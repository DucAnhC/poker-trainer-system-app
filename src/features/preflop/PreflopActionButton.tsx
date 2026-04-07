import { cn } from "@/lib/utils";
import type { CandidateAction } from "@/types/training";

import {
  getPreflopActionDisplay,
  type PreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

type PreflopActionButtonProps = {
  action: CandidateAction;
  index: number;
  language: PreflopUiLanguage;
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
  language,
  isSelected,
  isLocked,
  isRecommended = false,
  isSubmittedChoice = false,
  selectedTag,
  bestTag,
  onSelect,
}: PreflopActionButtonProps) {
  const display = getPreflopActionDisplay(action);
  const numberLabel = `${index + 1}`.padStart(2, "0");
  const showSubmittedState = isLocked && (isRecommended || isSubmittedChoice);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      aria-pressed={isSelected}
      className={cn(
        "group w-full rounded-[28px] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70",
        "bg-white/[0.04] text-white/92 shadow-[0_14px_34px_-24px_rgba(15,23,42,0.85)]",
        !isLocked && "hover:border-white/25 hover:bg-white/[0.08]",
        !isSelected && !showSubmittedState && "border-white/10",
        isSelected &&
          !isLocked &&
          "border-cyan-300/70 bg-cyan-300/[0.16] shadow-[0_20px_44px_-22px_rgba(103,232,249,0.5)]",
        isLocked &&
          isRecommended &&
          "border-emerald-300/65 bg-emerald-300/[0.16] shadow-[0_18px_44px_-24px_rgba(52,211,153,0.55)]",
        isLocked &&
          !isRecommended &&
          isSubmittedChoice &&
          "border-rose-300/60 bg-rose-300/[0.13] shadow-[0_18px_44px_-24px_rgba(251,113,133,0.45)]",
        isLocked && !isRecommended && !isSubmittedChoice && "border-white/10 opacity-75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.18em]",
              isSelected || showSubmittedState
                ? "border-white/35 bg-white/12 text-white"
                : "border-white/12 bg-black/10 text-slate-300",
            )}
          >
            {numberLabel}
          </div>

          <div className="min-w-0">
            <p className="text-xl font-semibold tracking-[0.03em] text-white">
              {display.primary}
            </p>
            {display.secondary ? (
              <p className="mt-1 text-sm text-slate-300">{display.secondary}</p>
            ) : null}
            {action.feedbackHint && isLocked && !isRecommended && isSubmittedChoice ? (
              <p className="mt-3 text-sm leading-5 text-rose-100/90">
                {action.feedbackHint}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isSubmittedChoice ? (
            <span className="rounded-full border border-white/18 bg-black/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
              {selectedTag}
            </span>
          ) : null}
          {isRecommended ? (
            <span className="rounded-full border border-emerald-200/35 bg-emerald-100/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
              {bestTag}
            </span>
          ) : null}
          {!isRecommended && !isSubmittedChoice && !isLocked ? (
            <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              {language === "vi" ? "Chọn" : "Select"}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
