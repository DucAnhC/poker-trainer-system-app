import {
  ActionTray,
  CoachAnchor,
} from "@/components/poker-room/PokerRoom";
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

  const coachActions =
    language === "vi"
      ? [
          {
            label: "Goi y ngan",
            helper: "Mot cue ngan truoc khi ban khoa line.",
          },
          {
            label: "Giai thich them",
            helper: "Tom tat vi sao line tot hon sau reveal.",
          },
          {
            label: "Tinh huong tuong tu",
            helper: "Mo them mot spot gan voi hand hien tai.",
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
  const coachTitle =
    language === "vi" ? "Coach seat da san sang cho vong sau" : "Coach seat is ready for the next pass";
  const coachBody =
    language === "vi"
      ? "Anchor nay giu cho cho AI tutor de nudges, short feedback, va compare spot ma khong day trainer thanh chat sidebar."
      : "This anchor reserves the table-coach slot for nudges, short feedback, and similar-spot prompts without turning the trainer into a sidebar chat.";
  const stateLabel = hasSubmitted
    ? language === "vi"
      ? "Line da khoa"
      : "Line locked"
    : selectedActionLabel
      ? language === "vi"
        ? "Da chon line"
        : "Line selected"
      : language === "vi"
        ? "Cho quyet dinh"
        : "Awaiting decision";
  const stateHint = hasSubmitted
    ? language === "vi"
      ? "Reveal panel dang san sang dua correction, takeaway, va next hand."
      : "The reveal panel is ready to show the correction, takeaway, and next hand."
    : selectedActionLabel
      ? language === "vi"
        ? "Ban da chon line. Khoa no lai de mo reveal."
        : "You have a line selected. Lock it to open the reveal."
      : language === "vi"
        ? "Chon mot line truoc. Coach seat se chi can thiep bang nudges ngan."
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
      coach={
        <CoachAnchor
          title={coachTitle}
          body={coachBody}
          modeLabel={language === "vi" ? "Coach anchor" : "Coach anchor"}
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
