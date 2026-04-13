import {
  BoardCards,
  PokerCard,
} from "@/components/poker-room/PokerRoom";

type TacticalCardVisualProps = {
  card: string;
  size?: "sm" | "md" | "lg" | "xl";
};

type TacticalCardRowProps = {
  cards: string[];
  size?: "sm" | "md" | "lg" | "xl";
};

export function TacticalCardVisual({
  card,
  size = "md",
}: TacticalCardVisualProps) {
  return <PokerCard card={card} size={size} />;
}

export function TacticalCardRow({
  cards,
  size = "md",
}: TacticalCardRowProps) {
  return <BoardCards cards={cards} size={size} />;
}
