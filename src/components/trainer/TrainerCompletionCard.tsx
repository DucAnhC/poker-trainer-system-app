"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

type TrainerCompletionCardProps = {
  title: string;
  bullets: string[];
  restartLabel: string;
  onRestart: () => void;
};

export function TrainerCompletionCard({
  title,
  bullets,
  restartLabel,
  onRestart,
}: TrainerCompletionCardProps) {
  const copy = useUiCopy();

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.trainer.shared.sessionRecap}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </div>

      <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
        {bullets.map((bullet) => (
          <li key={bullet}>- {bullet}</li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
        >
          {restartLabel}
        </button>
        <Link
          href="/dashboard"
          className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {copy.trainer.shared.backToDashboard}
        </Link>
      </div>
    </SurfaceCard>
  );
}
