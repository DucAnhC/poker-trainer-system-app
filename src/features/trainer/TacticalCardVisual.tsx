import { cn } from "@/lib/utils";

type TacticalCardVisualProps = {
  card: string;
  size?: "sm" | "md" | "lg" | "xl";
};

type TacticalCardRowProps = {
  cards: string[];
  size?: "sm" | "md" | "lg" | "xl";
};

function parseCard(card: string) {
  const trimmedCard = card.trim();

  if (trimmedCard.length < 2) {
    return {
      rank: trimmedCard,
      suit: "",
      toneClassName: "text-slate-100",
      accentClassName: "border-white/10 bg-white/[0.06]",
    };
  }

  const suit = trimmedCard.slice(-1).toLowerCase();
  const rank = trimmedCard.slice(0, -1).toUpperCase();

  if (suit === "h" || suit === "d") {
    return {
      rank,
      suit: suit.toUpperCase(),
      toneClassName: "text-rose-100",
      accentClassName: "border-rose-300/25 bg-rose-300/10",
    };
  }

  if (suit === "c") {
    return {
      rank,
      suit: suit.toUpperCase(),
      toneClassName: "text-emerald-100",
      accentClassName: "border-emerald-300/20 bg-emerald-300/10",
    };
  }

  return {
    rank,
    suit: suit.toUpperCase(),
    toneClassName: "text-cyan-100",
    accentClassName: "border-cyan-300/20 bg-cyan-300/10",
  };
}

function getSizeClassName(size: NonNullable<TacticalCardVisualProps["size"]>) {
  if (size === "sm") {
    return "h-[72px] min-w-[52px] rounded-[18px] px-3 py-2";
  }

  if (size === "xl") {
    return "h-[138px] min-w-[92px] rounded-[28px] px-4 py-4";
  }

  if (size === "lg") {
    return "h-[112px] min-w-[76px] rounded-[24px] px-4 py-3";
  }

  return "h-[88px] min-w-[60px] rounded-[20px] px-3 py-3";
}

export function TacticalCardVisual({
  card,
  size = "md",
}: TacticalCardVisualProps) {
  const parsedCard = parseCard(card);

  return (
    <div
      className={cn(
        "flex flex-col justify-between border shadow-[0_16px_34px_-24px_rgba(15,23,42,0.85)]",
        "bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(6,14,27,0.96))]",
        getSizeClassName(size),
        parsedCard.accentClassName,
      )}
    >
      <span
        className={cn(
          size === "xl" ? "text-[1.65rem]" : "text-lg",
          "font-semibold tracking-[0.04em]",
          parsedCard.toneClassName,
        )}
      >
        {parsedCard.rank}
      </span>
      <span
        className={cn(
          size === "xl" ? "text-sm" : "text-xs",
          "font-semibold uppercase tracking-[0.22em]",
          parsedCard.toneClassName,
        )}
      >
        {parsedCard.suit}
      </span>
    </div>
  );
}

export function TacticalCardRow({
  cards,
  size = "md",
}: TacticalCardRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {cards.map((card) => (
        <TacticalCardVisual key={`${card}-${size}`} card={card} size={size} />
      ))}
    </div>
  );
}
