"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { FollowUpSuggestionsPanel } from "@/components/trainer/FollowUpSuggestionsPanel";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { leakTags } from "@/data/leak-tags";
import {
  getExplanationOverview,
  getExplanationSections,
} from "@/lib/training/explanations";
import { getScenarioFollowUpSuggestions } from "@/lib/training/follow-up-suggestions";
import type {
  ProgressSummary,
  SubmittedAnswerFeedback,
  TrainingScenario,
} from "@/types/training";

type FeedbackPanelProps = {
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback;
  progressSummary: ProgressSummary;
};

function getLocalizedSectionText(
  sectionId: string,
  copy: ReturnType<typeof useUiCopy>,
) {
  if (sectionId === "answer-summary") {
    return {
      eyebrow: copy.trainer.shared.answerSummaryEyebrow,
      title: copy.trainer.shared.answerSummaryTitle,
    };
  }

  if (sectionId === "why-it-fits") {
    return {
      eyebrow: copy.trainer.shared.whyFitsEyebrow,
      title: copy.trainer.shared.whyFitsTitle,
    };
  }

  if (sectionId === "weaker-lines") {
    return {
      eyebrow: copy.trainer.shared.weakerLinesEyebrow,
      title: copy.trainer.shared.weakerLinesTitle,
    };
  }

  if (sectionId === "mistake-pattern") {
    return {
      eyebrow: copy.trainer.shared.mistakePatternEyebrow,
      title: copy.trainer.shared.mistakePatternTitle,
    };
  }

  return {
    eyebrow: sectionId,
    title: sectionId,
  };
}

export function FeedbackPanel({
  scenario,
  feedback,
  progressSummary,
}: FeedbackPanelProps) {
  const copy = useUiCopy();
  const activeLeakTags = leakTags.filter((leakTag) =>
    scenario.mistakeTags.includes(leakTag.id),
  );
  const explanationOverview = getExplanationOverview(scenario);
  const explanationSections = getExplanationSections(
    scenario,
    feedback.attempt.isCorrect,
  );
  const followUpSuggestions = getScenarioFollowUpSuggestions({
    scenario,
    isCorrect: feedback.attempt.isCorrect,
    progressSummary,
  });

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={feedback.attempt.isCorrect ? "success" : "danger"}>
            {feedback.attempt.isCorrect
              ? copy.trainer.shared.correct
              : copy.trainer.shared.incorrect}
          </StatusPill>
          <StatusPill>{feedback.selectedAction.label}</StatusPill>
          <StatusPill tone="accent">
            {copy.trainer.shared.recommendedAction}:{" "}
            {feedback.recommendedAction.label}
          </StatusPill>
          <StatusPill tone="gold">
            {copy.trainer.sourceTypeLabels[scenario.sourceType]}
          </StatusPill>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)]">
          <div className="rounded-3xl border border-border/70 bg-muted/18 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {copy.trainer.shared.whyBest}
            </p>
            <p className="mt-3 text-lg font-semibold text-foreground">
              {scenario.learningGoal}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {explanationOverview.keyConceptLabels.map((conceptLabel) => (
                <StatusPill key={`${scenario.id}-${conceptLabel}`} tone="accent">
                  {conceptLabel}
                </StatusPill>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-muted/18 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {copy.trainer.shared.sourceType}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {copy.trainer.sourceTypeDescriptions[scenario.sourceType]}
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {explanationSections.map((section) => {
            const sectionText = getLocalizedSectionText(section.id, copy);

            return (
              <div
                key={section.id}
                className="space-y-3 rounded-3xl border border-border/70 bg-muted/15 p-5"
              >
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    {sectionText.eyebrow}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {sectionText.title}
                  </p>
                </div>

                <div className="space-y-3">
                  {section.blocks.map((rationaleBlock) => (
                    <div
                      key={rationaleBlock.id}
                      className="rounded-2xl border border-border/70 bg-white/80 p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {rationaleBlock.title}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        {rationaleBlock.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {scenario.assumptions.length > 0 ? (
          <div className="rounded-3xl border border-gold/25 bg-gold/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
              {copy.trainer.shared.assumptions}
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {scenario.assumptions.map((assumption) => (
                <li key={assumption}>- {assumption}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeLeakTags.length > 0 && !feedback.attempt.isCorrect ? (
          <div className="rounded-3xl border border-border/70 bg-muted/15 p-5">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy.trainer.shared.mistakeTags}
              </p>
              <div className="flex flex-wrap gap-2">
                {activeLeakTags.map((leakTag) => (
                  <LeakTagBadge key={leakTag.id} leakTag={leakTag} />
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-white/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy.trainer.shared.studyNext}
              </p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
                {activeLeakTags.slice(0, 2).map((leakTag) => (
                  <li key={leakTag.id}>- {leakTag.guidanceNote}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {!feedback.attempt.isCorrect && feedback.selectedAction.feedbackHint ? (
          <div className="rounded-3xl border border-rose-200/80 bg-rose-50/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
              {copy.trainer.shared.chosenLineDrifted}
            </p>
            <p className="mt-3 text-sm leading-6 text-rose-900/80">
              {feedback.selectedAction.feedbackHint}
            </p>
          </div>
        ) : null}
      </SurfaceCard>

      <FollowUpSuggestionsPanel suggestions={followUpSuggestions} />
    </div>
  );
}
