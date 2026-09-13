"use client";

/*
 * Gradient reveal model adapted from Iconiq UI Dia Text.
 * Source: https://iconiqui.com/texts/dia-text
 */

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;
const INLINE_BASELINE_OFFSET = "-0.12em";
const TEXT_SWAP_EASE = [0.22, 1, 0.36, 1] as const;

type DiaTextMotionProps = ComponentPropsWithoutRef<typeof motion.span>;

interface DiaTextRevealProps extends Omit<
  DiaTextMotionProps,
  "children" | "style" | "animate" | "transition" | "color" | "className"
> {
  /** Single text value to reveal, or multiple values to rotate through. */
  text: string | string[];
  /** Gradient stops used for the sweep band. */
  colors?: string[];
  /** Base text color used before and after the sweep passes. */
  textColor?: string;
  /** Duration of each sweep, in seconds. */
  duration?: number;
  /** Delay before the first sweep, in seconds. */
  delay?: number;
  /** Keep replaying the sweep. Rotates through text arrays when enabled. */
  repeat?: boolean;
  /** Pause between repeated sweeps, in seconds. */
  repeatDelay?: number;
  /** Wait until the element enters the viewport before playing. */
  triggerOnView?: boolean;
  /** Only run the in-view reveal once. */
  once?: boolean;
  /** Keep the widest text width when rotating through multiple values. */
  fixedWidth?: boolean;
  className?: string;
}

const sweepEase = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

function buildGradient(pos: number, colors: string[], textColor: string) {
  const bandStart = Math.max(0, pos - BAND_HALF);
  const bandEnd = Math.min(100, pos + BAND_HALF);

  if (pos <= SWEEP_START || pos >= SWEEP_END || bandStart >= bandEnd) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }

  const palette = colors.length > 0 ? colors : DEFAULT_COLORS;
  const count = palette.length;
  const bandWidth = bandEnd - bandStart;
  const parts: string[] = [];

  parts.push(`${textColor} 0%`);

  if (bandStart > 0) {
    parts.push(`${textColor} ${bandStart.toFixed(2)}%`);
  }

  palette.forEach((color, index) => {
    const pct =
      count === 1 ? bandStart + bandWidth / 2 : bandStart + (index / (count - 1)) * bandWidth;
    parts.push(`${color} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100) {
    parts.push(`${textColor} ${bandEnd.toFixed(2)}%`);
  }

  parts.push(`${textColor} 100%`);

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function measureWidths(element: HTMLElement, texts: string[]) {
  const ghost = element.cloneNode() as HTMLElement;

  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });

  element.parentElement?.appendChild(ghost);

  const widths = texts.map((entry) => {
    ghost.textContent = entry;
    return ghost.getBoundingClientRect().width;
  });

  ghost.remove();
  return widths;
}

const DiaTextReveal = forwardRef<HTMLSpanElement, DiaTextRevealProps>(
  (
    {
      text,
      colors = DEFAULT_COLORS,
      textColor = "var(--foreground)",
      duration = 1.5,
      delay = 0,
      repeat = false,
      repeatDelay = 0.5,
      triggerOnView = true,
      once = true,
      fixedWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);
    const shouldReduceMotion = useReducedMotion();

    const indexRef = useRef(0);
    const hasPlayedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const controlsRef = useRef<AnimationPlaybackControls | undefined>(undefined);
    const previousTextKeyRef = useRef("");
    const previousActiveIndexRef = useRef(0);

    const sweepPos = useMotionValue(SWEEP_START);
    const textOpacity = useMotionValue(1);
    const textBlur = useMotionValue(0);
    const textShift = useMotionValue(0);
    const inView = useInView(spanRef, { once, amount: 0.1 });

    const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
    const textKey = useMemo(() => JSON.stringify(texts), [texts]);
    const isMulti = texts.length > 1;
    const isVisible = triggerOnView ? inView : true;

    const backgroundImage = useTransform(sweepPos, (pos) => buildGradient(pos, colors, textColor));
    const contentFilter = useTransform(textBlur, (blur) => `blur(${blur.toFixed(2)}px)`);
    const contentTransform = useTransform(
      textShift,
      (shift) => `translateY(${shift.toFixed(2)}px)`,
    );

    const fixedW = useMemo(
      () =>
        isMulti && fixedWidth && measuredWidths.length > 0
          ? Math.max(...measuredWidths)
          : undefined,
      [fixedWidth, isMulti, measuredWidths],
    );

    const animatedW = useMemo(
      () =>
        isMulti && !fixedWidth && measuredWidths[activeIndex] != null
          ? measuredWidths[activeIndex]
          : undefined,
      [activeIndex, fixedWidth, isMulti, measuredWidths],
    );

    const containerStyle = useMemo(
      (): NonNullable<DiaTextMotionProps["style"]> => ({
        lineHeight: 1,
        ...(isMulti && {
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: INLINE_BASELINE_OFFSET as CSSProperties["verticalAlign"],
          whiteSpace: "nowrap",
          ...(fixedW != null && { width: fixedW }),
        }),
      }),
      [fixedW, isMulti],
    );

    const contentStyle = useMemo(
      (): NonNullable<DiaTextMotionProps["style"]> => ({
        display: "inline-block",
        lineHeight: 1,
        willChange: shouldReduceMotion ? "auto" : "background-image, filter, opacity, transform",
        ...(shouldReduceMotion
          ? {
              color: textColor,
            }
          : {
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              backgroundSize: "100% 100%",
              backgroundImage,
              opacity: textOpacity,
              filter: contentFilter,
              transform: contentTransform,
            }),
      }),
      [
        backgroundImage,
        contentFilter,
        contentTransform,
        shouldReduceMotion,
        textColor,
        textOpacity,
      ],
    );

    const clearCycle = useCallback(() => {
      controlsRef.current?.stop();
      controlsRef.current = undefined;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = undefined;
    }, []);

    const playRef = useRef<() => void>(() => undefined);

    playRef.current = () => {
      clearCycle();

      if (shouldReduceMotion) {
        sweepPos.set(SWEEP_END);
        return;
      }

      sweepPos.set(SWEEP_START);

      controlsRef.current = animate(sweepPos, SWEEP_END, {
        duration,
        delay,
        ease: sweepEase,
        onComplete() {
          if (!repeat || texts.length === 0) return;

          timerRef.current = setTimeout(() => {
            const next = (indexRef.current + 1) % texts.length;

            indexRef.current = next;
            setActiveIndex(next);
            playRef.current();
          }, repeatDelay * 1000);
        },
      });
    };

    useEffect(() => {
      if (textKey === previousTextKeyRef.current) return;

      previousTextKeyRef.current = textKey;
      indexRef.current = 0;
      setActiveIndex(0);
      hasPlayedRef.current = false;
      clearCycle();
      sweepPos.set(shouldReduceMotion ? SWEEP_END : SWEEP_START);
    }, [clearCycle, shouldReduceMotion, sweepPos, textKey]);

    useEffect(() => {
      const element = spanRef.current;

      if (!(element && isMulti)) {
        setMeasuredWidths([]);
        return;
      }

      setMeasuredWidths(measureWidths(element, texts));
    }, [isMulti, texts]);

    useEffect(() => {
      if (shouldReduceMotion) {
        clearCycle();
        sweepPos.set(SWEEP_END);
        return;
      }

      if (!isVisible) {
        clearCycle();

        if (!once) {
          hasPlayedRef.current = false;
        }

        return;
      }

      if (once && hasPlayedRef.current) return;

      hasPlayedRef.current = true;
      playRef.current();
    }, [clearCycle, isVisible, once, shouldReduceMotion, sweepPos, textKey]);

    useEffect(() => {
      if (!isMulti || shouldReduceMotion) {
        textOpacity.set(1);
        textBlur.set(0);
        textShift.set(0);
        previousActiveIndexRef.current = activeIndex;
        return;
      }

      if (previousActiveIndexRef.current === activeIndex) return;

      previousActiveIndexRef.current = activeIndex;
      textOpacity.set(0.58);
      textBlur.set(8);
      textShift.set(5.5);

      const opacityControls = animate(textOpacity, 1, {
        duration: 0.26,
        ease: TEXT_SWAP_EASE,
      });
      const blurControls = animate(textBlur, 0, {
        duration: 0.34,
        ease: TEXT_SWAP_EASE,
      });
      const shiftControls = animate(textShift, 0, {
        duration: 0.34,
        ease: TEXT_SWAP_EASE,
      });

      return () => {
        opacityControls.stop();
        blurControls.stop();
        shiftControls.stop();
      };
    }, [activeIndex, isMulti, shouldReduceMotion, textBlur, textOpacity, textShift]);

    useEffect(
      () => () => {
        clearCycle();
        hasPlayedRef.current = false;
      },
      [clearCycle],
    );

    const setRefs = (node: HTMLSpanElement | null) => {
      spanRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <motion.span
        animate={animatedW != null && !shouldReduceMotion ? { width: animatedW } : undefined}
        className={cn("text-inherit", className)}
        ref={setRefs}
        style={containerStyle}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        <motion.span aria-hidden className="inline-block text-inherit" style={contentStyle}>
          {texts[activeIndex]}
        </motion.span>
        <span className="sr-only">{texts[activeIndex]}</span>
      </motion.span>
    );
  },
);

DiaTextReveal.displayName = "DiaTextReveal";

const DiaText = DiaTextReveal;

export { DiaText, DiaTextReveal };
export type { DiaTextRevealProps };
