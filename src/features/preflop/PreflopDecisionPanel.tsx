import { cn } from "@/lib/utils";
import type {
  SubmittedAnswerFeedback,
  TrainingAnswerPhase,
  TrainingScenario,
} from "@/types/training";

import { PreflopActionButton } from "@/features/preflop/PreflopActionButton";
import {
  getPreflopActionSummaryLabel,
  getPreflopDecisionHint,
  getPreflopDrillCopy,
  type PreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

type PreflopDecisionPanelProps = {
  language: PreflopUiLanguage;
  scenario: TrainingScenario;
  selectedActionId: string | null;
  answerPhase: TrainingAnswerPhase;
  feedback: SubmittedAnswerFeedback | null;
  canSubmit: boolean;
  canAdvance: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  onSelectAction: (actionId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
};

export function PreflopDecisionPanel({
  language,
  scenario,
  selectedActionId,
  answerPhase,
  feedback,
  canSubmit,
  canAdvance,
  hasSubmitted,
  isLastScenario,
  onSelectAction,
  onSubmit,
  onNext,
  onRestart,
}: PreflopDecisionPanelProps) {
  const copy = getPreflopDrillCopy(language);
  const selectedAction =
    scenario.candidateActions.find((action) => action.id === selectedActionId) ?? null;
  const selectedActionLabel = selectedAction
    ? getPreflopActionSummaryLabel(selectedAction)
    : null;
  const decisionHint = getPreflopDecisionHint(answerPhase, language);
  const primaryButtonLabel = hasSubmitted
    ? isLastScenario
      ? copy.finishSessionLabel
      : copy.nextSpotLabel
    : selectedActionLabel
      ? `${copy.submitLabel} ${selectedActionLabel}`
      : copy.submitLabel;

  return (
    <aside className="rounded-[32px] border border-slate-900/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,15,28,0.96))] p-5 text-white shadow-panel xl:sticky xl:top-6">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200/80">
          {copy.decisionEyebrow}
        </p>
        <h2 className="text-[1.85rem] font-semibold tracking-tight text-white">
          {copy.decisionTitle}
        </h2>
        <p className="text-sm leading-6 text-slate-300">
          {decisionHint}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {scenario.candidateActions.map((action, index) => (
          <PreflopActionButton
            key={action.id}
            action={action}
            index={index}
            language={language}
            isSelected={selectedActionId === action.id}
            isLocked={hasSubmitted}
            isRecommended={feedback?.recommendedAction.id === action.id}
            isSubmittedChoice={feedback?.selectedAction.id === action.id}
            selectedTag={copy.selectedTag}
            bestTag={copy.bestTag}
            onSelect={() => onSelectAction(action.id)}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.05] p-4">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            {copy.selectedLineLabel}
          </p>
          <p className="text-xl font-semibold text-white">
            {selectedActionLabel ?? copy.noLineSelected}
          </p>
        </div>

        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={hasSubmitted ? onNext : onSubmit}
            disabled={hasSubmitted ? !canAdvance : !canSubmit}
            className={cn(
              "w-full rounded-full px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] transition active:scale-[0.99]",
              (hasSubmitted ? !canAdvance : !canSubmit)
                ? "cursor-not-allowed bg-slate-600/60 text-slate-300"
                : "bg-[linear-gradient(135deg,rgba(34,197,94,0.98),rgba(6,182,212,0.96))] text-white shadow-[0_18px_42px_-22px_rgba(34,197,94,0.7)] hover:brightness-105",
            )}
          >
            {primaryButtonLabel}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="w-full rounded-full border border-white/12 bg-transparent px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/22 hover:bg-white/[0.06]"
          >
            {copy.restartLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}
