import { ActionOptionCard } from "@/components/poker-room/PokerRoom";
import type { CandidateAction } from "@/types/training";

import { getPreflopActionDisplay } from "@/features/preflop/preflop-trainer-copy";

type PreflopActionButtonProps = {
  action: CandidateAction;
  index: number;
  isSelected: boolean;
  isLocked: boolean;
  isRecommended?: boolean;
  isSubmittedChoice?: boolean;
  selectedTag: string;
  bestTag: string;
  onSelect: () => void;
};

export function PreflopActionButton({
  action,
  index,
  isSelected,
  isLocked,
  isRecommended = false,
  isSubmittedChoice = false,
  selectedTag,
  bestTag,
  onSelect,
}: PreflopActionButtonProps) {
  const display = getPreflopActionDisplay(action);

  return (
    <ActionOptionCard
      index={index}
      label={display.primary}
      subtitle={display.secondary ?? undefined}
      isSelected={isSelected}
      isLocked={isLocked}
      isRecommended={isRecommended}
      isSubmittedChoice={isSubmittedChoice}
      selectedTag={selectedTag}
      bestTag={bestTag}
      note={
        action.feedbackHint && isLocked && !isRecommended && isSubmittedChoice
          ? action.feedbackHint
          : undefined
      }
      onSelect={onSelect}
    />
  );
}
