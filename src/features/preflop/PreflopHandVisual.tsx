import { HeroHand } from "@/components/poker-room/PokerRoom";
import { parsePreflopHandLabel } from "@/lib/poker/cards";

import { type PreflopUiLanguage } from "@/features/preflop/preflop-trainer-copy";

function getShapeLabel(
  handShape: ReturnType<typeof parsePreflopHandLabel>["shape"],
  language: PreflopUiLanguage,
) {
  if (language === "vi") {
    if (handShape === "pair") {
      return "Doi";
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

type PreflopHandVisualProps = {
  handLabel: string;
  language: PreflopUiLanguage;
};

export function PreflopHandVisual({
  handLabel,
  language,
}: PreflopHandVisualProps) {
  const parsedHand = parsePreflopHandLabel(handLabel);

  return (
    <HeroHand
      label={handLabel}
      cards={parsedHand.cards}
      detail={getShapeLabel(parsedHand.shape, language)}
    />
  );
}
