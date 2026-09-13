"use client";

import { motion, type Variants } from "motion/react";
import { GradientBackground } from "@/components/ui/noisy-gradient-backgrounds";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/SaihajKOhli1", Icon: GitHubIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/saihaj-kohli-a2b927301/", Icon: LinkedInIcon },
];

const CONTACT_EMAIL = "sskohli@uwaterloo.ca";
const MAILTO_HREF = `mailto:${CONTACT_EMAIL}`;
const GMAIL_COMPOSE_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

function handleContactClick(event: React.MouseEvent<HTMLAnchorElement>) {
  // Devices with no default mail app silently do nothing on a plain mailto
  // click, so fall back to Gmail's web compose if the OS never takes focus
  // away from the tab (a sign a mail app actually opened).
  event.preventDefault();

  let mailAppOpened = false;
  const markOpened = () => {
    mailAppOpened = true;
  };

  window.addEventListener("blur", markOpened, { once: true });
  window.location.href = MAILTO_HREF;

  window.setTimeout(() => {
    window.removeEventListener("blur", markOpened);
    if (!mailAppOpened) {
      window.open(GMAIL_COMPOSE_HREF, "_blank", "noopener,noreferrer");
    }
  }, 600);
}

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export function GetInTouchCard() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
      className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/60 shadow-lg backdrop-blur-lg"
    >
      <motion.div variants={FADE_UP} className="relative h-40 w-full overflow-hidden">
        <GradientBackground />
      </motion.div>

      <div className="flex flex-col items-center gap-6 p-8 text-center">
        <motion.div variants={FADE_UP} className="space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">
            Let&apos;s build something together
          </h2>
          <p className="text-zinc-500">
            Have a role, project, or idea in mind? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <motion.a
          variants={FADE_UP}
          href={MAILTO_HREF}
          onClick={handleContactClick}
          className="mt-2 inline-flex items-center justify-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-8 py-3 text-3xl text-[#3B82F6] shadow-sm transition-transform hover:scale-105 hover:bg-[#3B82F6]/15"
          style={{ fontFamily: "var(--font-cursive)" }}
        >
          Get in touch with me
        </motion.a>

        <motion.div variants={FADE_UP} className="mt-2 flex items-center gap-5">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-zinc-400 transition-colors hover:text-zinc-800"
            >
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
