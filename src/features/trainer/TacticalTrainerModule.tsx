"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { leakTags } from "@/data/leak-tags";
import { TacticalCardRow } from "@/features/trainer/TacticalCardVisual";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import {
  getTacticalBoardLabels,
  getTacticalDifficultyLabel,
  getTacticalDrillCopy,
  getTacticalModuleMeta,
  getTacticalPlayerTypeLabel,
  getTacticalQueueModeLabel,
  getTacticalSourceTypeLabel,
  getTacticalStorageLabel,
  getTacticalUiLanguage,
  type TacticalUiLanguage,
} from "@/features/trainer/tactical-trainer-copy";
import { getScenarioFollowUpSuggestions } from "@/lib/training/follow-up-suggestions";
import { cn, formatDateTimeLabel, formatPercent } from "@/lib/utils";
import type {
  CandidateAction,
  ContentPack,
  Difficulty,
  InteractiveTrainingModuleId,
  PersistenceMode,
  ProgressSummary,
  RetryQueueItem,
  SubmittedAnswerFeedback,
  TrainingDifficultyFilter,
  TrainingScenario,
  TrainerQueueMode,
} from "@/types/training";

type TacticalTrainerModuleProps<T extends TrainingScenario> = {
  moduleId: InteractiveTrainingModuleId;
  scenarios: T[];
};

type SpotTile = {
  label: string;
  value: string;
  wide?: boolean;
};

function countScenariosByPack(scenarios: TrainingScenario[]) {
  return scenarios.reduce<Record<string, number>>((counts, scenario) => {
    counts[scenario.contentPackId] = (counts[scenario.contentPackId] ?? 0) + 1;
    return counts;
  }, {});
}

function getVisibleBoardCards(scenario: TrainingScenario) {
  if (scenario.module === "preflop" || !scenario.board) {
    return [];
  }

  const cards = [...scenario.board.flop];

  if ((scenario.street === "turn" || scenario.street === "river") && scenario.board.turn) {
    cards.push(scenario.board.turn);
  }

  if (scenario.street === "river" && scenario.board.river) {
    cards.push(scenario.board.river);
  }

  return cards;
}

function getHeroHandCards(scenario: TrainingScenario) {
  if (scenario.module === "preflop" || !scenario.heroHand) {
    return [];
  }

  return scenario.heroHand
    .split(/\s+/)
    .map((card) => card.trim())
    .filter(Boolean);
}

function getBreakEvenPercent(potSizeBb?: number, betToCallBb?: number) {
  if (
    typeof potSizeBb !== "number" ||
    typeof betToCallBb !== "number" ||
    betToCallBb <= 0
  ) {
    return null;
  }

  const finalPot = potSizeBb + betToCallBb + betToCallBb;
  const requiredEquity = (betToCallBb / finalPot) * 100;

  return `${Math.round(requiredEquity)}%`;
}

function getSpotTiles(
  scenario: TrainingScenario,
  language: TacticalUiLanguage,
) {
  const copy = getTacticalDrillCopy(language);

  if (scenario.module === "pot-odds") {
    return [
      {
        label: copy.potLabel,
        value:
          typeof scenario.potSizeBb === "number" ? `${scenario.potSizeBb}bb` : "-",
      },
      {
        label: copy.callLabel,
        value:
          typeof scenario.betToCallBb === "number"
            ? `${scenario.betToCallBb}bb`
            : "-",
      },
      {
        label: copy.needLabel,
        value: getBreakEvenPercent(scenario.potSizeBb, scenario.betToCallBb) ?? "-",
      },
      {
        label: copy.outsLabel,
        value:
          typeof scenario.outsCount === "number" ? `${scenario.outsCount}` : "-",
      },
      {
        label: copy.streetLabel,
        value: scenario.street.toUpperCase(),
      },
      ...(scenario.equityHint
        ? [{ label: copy.hintLabel, value: scenario.equityHint, wide: true }]
        : []),
    ] satisfies SpotTile[];
  }

  if (scenario.module === "preflop") {
    return [];
  }

  const tiles: SpotTile[] = [{ label: copy.streetLabel, value: scenario.street.toUpperCase() }];

  if (scenario.heroPosition) {
    tiles.push({ label: copy.heroLabel, value: scenario.heroPosition });
  }

  if (scenario.villainPosition) {
    tiles.push({ label: copy.villainLabel, value: scenario.villainPosition });
  }

  if (scenario.heroHand) {
    tiles.push({ label: copy.handLabel, value: scenario.heroHand });
  }

  if (typeof scenario.effectiveStackBb === "number") {
    tiles.push({
      label: copy.stackLabel,
      value: `${scenario.effectiveStackBb}bb`,
    });
  }

  if (scenario.playerArchetypeId) {
    tiles.push({
      label: copy.playerTypeLabel,
      value: getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language),
    });
  }

  if (scenario.board) {
    tiles.push({
      label: copy.textureLabel,
      value: getTacticalBoardLabels(scenario.board, language).join(" / "),
      wide: true,
    });
  }

  return tiles;
}

function SessionFilterButton({
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

function SessionStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-black/14 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function SessionFilterGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function TacticalSessionStrip({
  language,
  moduleId,
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
  persistenceError,
}: {
  language: TacticalUiLanguage;
  moduleId: InteractiveTrainingModuleId;
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
}) {
  const copy = getTacticalDrillCopy(language);
  const moduleMeta = getTacticalModuleMeta(moduleId, language);

  return (
    <section className="rounded-[32px] border border-emerald-950/18 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-4 text-white shadow-panel sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
              {moduleMeta.eyebrow}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              {moduleMeta.title}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              {activeContentPack.focusLabel}
            </span>
            <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
              {getTacticalStorageLabel(storageMode, language)}
            </span>
            {retryItemCount > 0 ? (
              <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                {copy.retryLabel} x{retryItemCount}
              </span>
            ) : null}
            {isPersisting ? (
              <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
                {copy.savingLabel}
              </span>
            ) : null}
            {persistenceError ? (
              <span className="rounded-full border border-rose-200/25 bg-rose-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-100">
                {copy.syncIssueLabel}
              </span>
            ) : null}
          </div>

          <div className="rounded-[22px] border border-white/10 bg-black/12 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
              {copy.sessionLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                {copy.packLabel}: {activeContentPack.focusLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                {copy.levelLabel}: {getTacticalDifficultyLabel(selectedDifficulty, language)}
              </span>
              <span className="rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
                {copy.orderLabel}: {getTacticalQueueModeLabel(queueMode, language)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SessionStat
            label={copy.sessionProgressLabel}
            value={`${answeredCount}/${totalQuestions}`}
          />
          <SessionStat label={copy.accuracyLabel} value={formatPercent(accuracy)} />
          <SessionStat label={copy.attemptsLabel} value={`${attempts}`} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(0,0.9fr)]">
        <SessionFilterGroup label={copy.packLabel}>
          {availableContentPacks.map((contentPack) => (
            <SessionFilterButton
              key={contentPack.id}
              isActive={selectedContentPackId === contentPack.id}
              onClick={() => onSelectContentPack(contentPack.id)}
            >
              {contentPack.focusLabel}{" "}
              <span className="text-slate-300/75">
                ({scenarioCountByPackId[contentPack.id] ?? 0})
              </span>
            </SessionFilterButton>
          ))}
        </SessionFilterGroup>

        <SessionFilterGroup label={copy.levelLabel}>
          <SessionFilterButton
            isActive={selectedDifficulty === "all"}
            onClick={() => onSelectDifficulty("all")}
          >
            {getTacticalDifficultyLabel("all", language)}
          </SessionFilterButton>
          {availableDifficulties.map((difficulty) => (
            <SessionFilterButton
              key={difficulty}
              isActive={selectedDifficulty === difficulty}
              onClick={() => onSelectDifficulty(difficulty)}
            >
              {getTacticalDifficultyLabel(difficulty, language)}
            </SessionFilterButton>
          ))}
        </SessionFilterGroup>

        <SessionFilterGroup label={copy.orderLabel}>
          {(["adaptive", "default"] as const).map((mode) => (
            <SessionFilterButton
              key={mode}
              isActive={queueMode === mode}
              onClick={() => onSelectQueueMode(mode)}
            >
              {getTacticalQueueModeLabel(mode, language)}
            </SessionFilterButton>
          ))}
        </SessionFilterGroup>
      </div>

      {persistenceError ? (
        <p className="mt-4 text-sm leading-6 text-rose-100/90">{persistenceError}</p>
      ) : null}
    </section>
  );
}

function SpotTileCard({ label, value, wide = false }: SpotTile) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-white/12 bg-black/14 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        wide && "sm:col-span-2",
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}

function ActionLane({
  label,
  steps,
}: {
  label: string;
  steps: string[];
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {steps.map((step, index) => (
          <div key={`${step}-${index}`} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/45">
                {"->"}
              </span>
            ) : null}
            <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioPrimaryVisual({
  language,
  scenario,
}: {
  language: TacticalUiLanguage;
  scenario: TrainingScenario;
}) {
  const copy = getTacticalDrillCopy(language);
  const boardCards = getVisibleBoardCards(scenario);
  const heroHandCards = getHeroHandCards(scenario);

  if (scenario.module === "pot-odds") {
    const breakEvenPercent =
      getBreakEvenPercent(scenario.potSizeBb, scenario.betToCallBb) ?? "-";

    return (
      <div className="rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.22),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.18)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <SpotTileCard
            label={copy.potLabel}
            value={
              typeof scenario.potSizeBb === "number" ? `${scenario.potSizeBb}bb` : "-"
            }
          />
          <SpotTileCard
            label={copy.callLabel}
            value={
              typeof scenario.betToCallBb === "number"
                ? `${scenario.betToCallBb}bb`
                : "-"
            }
          />
          <SpotTileCard label={copy.needLabel} value={breakEvenPercent} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
            {scenario.street.toUpperCase()}
          </span>
          {typeof scenario.outsCount === "number" ? (
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
              {copy.outsLabel}: {scenario.outsCount}
            </span>
          ) : null}
          {scenario.equityHint ? (
            <span className="rounded-full border border-emerald-200/18 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100">
              {scenario.equityHint}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (scenario.module === "preflop") {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.2),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.18)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
          {scenario.street.toUpperCase()}
        </span>
        {scenario.playerArchetypeId ? (
          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-100">
            {getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}
          </span>
        ) : null}
        {scenario.board
          ? getTacticalBoardLabels(scenario.board, language).map((label) => (
              <span
                key={`${scenario.id}-${label}`}
                className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200"
              >
                {label}
              </span>
            ))
          : null}
      </div>

      {boardCards.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
            {copy.boardLabel}
          </p>
          <TacticalCardRow cards={boardCards} size="lg" />
        </div>
      ) : null}

      {heroHandCards.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
            {copy.handLabel}
          </p>
          <TacticalCardRow cards={heroHandCards} size="md" />
        </div>
      ) : null}

      {boardCards.length === 0 && heroHandCards.length === 0 ? (
        <div className="mt-4 rounded-[22px] border border-white/12 bg-black/16 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
            {copy.focusLabel}
          </p>
          <p className="mt-2 text-xl font-semibold text-white">{scenario.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.prompt}</p>
        </div>
      ) : null}
    </div>
  );
}

function TacticalSpotPanel({
  language,
  moduleId,
  activeContentPack,
  scenario,
  questionNumber,
  totalQuestions,
  retryHint,
}: {
  language: TacticalUiLanguage;
  moduleId: InteractiveTrainingModuleId;
  activeContentPack: ContentPack;
  scenario: TrainingScenario;
  questionNumber: number;
  totalQuestions: number;
  retryHint?: RetryQueueItem | null;
}) {
  const copy = getTacticalDrillCopy(language);
  const moduleMeta = getTacticalModuleMeta(moduleId, language);
  const spotTiles = getSpotTiles(scenario, language);
  const actionLane =
    scenario.module === "preflop" ? scenario.actionHistory : scenario.actionHistory ?? [];

  return (
    <section className="rounded-[34px] border border-emerald-950/20 bg-[linear-gradient(180deg,rgba(7,30,28,0.97),rgba(8,23,32,0.96))] p-5 text-white shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100">
          {moduleMeta.stateEyebrow}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {questionNumber}/{totalQuestions}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {getTacticalSourceTypeLabel(scenario.sourceType, language)}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
          {activeContentPack.focusLabel}
        </span>
        {retryHint ? (
          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
            {copy.retryLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-[28px] border border-white/12 bg-black/14 p-4 sm:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
          {moduleMeta.title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[2rem]">
          {scenario.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          {scenario.prompt}
        </p>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <ScenarioPrimaryVisual language={language} scenario={scenario} />

        <div className="grid gap-3 sm:grid-cols-2">
          {spotTiles.map((tile) => (
            <SpotTileCard key={`${tile.label}-${tile.value}`} {...tile} />
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <ActionLane label={copy.actionLabel} steps={actionLane} />

        <div className="rounded-[24px] border border-white/12 bg-black/14 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/55">
            {copy.focusLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.learningGoal}</p>
        </div>
      </div>

      {retryHint ? (
        <div className="mt-4 rounded-[24px] border border-amber-200/18 bg-amber-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
            {copy.retryLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-50/90">{retryHint.reason}</p>
        </div>
      ) : null}
    </section>
  );
}

function TacticalActionButton({
  action,
  index,
  selectedTag,
  bestTag,
  isSelected,
  isLocked,
  isRecommended,
  isSubmittedChoice,
  onSelect,
}: {
  action: CandidateAction;
  index: number;
  selectedTag: string;
  bestTag: string;
  isSelected: boolean;
  isLocked: boolean;
  isRecommended: boolean;
  isSubmittedChoice: boolean;
  onSelect: () => void;
}) {
  const showSubmittedState = isLocked && (isRecommended || isSubmittedChoice);
  const isIncorrectSubmitted = isSubmittedChoice && !isRecommended;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      aria-pressed={isSelected}
      className={cn(
        "group w-full rounded-[28px] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 active:scale-[0.99]",
        "min-h-[96px] bg-white/[0.04] text-white/92 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.85)]",
        !isLocked && "hover:-translate-y-px hover:border-white/25 hover:bg-white/[0.08]",
        !isSelected && !showSubmittedState && "border-white/10",
        isSelected &&
          !isLocked &&
          "border-cyan-300/70 bg-[linear-gradient(135deg,rgba(8,47,73,0.95),rgba(8,145,178,0.26))] shadow-[0_20px_44px_-22px_rgba(103,232,249,0.5)]",
        isLocked &&
          isRecommended &&
          "border-emerald-300/65 bg-[linear-gradient(135deg,rgba(6,78,59,0.95),rgba(52,211,153,0.24))] shadow-[0_18px_44px_-24px_rgba(52,211,153,0.55)]",
        isIncorrectSubmitted &&
          "border-rose-300/60 bg-[linear-gradient(135deg,rgba(76,5,25,0.96),rgba(251,113,133,0.18))] shadow-[0_18px_44px_-24px_rgba(251,113,133,0.45)]",
        isLocked && !isRecommended && !isSubmittedChoice && "border-white/10 opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.18em]",
              isSelected || showSubmittedState
                ? "border-white/35 bg-white/12 text-white"
                : "border-white/12 bg-black/10 text-slate-300",
            )}
          >
            {`${index + 1}`.padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold leading-6 text-white sm:text-xl">
              {action.label}
            </p>
            {action.feedbackHint && isLocked && !isRecommended && isSubmittedChoice ? (
              <p className="mt-3 text-sm leading-5 text-rose-100/90">
                {action.feedbackHint}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isSubmittedChoice ? (
            <span className="rounded-full border border-white/18 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
              {selectedTag}
            </span>
          ) : null}
          {isRecommended ? (
            <span className="rounded-full border border-emerald-200/35 bg-emerald-100/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
              {bestTag}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function TacticalDecisionPanel({
  language,
  moduleId,
  scenario,
  feedback,
  selectedActionId,
  canSubmit,
  hasSubmitted,
  isLastScenario,
  onSelectAction,
  onSubmit,
  onNext,
  onRestart,
}: {
  language: TacticalUiLanguage;
  moduleId: InteractiveTrainingModuleId;
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback | null;
  selectedActionId: string | null;
  canSubmit: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  onSelectAction: (actionId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const copy = getTacticalDrillCopy(language);
  const moduleMeta = getTacticalModuleMeta(moduleId, language);
  const selectedAction =
    scenario.candidateActions.find((action) => action.id === selectedActionId) ?? null;
  const primaryButtonLabel = hasSubmitted
    ? isLastScenario
      ? copy.finishSetLabel
      : copy.nextSpotLabel
    : selectedAction
      ? `${copy.lockLabel} ${selectedAction.label}`
      : copy.lockLabel;

  return (
    <aside className="rounded-[32px] border border-slate-900/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel xl:sticky xl:top-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          {moduleMeta.eyebrow}
        </p>
        <h2 className="text-[1.8rem] font-semibold tracking-tight text-white">
          {moduleMeta.decisionTitle}
        </h2>
        <p className="text-sm leading-6 text-slate-300">
          {hasSubmitted ? copy.reviewPlaceholder : moduleMeta.decisionHint}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {scenario.candidateActions.map((action, index) => (
          <TacticalActionButton
            key={action.id}
            action={action}
            index={index}
            selectedTag={copy.selectedLineLabel}
            bestTag={copy.bestLineLabel}
            isSelected={selectedActionId === action.id}
            isLocked={hasSubmitted}
            isRecommended={feedback?.recommendedAction.id === action.id}
            isSubmittedChoice={feedback?.selectedAction.id === action.id}
            onSelect={() => onSelectAction(action.id)}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            {copy.selectedLineLabel}
          </p>
          <p className="text-xl font-semibold text-white">
            {selectedAction?.label ?? copy.noLineSelectedLabel}
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={hasSubmitted ? onNext : onSubmit}
            disabled={!hasSubmitted && !canSubmit}
            className={cn(
              "w-full rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition active:scale-[0.99]",
              !hasSubmitted && !canSubmit
                ? "cursor-not-allowed bg-slate-600/60 text-slate-300"
                : "bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(6,182,212,0.96))] text-white shadow-[0_18px_42px_-22px_rgba(34,197,94,0.7)] hover:brightness-105",
            )}
          >
            {primaryButtonLabel}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-full border border-white/12 bg-transparent px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/22 hover:bg-white/[0.06]"
          >
            {copy.restartLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}

function ReviewBlock({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-[28px] border p-5", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

function TacticalFeedbackPanel({
  language,
  scenario,
  feedback,
  progressSummary,
}: {
  language: TacticalUiLanguage;
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback | null;
  progressSummary: ProgressSummary;
}) {
  const copy = getTacticalDrillCopy(language);

  if (!feedback) {
    return (
      <section className="rounded-[32px] border border-dashed border-border/80 bg-surface/75 p-5 shadow-panel sm:p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
            {copy.nextLabel}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {copy.reviewPlaceholder}
          </h2>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[copy.resultLabel, copy.bestLineLabel, copy.whyLabel, copy.learnLabel].map((label) => (
            <div
              key={label}
              className="rounded-[24px] border border-border/70 bg-muted/18 px-4 py-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </p>
              <div className="mt-3 h-3 w-24 rounded-full bg-muted" />
              <div className="mt-2 h-3 w-32 rounded-full bg-muted/80" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const isCorrect = feedback.attempt.isCorrect;
  const answerBlock =
    scenario.rationaleBlocks.find((block) => block.kind === "answer") ?? null;
  const whyBlock =
    scenario.rationaleBlocks.find(
      (block) => block.kind === "core-reason" || block.kind === "context-factor",
    ) ?? answerBlock;
  const takeawayBlock =
    scenario.rationaleBlocks.find(
      (block) =>
        block.kind === "alternative-action" || block.kind === "mistake-correction",
    ) ?? whyBlock;
  const surfacedLeakTags = scenario.mistakeTags
    .map((leakTagId) => leakTags.find((leakTag) => leakTag.id === leakTagId)?.label ?? null)
    .filter((value): value is string => value !== null)
    .slice(0, 2);
  const firstAssumption = scenario.assumptions[0] ?? null;
  const followUpSuggestions = getScenarioFollowUpSuggestions({
    scenario,
    isCorrect,
    progressSummary,
  }).slice(0, 2);

  return (
    <section className="rounded-[32px] border border-border/70 bg-surface/90 p-5 shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {isCorrect ? copy.correctLabel : copy.incorrectLabel}
        </span>
        <span className="rounded-full border border-border bg-muted/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.selectedLineLabel}: {feedback.selectedAction.label}
        </span>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.bestLineLabel}: {feedback.recommendedAction.label}
        </span>
        <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          {getTacticalSourceTypeLabel(scenario.sourceType, language)}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReviewBlock
          label={copy.resultLabel}
          className={cn(
            isCorrect
              ? "border-emerald-200/70 bg-emerald-50/70"
              : "border-rose-200/70 bg-rose-50/70",
          )}
        >
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isCorrect ? "text-emerald-700" : "text-rose-700",
            )}
          >
            {isCorrect ? copy.correctLabel : copy.incorrectLabel}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {feedback.selectedAction.label}
          </p>
        </ReviewBlock>

        <ReviewBlock label={copy.bestLineLabel} className="border-accent/20 bg-accent/5">
          <p className="text-2xl font-semibold tracking-tight text-accent-strong">
            {feedback.recommendedAction.label}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {answerBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewBlock>

        <ReviewBlock label={copy.whyLabel} className="border-border/70 bg-muted/12">
          <p className="text-sm leading-6 text-muted-foreground">
            {whyBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewBlock>

        <ReviewBlock label={copy.learnLabel} className="border-border/70 bg-muted/12">
          <p className="text-sm leading-6 text-muted-foreground">
            {takeawayBlock?.body ?? scenario.learningGoal}
          </p>
          {!isCorrect && surfacedLeakTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {surfacedLeakTags.map((leakLabel) => (
                <span
                  key={`${scenario.id}-${leakLabel}`}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700"
                >
                  {leakLabel}
                </span>
              ))}
            </div>
          ) : null}
        </ReviewBlock>
      </div>

      {!isCorrect && feedback.selectedAction.feedbackHint ? (
        <div className="mt-4 rounded-[26px] border border-rose-200/70 bg-rose-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
            {copy.driftLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-900/80">
            {feedback.selectedAction.feedbackHint}
          </p>
        </div>
      ) : null}

      {firstAssumption ? (
        <div className="mt-4 rounded-[26px] border border-gold/20 bg-gold/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            {copy.assumptionsLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {firstAssumption}
          </p>
        </div>
      ) : null}

      {followUpSuggestions.length > 0 ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {followUpSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="rounded-[24px] border border-border/70 bg-muted/18 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
                  {copy.nextLabel}
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold text-foreground">
                {suggestion.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {suggestion.reason}
              </p>
              <Link
                href={suggestion.route}
                className="mt-4 inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                {copy.openPackLabel}
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CompletionPanel({
  language,
  moduleId,
  moduleCopy,
  activeContentPack,
  accuracy,
  correctCount,
  answeredCount,
  completionTimestamp,
  storageMode,
  onRestart,
}: {
  language: TacticalUiLanguage;
  moduleId: InteractiveTrainingModuleId;
  moduleCopy: ReturnType<typeof useUiCopy>["trainer"]["modules"][InteractiveTrainingModuleId];
  activeContentPack: ContentPack;
  accuracy: number;
  correctCount: number;
  answeredCount: number;
  completionTimestamp: string | null;
  storageMode: PersistenceMode;
  onRestart: () => void;
}) {
  const copy = getTacticalDrillCopy(language);
  const moduleMeta = getTacticalModuleMeta(moduleId, language);

  return (
    <section className="rounded-[36px] border border-emerald-950/20 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-5 text-white shadow-panel sm:p-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/75">
          {moduleMeta.eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {moduleMeta.completionTitle}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-300">
          {moduleMeta.completionBody}
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <SessionStat label={copy.accuracyLabel} value={formatPercent(accuracy)} />
        <SessionStat label={copy.correctCountLabel} value={`${correctCount}/${answeredCount}`} />
        <SessionStat
          label={copy.savedLabel}
          value={formatDateTimeLabel(completionTimestamp)}
        />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {moduleCopy.recapBullets.map((bullet) => (
          <div
            key={bullet}
            className="rounded-[24px] border border-white/10 bg-black/14 px-4 py-4"
          >
            <p className="text-sm leading-6 text-slate-300">{bullet}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(13,148,136,0.96))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:brightness-105"
        >
          {moduleCopy.restartButton}
        </button>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
          {activeContentPack.focusLabel}
        </span>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
          {getTacticalStorageLabel(storageMode, language)}
        </span>
      </div>
    </section>
  );
}

export function TacticalTrainerModule<T extends TrainingScenario>({
  moduleId,
  scenarios,
}: TacticalTrainerModuleProps<T>) {
  const copy = useUiCopy();
  const language = getTacticalUiLanguage(copy.locale);
  const moduleCopy = copy.trainer.modules[moduleId];
  const moduleMeta = getTacticalModuleMeta(moduleId, language);
  const scenarioCountByPackId = useMemo(() => countScenariosByPack(scenarios), [scenarios]);
  const {
    activeContentPack,
    availableContentPacks,
    queueMode,
    scopedProgress,
    selectedContentPackId,
    selectedDifficulty,
    session,
    setQueueMode,
    setSelectedContentPackId,
    setSelectedDifficulty,
  } = useTrainerModuleSession(moduleId, scenarios);

  if (session.isComplete) {
    return (
      <CompletionPanel
        language={language}
        moduleId={moduleId}
        moduleCopy={moduleCopy}
        activeContentPack={activeContentPack}
        accuracy={session.accuracy}
        correctCount={session.correctCount}
        answeredCount={session.answeredCount}
        completionTimestamp={session.completionTimestamp}
        storageMode={session.storageMode}
        onRestart={session.handleRestartSession}
      />
    );
  }

  if (!session.currentScenario) {
    return (
      <section className="rounded-[32px] border border-border/70 bg-surface/90 p-6 shadow-panel">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
          {moduleMeta.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {moduleMeta.emptyTitle}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {selectedDifficulty === "all"
            ? moduleMeta.emptyBody
            : moduleCopy.emptyByDifficulty(
                copy.trainer.difficultyLabels[selectedDifficulty],
              )}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <TacticalSessionStrip
        language={language}
        moduleId={moduleId}
        activeContentPack={activeContentPack}
        availableContentPacks={availableContentPacks}
        selectedContentPackId={selectedContentPackId}
        onSelectContentPack={setSelectedContentPackId}
        scenarioCountByPackId={scenarioCountByPackId}
        availableDifficulties={session.availableDifficulties}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
        queueMode={queueMode}
        onSelectQueueMode={setQueueMode}
        answeredCount={session.answeredCount}
        totalQuestions={session.totalQuestions}
        accuracy={session.accuracy}
        attempts={scopedProgress.attempts}
        retryItemCount={session.retryQueueItems.length}
        storageMode={session.storageMode}
        isPersisting={session.isPersisting}
        persistenceError={session.persistenceError}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <TacticalSpotPanel
          language={language}
          moduleId={moduleId}
          activeContentPack={activeContentPack}
          scenario={session.currentScenario}
          questionNumber={session.questionNumber}
          totalQuestions={session.totalQuestions}
          retryHint={session.currentRetryHint}
        />

        <TacticalDecisionPanel
          language={language}
          moduleId={moduleId}
          scenario={session.currentScenario}
          feedback={session.feedback}
          selectedActionId={session.selectedActionId}
          canSubmit={session.canSubmit}
          hasSubmitted={session.hasSubmitted}
          isLastScenario={session.isLastScenario}
          onSelectAction={session.handleSelectAction}
          onSubmit={session.handleSubmitAnswer}
          onNext={session.handleNextScenario}
          onRestart={session.handleRestartSession}
        />
      </div>

      <TacticalFeedbackPanel
        language={language}
        scenario={session.currentScenario}
        feedback={session.feedback}
        progressSummary={session.overallProgressSummary}
      />
    </div>
  );
}
