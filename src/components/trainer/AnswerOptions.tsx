import { cn } from "@/lib/utils";
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
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = selectedActionId === option.id;
        const isRecommended = recommendedActionId === option.id;
        const isSubmittedChoice = submittedActionId === option.id;
        const isIncorrectSubmitted =
          Boolean(submittedActionId) && isSubmittedChoice && !isRecommended;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            disabled={disabled}
            className={cn(
              "rounded-2xl border px-4 py-4 text-left text-sm font-medium transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/40",
              !disabled &&
                "hover:border-accent/40 hover:bg-accent/5 hover:text-accent-strong",
              isSelected && !submittedActionId && "border-accent bg-accent/10",
              isRecommended && submittedActionId && "border-emerald-300 bg-emerald-50",
              isIncorrectSubmitted && "border-rose-300 bg-rose-50",
              !isSelected &&
                !isRecommended &&
                !isIncorrectSubmitted &&
                "border-border bg-surface",
              disabled && "cursor-not-allowed",
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <span>{option.label}</span>
              {isRecommended && submittedActionId ? (
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Best answer
                </span>
              ) : null}
              {isIncorrectSubmitted ? (
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Your choice
                </span>
              ) : null}
            </div>
            {option.feedbackHint ? (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {option.feedbackHint}
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
