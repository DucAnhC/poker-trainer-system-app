import { ActionChoiceCard } from "@/components/trainer/ActionChoiceCard";
import type { CandidateAction } from "@/types/training";

type AnswerOptionsProps = {
  options: CandidateAction[];
  selectedActionId: string | null;
  recommendedActionId?: string;
  submittedActionId?: string | null;
  onSelect: (actionId: string) => void;
  disabled?: boolean;
};

export function AnswerOptions({
  options,
  selectedActionId,
  recommendedActionId,
  submittedActionId,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  return (
    <div
      className={`grid gap-3 ${
        options.length <= 4 ? "sm:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {options.map((option, index) => {
        const isSelected = selectedActionId === option.id;
        const isRecommended = recommendedActionId === option.id;
        const isSubmittedChoice = submittedActionId === option.id;

        return (
          <ActionChoiceCard
            key={option.id}
            optionLabel={option.label}
            feedbackHint={option.feedbackHint}
            showHint={Boolean(submittedActionId)}
            isSelected={isSelected}
            isRecommended={Boolean(submittedActionId) && isRecommended}
            isSubmittedChoice={Boolean(submittedActionId) && isSubmittedChoice}
            isLocked={disabled}
            onSelect={() => onSelect(option.id)}
            index={index}
          />
        );
      })}
    </div>
  );
}
