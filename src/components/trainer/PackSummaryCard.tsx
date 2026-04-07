import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { StatusPill } from "@/components/ui/StatusPill";
import { getConceptLabel } from "@/lib/training/concepts";
import { cn } from "@/lib/utils";
import type { ContentPack } from "@/types/training";

type PackSummaryCardProps = {
  contentPack: ContentPack;
  isSelected: boolean;
  onSelect: (contentPackId: string) => void;
  scenarioCount: number;
};

export function PackSummaryCard({
  contentPack,
  isSelected,
  onSelect,
  scenarioCount,
}: PackSummaryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(contentPack.id)}
      className={cn(
        "w-full rounded-2xl border p-4 text-left transition",
        isSelected
          ? "border-accent/35 bg-accent/10 shadow-[0_16px_40px_rgba(193,125,17,0.10)]"
          : "border-border/80 bg-white hover:border-accent/30 hover:bg-accent/5",
      )}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={isSelected ? "accent" : "neutral"}>
            {isSelected ? "Selected pack" : "Available pack"}
          </StatusPill>
          <StatusPill>{contentPack.focusLabel}</StatusPill>
          <StatusPill tone="gold">{scenarioCount} scenarios</StatusPill>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {contentPack.title}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {contentPack.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {contentPack.difficultyFocus.map((difficulty) => (
            <DifficultyBadge
              key={`${contentPack.id}-${difficulty}`}
              difficulty={difficulty}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {contentPack.conceptTags.slice(0, 3).map((conceptTag) => (
            <StatusPill key={`${contentPack.id}-${conceptTag}`}>
              {getConceptLabel(conceptTag)}
            </StatusPill>
          ))}
        </div>
      </div>
    </button>
  );
}
