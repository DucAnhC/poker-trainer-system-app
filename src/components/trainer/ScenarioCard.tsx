import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { contentPackMap } from "@/data/content-packs";
import { getScenarioContextLines } from "@/lib/poker/formatting";
import { sourceTypeLabels } from "@/lib/poker/labels";
import { getConceptLabel } from "@/lib/training/concepts";
import type {
  RetryQueueItem,
  TrainingScenario,
} from "@/types/training";

type ScenarioCardProps = {
  scenario: TrainingScenario;
  questionNumber: number;
  totalQuestions: number;
  retryHint?: RetryQueueItem | null;
};

export function ScenarioCard({
  scenario,
  questionNumber,
  totalQuestions,
  retryHint = null,
}: ScenarioCardProps) {
  const contextLines = getScenarioContextLines(scenario);
  const contentPack = contentPackMap[scenario.contentPackId] ?? null;

  return (
    <SurfaceCard className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="accent">
          Question {questionNumber} of {totalQuestions}
        </StatusPill>
        <DifficultyBadge difficulty={scenario.difficulty} />
        <StatusPill tone="gold">{sourceTypeLabels[scenario.sourceType]}</StatusPill>
        {contentPack ? <StatusPill>{contentPack.focusLabel}</StatusPill> : null}
        {retryHint ? <StatusPill tone="gold">Suggested retry</StatusPill> : null}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {scenario.learningGoal}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {scenario.title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground">
          {scenario.prompt}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {contextLines.map((contextLine) => (
          <div
            key={contextLine}
            className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground"
          >
            {contextLine}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Key concepts in this spot
        </p>
        <div className="flex flex-wrap gap-2">
          {scenario.keyConcepts.map((conceptTag) => (
            <StatusPill key={`${scenario.id}-${conceptTag}`}>
              {getConceptLabel(conceptTag)}
            </StatusPill>
          ))}
        </div>
      </div>

      {retryHint ? (
        <div className="rounded-2xl border border-accent/15 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Review weak concepts
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {retryHint.reason}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {scenario.tags.map((tag) => (
          <StatusPill key={tag}>{tag}</StatusPill>
        ))}
      </div>
    </SurfaceCard>
  );
}
