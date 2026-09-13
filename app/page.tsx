import { HelloHero } from "@/components/hello-hero";
import { GradientBackground } from "@/components/ui/noisy-gradient-backgrounds";
import { GlitchText } from "@/components/ui/animated-glitch-text";
import { DiaText } from "@/components/ui/dia-text";
import { BioCard } from "@/components/bio-card";
import { ResumeCard } from "@/components/resume-card";
import { GetInTouchCard } from "@/components/get-in-touch-card";
import { PolaroidPhotos } from "@/components/polaroid-photos";
import { AnimatedHearts } from "@/components/ui/text-wave-animation";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";

export default function Home() {
  return (
    <div>
      <AnimatedNavFramer />
      <HelloHero />
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <GradientBackground gradientSize="125% 70%" />
        <div className="relative z-10 flex flex-col items-center gap-40">
          <GlitchText
            text="Saihaj Kohli"
            className="min-h-0 p-0"
            textClassName="text-6xl font-bold text-white sm:text-7xl md:text-8xl lg:text-9xl"
          />
          <DiaText
            text={["An engineer", "A student", "An innovator"]}
            textColor="#ffffff"
            repeat
            duration={1.2}
            repeatDelay={0.6}
            fixedWidth
            className="text-4xl font-semibold [text-shadow:0_2px_10px_rgba(0,0,0,0.35)] sm:text-5xl"
          />
        </div>
      </section>
      <section id="about" className="relative flex h-screen items-center justify-center overflow-hidden">
        <GradientBackground />
        <div className="relative z-10 flex w-[92vw] max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
          <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-white/10 to-transparent" />
            <div className="relative overflow-y-auto">
              <BioCard />
            </div>
          </div>
          <PolaroidPhotos />
        </div>
      </section>
      <section id="contact" className="relative flex h-screen items-center justify-center overflow-hidden">
        <GradientBackground />
        <div className="relative z-10 flex w-[92vw] max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-center">
          <GetInTouchCard />
          <ResumeCard />
        </div>
      </section>
      <div className="pointer-events-none fixed right-6 bottom-6 z-50">
        <AnimatedHearts
          text="✦"
          count={3}
          fontSize="1rem"
          heightFactor={0.12}
          animationDuration={1.5}
          staggerDelay={150}
        />
      </div>
    </div>
  );
}
