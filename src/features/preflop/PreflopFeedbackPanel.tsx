import type { ReactNode } from "react";

import {
  CoachAnchor,
  RevealStatePanel,
  SpotTag,
} from "@/components/poker-room/PokerRoom";
import { leakTags } from "@/data/leak-tags";
import { cn } from "@/lib/utils";
import type { PreflopScenario, SubmittedAnswerFeedback } from "@/types/training";

import {
  getPreflopActionSummaryLabel,
  getPreflopConceptLabel,
  getPreflopDrillCopy,
  getPreflopSourceTypeLabel,
  type PreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

type PreflopFeedbackPanelProps = {
  language: PreflopUiLanguage;
  scenario: PreflopScenario;
  feedback: SubmittedAnswerFeedback | null;
};

function ReviewCard({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[28px] border p-5", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

export function PreflopFeedbackPanel({
  language,
  scenario,
  feedback,
}: PreflopFeedbackPanelProps) {
  const copy = getPreflopDrillCopy(language);
  const coachActions =
    language === "vi"
      ? [
          {
            label: "Goi y ngan",
            helper: "Feedback ngan neu nguoi hoc muon giu nhip nhanh.",
          },
          {
            label: "Giai thich them",
            helper: "Dao sau vi sao line nay tot hon trong node nay.",
          },
          {
            label: "Tinh huong tuong tu",
            helper: "Mo them mot hand gan de lap lai bai hoc.",
          },
        ]
      : [
          {
            label: "Quick hint",
            helper: "A short note for keeping the pace fast.",
          },
          {
            label: "Explain more",
            helper: "A deeper why for this exact node.",
          },
          {
            label: "Similar spot",
            helper: "Open a close hand to repeat the takeaway.",
          },
        ];

  if (!feedback) {
    return (
      <RevealStatePanel
        eyebrow={copy.reviewEyebrow}
        title={copy.reviewPlaceholder}
        description={
          language === "vi"
            ? "Reveal panel se mo sau khi ban da chot line. Luc nay scene van uu tien quyet dinh tren ban."
            : "The reveal panel opens after the line is locked. Until then, the scene keeps the decision in the spotlight."
        }
        revealed={false}
        placeholderLabels={[
          copy.resultLabel,
          copy.recommendedLineLabel,
          copy.whyLabel,
          copy.learnLabel,
        ]}
        coach={
          <CoachAnchor
            title={language === "vi" ? "Coach doi sau khi ban chot line" : "Coach waits until you lock the line"}
            body={
              language === "vi"
                ? "Future AI tutor co the feedback ngan ngay sau hand, hoac mo rong ly do khi nguoi hoc can them context."
                : "The future AI tutor can give a short post-hand nudge here, then expand the why when the learner wants more context."
            }
            modeLabel={language === "vi" ? "Silent coach" : "Silent coach"}
            actions={coachActions}
          />
        }
      >
        <div />
      </RevealStatePanel>
    );
  }

  const isCorrect = feedback.attempt.isCorrect;
  const answerBlock =
    scenario.rationaleBlocks.find((block) => block.kind === "answer") ?? null;
  const whyBlocks = scenario.rationaleBlocks
    .filter((block) => block.kind === "core-reason" || block.kind === "context-factor")
    .slice(0, 2);
  const weakerLineBlock =
    scenario.rationaleBlocks.find(
      (block) =>
        block.kind === "alternative-action" || block.kind === "mistake-correction",
    ) ?? null;
  const firstAssumption =
    scenario.assumptions[0] ??
    scenario.rationaleBlocks.find((block) => block.kind === "assumption")?.body ??
    null;
  const surfacedLeakTags = scenario.mistakeTags
    .map((leakTagId) => leakTags.find((leakTag) => leakTag.id === leakTagId)?.label ?? null)
    .filter((value): value is string => value !== null)
    .slice(0, 2);
  const shortWhy = whyBlocks[0]?.body ?? answerBlock?.body ?? scenario.learningGoal;
  const lessonText =
    weakerLineBlock?.body ??
    surfacedLeakTags[0] ??
    getPreflopConceptLabel(scenario.keyConcepts[0] ?? "preflop", language);

  return (
    <RevealStatePanel
      eyebrow={copy.reviewEyebrow}
      title={language === "vi" ? "Reveal va lesson sau hand" : "Reveal and lesson after the hand"}
      description={
        language === "vi"
          ? "Ban da chot line. Bay gio he thong moi reveal line tot hon, ly do, va diem hoc can giu lai."
          : "The line is locked. Now the system reveals the cleaner option, the why, and the main learning point to keep."
      }
      revealed
      placeholderLabels={[]}
      coach={
        <CoachAnchor
          title={language === "vi" ? "Coach seat cho feedback theo hand" : "Coach seat for post-hand feedback"}
          body={
            language === "vi"
              ? "Foundation nay san sang cho silent coach, nudge coach, va sparring tutor o vong tiep theo."
              : "This foundation is ready for silent coach, nudge coach, and sparring tutor modes in the next pass."
          }
          modeLabel={language === "vi" ? "Coach ready" : "Coach ready"}
          actions={coachActions}
        />
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <SpotTag tone={isCorrect ? "emerald" : "rose"}>
          {isCorrect ? copy.correctLabel : copy.incorrectLabel}
        </SpotTag>
        <SpotTag tone="slate">
          {copy.selectedTag}: {getPreflopActionSummaryLabel(feedback.selectedAction)}
        </SpotTag>
        <SpotTag tone="cyan">
          {copy.bestTag}: {getPreflopActionSummaryLabel(feedback.recommendedAction)}
        </SpotTag>
        <SpotTag tone="amber">
          {getPreflopSourceTypeLabel(scenario.sourceType, language)}
        </SpotTag>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReviewCard
          label={copy.resultLabel}
          className={cn(
            isCorrect
              ? "border-emerald-300/28 bg-[linear-gradient(180deg,rgba(6,78,59,0.92),rgba(6,24,28,0.96))]"
              : "border-rose-300/28 bg-[linear-gradient(180deg,rgba(76,5,25,0.94),rgba(22,8,18,0.96))]",
          )}
        >
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isCorrect ? "text-emerald-100" : "text-rose-100",
            )}
          >
            {isCorrect ? copy.correctLabel : copy.incorrectLabel}
          </p>
          <p className="text-sm leading-6 text-white/78">
            {getPreflopActionSummaryLabel(feedback.selectedAction)}
          </p>
        </ReviewCard>

        <ReviewCard
          label={copy.recommendedLineLabel}
          className="border-cyan-300/24 bg-[linear-gradient(180deg,rgba(8,47,73,0.96),rgba(8,23,42,0.96))]"
        >
          <p className="text-2xl font-semibold tracking-tight text-cyan-100">
            {getPreflopActionSummaryLabel(feedback.recommendedAction)}
          </p>
          <p className="text-sm leading-6 text-white/78">
            {answerBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewCard>

        <ReviewCard label={copy.whyLabel} className="border-white/12 bg-black/14">
          <p className="text-sm leading-6 text-slate-200/90">{shortWhy}</p>
        </ReviewCard>

        <ReviewCard label={copy.learnLabel} className="border-white/12 bg-black/14">
          <div className="flex flex-wrap gap-2">
            {scenario.keyConcepts.map((conceptId) => (
              <SpotTag key={`${scenario.id}-${conceptId}`} tone="slate">
                {getPreflopConceptLabel(conceptId, language)}
              </SpotTag>
            ))}
          </div>
          <p className="text-sm leading-6 text-slate-200/90">{lessonText}</p>

          {surfacedLeakTags.length > 0 && !isCorrect ? (
            <div className="flex flex-wrap gap-2">
              {surfacedLeakTags.map((leakLabel) => (
                <SpotTag key={`${scenario.id}-${leakLabel}`} tone="rose">
                  {leakLabel}
                </SpotTag>
              ))}
            </div>
          ) : null}
        </ReviewCard>
      </div>

      {!isCorrect && feedback.selectedAction.feedbackHint ? (
        <div className="rounded-[26px] border border-rose-200/30 bg-rose-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-100">
            {copy.driftLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-50/90">
            {feedback.selectedAction.feedbackHint}
          </p>
        </div>
      ) : null}

      {firstAssumption ? (
        <div className="rounded-[26px] border border-amber-200/20 bg-amber-300/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100">
            {copy.assumptionLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200/90">{firstAssumption}</p>
        </div>
      ) : null}
    </RevealStatePanel>
  );
}
