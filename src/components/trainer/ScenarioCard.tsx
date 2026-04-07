"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { contentPackMap } from "@/data/content-packs";
import {
  formatActionHistory,
  formatHandCategory,
  formatPlayerArchetype,
  formatPosition,
} from "@/lib/poker/formatting";
import { getConceptLabel } from "@/lib/training/concepts";
import type { RetryQueueItem, TrainingScenario } from "@/types/training";

type ScenarioCardProps = {
  scenario: TrainingScenario;
  questionNumber: number;
  totalQuestions: number;
  retryHint?: RetryQueueItem | null;
};

type SpotFact = {
  id: string;
  label: string;
  value: string;
  wide?: boolean;
};

function formatBoardFromScenario(scenario: TrainingScenario) {
  if (scenario.module === "preflop" || !scenario.board) {
    return null;
  }

  const cards = [...scenario.board.flop];

  if ((scenario.street === "turn" || scenario.street === "river") && scenario.board.turn) {
    cards.push(scenario.board.turn);
  }

  if (scenario.street === "river" && scenario.board.river) {
    cards.push(scenario.board.river);
  }

  return cards.join(" ");
}

function getFactLabels(language: "en" | "vi") {
  if (language === "vi") {
    return {
      hero: "Hero",
      villain: "Villain",
      hand: "Hand",
      handType: "Nhóm hand",
      stack: "Stack",
      action: "Action trước đó",
      street: "Street",
      board: "Board",
      playerType: "Player type",
      pot: "Pot",
      outs: "Outs",
      hint: "Gợi ý",
    };
  }

  return {
    hero: "Hero",
    villain: "Villain",
    hand: "Hand",
    handType: "Hand type",
    stack: "Stack",
    action: "Action",
    street: "Street",
    board: "Board",
    playerType: "Player type",
    pot: "Pot",
    outs: "Outs",
    hint: "Hint",
  };
}

function getSpotFacts(scenario: TrainingScenario, language: "en" | "vi"): SpotFact[] {
  const labels = getFactLabels(language);

  if (scenario.module === "preflop") {
    return [
      {
        id: "hero",
        label: labels.hero,
        value: formatPosition(scenario.heroPosition),
      },
      {
        id: "hand",
        label: labels.hand,
        value: scenario.handLabel,
      },
      {
        id: "stack",
        label: labels.stack,
        value: `${scenario.effectiveStackBb}bb`,
      },
      {
        id: "villain",
        label: labels.villain,
        value: scenario.villainPosition
          ? formatPosition(scenario.villainPosition)
          : "N/A",
      },
      {
        id: "hand-type",
        label: labels.handType,
        value: formatHandCategory(scenario.handCategory),
      },
      {
        id: "action",
        label: labels.action,
        value: formatActionHistory(scenario.actionHistory),
        wide: true,
      },
    ];
  }

  const facts: SpotFact[] = [
    {
      id: "street",
      label: labels.street,
      value: scenario.street.toUpperCase(),
    },
  ];

  if (scenario.heroPosition) {
    facts.push({
      id: "hero",
      label: labels.hero,
      value: formatPosition(scenario.heroPosition),
    });
  }

  if (scenario.heroHand) {
    facts.push({
      id: "hand",
      label: labels.hand,
      value: scenario.heroHand,
    });
  }

  if (scenario.villainPosition) {
    facts.push({
      id: "villain",
      label: labels.villain,
      value: formatPosition(scenario.villainPosition),
    });
  }

  if (typeof scenario.effectiveStackBb === "number") {
    facts.push({
      id: "stack",
      label: labels.stack,
      value: `${scenario.effectiveStackBb}bb`,
    });
  }

  const boardLabel = formatBoardFromScenario(scenario);

  if (boardLabel) {
    facts.push({
      id: "board",
      label: labels.board,
      value: boardLabel,
    });
  }

  if (scenario.actionHistory?.length) {
    facts.push({
      id: "action",
      label: labels.action,
      value: formatActionHistory(scenario.actionHistory),
      wide: true,
    });
  }

  if (scenario.playerArchetypeId) {
    facts.push({
      id: "player-type",
      label: labels.playerType,
      value: formatPlayerArchetype(scenario.playerArchetypeId),
    });
  }

  if (
    typeof scenario.potSizeBb === "number" &&
    typeof scenario.betToCallBb === "number"
  ) {
    facts.push({
      id: "pot",
      label: labels.pot,
      value: `${scenario.potSizeBb}bb / ${scenario.betToCallBb}bb`,
    });
  }

  if (scenario.outsCount) {
    facts.push({
      id: "outs",
      label: labels.outs,
      value: `${scenario.outsCount}`,
    });
  }

  if (scenario.equityHint) {
    facts.push({
      id: "hint",
      label: labels.hint,
      value: scenario.equityHint,
      wide: true,
    });
  }

  return facts;
}

export function ScenarioCard({
  scenario,
  questionNumber,
  totalQuestions,
  retryHint = null,
}: ScenarioCardProps) {
  const { copy, language } = useUiLanguageValues();
  const contentPack = contentPackMap[scenario.contentPackId] ?? null;
  const facts = getSpotFacts(scenario, language);

  return (
    <SurfaceCard className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill tone="accent">
          {copy.trainer.shared.questionCounter(questionNumber, totalQuestions)}
        </StatusPill>
        <DifficultyBadge difficulty={scenario.difficulty} />
        <StatusPill tone="gold">
          {copy.trainer.sourceTypeLabels[scenario.sourceType]}
        </StatusPill>
        {contentPack ? <StatusPill>{contentPack.focusLabel}</StatusPill> : null}
        {retryHint ? (
          <StatusPill tone="gold">{copy.trainer.shared.suggestedRetry}</StatusPill>
        ) : null}
      </div>

      <div className="rounded-[28px] border border-accent/15 bg-accent/5 p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.trainer.shared.decisionSpot}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            {scenario.learningGoal}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {scenario.title}
          </h2>
          <p className="max-w-3xl text-base leading-7 text-foreground/90">
            {scenario.prompt}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.trainer.shared.spotState}
        </p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.id}
              className={`rounded-3xl border border-border/70 bg-muted/18 px-4 py-4 ${
                fact.wide ? "sm:col-span-2 xl:col-span-3" : ""
              }`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {fact.label}
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-foreground sm:text-base">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.trainer.shared.keyConcepts}
        </p>
        <div className="flex flex-wrap gap-2">
          {scenario.keyConcepts.map((conceptTag) => (
            <StatusPill key={`${scenario.id}-${conceptTag}`} tone="accent">
              {getConceptLabel(conceptTag)}
            </StatusPill>
          ))}
        </div>
      </div>

      {retryHint ? (
        <div className="rounded-3xl border border-gold/20 bg-gold/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            {copy.trainer.shared.reviewWeakConcepts}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {retryHint.reason}
          </p>
        </div>
      ) : null}

      {scenario.tags.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.trainer.shared.extraTags}
          </p>
          <div className="flex flex-wrap gap-2">
            {scenario.tags.slice(0, 5).map((tag) => (
              <StatusPill key={tag}>{tag}</StatusPill>
            ))}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}

function useUiLanguageValues() {
  const copy = useUiCopy();

  return {
    copy,
    language: copy.locale === "vi-VN" ? ("vi" as const) : ("en" as const),
  };
}
