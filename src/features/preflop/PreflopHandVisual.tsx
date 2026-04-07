import { cn } from "@/lib/utils";

import { type PreflopUiLanguage } from "@/features/preflop/preflop-trainer-copy";

type CardSuit = "spade" | "heart" | "diamond" | "club";

type ParsedCard = {
  rank: string;
  suit: CardSuit;
};

function getSuitSymbol(suit: CardSuit) {
  if (suit === "spade") {
    return "♠";
  }

  if (suit === "heart") {
    return "♥";
  }

  if (suit === "diamond") {
    return "♦";
  }

  return "♣";
}

function getSuitTone(suit: CardSuit) {
  return suit === "heart" || suit === "diamond" ? "text-rose-600" : "text-slate-900";
}

function parseHandLabel(handLabel: string) {
  const normalizedLabel = handLabel.trim().toUpperCase();
  const firstRank = normalizedLabel[0] ?? "?";
  const secondRank = normalizedLabel[1] ?? firstRank;
  const modifier = normalizedLabel[2] ?? "";
  const isPair = firstRank === secondRank && normalizedLabel.length <= 2;

  if (isPair) {
    return {
      cards: [
        { rank: firstRank, suit: "spade" as const },
        { rank: secondRank, suit: "heart" as const },
      ],
      shapeLabel: "pair" as const,
    };
  }

  if (modifier === "S") {
    return {
      cards: [
        { rank: firstRank, suit: "heart" as const },
        { rank: secondRank, suit: "heart" as const },
      ],
      shapeLabel: "suited" as const,
    };
  }

  if (modifier === "O") {
    return {
      cards: [
        { rank: firstRank, suit: "spade" as const },
        { rank: secondRank, suit: "diamond" as const },
      ],
      shapeLabel: "offsuit" as const,
    };
  }

  return {
    cards: [
      { rank: firstRank, suit: "spade" as const },
      { rank: secondRank, suit: "club" as const },
    ],
    shapeLabel: "mixed" as const,
  };
}

function getShapeLabel(
  handShape: ReturnType<typeof parseHandLabel>["shapeLabel"],
  language: PreflopUiLanguage,
) {
  if (language === "vi") {
    if (handShape === "pair") {
      return "Đôi";
    }

    if (handShape === "suited") {
      return "Suited";
    }

    if (handShape === "offsuit") {
      return "Offsuit";
    }

    return "Mixed";
  }

  if (handShape === "pair") {
    return "Pair";
  }

  if (handShape === "suited") {
    return "Suited";
  }

  if (handShape === "offsuit") {
    return "Offsuit";
  }

  return "Mixed";
}

function CardFace({
  card,
  className,
}: {
  card: ParsedCard;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-36 w-24 flex-col justify-between rounded-[18px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#eef3f7)] p-3 shadow-[0_18px_32px_-18px_rgba(15,23,42,0.75)]",
        className,
      )}
    >
      <div>
        <p className={cn("text-2xl font-black leading-none", getSuitTone(card.suit))}>
          {card.rank}
        </p>
        <p className={cn("mt-1 text-lg leading-none", getSuitTone(card.suit))}>
          {getSuitSymbol(card.suit)}
        </p>
      </div>
      <div className="flex justify-end">
        <div className="rotate-180">
          <p className={cn("text-2xl font-black leading-none", getSuitTone(card.suit))}>
            {card.rank}
          </p>
          <p className={cn("mt-1 text-lg leading-none", getSuitTone(card.suit))}>
            {getSuitSymbol(card.suit)}
          </p>
        </div>
      </div>
    </div>
  );
}

type PreflopHandVisualProps = {
  handLabel: string;
  language: PreflopUiLanguage;
};

export function PreflopHandVisual({
  handLabel,
  language,
}: PreflopHandVisualProps) {
  const parsedHand = parseHandLabel(handLabel);
  const [firstCard, secondCard] = parsedHand.cards;

  return (
    <div className="rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),rgba(15,23,42,0.1)_70%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="relative mx-auto flex h-40 w-[13rem] items-center justify-center">
        <CardFace card={firstCard} className="-rotate-6 translate-x-3" />
        <CardFace card={secondCard} className="absolute rotate-6 -translate-x-3" />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-sm font-semibold tracking-[0.08em] text-cyan-100">
          {handLabel}
        </span>
        <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
          {getShapeLabel(parsedHand.shapeLabel, language)}
        </span>
      </div>
    </div>
  );
}
