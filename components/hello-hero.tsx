"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";

import { AppleHelloEnglishEffect } from "@/components/ui/apple-hello-effect";
import { GradientBackground } from "@/components/ui/noisy-gradient-backgrounds";

export function HelloHero() {
  const [visible, setVisible] = useState(true);
  const dismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const glow = useMotionValue(0);
  const brightness = useMotionValue(1);
  const filter = useMotionTemplate`drop-shadow(0 0 ${glow}px #FF69B4) brightness(${brightness})`;

  const handleWritten = () => {
    animate(glow, [0, 30, 0], {
      duration: 0.9,
      times: [0, 0.4, 1],
      ease: "easeInOut",
    });
    animate(brightness, [1, 1.9, 1], {
      duration: 0.9,
      times: [0, 0.4, 1],
      ease: "easeInOut",
    });
    dismissTimeout.current = setTimeout(() => setVisible(false), 650);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="relative flex h-screen items-center justify-center overflow-hidden"
          exit={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <GradientBackground
            customGradient="linear-gradient(180deg, #ffffff 0%, #ffd6eb 100%)"
            noisePatternAlpha={12}
            noiseIntensity={0.5}
            noisePatternRefreshInterval={2}
          />
          <motion.div className="relative z-10" style={{ filter }}>
            <AppleHelloEnglishEffect
              className="h-32 text-[#FF69B4] sm:h-48"
              onAnimationComplete={handleWritten}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
