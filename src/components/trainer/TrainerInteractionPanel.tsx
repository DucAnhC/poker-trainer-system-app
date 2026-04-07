import { AnswerOptions } from "@/components/trainer/AnswerOptions";
import { FeedbackPanel } from "@/components/trainer/FeedbackPanel";
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
}: TrainerInteractionPanelProps) {
  return (
    <>
      <SurfaceCard className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {answerTitle}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          {answerDescription}
        </p>
        <AnswerOptions
          options={scenario.candidateActions}
          selectedActionId={selectedActionId}
          recommendedActionId={feedback?.recommendedAction.id}
          submittedActionId={feedback?.selectedAction.id}
          onSelect={onSelectAction}
          disabled={hasSubmitted}
        />
      </SurfaceCard>

      {feedback ? (
        <FeedbackPanel
          scenario={scenario}
          feedback={feedback}
          progressSummary={progressSummary}
        />
      ) : (
        <SurfaceCard className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Feedback panel
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {feedbackPlaceholder}
          </p>
        </SurfaceCard>
      )}
    </>
  );
}
