import { FollowUpSuggestionsPanel } from "@/components/trainer/FollowUpSuggestionsPanel";
import { leakTags } from "@/data/leak-tags";
import { sourceTypeLabels } from "@/lib/poker/labels";
import {
  getExplanationOverview,
  getExplanationSections,
} from "@/lib/training/explanations";
import { getScenarioFollowUpSuggestions } from "@/lib/training/follow-up-suggestions";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
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

export function FeedbackPanel({
  scenario,
  feedback,
  progressSummary,
}: FeedbackPanelProps) {
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
      <SurfaceCard className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={feedback.attempt.isCorrect ? "success" : "danger"}>
            {feedback.attempt.isCorrect ? "Correct" : "Review this one"}
          </StatusPill>
          <StatusPill>{feedback.selectedAction.label}</StatusPill>
          <StatusPill tone="accent">
            Best answer: {feedback.recommendedAction.label}
          </StatusPill>
          <StatusPill tone="gold">{sourceTypeLabels[scenario.sourceType]}</StatusPill>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Key concept
            </p>
            <div className="flex flex-wrap gap-2">
              {explanationOverview.keyConceptLabels.map((conceptLabel) => (
                <StatusPill key={`${scenario.id}-${conceptLabel}`}>
                  {conceptLabel}
                </StatusPill>
              ))}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {scenario.learningGoal}
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Training mode
            </p>
            <p className="text-sm font-semibold text-foreground">
              {sourceTypeLabels[scenario.sourceType]}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {explanationOverview.sourceTypeNote}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {explanationSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
                  {section.eyebrow}
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {section.title}
                </p>
              </div>

              {section.blocks.map((rationaleBlock) => (
                <div
                  key={rationaleBlock.id}
                  className="rounded-2xl border border-border/70 bg-muted/35 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
                    {rationaleBlock.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {rationaleBlock.body}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {scenario.assumptions.length > 0 ? (
          <div className="rounded-2xl border border-gold/25 bg-gold/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
              Training assumptions
            </p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
              {scenario.assumptions.map((assumption) => (
                <li key={assumption}>- {assumption}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {activeLeakTags.length > 0 && !feedback.attempt.isCorrect ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Common mistake tags
            </p>
            <div className="flex flex-wrap gap-2">
              {activeLeakTags.map((leakTag) => (
                <LeakTagBadge key={leakTag.id} leakTag={leakTag} />
              ))}
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                What to study next
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
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Why the chosen line drifted
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feedback.selectedAction.feedbackHint}
            </p>
          </div>
        ) : null}
      </SurfaceCard>

      <FollowUpSuggestionsPanel suggestions={followUpSuggestions} />
    </div>
  );
}
