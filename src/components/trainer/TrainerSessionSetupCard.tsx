"use client";

import type { ReactNode } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { PackSummaryCard } from "@/components/trainer/PackSummaryCard";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getConceptLabel } from "@/lib/training/concepts";
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

function SupportSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-3xl border border-border/70 bg-muted/14"
    >
      <summary className="flex cursor-pointer list-none flex-col gap-1 px-4 py-4">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-sm leading-6 text-muted-foreground">
          {description}
        </span>
      </summary>
      <div className="border-t border-border/60 px-4 py-4">{children}</div>
    </details>
  );
}

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
  const copy = useUiCopy();
  const visibleRetryItems = retryItems.slice(0, 3);
  const selectedPack = availableContentPacks.find(
    (contentPack) => contentPack.id === selectedContentPackId,
  );

  return (
    <SurfaceCard className="space-y-4 xl:sticky xl:top-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.trainer.shared.setupEyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {copy.trainer.shared.setupTitle}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.trainer.shared.setupDescription}
        </p>
      </div>

      <div className="rounded-3xl border border-border/70 bg-muted/16 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="accent">{packTitle}</StatusPill>
          <StatusPill>{copy.trainer.queueModeLabels[queueMode]}</StatusPill>
          <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
            {storageMode === "account"
              ? copy.trainer.shared.accountAutosave
              : copy.trainer.shared.localAutosave}
          </StatusPill>
          {visibleRetryItems.length > 0 ? (
            <StatusPill tone="gold">
              {copy.trainer.shared.weakConceptCount(visibleRetryItems.length)}
            </StatusPill>
          ) : null}
          {isPersisting ? (
            <StatusPill tone="gold">{copy.trainer.shared.saving}</StatusPill>
          ) : null}
          {persistenceError ? (
            <StatusPill tone="danger">{copy.trainer.shared.syncIssue}</StatusPill>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {packSummary}
        </p>
        {packHighlights.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {packHighlights.slice(0, 3).map((highlight) => (
              <StatusPill key={`${packTitle}-${highlight}`}>{highlight}</StatusPill>
            ))}
          </div>
        ) : null}
      </div>

      {availableContentPacks.length > 1 ? (
        <SupportSection
          title={copy.trainer.shared.packSection}
          description={copy.trainer.shared.packSectionHint}
        >
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
        </SupportSection>
      ) : null}

      <SupportSection
        title={copy.trainer.shared.difficultySection}
        description={copy.trainer.shared.difficultySectionHint}
        defaultOpen
      >
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
            {copy.trainer.shared.allLevels}
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
              {copy.trainer.difficultyLabels[difficulty]}
            </button>
          ))}
        </div>

        {selectedPack?.conceptTags.length ? (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {copy.trainer.shared.packAnchors}
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedPack.conceptTags.slice(0, 4).map((conceptTag) => (
                <StatusPill key={`${selectedPack.id}-${conceptTag}`}>
                  {getConceptLabel(conceptTag)}
                </StatusPill>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.trainer.shared.packLevels}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableDifficulties.map((difficulty) => (
              <DifficultyBadge key={`${selectedPack?.id}-${difficulty}`} difficulty={difficulty} />
            ))}
          </div>
        </div>
      </SupportSection>

      <SupportSection
        title={copy.trainer.shared.orderSection}
        description={copy.trainer.shared.orderSectionHint}
      >
        <div className="flex flex-wrap gap-2">
          {(["adaptive", "default"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSelectQueueMode(mode)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                queueMode === mode
                  ? "border-accent/30 bg-accent/10 text-accent-strong"
                  : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
              }`}
            >
              {copy.trainer.queueModeLabels[mode]}
            </button>
          ))}
        </div>

        {visibleRetryItems.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="gold">{copy.trainer.shared.suggestedRetry}</StatusPill>
              <StatusPill>{copy.trainer.shared.weakConceptCount(visibleRetryItems.length)}</StatusPill>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {visibleRetryItems.map((retryItem) => (
                <li key={retryItem.scenarioId}>- {retryItem.reason}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {copy.trainer.shared.noWeakConcepts}
          </p>
        )}
      </SupportSection>

      <div
        className={`rounded-3xl border p-4 ${
          persistenceError
            ? "border-amber-200 bg-amber-50/80"
            : "border-border/70 bg-muted/18"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
            {storageMode === "account"
              ? copy.trainer.shared.accountAutosave
              : copy.trainer.shared.localAutosave}
          </StatusPill>
          {isPersisting ? (
            <StatusPill tone="gold">{copy.trainer.shared.saving}</StatusPill>
          ) : null}
          {persistenceError ? (
            <StatusPill tone="danger">{copy.trainer.shared.syncIssue}</StatusPill>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {persistenceError
            ? persistenceError
            : storageMode === "account"
              ? copy.trainer.shared.accountAutosaveDescription
              : copy.trainer.shared.localAutosaveDescription}
        </p>
      </div>
    </SurfaceCard>
  );
}
