import Image from "next/image";
import type { ReactNode } from "react";

interface LogoInfo {
  src: string;
  alt: string;
}

interface TimelineItem {
  name: string;
  detail: string;
  logo?: LogoInfo;
}

interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectItem {
  name: string;
  description: string;
  links: ProjectLink[];
}

const WATERLOO_LOGO: LogoInfo = {
  src: "/logos/waterloo.jpg",
  alt: "University of Waterloo seal",
};

const LAURIER_LOGO: LogoInfo = {
  src: "/logos/laurier.png",
  alt: "Wilfrid Laurier University seal",
};

const CURRENTLY: TimelineItem[] = [
  {
    name: "University of Waterloo",
    detail: "Second year, specializing in AI",
    logo: WATERLOO_LOGO,
  },
  {
    name: "Wilfrid Laurier University",
    detail: "BBA, hoping to specialize in Finance",
    logo: LAURIER_LOGO,
  },
];

const PREVIOUSLY: TimelineItem[] = [
  {
    name: "Liquid Analytics",
    detail:
      "AI Software Engineering Intern · Worked on the Forward Deployed Engineering team, building customer-facing AI demos and workflows",
    logo: { src: "/logos/liquid-analytics.jpg", alt: "Liquid Analytics logo" },
  },
  {
    name: "Tabi Well-Being",
    detail:
      "Software Engineering Intern · Built the initial product demo for the wellness app's RAG chatbot",
    logo: { src: "/logos/tabi.jpg", alt: "Tabi Well-Being logo" },
  },
  {
    name: "Enterone Corp",
    detail:
      "Software Engineering Intern · Built assessment software, straight out of high school",
    logo: { src: "/logos/enterone.jpg", alt: "Enterone Corp logo" },
  },
];

const PROJECTS: ProjectItem[] = [
  {
    name: "LIFESAVER",
    description:
      "Real-time AI voice pipeline bridging emergency calls for 3M+ Rohingya speakers, 1st place at AI & Data Science for Good Hackathon 2026.",
    links: [
      { label: "GITHUB", href: "https://github.com/youssefnashat/LifeSaver" },
      {
        label: "ARTICLE",
        href: "https://uwaterloo.ca/artificial-intelligence-institute/news/ai-data-science-good-hackathon-empowers-students-support",
      },
    ],
  },
  {
    name: "HydroCool Connect",
    description:
      "Mobile alert system notifying residents of nearby cooling locations during heat events, 3rd place at GoodHacks 24.",
    links: [
      {
        label: "GITHUB",
        href: "https://github.com/SaihajKOhli1/HydroCool-Connect",
      },
      {
        label: "ARTICLE",
        href: "https://uwaterloo.ca/news/breaking-barriers-local-climate-action-open-source-data",
      },
    ],
  },
];

function Logo({ src, alt }: Partial<LogoInfo>) {
  if (!src) {
    return (
      <span
        aria-hidden
        className="mt-0.5 inline-block h-7 w-7 shrink-0 rounded-full border border-zinc-400/70"
      />
    );
  }

  return (
    <span className="relative mt-0.5 inline-block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10">
      <Image src={src} alt={alt ?? ""} fill sizes="28px" className="object-cover" />
    </span>
  );
}

function ExternalLinkPlaceholder({ label, href }: ProjectLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="ml-2 font-mono text-[10px] uppercase tracking-wide text-zinc-400 underline-offset-2 hover:underline"
    >
      {label} ↗
    </a>
  );
}

function EntryName({ children }: { children: ReactNode }) {
  return (
    <span className="font-bold text-zinc-900 underline decoration-zinc-400 underline-offset-2">
      {children}
    </span>
  );
}

function SectionLabel({ marker, children }: { marker: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm text-zinc-500 italic">
      <span aria-hidden className="not-italic">
        {marker}
      </span>
      {children}
    </p>
  );
}

function TimelineRow({ item }: { item: TimelineItem }) {
  return (
    <div className="flex items-start gap-2 text-sm text-zinc-700">
      <span aria-hidden className="mt-0.5 text-zinc-400">
        ↳
      </span>
      <Logo src={item.logo?.src} alt={item.logo?.alt} />
      <p className="leading-relaxed">
        <EntryName>{item.name}</EntryName> · {item.detail}
      </p>
    </div>
  );
}

function ProjectRow({ project }: { project: ProjectItem }) {
  return (
    <div className="flex items-start gap-2 text-sm text-zinc-700">
      <span aria-hidden className="mt-0.5 text-zinc-400">
        ↳
      </span>
      <p className="leading-relaxed">
        <EntryName>{project.name}</EntryName> · {project.description}
        {project.links.map((link) => (
          <ExternalLinkPlaceholder key={link.label} {...link} />
        ))}
      </p>
    </div>
  );
}

export function BioCard() {
  return (
    <div className="flex flex-col gap-6 px-8 py-10 text-zinc-800 sm:px-10">
      <p className="text-base leading-relaxed">
        Hey! I&apos;m <EntryName>Saihaj Kohli</EntryName>, a CS and BBA
        double-degree student at <Logo {...WATERLOO_LOGO} /> <EntryName>Waterloo</EntryName>{" "}
        and <Logo {...LAURIER_LOGO} /> <EntryName>Laurier</EntryName>. I&apos;m building
        with AI, agents, and product, and I&apos;m looking for Winter 2027
        internship opportunities.
      </p>

      <div className="flex flex-col gap-3">
        <SectionLabel marker="◆">currently:</SectionLabel>
        <div className="flex flex-col gap-2 pl-4">
          {CURRENTLY.map((item) => (
            <TimelineRow key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel marker="■">previously:</SectionLabel>
        <div className="flex flex-col gap-2 pl-4">
          {PREVIOUSLY.map((item) => (
            <TimelineRow key={item.name} item={item} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SectionLabel marker="■">projects:</SectionLabel>
        <div className="flex flex-col gap-2 pl-4">
          {PROJECTS.map((project) => (
            <ProjectRow key={project.name} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
