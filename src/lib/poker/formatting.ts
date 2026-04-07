import {
  handCategoryLabels,
  playerArchetypeLabels,
  positionLabels,
} from "@/lib/poker/labels";
import type {
  HandCategoryId,
  PlayerArchetypeId,
  PositionId,
} from "@/types/poker";
import type { PostflopScenario, TrainingScenario } from "@/types/training";

export function formatPosition(position: PositionId) {
  return positionLabels[position];
}

export function formatActionHistory(actions: string[]) {
  return actions.join(" -> ");
}

export function formatBoardCards(cards: [string, string, string]) {
  return cards.join(" ");
}

function formatBoardForStreet(
  board: NonNullable<PostflopScenario["board"]>,
  street: PostflopScenario["street"],
) {
  const cards = [...board.flop];

  if ((street === "turn" || street === "river") && board.turn) {
    cards.push(board.turn);
  }

  if (street === "river" && board.river) {
    cards.push(board.river);
  }

  return cards.join(" ");
}

export function formatPlayerArchetype(playerArchetypeId: PlayerArchetypeId) {
  return playerArchetypeLabels[playerArchetypeId];
}

export function formatHandCategory(handCategory: HandCategoryId) {
  return handCategoryLabels[handCategory];
}

function formatConnectednessLabel(value: string) {
  return value.replace("-", " ");
}

function formatBoardProfileLine(scenario: PostflopScenario) {
  if (!scenario.board) {
    return null;
  }

  return `Board profile: ${scenario.board.suitedness}, ${formatConnectednessLabel(
    scenario.board.connectedness,
  )}, ${scenario.board.pairedness}, ${scenario.board.dynamicLevel}`;
}

export function getScenarioContextLines(
  scenario: TrainingScenario,
) {
  if (scenario.module === "preflop") {
    return [
      `Hero: ${formatPosition(scenario.heroPosition)} with ${scenario.handLabel}`,
      scenario.villainPosition
        ? `Villain: ${formatPosition(scenario.villainPosition)}`
        : "Villain: not applicable",
      `Hand category: ${formatHandCategory(scenario.handCategory)}`,
      `Effective stack: ${scenario.effectiveStackBb}bb`,
      `Action history: ${formatActionHistory(scenario.actionHistory)}`,
    ];
  }

  const lines = [`Street: ${scenario.street}`];

  if (scenario.heroHand) {
    lines.push(`Hero hand: ${scenario.heroHand}`);
  }

  if (scenario.heroPosition) {
    lines.push(`Hero: ${formatPosition(scenario.heroPosition)}`);
  }

  if (scenario.villainPosition) {
    lines.push(`Villain: ${formatPosition(scenario.villainPosition)}`);
  }

  if (typeof scenario.effectiveStackBb === "number") {
    lines.push(`Effective stack: ${scenario.effectiveStackBb}bb`);
  }

  if (scenario.actionHistory?.length) {
    lines.push(`Action history: ${formatActionHistory(scenario.actionHistory)}`);
  }

  if (scenario.board) {
    lines.push(`Board: ${formatBoardForStreet(scenario.board, scenario.street)}`);
    const boardProfileLine = formatBoardProfileLine(scenario);

    if (boardProfileLine) {
      lines.push(boardProfileLine);
    }
  }

  if (scenario.playerArchetypeId) {
    lines.push(`Player type: ${formatPlayerArchetype(scenario.playerArchetypeId)}`);
  }

  if (
    typeof scenario.potSizeBb === "number" &&
    typeof scenario.betToCallBb === "number"
  ) {
    lines.push(
      `Pot: ${scenario.potSizeBb}bb, facing ${scenario.betToCallBb}bb`,
    );
  }

  if (scenario.outsCount) {
    lines.push(`Approximate outs: ${scenario.outsCount}`);
  }

  if (scenario.equityHint) {
    lines.push(`Hint: ${scenario.equityHint}`);
  }

  return lines;
}
