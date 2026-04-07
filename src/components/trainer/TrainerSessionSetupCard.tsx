import { PackSummaryCard } from "@/components/trainer/PackSummaryCard";
import { difficultyLabels } from "@/lib/poker/labels";
import { getConceptLabel } from "@/lib/training/concepts";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import type {
  ContentPack,
  Difficulty,
  PersistenceMode,
  RetryQueueItem,
  TrainingDifficultyFilter,
  TrainerQueueMode,
} from "@/types/training";

type TrainerSessionSetupCardProps = {
  packTitle: string;
  packSummary: string;
  packHighlights: string[];
  availableContentPacks: ContentPack[];
  selectedContentPackId: string | null;
  onSelectContentPack: (contentPackId: string) => void;
  scenarioCountByPackId: Record<string, number>;
  availableDifficulties: Difficulty[];
  selectedDifficulty: TrainingDifficultyFilter;
  onSelectDifficulty: (difficulty: TrainingDifficultyFilter) => void;
  queueMode: TrainerQueueMode;
  onSelectQueueMode: (queueMode: TrainerQueueMode) => void;
  retryItems: RetryQueueItem[];
  storageMode: PersistenceMode;
  isPersisting?: boolean;
  persistenceError?: string | null;
};

export function TrainerSessionSetupCard({
  packTitle,
  packSummary,
  packHighlights,
  availableContentPacks,
  selectedContentPackId,
  onSelectContentPack,
  scenarioCountByPackId,
  availableDifficulties,
  selectedDifficulty,
  onSelectDifficulty,
  queueMode,
  onSelectQueueMode,
  retryItems,
  storageMode,
  isPersisting = false,
  persistenceError = null,
}: TrainerSessionSetupCardProps) {
  const visibleRetryItems = retryItems.slice(0, 3);
  const hasRetryItems = visibleRetryItems.length > 0;

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Session planner
        </p>
        <h2 className="text-2xl font-semibold text-foreground">{packTitle}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{packSummary}</p>
      </div>

      {packHighlights.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {packHighlights.slice(0, 3).map((highlight) => (
            <StatusPill key={`${packTitle}-${highlight}`}>{highlight}</StatusPill>
          ))}
        </div>
      ) : null}

      {availableContentPacks.length > 1 ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Concept packs
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Choose the slice of the module you want to train. Packs keep the
              session focused on one family of ideas instead of mixing every
              concept together.
            </p>
          </div>

          <div className="space-y-3">
            {availableContentPacks.map((contentPack) => (
              <PackSummaryCard
                key={contentPack.id}
                contentPack={contentPack}
                isSelected={selectedContentPackId === contentPack.id}
                onSelect={onSelectContentPack}
                scenarioCount={scenarioCountByPackId[contentPack.id] ?? 0}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Difficulty filter
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectDifficulty("all")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selectedDifficulty === "all"
                ? "border-accent/30 bg-accent/10 text-accent-strong"
                : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
            }`}
          >
            All levels
          </button>
          {availableDifficulties.map((difficulty) => (
            <button
              key={difficulty}
              type="button"
              onClick={() => onSelectDifficulty(difficulty)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                selectedDifficulty === difficulty
                  ? "border-accent/30 bg-accent/10 text-accent-strong"
                  : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
              }`}
            >
              {difficultyLabels[difficulty]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pack concept anchors
        </p>
        <div className="flex flex-wrap gap-2">
          {availableContentPacks
            .find((contentPack) => contentPack.id === selectedContentPackId)
            ?.conceptTags.slice(0, 4)
            .map((conceptTag) => (
              <StatusPill key={`${selectedContentPackId}-${conceptTag}`}>
                {getConceptLabel(conceptTag)}
              </StatusPill>
            ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Available pack levels
        </p>
        <div className="flex flex-wrap gap-2">
          {availableDifficulties.map((difficulty) => (
            <DifficultyBadge key={`${selectedContentPackId}-${difficulty}`} difficulty={difficulty} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Review weak concepts
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectQueueMode("adaptive")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              queueMode === "adaptive"
                ? "border-accent/30 bg-accent/10 text-accent-strong"
                : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
            }`}
          >
            Adaptive order
          </button>
          <button
            type="button"
            onClick={() => onSelectQueueMode("default")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              queueMode === "default"
                ? "border-accent/30 bg-accent/10 text-accent-strong"
                : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
            }`}
          >
            Original order
          </button>
        </div>
      </div>

      {hasRetryItems ? (
        <div className="space-y-3 rounded-2xl border border-accent/15 bg-accent/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="gold">Suggested retry</StatusPill>
            <StatusPill>{visibleRetryItems.length} weak concepts</StatusPill>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            You missed similar spots recently, so adaptive order will bring those
            concepts forward sooner.
          </p>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {visibleRetryItems.map((retryItem) => (
              <li key={retryItem.scenarioId}>- {retryItem.title}: {retryItem.reason}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-4 text-sm leading-6 text-muted-foreground">
          No repeat weak concepts have built up strongly in this pack yet, so
          original order and adaptive order will feel similar for now.
        </div>
      )}

      <div
        className={`space-y-3 rounded-2xl border p-4 ${
          persistenceError
            ? "border-amber-200 bg-amber-50/80"
            : "border-border/70 bg-muted/20"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
            {storageMode === "account" ? "Account autosave" : "Local autosave"}
          </StatusPill>
          {isPersisting ? <StatusPill tone="gold">Saving</StatusPill> : null}
          {persistenceError ? <StatusPill tone="danger">Sync issue</StatusPill> : null}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {persistenceError
            ? persistenceError
            : storageMode === "account"
              ? "Submitted answers and session summaries are saved to the signed-in account automatically."
              : "Submitted answers and session summaries are saved locally in this browser automatically."}
        </p>
      </div>
    </SurfaceCard>
  );
}
