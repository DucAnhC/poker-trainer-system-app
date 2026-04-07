"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { cn } from "@/lib/utils";

type ActionChoiceCardProps = {
  optionLabel: string;
  feedbackHint?: string;
  showHint: boolean;
  isSelected: boolean;
  isRecommended: boolean;
  isSubmittedChoice: boolean;
  isLocked: boolean;
  onSelect: () => void;
  index: number;
};

export function ActionChoiceCard({
  optionLabel,
  feedbackHint,
  showHint,
  isSelected,
  isRecommended,
  isSubmittedChoice,
  isLocked,
  onSelect,
  index,
}: ActionChoiceCardProps) {
  const copy = useUiCopy();
  const isIncorrectSubmitted = isSubmittedChoice && !isRecommended;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      className={cn(
        "group w-full rounded-3xl border p-4 text-left transition sm:p-5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong/30",
        !isLocked &&
          "active:scale-[0.995] hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-panel",
        isSelected && !isSubmittedChoice && "border-accent bg-accent/10 shadow-panel",
        isRecommended && isSubmittedChoice && "border-emerald-300 bg-emerald-50/90 shadow-panel",
        isIncorrectSubmitted && "border-rose-300 bg-rose-50/90",
        !isSelected &&
          !isRecommended &&
          !isIncorrectSubmitted &&
          "border-border/80 bg-white/95",
        isLocked && "cursor-not-allowed",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold",
              isRecommended && isSubmittedChoice
                ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                : isIncorrectSubmitted
                  ? "border-rose-300 bg-rose-100 text-rose-700"
                  : isSelected
                    ? "border-accent/30 bg-accent/10 text-accent-strong"
                    : "border-border bg-muted/40 text-muted-foreground",
            )}
          >
            {String.fromCharCode(65 + index)}
          </span>

          <div className="min-w-0 space-y-2">
            <p className="text-base font-semibold text-foreground sm:text-lg">
              {optionLabel}
            </p>
            {showHint && feedbackHint ? (
              <p className="text-sm leading-5 text-muted-foreground">
                {feedbackHint}
              </p>
            ) : null}
          </div>
        </div>

        {isRecommended && isSubmittedChoice ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
            {copy.trainer.shared.bestAnswer}
          </span>
        ) : null}

        {isIncorrectSubmitted ? (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700">
            {copy.trainer.shared.yourChoice}
          </span>
        ) : null}
      </div>
    </button>
  );
}
