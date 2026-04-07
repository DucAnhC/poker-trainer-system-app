import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getScenarioContextLines } from "@/lib/poker/formatting";
import { sourceTypeLabels } from "@/lib/poker/labels";
import type { TrainingScenario } from "@/types/training";

type ScenarioPreviewCardProps = {
  scenario: TrainingScenario;
};

export function ScenarioPreviewCard({ scenario }: ScenarioPreviewCardProps) {
  const recommendedAction = scenario.candidateActions.find(
    (candidateAction) => candidateAction.id === scenario.recommendedActionId,
  );

  return (
    <SurfaceCard className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <DifficultyBadge difficulty={scenario.difficulty} />
        <StatusPill>{sourceTypeLabels[scenario.sourceType]}</StatusPill>
        <StatusPill tone="gold">Sample scenario</StatusPill>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          {scenario.title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {scenario.prompt}
        </p>
      </div>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {getScenarioContextLines(scenario).map((line) => (
          <li key={line}>- {line}</li>
        ))}
      </ul>

      <div className="rounded-2xl border border-accent/15 bg-accent/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
          Training note
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Recommended answer in the mock training set:{" "}
          <span className="font-semibold text-foreground">
            {recommendedAction?.label ?? scenario.recommendedActionId}
          </span>
          . The preview cards still show the shared content model even though the
          main training routes and hand review flow are now live.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {scenario.tags.slice(0, 4).map((tag) => (
          <StatusPill key={tag}>{tag}</StatusPill>
        ))}
      </div>
    </SurfaceCard>
  );
}
