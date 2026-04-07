"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

type TrainerStatsStripProps = {
  answeredCount: number;
  totalQuestions: number;
  accuracy: number;
  attempts: number;
  lastCompletedAt: string | null;
};

export function TrainerStatsStrip({
  answeredCount,
  totalQuestions,
  accuracy,
  attempts,
  lastCompletedAt,
}: TrainerStatsStripProps) {
  const copy = useUiCopy();

  const items = [
    {
      label: copy.trainer.shared.sessionProgress,
      value: `${answeredCount}/${totalQuestions}`,
      note: copy.trainer.shared.submittedInRun,
    },
    {
      label: copy.trainer.shared.sessionAccuracy,
      value: formatPercent(accuracy),
      note: copy.trainer.shared.accuracyUpdates,
    },
    {
      label: copy.trainer.shared.allTimeAttempts,
      value: `${attempts}`,
      note: copy.trainer.shared.lastCompleted(
        lastCompletedAt
          ? formatDateTimeLabel(lastCompletedAt)
          : copy.trainer.shared.notYetCompleted,
      ),
    },
  ];

  return (
    <SurfaceCard className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border/70 bg-muted/18 px-4 py-4"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {item.value}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {item.note}
          </p>
        </div>
      ))}
    </SurfaceCard>
  );
}
