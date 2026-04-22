import {
  ActionTray,
  CoachAnchor,
} from "@/components/poker-room/PokerRoom";
import { buildNudgeCoachNote } from "@/lib/training/coach-notes";
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
  canRetryCurrentScenario: boolean;
  hasSubmitted: boolean;
  isLastScenario: boolean;
  onSelectAction: (actionId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetryCurrent: () => void;
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
  canRetryCurrentScenario,
  hasSubmitted,
  isLastScenario,
  onSelectAction,
  onSubmit,
  onNext,
  onRetryCurrent,
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
  const coachNote = buildNudgeCoachNote({ scenario, language });

  const coachActions =
    language === "vi"
      ? [
          {
            label: "Gợi ý ngắn",
            helper: "Một cue ngắn trước khi bạn khóa line.",
          },
          {
            label: "Giải thích thêm",
            helper: "Tóm tắt vì sao line tốt hơn sau reveal.",
          },
          {
            label: "Tình huống tương tự",
            helper: "Mở thêm một spot gần với hand hiện tại.",
          },
        ]
      : [
          {
            label: "Quick hint",
            helper: "A short nudge before the line is locked.",
          },
          {
            label: "Explain more",
            helper: "A tighter why after the reveal opens.",
          },
          {
            label: "Similar spot",
            helper: "Pull a close follow-up hand from the same node.",
          },
        ];
  const stateLabel = hasSubmitted
    ? language === "vi"
      ? "Line đã khóa"
      : "Line locked"
    : selectedActionLabel
      ? language === "vi"
        ? "Đã chọn line"
        : "Line selected"
      : language === "vi"
        ? "Chờ quyết định"
        : "Awaiting decision";
  const stateHint = hasSubmitted
    ? language === "vi"
      ? "Reveal panel đang sẵn sàng đưa correction, takeaway và next hand."
      : "The reveal panel is ready to show the correction, takeaway, and next hand."
    : selectedActionLabel
      ? language === "vi"
        ? "Bạn đã chọn line. Khóa lại để mở reveal."
        : "You have a line selected. Lock it to open the reveal."
      : language === "vi"
        ? "Chọn một line trước. Coach seat chỉ can thiệp bằng nudge ngắn."
        : "Pick a line first. The coach seat stays limited to short nudges.";

  return (
    <ActionTray
      eyebrow={copy.decisionEyebrow}
      title={copy.decisionTitle}
      hint={decisionHint}
      selectedLabel={copy.selectedLineLabel}
      selectedValue={selectedActionLabel ?? copy.noLineSelected}
      stateLabel={stateLabel}
      stateHint={stateHint}
      stateTone={hasSubmitted ? "emerald" : selectedActionLabel ? "cyan" : "slate"}
      primaryLabel={primaryButtonLabel}
      onPrimary={hasSubmitted ? onNext : onSubmit}
      primaryDisabled={hasSubmitted ? !canAdvance : !canSubmit}
      secondaryLabel={copy.restartLabel}
      onSecondary={onRestart}
      tertiaryLabel={hasSubmitted ? copy.retrySpotLabel : undefined}
      onTertiary={hasSubmitted ? onRetryCurrent : undefined}
      tertiaryDisabled={!canRetryCurrentScenario}
      coach={
        <CoachAnchor
          title={coachNote.title}
          body={coachNote.body}
          modeLabel={coachNote.modeLabel}
          actions={coachActions}
        />
      }
    >
      {scenario.candidateActions.map((action, index) => (
        <PreflopActionButton
          key={action.id}
          action={action}
          index={index}
          isSelected={selectedActionId === action.id}
          isLocked={hasSubmitted}
          isRecommended={feedback?.recommendedAction.id === action.id}
          isSubmittedChoice={feedback?.selectedAction.id === action.id}
          selectedTag={copy.selectedTag}
          bestTag={copy.bestTag}
          onSelect={() => onSelectAction(action.id)}
        />
      ))}
    </ActionTray>
  );
}
