"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { AnswerOptions } from "@/components/trainer/AnswerOptions";
import { FeedbackPanel } from "@/components/trainer/FeedbackPanel";
import { TrainerSubmitBar } from "@/components/trainer/TrainerSubmitBar";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type {
  ProgressSummary,
  SubmittedAnswerFeedback,
  TrainingScenario,
} from "@/types/training";

type TrainerInteractionPanelProps = {
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback | null;
  selectedActionId: string | null;
  onSelectAction: (actionId: string) => void;
  hasSubmitted: boolean;
  answerTitle: string;
  answerDescription: string;
  feedbackPlaceholder: string;
  progressSummary: ProgressSummary;
  canSubmit: boolean;
  isLastScenario: boolean;
  onSubmit: () => void;
  onNext: () => void;
  onRestart: () => void;
};

export function TrainerInteractionPanel({
  scenario,
  feedback,
  selectedActionId,
  onSelectAction,
  hasSubmitted,
  answerTitle,
  answerDescription,
  feedbackPlaceholder,
  progressSummary,
  canSubmit,
  isLastScenario,
  onSubmit,
  onNext,
  onRestart,
}: TrainerInteractionPanelProps) {
  const copy = useUiCopy();
  const selectedActionLabel =
    scenario.candidateActions.find((option) => option.id === selectedActionId)?.label ??
    null;

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {answerTitle || copy.trainer.shared.answerEyebrow}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {answerDescription}
          </p>
        </div>

        <AnswerOptions
          options={scenario.candidateActions}
          selectedActionId={selectedActionId}
          recommendedActionId={feedback?.recommendedAction.id}
          submittedActionId={feedback?.selectedAction.id}
          onSelect={onSelectAction}
          disabled={hasSubmitted}
        />

        <TrainerSubmitBar
          canSubmit={canSubmit}
          hasSubmitted={hasSubmitted}
          isLastScenario={isLastScenario}
          selectedActionLabel={selectedActionLabel}
          onSubmit={onSubmit}
          onNext={onNext}
          onRestart={onRestart}
        />
      </SurfaceCard>

      {feedback ? (
        <FeedbackPanel
          scenario={scenario}
          feedback={feedback}
          progressSummary={progressSummary}
        />
      ) : (
        <SurfaceCard className="space-y-3 border-dashed border-border/80 bg-muted/10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            {copy.trainer.shared.feedbackWaitingTitle}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {feedbackPlaceholder}
          </p>
        </SurfaceCard>
      )}
    </div>
  );
}
