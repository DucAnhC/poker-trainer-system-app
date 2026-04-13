export type HandShape = "pair" | "suited" | "offsuit" | "mixed";

const CARD_CODE_PATTERN = /^(10|[2-9TJQKA])[shdc]$/i;

function normalizeRank(rank: string) {
  const normalized = rank.trim().toUpperCase();

  return normalized === "10" ? "T" : normalized;
}

export function normalizeCardCode(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const suit = trimmedValue.slice(-1).toLowerCase();
  const rank = normalizeRank(trimmedValue.slice(0, -1));
  const normalized = `${rank}${suit}`;

  return CARD_CODE_PATTERN.test(normalized) ? normalized : null;
}

export function extractCardCodes(value: string) {
  return value
    .split(/[\s,|/;:-]+/)
    .map((token) => normalizeCardCode(token))
    .filter((token): token is string => token !== null);
}

export function parsePreflopHandLabel(handLabel: string) {
  const normalizedLabel = handLabel.trim().toUpperCase();
  const firstRank = normalizeRank(normalizedLabel[0] ?? "?");
  const secondRank = normalizeRank(normalizedLabel[1] ?? firstRank);
  const modifier = normalizedLabel[2] ?? "";
  const isPair = firstRank === secondRank && normalizedLabel.length <= 2;

  if (isPair) {
    return {
      cards: [`${firstRank}s`, `${secondRank}h`],
      shape: "pair" as const,
    };
  }

  if (modifier === "S") {
    return {
      cards: [`${firstRank}h`, `${secondRank}h`],
      shape: "suited" as const,
    };
  }

  if (modifier === "O") {
    return {
      cards: [`${firstRank}s`, `${secondRank}d`],
      shape: "offsuit" as const,
    };
  }

  return {
    cards: [`${firstRank}s`, `${secondRank}c`],
    shape: "mixed" as const,
  };
}
