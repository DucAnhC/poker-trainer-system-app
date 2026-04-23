"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, type ReactNode } from "react";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import {
  ActionHistory,
  ActionOptionCard,
  ActionTray,
  CoachAnchor,
  PotDisplay,
  RevealStatePanel,
  SceneHeader,
  SceneStatCard,
  SeatBadge,
  SpotTag,
  StatPill,
  TableSceneShell,
} from "@/components/poker-room/PokerRoom";
import { leakTags } from "@/data/leak-tags";
import { TacticalCardRow } from "@/features/trainer/TacticalCardVisual";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import {
  getTacticalBoardLabels,
  getTacticalDecisionHint,
  getTacticalDifficultyLabel,
  getTacticalDrillCopy,
  getTacticalModuleMeta,
  getTacticalPackLabel,
  getTacticalPlayerTypeLabel,
  getTacticalQueueModeLabel,
  getTacticalSourceTypeLabel,
  getTacticalStorageLabel,
  getTacticalUiLanguage,
  type TacticalUiLanguage,
} from "@/features/trainer/tactical-trainer-copy";
import {
  buildNudgeCoachNote,
  buildSilentCoachNote,
} from "@/lib/training/coach-notes";
import { getScenarioFollowUpSuggestions } from "@/lib/training/follow-up-suggestions";
import { cn, formatDateTimeLabel, formatPercent } from "@/lib/utils";
import type { BoardTextureProfile, PlayerArchetypeId } from "@/types/poker";
import type {
  CandidateAction,
  ContentPack,
  Difficulty,
  InteractiveTrainingModuleId,
  PersistenceMode,
  PostflopScenario,
  ProgressSummary,
  RetryQueueItem,
  SubmittedAnswerFeedback,
  TrainingAnswerPhase,
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

function getFinalPotBb(potSizeBb?: number, betToCallBb?: number) {
  if (
    typeof potSizeBb !== "number" ||
    typeof betToCallBb !== "number"
  ) {
    return null;
  }

  return potSizeBb + betToCallBb + betToCallBb;
}

function getActionTypeLabel(
  actionType: CandidateAction["actionType"],
  language: TacticalUiLanguage,
) {
  const labels =
    language === "vi"
      ? {
          open: "Open",
          check: "Check",
          bet: "Bet",
          call: "Call",
          raise: "Raise",
          "3bet": "3-bet",
          "4bet": "4-bet",
          fold: "Fold",
          classify: "Read",
        }
      : {
          open: "Open",
          check: "Check",
          bet: "Bet",
          call: "Call",
          raise: "Raise",
          "3bet": "3-bet",
          "4bet": "4-bet",
          fold: "Fold",
          classify: "Read",
        };

  return labels[actionType];
}

function getCoachActions(language: TacticalUiLanguage) {
  return language === "vi"
    ? [
        {
          label: "Gợi ý ngắn",
          helper: "Nudge ngắn, đúng vai trò trong nhịp chơi.",
        },
        {
          label: "Giải thích thêm",
          helper: "Tóm tắt vì sao line này tốt hơn trong node này.",
        },
        {
          label: "Tình huống tương tự",
          helper: "Dự phòng cho follow-up hand cùng family.",
        },
      ]
    : [
        {
          label: "Quick hint",
          helper: "A short nudge that stays inside the play rhythm.",
        },
        {
          label: "Explain more",
          helper: "A tighter why for this exact node.",
        },
        {
          label: "Similar spot",
          helper: "Reserved for a follow-up hand from the same family.",
        },
      ];
}

function shouldUseHighTensionDecisionPanel(moduleId: InteractiveTrainingModuleId) {
  return moduleId !== "preflop";
}

function getBoardTextureCue(
  board: BoardTextureProfile | undefined,
  language: TacticalUiLanguage,
) {
  if (!board) {
    return language === "vi"
      ? "Đọc kết cấu board trước, rồi mới chốt ý chính."
      : "Read the texture first, then lock the takeaway.";
  }

  if (board.dynamicLevel === "dynamic") {
    return language === "vi"
      ? "Board động, nhiều turn đổi nhịp và người call giữ nhiều draw."
      : "Dynamic board: many turns swing the node and the caller keeps more draws.";
  }

  if (board.dynamicLevel === "medium") {
    return language === "vi"
      ? "Board trung tính, vẫn có đủ turn làm áp lực range đổi hướng."
      : "Medium texture: enough turn cards still redirect the pressure.";
  }

  return language === "vi"
    ? "Board tĩnh, ít lá turn làm tình huống đổi mạnh."
    : "Static board: fewer turns swing the spot sharply.";
}

function getTextureStateChips(
  board: BoardTextureProfile,
  language: TacticalUiLanguage,
) {
  const labels = getTacticalBoardLabels(board, language);

  return [
    {
      label: language === "vi" ? "Màu" : "Suits",
      value: labels[0],
    },
    {
      label: language === "vi" ? "Kết nối" : "Connectivity",
      value: labels[1],
    },
    {
      label: language === "vi" ? "Đôi" : "Pairing",
      value: labels[2],
    },
    {
      label: language === "vi" ? "Nhịp" : "Tempo",
      value: labels[3],
    },
  ];
}

function getTextureSceneTone(board: BoardTextureProfile | undefined) {
  if (!board) {
    return "bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.24),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)]";
  }

  if (board.dynamicLevel === "dynamic") {
    return "bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.24),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)]";
  }

  if (board.dynamicLevel === "medium") {
    return "bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.22),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)]";
  }

  return "bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.2),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)]";
}

function getPlayerTypeScene(
  playerTypeId: PlayerArchetypeId | undefined,
  language: TacticalUiLanguage,
) {
  const fallback = {
    eyebrow: language === "vi" ? "Đọc villain" : "Villain read",
    read:
      language === "vi"
        ? "Giữ cơ bản trước khi có read đủ mạnh."
        : "Stay close to baseline until the read is strong enough.",
    exploit:
      language === "vi"
        ? "Chỉ exploit khi xu hướng thật sự lộ ra."
        : "Exploit only when the tendency is actually clear.",
    accent:
      "border-cyan-300/28 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
    badge:
      "border-cyan-200/20 bg-cyan-300/12 text-cyan-100",
  };

  if (!playerTypeId) {
    return fallback;
  }

  const themes =
    language === "vi"
      ? {
          nit: {
            eyebrow: "Nit",
            read: "Ít bluff ở các tình huống lớn, line mạnh thường nặng value.",
            exploit: "Tôn trọng lực tay hơn và fold kỷ luật hơn.",
            accent:
              "border-amber-300/28 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-amber-200/20 bg-amber-300/12 text-amber-100",
          },
          tag: {
            eyebrow: "TAG",
            read: "Kiểu chơi chắc tay, ít tình huống nào đáng bẻ mạnh nếu read còn mỏng.",
            exploit: "Giữ cơ bản trước, chỉ lệch khi có dữ liệu rõ.",
            accent:
              "border-cyan-300/28 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-cyan-200/20 bg-cyan-300/12 text-cyan-100",
          },
          lag: {
            eyebrow: "LAG",
            read: "Mở rộng và gây áp lực nhiều hơn mức cân bằng.",
            exploit: "Tăng re-raise hoặc trap tùy tình huống có fold equity.",
            accent:
              "border-orange-300/28 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-orange-200/20 bg-orange-300/12 text-orange-100",
          },
          "calling-station": {
            eyebrow: "Calling station",
            read: "Call quá rộng, ghét bỏ bluff-catcher và pair yếu.",
            exploit: "Value bet mỏng hơn, bluff ít hơn.",
            accent:
              "border-emerald-300/28 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-emerald-200/20 bg-emerald-300/12 text-emerald-100",
          },
          maniac: {
            eyebrow: "Maniac",
            read: "Over-barrel, over-bluff và ép bluff-catcher nhiều hơn bình thường.",
            exploit: "Call down rộng hơn với bluff-catcher đáng tin.",
            accent:
              "border-rose-300/28 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.26),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-rose-200/20 bg-rose-300/12 text-rose-100",
          },
          "passive-rec": {
            eyebrow: "Rec thụ động",
            read: "Chậm nhịp, under-bluff và hay lộ lực tay.",
            exploit: "Bet chủ động hơn, đừng tự level chính mình.",
            accent:
              "border-sky-300/28 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-sky-200/20 bg-sky-300/12 text-sky-100",
          },
        }
      : {
          nit: {
            eyebrow: "Nit",
            read: "Under-bluffs big nodes and arrives value-heavy in strong lines.",
            exploit: "Respect the strength and fold more cleanly.",
            accent:
              "border-amber-300/28 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-amber-200/20 bg-amber-300/12 text-amber-100",
          },
          tag: {
            eyebrow: "TAG",
            read: "Solid profile, so dramatic exploits need real evidence.",
            exploit: "Stay baseline-first until the read is clearer.",
            accent:
              "border-cyan-300/28 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-cyan-200/20 bg-cyan-300/12 text-cyan-100",
          },
          lag: {
            eyebrow: "LAG",
            read: "Wide opens and pressure-heavy lines create more exploitable dead money.",
            exploit: "Lean into re-raises when fold equity is showing.",
            accent:
              "border-orange-300/28 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-orange-200/20 bg-orange-300/12 text-orange-100",
          },
          "calling-station": {
            eyebrow: "Calling station",
            read: "Calls too wide and hangs on to bluff-catchers too often.",
            exploit: "Value bet thinner and bluff less often.",
            accent:
              "border-emerald-300/28 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-emerald-200/20 bg-emerald-300/12 text-emerald-100",
          },
          maniac: {
            eyebrow: "Maniac",
            read: "Over-barrels and over-bluffs enough to stretch bluff-catching.",
            exploit: "Call down wider when the bluff-catcher is credible.",
            accent:
              "border-rose-300/28 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.26),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-rose-200/20 bg-rose-300/12 text-rose-100",
          },
          "passive-rec": {
            eyebrow: "Passive rec",
            read: "Plays slower, under-bluffs, and telegraphs strength more often.",
            exploit: "Bet more proactively and do not level yourself.",
            accent:
              "border-sky-300/28 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),rgba(8,23,42,0.2)_58%,rgba(3,7,18,0.96)_100%)]",
            badge:
              "border-sky-200/20 bg-sky-300/12 text-sky-100",
          },
        };

  return themes[playerTypeId] ?? fallback;
}

function joinSpotParts(parts: Array<string | null | undefined>) {
  return parts.filter((part): part is string => Boolean(part)).join(" / ");
}

function getSpotTiles(
  scenario: TrainingScenario,
  language: TacticalUiLanguage,
) {
  const copy = getTacticalDrillCopy(language);

  if (scenario.module === "pot-odds") {
    return [];
  }

  if (scenario.module === "preflop") {
    return [];
  }

  if (scenario.module === "postflop") {
    const tiles: SpotTile[] = [];
    const seatValue = joinSpotParts([
      scenario.heroPosition || scenario.villainPosition
        ? `${scenario.heroPosition ?? copy.heroLabel} vs ${scenario.villainPosition ?? copy.villainLabel}`
        : null,
      typeof scenario.effectiveStackBb === "number" ? `${copy.stackLabel}: ${scenario.effectiveStackBb}bb` : null,
    ]);

    if (seatValue) {
      tiles.push({
        label: language === "vi" ? "Spot context" : "Spot context",
        value: seatValue,
        wide: true,
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

  if (scenario.module === "board-texture") {
    const tiles: SpotTile[] = [];

    if (scenario.board) {
      const textureValue = getTextureStateChips(scenario.board, language)
        .map((chip) => `${chip.label}: ${chip.value}`)
        .join(" / ");

      if (textureValue) {
        tiles.push({
          label: language === "vi" ? "Board state" : "Board state",
          value: textureValue,
          wide: true,
        });
      }
    }

    if (scenario.board?.notes[0]) {
      tiles.push({
        label: copy.whyLabel,
        value: scenario.board.notes[0],
        wide: true,
      });
    }

    return tiles;
  }

  if (scenario.module === "player-types") {
    const tiles: SpotTile[] = [];
    const playerScene = getPlayerTypeScene(scenario.playerArchetypeId, language);
    const playerTypeValue = scenario.playerArchetypeId
      ? getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)
      : playerScene.eyebrow;

    tiles.push({
      label: copy.playerTypeLabel,
      value: `${playerTypeValue} / ${playerScene.read}`,
      wide: true,
    });

    tiles.push({
      label: language === "vi" ? "Exploit frame" : "Exploit frame",
      value: playerScene.exploit,
      wide: true,
    });

    return tiles;
  }

  const tiles: SpotTile[] = [];
  const contextValue = joinSpotParts([
    `${copy.streetLabel}: ${scenario.street.toUpperCase()}`,
    scenario.heroPosition || scenario.villainPosition
      ? `${scenario.heroPosition ?? copy.heroLabel} vs ${scenario.villainPosition ?? copy.villainLabel}`
      : null,
    typeof scenario.effectiveStackBb === "number" ? `${copy.stackLabel}: ${scenario.effectiveStackBb}bb` : null,
    scenario.playerArchetypeId
      ? `${copy.playerTypeLabel}: ${getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}`
      : null,
  ]);
  const cardValue = joinSpotParts([
    scenario.heroHand ? `${copy.handLabel}: ${scenario.heroHand}` : null,
    scenario.board
      ? `${copy.textureLabel}: ${getTacticalBoardLabels(scenario.board, language).join(" / ")}`
      : null,
  ]);

  if (contextValue) {
    tiles.push({
      label: language === "vi" ? "Spot context" : "Spot context",
      value: contextValue,
      wide: true,
    });
  }

  if (cardValue) {
    tiles.push({
      label: language === "vi" ? "Cards and board" : "Cards and board",
      value: cardValue,
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
    <div className="min-w-0 rounded-[20px] border border-white/10 bg-black/14 px-4 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 break-words text-xl font-semibold leading-7 text-white text-pretty sm:text-2xl">
        {value}
      </p>
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
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
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] 2xl:items-start">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="max-w-full break-words rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100 text-pretty">
              {moduleMeta.eyebrow}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 text-pretty">
              {moduleMeta.title}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 text-pretty">
              {getTacticalPackLabel(
                activeContentPack.id,
                activeContentPack.focusLabel,
                language,
              )}
            </span>
            <span className="max-w-full break-words rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 text-pretty">
              {getTacticalStorageLabel(storageMode, language)}
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

          <div className="rounded-[22px] border border-white/10 bg-black/12 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
              {copy.sessionLabel}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
                {copy.packLabel}:{" "}
                {getTacticalPackLabel(
                  activeContentPack.id,
                  activeContentPack.focusLabel,
                  language,
                )}
              </span>
              <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
                {copy.levelLabel}: {getTacticalDifficultyLabel(selectedDifficulty, language)}
              </span>
              <span className="max-w-full break-words rounded-full border border-white/10 bg-black/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 text-pretty">
                {copy.orderLabel}: {getTacticalQueueModeLabel(queueMode, language)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3 2xl:grid-cols-1">
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
              {getTacticalPackLabel(contentPack.id, contentPack.focusLabel, language)}{" "}
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
  return <SceneStatCard label={label} value={value} wide={wide} />;
}

function ActionLane({
  label,
  steps,
}: {
  label: string;
  steps: string[];
}) {
  return <ActionHistory label={label} steps={steps} />;
}

function PotOddsHeroObject({
  language,
  scenario,
}: {
  language: TacticalUiLanguage;
  scenario: PostflopScenario;
}) {
  const copy = getTacticalDrillCopy(language);
  const breakEvenPercent =
    getBreakEvenPercent(scenario.potSizeBb, scenario.betToCallBb) ?? "-";
  const finalPotBb = getFinalPotBb(scenario.potSizeBb, scenario.betToCallBb);
  const mathLineLabel = language === "vi" ? "Dòng tính nhanh" : "Math line";
  const intuitionLabel = language === "vi" ? "Trực giác call" : "Call intuition";
  const priceLabel = language === "vi" ? "Facing bet" : "Facing bet";
  const spotLabel = language === "vi" ? "Pot odds spot" : "Pot odds spot";
  const equityLine = joinSpotParts([
    typeof scenario.outsCount === "number" ? `${copy.outsLabel}: ${scenario.outsCount}` : null,
    scenario.equityHint,
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <SpotTag tone="cyan">{scenario.street.toUpperCase()}</SpotTag>
        <SpotTag>{spotLabel}</SpotTag>
        {scenario.equityHint ? <SpotTag tone="emerald">{scenario.equityHint}</SpotTag> : null}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SeatBadge role={copy.heroLabel} position={language === "vi" ? "Facing bet" : "Facing bet"} tone="cyan" />
        <SeatBadge role={copy.villainLabel} position={priceLabel} tone="slate" />
      </div>

      <PotDisplay
        potLabel={copy.potLabel}
        potValue={typeof scenario.potSizeBb === "number" ? `${scenario.potSizeBb}bb` : "-"}
        callLabel={copy.callLabel}
        callValue={typeof scenario.betToCallBb === "number" ? `${scenario.betToCallBb}bb` : "-"}
        centerLabel={copy.needLabel}
        centerValue={breakEvenPercent}
        footer={finalPotBb ? `${scenario.betToCallBb ?? "-"}bb -> ${finalPotBb}bb` : copy.callLabel}
      />

      <div className="rounded-[26px] border border-white/10 bg-black/14 p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
              {mathLineLabel}
            </p>
            <p className="mt-2 break-words text-lg font-semibold leading-7 text-white text-pretty">
              {finalPotBb
                ? language === "vi"
                  ? `${scenario.betToCallBb}bb để tranh ${finalPotBb}bb`
                  : `${scenario.betToCallBb}bb to play for ${finalPotBb}bb`
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100/80">
              {intuitionLabel}
            </p>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-slate-300 text-pretty">
              {scenario.learningGoal}
            </p>
            {equityLine ? (
              <p className="mt-3 break-words text-sm font-semibold leading-6 text-emerald-100 text-pretty">
                {equityLine}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostflopHeroObject({
  language,
  scenario,
}: {
  language: TacticalUiLanguage;
  scenario: PostflopScenario;
}) {
  const copy = getTacticalDrillCopy(language);
  const boardCards = getVisibleBoardCards(scenario);
  const heroHandCards = getHeroHandCards(scenario);

  return (
    <div className="min-w-0 rounded-[30px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.26),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
          {scenario.street.toUpperCase()}
        </span>
        {scenario.playerArchetypeId ? (
          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
            {getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}
          </span>
        ) : null}
        <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
          {(scenario.heroPosition ?? "-") + " vs " + (scenario.villainPosition ?? "-")}
        </span>
        {typeof scenario.effectiveStackBb === "number" ? (
          <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
            {scenario.effectiveStackBb}bb
          </span>
        ) : null}
      </div>

      <div className="mt-5 min-w-0 rounded-[26px] border border-white/12 bg-black/16 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
          {copy.boardLabel}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TacticalCardRow cards={boardCards} size="xl" />
        </div>

        <div className="mt-5">
          <ActionLane label={copy.actionLabel} steps={scenario.actionHistory ?? []} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {heroHandCards.length > 0 ? (
          <div className="min-w-0 rounded-[24px] border border-white/12 bg-black/16 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
              {copy.handLabel}
            </p>
            <div className="mt-4">
              <TacticalCardRow cards={heroHandCards} size="lg" />
            </div>
          </div>
        ) : null}

        <div className="min-w-0 rounded-[24px] border border-white/12 bg-black/16 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
            {copy.focusLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
              {(scenario.heroPosition ?? "-") + " vs " + (scenario.villainPosition ?? "-")}
            </span>
            {typeof scenario.effectiveStackBb === "number" ? (
              <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                {scenario.effectiveStackBb}bb
              </span>
            ) : null}
            {scenario.playerArchetypeId ? (
              <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">
                {getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}
              </span>
            ) : null}
          </div>
          {scenario.board ? (
            <div className="mt-4 rounded-[20px] border border-white/10 bg-black/18 px-4 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {copy.textureLabel}
              </p>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-white">
                {getTacticalBoardLabels(scenario.board, language).join(" / ")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BoardTextureHeroObject({
  language,
  scenario,
}: {
  language: TacticalUiLanguage;
  scenario: PostflopScenario;
}) {
  const copy = getTacticalDrillCopy(language);
  const boardCards = getVisibleBoardCards(scenario);
  const textureChips = scenario.board ? getTextureStateChips(scenario.board, language) : [];
  const boardCue = getBoardTextureCue(scenario.board, language);

  return (
    <div
      className={cn(
        "min-w-0 rounded-[30px] border border-white/12 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5",
        getTextureSceneTone(scenario.board),
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
          {scenario.street.toUpperCase()}
        </span>
        <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
          {(scenario.heroPosition ?? "-") + " vs " + (scenario.villainPosition ?? "-")}
        </span>
        {typeof scenario.effectiveStackBb === "number" ? (
          <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
            {scenario.effectiveStackBb}bb
          </span>
        ) : null}
      </div>

      <div className="mt-5 min-w-0 rounded-[26px] border border-white/12 bg-black/18 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
          {copy.boardLabel}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <TacticalCardRow cards={boardCards} size="xl" />
        </div>

        <div className="mt-5">
          <ActionLane label={copy.actionLabel} steps={scenario.actionHistory ?? []} />
        </div>
      </div>

      <div className="mt-4 min-w-0 rounded-[24px] border border-white/12 bg-black/18 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
          {copy.textureLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {textureChips.map((chip) => (
            <span
              key={`${chip.label}-${chip.value}`}
              className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92"
            >
              {chip.value}
            </span>
          ))}
        </div>
        <p className="mt-4 max-w-3xl break-words text-sm font-semibold leading-6 text-white text-pretty">
          {boardCue}
        </p>
        {scenario.board?.notes[0] ? (
          <p className="mt-2 max-w-3xl break-words text-xs leading-5 text-slate-400 text-pretty">
            {scenario.board.notes[0]}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function PlayerTypeHeroObject({
  language,
  scenario,
}: {
  language: TacticalUiLanguage;
  scenario: PostflopScenario;
}) {
  const copy = getTacticalDrillCopy(language);
  const boardCards = getVisibleBoardCards(scenario);
  const heroHandCards = getHeroHandCards(scenario);
  const playerScene = getPlayerTypeScene(scenario.playerArchetypeId, language);
  const readLabel = language === "vi" ? "Xu hướng" : "Read";
  const exploitLabel = language === "vi" ? "Hướng exploit" : "Exploit";
  const tendencyLabel = language === "vi" ? "Xu hướng" : "Tendency";

  return (
    <div className="min-w-0 rounded-[30px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.16),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.2)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
          {scenario.street.toUpperCase()}
        </span>
        {scenario.playerArchetypeId ? (
          <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]", playerScene.badge)}>
            {getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}
          </span>
        ) : null}
        <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
          {(scenario.heroPosition ?? "-") + " vs " + (scenario.villainPosition ?? "-")}
        </span>
        {typeof scenario.effectiveStackBb === "number" ? (
          <span className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">
            {scenario.effectiveStackBb}bb
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div
          className={cn(
            "min-w-0 rounded-[26px] border p-5 shadow-[0_18px_34px_-24px_rgba(15,23,42,0.9)]",
            playerScene.accent,
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                {copy.playerTypeLabel}
              </p>
              <p className="mt-2 break-words text-3xl font-semibold tracking-tight text-white text-pretty">
                {playerScene.eyebrow}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-white/80">
                {scenario.playerArchetypeId
                  ? getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)
                  : copy.playerTypeLabel}
              </p>
            </div>
            <span className={cn("rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", playerScene.badge)}>
              {tendencyLabel}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                {readLabel}
              </p>
              <p className="mt-2 max-w-xl break-words text-sm font-semibold leading-6 text-white text-pretty">
                {playerScene.read}
              </p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                {exploitLabel}
              </p>
              <p className="mt-2 max-w-xl break-words text-sm font-semibold leading-6 text-white text-pretty">
                {playerScene.exploit}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-[26px] border border-white/12 bg-black/18 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
            {boardCards.length > 0 ? copy.boardLabel : copy.focusLabel}
          </p>
          {boardCards.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <TacticalCardRow cards={boardCards} size="xl" />
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                {(scenario.heroPosition ?? "Hero") + " vs " + (scenario.villainPosition ?? "Villain")}
              </span>
              {typeof scenario.effectiveStackBb === "number" ? (
                <span className="rounded-full border border-white/12 bg-black/16 px-3 py-2 text-sm font-semibold text-white/92">
                  {scenario.effectiveStackBb}bb
                </span>
              ) : null}
            </div>
          )}

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)]">
            {heroHandCards.length > 0 ? (
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
                  {copy.handLabel}
                </p>
                <div className="mt-3">
                  <TacticalCardRow cards={heroHandCards} size="lg" />
                </div>
              </div>
            ) : null}

            {scenario.board ? (
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100/80">
                  {copy.textureLabel}
                </p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-white text-pretty">
                  {getTacticalBoardLabels(scenario.board, language).join(" / ")}
                </p>
                {scenario.board.notes[0] ? (
                  <p className="mt-3 break-words text-xs leading-5 text-slate-400 text-pretty">
                    {scenario.board.notes[0]}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ActionLane label={copy.actionLabel} steps={scenario.actionHistory ?? []} />
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
  if (scenario.module === "pot-odds") {
    return <PotOddsHeroObject language={language} scenario={scenario} />;
  }

  if (scenario.module === "preflop") {
    return null;
  }

  if (scenario.module === "postflop") {
    return <PostflopHeroObject language={language} scenario={scenario} />;
  }

  if (scenario.module === "board-texture") {
    return <BoardTextureHeroObject language={language} scenario={scenario} />;
  }

  if (scenario.module === "player-types") {
    return <PlayerTypeHeroObject language={language} scenario={scenario} />;
  }

  const copy = getTacticalDrillCopy(language);
  const boardCards = getVisibleBoardCards(scenario);
  const heroHandCards = getHeroHandCards(scenario);

  return (
    <div className="rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.2),rgba(8,23,42,0.08)_42%,rgba(3,7,18,0.18)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100">
          {scenario.street.toUpperCase()}
        </span>
        {scenario.playerArchetypeId ? (
          <span className="rounded-full border border-amber-200/20 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
            {getTacticalPlayerTypeLabel(scenario.playerArchetypeId, language)}
          </span>
        ) : null}
        {scenario.board
          ? getTacticalBoardLabels(scenario.board, language).map((label) => (
              <span
                key={`${scenario.id}-${label}`}
                className="rounded-full border border-white/12 bg-black/16 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200"
              >
                {label}
              </span>
            ))
          : null}
      </div>

      {boardCards.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
            {copy.boardLabel}
          </p>
          <TacticalCardRow cards={boardCards} size="lg" />
        </div>
      ) : null}

      {heroHandCards.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
            {copy.handLabel}
          </p>
          <TacticalCardRow cards={heroHandCards} size="md" />
        </div>
      ) : null}

      {boardCards.length === 0 && heroHandCards.length === 0 ? (
        <div className="mt-4 rounded-[22px] border border-white/12 bg-black/16 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
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
  const showBottomActionLane =
    !["postflop", "board-texture", "player-types"].includes(scenario.module) &&
    actionLane.length > 0;
  const showSupportRail = spotTiles.length > 0;
  const coachActions = getCoachActions(language);
  const coachNote = buildNudgeCoachNote({ scenario, language });

  return (
    <TableSceneShell
      header={
        <SceneHeader
          eyebrow={moduleMeta.stateEyebrow}
          title={scenario.title}
          description={scenario.prompt}
          tags={
            <>
              <SpotTag tone="cyan">{questionNumber}/{totalQuestions}</SpotTag>
              <SpotTag>{getTacticalSourceTypeLabel(scenario.sourceType, language)}</SpotTag>
              <SpotTag>{getTacticalPackLabel(activeContentPack.id, activeContentPack.focusLabel, language)}</SpotTag>
              {retryHint ? <SpotTag tone="amber">{copy.retryLabel}</SpotTag> : null}
            </>
          }
          aside={
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <StatPill
                label={copy.sessionLabel}
                value={`${questionNumber}/${totalQuestions}`}
                note={moduleMeta.title}
              />
              <StatPill
                label={copy.focusLabel}
                value={scenario.street.toUpperCase()}
                note={getTacticalSourceTypeLabel(scenario.sourceType, language)}
              />
            </div>
          }
        />
      }
      rail={
        showSupportRail ? (
          <div className="min-w-0 grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            {spotTiles.map((tile) => (
              <SpotTileCard key={`${tile.label}-${tile.value}`} {...tile} />
            ))}
          </div>
        ) : undefined
      }
      footer={
        <div
          className={cn(
            "grid gap-4",
            showBottomActionLane
              ? "xl:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)]"
              : "",
          )}
        >
          {showBottomActionLane ? (
            <ActionLane label={copy.actionLabel} steps={actionLane} />
          ) : null}

          <div className="min-w-0 rounded-[24px] border border-white/12 bg-black/14 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
              {copy.focusLabel}
            </p>
            <p className="mt-2 break-words text-sm leading-6 text-slate-300">
              {scenario.learningGoal}
            </p>
            {retryHint ? (
              <div className="mt-4 rounded-[20px] border border-amber-200/18 bg-amber-300/10 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
                  {copy.retryLabel}
                </p>
                <p className="mt-2 break-words text-sm leading-6 text-amber-50/90">
                  {retryHint.reason}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      }
      coach={
        <CoachAnchor
          title={coachNote.title}
          body={coachNote.body}
          modeLabel={coachNote.modeLabel}
          actions={coachActions}
        />
      }
    >
      <ScenarioPrimaryVisual language={language} scenario={scenario} />
    </TableSceneShell>
  );
}

function TacticalActionButton({
  action,
  index,
  language,
  highTension,
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
  language: TacticalUiLanguage;
  highTension: boolean;
  selectedTag: string;
  bestTag: string;
  isSelected: boolean;
  isLocked: boolean;
  isRecommended: boolean;
  isSubmittedChoice: boolean;
  onSelect: () => void;
}) {
  const actionTypeLabel = getActionTypeLabel(action.actionType, language);

  return (
    <ActionOptionCard
      index={index}
      label={action.label}
      metaLabel={actionTypeLabel}
      note={
        action.feedbackHint && isLocked && !isRecommended && isSubmittedChoice
          ? action.feedbackHint
          : undefined
      }
      isSelected={isSelected}
      isLocked={isLocked}
      isRecommended={isRecommended}
      isSubmittedChoice={isSubmittedChoice}
      selectedTag={selectedTag}
      bestTag={bestTag}
      onSelect={onSelect}
      highTension={highTension}
    />
  );
}

function TacticalDecisionPanel({
  language,
  moduleId,
  scenario,
  feedback,
  selectedActionId,
  answerPhase,
  canSubmit,
  canAdvance,
  canRetryCurrentScenario,
  hasSubmitted,
  isLastScenario,
  onSelectAction,
  onSubmit,
  onNext,
  onRetryCurrent,
  onRestart,
}: {
  language: TacticalUiLanguage;
  moduleId: InteractiveTrainingModuleId;
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback | null;
  selectedActionId: string | null;
  answerPhase: TrainingAnswerPhase;
  canSubmit: boolean;
  canAdvance: boolean;
  canRetryCurrentScenario: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  onSelectAction: (actionId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetryCurrent: () => void;
  onRestart: () => void;
}) {
  const copy = getTacticalDrillCopy(language);
  const moduleMeta = getTacticalModuleMeta(moduleId, language);
  const highTension = shouldUseHighTensionDecisionPanel(moduleId);
  const selectedAction =
    scenario.candidateActions.find((action) => action.id === selectedActionId) ?? null;
  const decisionHint = getTacticalDecisionHint(
    answerPhase,
    moduleMeta.decisionHint,
    language,
  );
  const primaryButtonLabel = hasSubmitted
    ? isLastScenario
      ? copy.finishSetLabel
      : copy.nextSpotLabel
    : selectedAction
      ? `${copy.lockLabel} ${selectedAction.label}`
      : copy.lockLabel;
  const coachNote = buildNudgeCoachNote({ scenario, language });
  const coachActions = getCoachActions(language);
  const stateLabel = hasSubmitted
    ? language === "vi"
      ? "Line đã khóa"
      : "Line locked"
    : selectedAction
      ? language === "vi"
        ? "Đã chọn line"
        : "Line selected"
      : language === "vi"
        ? "Chờ quyết định"
        : "Awaiting decision";
  const stateHint = hasSubmitted
    ? language === "vi"
      ? "Reveal panel tiếp theo sẽ đưa correction, coach recap và next spot."
      : "The reveal panel now carries the correction, coach recap, and next spot."
    : selectedAction
      ? language === "vi"
        ? "Line đã được chọn. Khóa lại để mở reveal."
        : "A line is selected. Lock it to open the reveal."
      : language === "vi"
        ? "Chọn một action trước. Coach seat chỉ giữ vai trò nudge ngắn."
        : "Choose an action first. The coach seat stays limited to short nudges.";

  return (
    <ActionTray
      eyebrow={moduleMeta.eyebrow}
      title={moduleMeta.decisionTitle}
      hint={decisionHint}
      selectedLabel={copy.selectedLineLabel}
      selectedValue={selectedAction?.label ?? copy.noLineSelectedLabel}
      selectedMeta={
        selectedAction ? getActionTypeLabel(selectedAction.actionType, language) : undefined
      }
      stateLabel={stateLabel}
      stateHint={stateHint}
      stateTone={hasSubmitted ? "emerald" : selectedAction ? "cyan" : "slate"}
      primaryLabel={primaryButtonLabel}
      onPrimary={hasSubmitted ? onNext : onSubmit}
      primaryDisabled={hasSubmitted ? !canAdvance : !canSubmit}
      secondaryLabel={copy.restartLabel}
      onSecondary={onRestart}
      tertiaryLabel={hasSubmitted ? copy.retrySpotLabel : undefined}
      onTertiary={hasSubmitted ? onRetryCurrent : undefined}
      tertiaryDisabled={!canRetryCurrentScenario}
      coach={
        <CoachAnchor
          title={coachNote.title}
          body={coachNote.body}
          modeLabel={coachNote.modeLabel}
          actions={coachActions}
        />
      }
      highTension={highTension}
    >
      {scenario.candidateActions.map((action, index) => (
        <TacticalActionButton
          key={action.id}
          action={action}
          index={index}
          language={language}
          highTension={highTension}
          selectedTag={copy.selectedLineLabel}
          bestTag={copy.bestLineLabel}
          isSelected={selectedActionId === action.id}
          isLocked={hasSubmitted}
          isRecommended={feedback?.recommendedAction.id === action.id}
          isSubmittedChoice={feedback?.selectedAction.id === action.id}
          onSelect={() => onSelectAction(action.id)}
        />
      ))}
    </ActionTray>
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
    <div className={cn("rounded-[28px] border border-white/12 bg-black/14 p-5", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
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
  const coachActions = getCoachActions(language);

  if (!feedback) {
    return (
      <RevealStatePanel
        eyebrow={copy.nextLabel}
        title={copy.reviewPlaceholder}
        description={
          language === "vi"
            ? "Scene vẫn ưu tiên quyết định. Reveal chỉ mở sau khi người học đã commit line."
            : "The scene still prioritizes the decision. The reveal opens only after the learner commits to a line."
        }
        revealed={false}
        placeholderLabels={[
          copy.resultLabel,
          copy.bestLineLabel,
          copy.whyLabel,
          copy.learnLabel,
        ]}
      >
        <div />
      </RevealStatePanel>
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
  const coachNote = buildSilentCoachNote({ scenario, feedback, language });

  return (
    <RevealStatePanel
      eyebrow={copy.nextLabel}
      title={language === "vi" ? "Reveal và correction sau spot" : "Reveal and correction after the spot"}
      description={
        language === "vi"
          ? "Sau khi line đã bị khóa, panel này mới đưa kết quả, line tốt hơn và next lesson theo đúng nhịp chơi."
          : "Once the line is locked, this panel reveals the result, the cleaner line, and the next lesson without breaking the play rhythm."
      }
      revealed
      placeholderLabels={[]}
      coach={
        <CoachAnchor
          title={coachNote.title}
          body={coachNote.body}
          modeLabel={coachNote.modeLabel}
          actions={coachActions}
        />
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <SpotTag tone={isCorrect ? "emerald" : "rose"}>
          {isCorrect ? copy.correctLabel : copy.incorrectLabel}
        </SpotTag>
        <SpotTag tone="slate">
          {copy.selectedLineLabel}: {feedback.selectedAction.label}
        </SpotTag>
        <SpotTag tone="cyan">
          {copy.bestLineLabel}: {feedback.recommendedAction.label}
        </SpotTag>
        <SpotTag tone="amber">
          {getTacticalSourceTypeLabel(scenario.sourceType, language)}
        </SpotTag>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReviewBlock
          label={copy.resultLabel}
          className={cn(
            isCorrect
              ? "border-emerald-300/28 bg-[linear-gradient(180deg,rgba(6,78,59,0.92),rgba(6,24,28,0.96))]"
              : "border-rose-300/28 bg-[linear-gradient(180deg,rgba(76,5,25,0.94),rgba(22,8,18,0.96))]",
          )}
        >
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isCorrect ? "text-emerald-100" : "text-rose-100",
            )}
          >
            {isCorrect ? copy.correctLabel : copy.incorrectLabel}
          </p>
          <p className="break-words text-sm leading-6 text-white/78">
            {feedback.selectedAction.label}
          </p>
        </ReviewBlock>

        <ReviewBlock
          label={copy.bestLineLabel}
          className="border-cyan-300/24 bg-[linear-gradient(180deg,rgba(8,47,73,0.96),rgba(8,23,42,0.96))]"
        >
          <p className="text-2xl font-semibold tracking-tight text-cyan-100">
            {feedback.recommendedAction.label}
          </p>
          <p className="break-words text-sm leading-6 text-white/78">
            {answerBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewBlock>

        <ReviewBlock label={copy.whyLabel}>
          <p className="break-words text-sm leading-6 text-slate-200/90">
            {whyBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewBlock>

        <ReviewBlock label={copy.learnLabel}>
          <p className="break-words text-sm leading-6 text-slate-200/90">
            {takeawayBlock?.body ?? scenario.learningGoal}
          </p>
          {!isCorrect && surfacedLeakTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {surfacedLeakTags.map((leakLabel) => (
                <SpotTag key={`${scenario.id}-${leakLabel}`} tone="rose">
                  {leakLabel}
                </SpotTag>
              ))}
            </div>
          ) : null}
        </ReviewBlock>
      </div>

      {!isCorrect && feedback.selectedAction.feedbackHint ? (
        <div className="rounded-[26px] border border-rose-200/30 bg-rose-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rose-100">
            {copy.driftLabel}
          </p>
          <p className="mt-2 break-words text-sm leading-6 text-rose-50/90">
            {feedback.selectedAction.feedbackHint}
          </p>
        </div>
      ) : null}

      {firstAssumption ? (
        <div className="rounded-[26px] border border-amber-200/20 bg-amber-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-100">
            {copy.assumptionsLabel}
          </p>
          <p className="mt-2 break-words text-sm leading-6 text-slate-200/90">
            {firstAssumption}
          </p>
        </div>
      ) : null}

      {followUpSuggestions.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {followUpSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="min-w-0 rounded-[24px] border border-white/12 bg-black/14 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <SpotTag tone="cyan">{copy.nextLabel}</SpotTag>
              </div>
              <p className="mt-3 break-words text-lg font-semibold text-white">
                {suggestion.title}
              </p>
              <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                {suggestion.reason}
              </p>
              <Link
                href={suggestion.route}
                className="mt-4 inline-flex rounded-full border border-white/12 bg-black/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300/25 hover:text-cyan-100"
              >
                {copy.openPackLabel}
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </RevealStatePanel>
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
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/75">
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
          className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(13,148,136,0.96))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:brightness-105"
        >
          {moduleCopy.restartButton}
        </button>
        <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
          {getTacticalPackLabel(activeContentPack.id, activeContentPack.focusLabel, language)}
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
  const feedbackRegionRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!session.feedback || window.matchMedia("(min-width: 1024px)").matches) {
      return;
    }

    window.requestAnimationFrame(() => {
      feedbackRegionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [session.feedback?.attempt.id, session.feedback]);

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
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-strong">
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:items-start">
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
          answerPhase={session.answerPhase}
          canSubmit={session.canSubmit}
          canAdvance={session.canAdvance}
          canRetryCurrentScenario={session.canRetryCurrentScenario}
          hasSubmitted={session.hasSubmitted}
          isLastScenario={session.isLastScenario}
          onSelectAction={session.handleSelectAction}
          onSubmit={session.handleSubmitAnswer}
          onNext={session.handleNextScenario}
          onRetryCurrent={session.handleRetryCurrentScenario}
          onRestart={session.handleRestartSession}
        />
      </div>

      <div ref={feedbackRegionRef} className="scroll-mt-24">
        <TacticalFeedbackPanel
          language={language}
          scenario={session.currentScenario}
          feedback={session.feedback}
          progressSummary={session.overallProgressSummary}
        />
      </div>
    </div>
  );
}
