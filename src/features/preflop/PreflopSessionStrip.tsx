import type { ReactNode } from "react";

import type {
  ContentPack,
  Difficulty,
  PersistenceMode,
  TrainingDifficultyFilter,
  TrainerQueueMode,
} from "@/types/training";

import { cn, formatPercent } from "@/lib/utils";
import {
  getPreflopDifficultyLabel,
  getPreflopDrillCopy,
  getPreflopPackLabel,
  getPreflopQueueModeLabel,
  getPreflopStorageLabel,
  type PreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

type PreflopSessionStripProps = {
  language: PreflopUiLanguage;
  activeContentPack: ContentPack;
  availableContentPacks: ContentPack[];
  selectedContentPackId: string | null;
  onSelectContentPack: (contentPackId: string) => void;
  scenarioCountByPackId: Record<string, number>;
  availableDifficulties: Difficulty[];
  selectedDifficulty: TrainingDifficultyFilter;
  onSelectDifficulty: (difficulty: TrainingDifficultyFilter) => void;
  queueMode: TrainerQueueMode;
  onSelectQueueMode: (queueMode: TrainerQueueMode) => void;
  answeredCount: number;
  totalQuestions: number;
  accuracy: number;
  attempts: number;
  retryItemCount: number;
  storageMode: PersistenceMode;
  isPersisting: boolean;
  persistenceError?: string | null;
};

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/60">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function StripButton({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition",
        isActive
          ? "border-cyan-200/25 bg-cyan-300/12 text-cyan-100"
          : "border-white/10 bg-black/12 text-slate-200 hover:border-white/20 hover:bg-white/[0.06]",
      )}
    >
      {children}
    </button>
  );
}

function StatBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-[20px] border border-white/10 bg-black/14 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-semibold leading-7 text-white text-pretty sm:text-xl">
        {value}
      </p>
    </div>
  );
}

export function PreflopSessionStrip({
  language,
  activeContentPack,
  availableContentPacks,
  selectedContentPackId,
  onSelectContentPack,
  scenarioCountByPackId,
  availableDifficulties,
  selectedDifficulty,
  onSelectDifficulty,
  queueMode,
  onSelectQueueMode,
  answeredCount,
  totalQuestions,
  accuracy,
  attempts,
  retryItemCount,
  storageMode,
  isPersisting,
  persistenceError = null,
}: PreflopSessionStripProps) {
  const copy = getPreflopDrillCopy(language);

  return (
    <section className="rounded-[32px] border border-emerald-950/18 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-4 text-white shadow-panel sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] xl:items-start 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="max-w-full break-words rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100 text-pretty">
              {copy.pageEyebrow}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 text-pretty">
              {copy.pageTitle}
            </span>
            <span className="max-w-full break-words rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100 text-pretty">
              {getPreflopPackLabel(activeContentPack.id, language)}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 text-pretty">
              {getPreflopStorageLabel(storageMode, language)}
            </span>
            {retryItemCount > 0 ? (
              <span className="max-w-full break-words rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100 text-pretty">
                {copy.retryLabel} x{retryItemCount}
              </span>
            ) : null}
            {isPersisting ? (
              <span className="max-w-full break-words rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100 text-pretty">
                {copy.savingLabel}
              </span>
            ) : null}
            {persistenceError ? (
              <span className="max-w-full break-words rounded-full border border-rose-200/25 bg-rose-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-100 text-pretty">
                {copy.syncIssueLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          <StatBlock
            label={copy.sessionProgress}
            value={`${answeredCount}/${totalQuestions}`}
          />
          <StatBlock label={copy.sessionAccuracy} value={formatPercent(accuracy)} />
          <StatBlock label={copy.allTimeAttempts} value={`${attempts}`} />
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
            {copy.sessionLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
              {copy.packLabel}: {getPreflopPackLabel(activeContentPack.id, language)}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
              {copy.queueLabel}: {getPreflopQueueModeLabel(queueMode, language)}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
              {copy.difficultyLabel}: {getPreflopDifficultyLabel(selectedDifficulty, language)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
        {availableContentPacks.length > 1 ? (
          <FilterGroup label={copy.packLabel}>
            {availableContentPacks.map((contentPack) => (
              <StripButton
                key={contentPack.id}
                isActive={selectedContentPackId === contentPack.id}
                onClick={() => onSelectContentPack(contentPack.id)}
              >
                {getPreflopPackLabel(contentPack.id, language)}{" "}
                <span className="text-slate-300/80">
                  ({scenarioCountByPackId[contentPack.id] ?? 0})
                </span>
              </StripButton>
            ))}
          </FilterGroup>
        ) : (
          <FilterGroup label={copy.packLabel}>
            <span className="rounded-full border border-white/10 bg-black/12 px-4 py-2 text-sm font-semibold text-slate-200">
              {getPreflopPackLabel(activeContentPack.id, language)}
            </span>
          </FilterGroup>
        )}

        <FilterGroup label={copy.difficultyLabel}>
          <StripButton
            isActive={selectedDifficulty === "all"}
            onClick={() => onSelectDifficulty("all")}
          >
            {getPreflopDifficultyLabel("all", language)}
          </StripButton>
          {availableDifficulties.map((difficulty) => (
            <StripButton
              key={difficulty}
              isActive={selectedDifficulty === difficulty}
              onClick={() => onSelectDifficulty(difficulty)}
            >
              {getPreflopDifficultyLabel(difficulty, language)}
            </StripButton>
          ))}
        </FilterGroup>

        <FilterGroup label={copy.queueLabel}>
          {(["adaptive", "default"] as const).map((mode) => (
            <StripButton
              key={mode}
              isActive={queueMode === mode}
              onClick={() => onSelectQueueMode(mode)}
            >
              {getPreflopQueueModeLabel(mode, language)}
            </StripButton>
          ))}
        </FilterGroup>
      </div>

      {persistenceError ? (
        <p className="mt-4 text-sm leading-6 text-rose-100/90">{persistenceError}</p>
      ) : null}
    </section>
  );
}
