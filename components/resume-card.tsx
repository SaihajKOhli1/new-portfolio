import Image from "next/image";

export function ResumeCard() {
  return (
    <a
      href="/saihaj-kohli-resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex w-full max-w-sm shrink-0 flex-col overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 shadow-[0_8px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-transform hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/60 via-white/10 to-transparent" />
      <div className="relative aspect-[772/1000] w-full">
        <Image
          src="/resume-preview.png"
          alt="Preview of Saihaj Kohli's resume"
          fill
          sizes="(min-width: 768px) 384px, 90vw"
          className="object-cover object-top"
        />
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-black/5 bg-white/70 px-6 py-4">
        <span className="text-sm font-semibold text-zinc-900">Resume</span>
        <span className="font-mono text-[10px] uppercase tracking-wide text-zinc-400 transition-colors group-hover:text-zinc-600">
          View PDF ↗
        </span>
      </div>
    </a>
  );
}
