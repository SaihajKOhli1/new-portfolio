"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { GitHubIcon } from "@/components/icons";

interface PhotoLink {
  label: string;
  href: string;
  icon: "github" | "play" | "article";
}

interface PhotoImage {
  src: string;
  alt: string;
}

interface Photo {
  id: number;
  image?: PhotoImage;
  caption: string;
  subCaption?: string;
  links?: PhotoLink[];
  rotation: string;
}

const PHOTOS: Photo[] = [
  {
    id: 1,
    image: {
      src: "/lifesaver-award.avif",
      alt: "The LIFESAVER team accepting their 1st place award",
    },
    caption: "1st Place — LIFESAVER 🏆",
    subCaption: "AI & Data Science for Good Hackathon 2026",
    links: [
      { label: "View on GitHub", href: "https://github.com/youssefnashat/LifeSaver", icon: "github" },
      {
        label: "Watch the Demo",
        href: "https://www.linkedin.com/posts/saihaj-kohli-a2b927301_1st-place-750-but-the-real-win-3-million-activity-7439694318837153792-okqi?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE0zkwMBxf8LFS7pZyIpHLyJB69kn6RuSN0",
        icon: "play",
      },
    ],
    rotation: "-rotate-3",
  },
  {
    id: 2,
    image: {
      src: "/hydrocool-award.avif",
      alt: "The HydroCool Connect team at GoodHacks 24",
    },
    caption: "3rd Place — HydroCool Connect 🏆",
    subCaption: "GoodHacks 24",
    links: [
      { label: "GitHub", href: "https://github.com/SaihajKOhli1/HydroCool-Connect", icon: "github" },
      {
        label: "Article",
        href: "https://uwaterloo.ca/news/breaking-barriers-local-climate-action-open-source-data",
        icon: "article",
      },
    ],
    rotation: "rotate-2",
  },
];

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2.2 5.5l7 4.5-7 4.5v-9z" />
    </svg>
  );
}

function ArticleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M7 17L17 7M17 7H9M17 7v8" />
    </svg>
  );
}

function LinkIcon({ icon, className }: { icon: PhotoLink["icon"]; className?: string }) {
  if (icon === "github") return <GitHubIcon className={className} />;
  if (icon === "play") return <PlayIcon className={className} />;
  return <ArticleIcon className={className} />;
}

function PhotoFrame({ image, size }: { image?: PhotoImage; size: "sm" | "lg" }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden border border-zinc-200 bg-zinc-100">
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={size === "lg" ? "448px" : "256px"}
          className="object-cover"
        />
      )}
    </div>
  );
}

function PhotoLinks({ links, size }: { links?: PhotoLink[]; size: "sm" | "lg" }) {
  if (!links?.length) return null;

  const iconSize = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className={`mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 ${textSize}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-medium text-zinc-500 transition-colors hover:text-zinc-800"
        >
          <LinkIcon icon={link.icon} className={iconSize} />
          {link.label}
        </a>
      ))}
    </div>
  );
}

function PhotoCaption({ photo }: { photo: Photo }) {
  if (photo.subCaption) {
    return (
      <>
        <p className="mt-4 text-center text-sm font-semibold text-zinc-800">
          {photo.caption}
        </p>
        <p className="mt-1 text-center text-xs text-zinc-400 italic">
          {photo.subCaption}
        </p>
      </>
    );
  }

  return (
    <p className="mt-4 text-center font-serif text-base text-zinc-400 italic">
      {photo.caption}
    </p>
  );
}

export function PolaroidPhotos() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = PHOTOS.find((photo) => photo.id === selectedId) ?? null;

  return (
    <>
      <div className="flex flex-wrap items-start justify-center gap-8 pt-4 sm:gap-12">
        {PHOTOS.map((photo) => (
          <motion.div
            key={photo.id}
            layoutId={`polaroid-${photo.id}`}
            className={`flex w-56 shrink-0 flex-col bg-white p-4 pb-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] sm:w-64 ${photo.rotation}`}
          >
            <button
              type="button"
              onClick={() => setSelectedId(photo.id)}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <PhotoFrame image={photo.image} size="sm" />
              <PhotoCaption photo={photo} />
            </button>
            <PhotoLinks links={photo.links} size="sm" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              layoutId={`polaroid-${selected.id}`}
              className="flex w-full max-w-md flex-col bg-white p-6 pb-8 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <PhotoFrame image={selected.image} size="lg" />
              <div className="text-lg [&_p:first-child]:text-lg [&_p:last-child]:text-sm">
                <PhotoCaption photo={selected} />
              </div>
              <PhotoLinks links={selected.links} size="lg" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
