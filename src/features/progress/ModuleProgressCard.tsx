import Link from "next/link";

import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getPrimaryContentPack } from "@/data/content-packs";
import { calculateAccuracy, getWeakestDifficultyEntry } from "@/lib/progress/metrics";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";
import type {
  Difficulty,
  DifficultyProgressRecord,
  ProgressSummary,
  TrainingModule,
  TrainingSessionSummary,
} from "@/types/training";

type ModuleProgressCardProps = {
  module: TrainingModule;
  progressSummary: ProgressSummary;
  activeSession: TrainingSessionSummary | null;
  isHighlighted: boolean;
};

export function ModuleProgressCard({
  module,
  progressSummary,
  activeSession,
  isHighlighted,
}: ModuleProgressCardProps) {
  const moduleProgress = progressSummary.moduleProgress[module.id];
  const accuracy = calculateAccuracy(
    moduleProgress.correctCount,
    moduleProgress.attempts,
  );
  const pack = module.id === "hand-review" ? null : getPrimaryContentPack(module.id);
  const populatedDifficultyEntries =
    module.id === "hand-review"
      ? []
      : (Object.entries(moduleProgress.difficultyProgress) as Array<
          [Difficulty, DifficultyProgressRecord]
        >).filter(([, difficultyProgress]) => difficultyProgress.attempts > 0);
  const weakestDifficultyEntry = getWeakestDifficultyEntry(
    populatedDifficultyEntries,
  );
  const isInteractive = module.phaseStatus === "interactive";
  const isHandReview = module.id === "hand-review";

  return (
    <SurfaceCard
      className={
        isHighlighted
          ? "space-y-4 border-accent/35 shadow-[0_20px_50px_rgba(193,125,17,0.12)]"
          : "space-y-4"
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-foreground">
              {module.title}
            </h3>
            <StatusPill tone={isInteractive ? "success" : "neutral"}>
              {isInteractive ? "Active" : "Scaffolded"}
            </StatusPill>
            {isHighlighted ? <StatusPill tone="gold">Focus now</StatusPill> : null}
            {activeSession ? <StatusPill tone="accent">Active run</StatusPill> : null}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {module.summary}
          </p>
          {pack ? (
            <div className="flex flex-wrap gap-2">
              <StatusPill tone="accent">{pack.title}</StatusPill>
              {pack.difficultyFocus.map((difficulty) => (
                <DifficultyBadge key={`${module.id}-${difficulty}`} difficulty={difficulty} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {isHandReview ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Saved notes
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {progressSummary.handReviewSummary.noteCount}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Last updated
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {formatDateTimeLabel(progressSummary.handReviewSummary.lastUpdatedAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Attempts
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {moduleProgress.attempts}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Correct
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {moduleProgress.correctCount}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Accuracy
            </p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {moduleProgress.attempts > 0 ? formatPercent(accuracy) : "--"}
            </p>
          </div>
        </div>
      )}

      {!isHandReview ? (
        populatedDifficultyEntries.length > 0 ? (
          <div className="rounded-2xl border border-border/70 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Difficulty progress
              </p>
              {weakestDifficultyEntry ? (
                <StatusPill tone="gold">
                  Weakest: {difficultyLabels[weakestDifficultyEntry[0]]}
                </StatusPill>
              ) : null}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {populatedDifficultyEntries.map(([difficulty, difficultyProgress]) => {
                const difficultyAccuracy = calculateAccuracy(
                  difficultyProgress.correctCount,
                  difficultyProgress.attempts,
                );

                return (
                  <div
                    key={`${module.id}-${difficulty}`}
                    className="rounded-2xl border border-border/70 bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <DifficultyBadge difficulty={difficulty} />
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-foreground">
                      {difficultyProgress.attempts}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      attempts, {formatPercent(difficultyAccuracy)} accuracy
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-4 text-sm leading-6 text-muted-foreground">
            No difficulty-specific attempts are saved here yet. Start the module
            and pick a level to build the progression signal.
          </div>
        )
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {isHandReview
            ? "Review notes feed leak tags, recommendations, and local focus guidance."
            : activeSession
              ? `Active run last touched ${formatDateTimeLabel(activeSession.lastActivityAt)}`
              : `Last completed: ${formatDateTimeLabel(moduleProgress.lastCompletedAt)}`}
        </p>
        <Link
          href={module.route}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          {isHandReview
            ? "Open review"
            : activeSession
              ? "Resume active run"
              : module.ctaLabel ?? (isInteractive ? "Continue training" : "Open scaffold")}
        </Link>
      </div>
    </SurfaceCard>
  );
}
