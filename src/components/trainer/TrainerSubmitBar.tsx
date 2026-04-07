"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { StatusPill } from "@/components/ui/StatusPill";

type TrainerSubmitBarProps = {
  canSubmit: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  selectedActionLabel?: string | null;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
};

export function TrainerSubmitBar({
  canSubmit,
  hasSubmitted,
  isLastScenario,
  selectedActionLabel,
  onSubmit,
  onNext,
  onRestart,
}: TrainerSubmitBarProps) {
  const copy = useUiCopy();
  const primaryLabel = hasSubmitted
    ? isLastScenario
      ? copy.trainer.shared.finishSession
      : copy.trainer.shared.nextSpot
    : copy.trainer.shared.submitAnswer;

  return (
    <div className="rounded-3xl border border-border/70 bg-muted/18 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          {selectedActionLabel ? (
            <>
              <StatusPill tone={hasSubmitted ? "success" : "accent"}>
                {copy.trainer.shared.selectedAction}
              </StatusPill>
              <p className="text-sm font-semibold text-foreground">
                {selectedActionLabel}
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {hasSubmitted
                  ? copy.trainer.shared.reviewAfterSubmit
                  : copy.trainer.shared.readyToSubmit}
              </p>
            </>
          ) : (
            <>
              <StatusPill>{copy.trainer.shared.answerEyebrow}</StatusPill>
              <p className="text-sm leading-6 text-muted-foreground">
                {copy.trainer.shared.selectActionFirst}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={hasSubmitted ? onNext : onSubmit}
            disabled={!hasSubmitted && !canSubmit}
            className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:bg-muted-foreground/45"
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            {copy.trainer.shared.restart}
          </button>
        </div>
      </div>
    </div>
  );
}
