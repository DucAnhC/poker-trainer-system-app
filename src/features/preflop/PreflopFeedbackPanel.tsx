import type { ReactNode } from "react";

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
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
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

  if (!feedback) {
    return (
      <section className="rounded-[32px] border border-dashed border-border/80 bg-surface/75 p-5 shadow-panel sm:p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-strong">
            {copy.reviewEyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {copy.reviewPlaceholder}
          </h2>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[copy.resultLabel, copy.recommendedLineLabel, copy.whyLabel, copy.learnLabel].map((label) => (
            <div
              key={label}
              className="rounded-[24px] border border-border/70 bg-muted/18 px-4 py-5"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </p>
              <div className="mt-3 h-3 w-24 rounded-full bg-muted" />
              <div className="mt-2 h-3 w-32 rounded-full bg-muted/80" />
            </div>
          ))}
        </div>
      </section>
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
  const shortWhy =
    whyBlocks[0]?.body ?? answerBlock?.body ?? scenario.learningGoal;
  const lessonText =
    weakerLineBlock?.body ??
    surfacedLeakTags[0] ??
    getPreflopConceptLabel(scenario.keyConcepts[0] ?? "preflop", language);

  return (
    <section className="rounded-[32px] border border-border/70 bg-surface/90 p-5 shadow-panel sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
            isCorrect
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {isCorrect ? copy.correctLabel : copy.incorrectLabel}
        </span>
        <span className="rounded-full border border-border bg-muted/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.selectedTag}: {getPreflopActionSummaryLabel(feedback.selectedAction)}
        </span>
        <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.bestTag}: {getPreflopActionSummaryLabel(feedback.recommendedAction)}
        </span>
        <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          {getPreflopSourceTypeLabel(scenario.sourceType, language)}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReviewCard
          label={copy.resultLabel}
          className={cn(
            isCorrect
              ? "border-emerald-200/70 bg-emerald-50/70"
              : "border-rose-200/70 bg-rose-50/70",
          )}
        >
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isCorrect ? "text-emerald-700" : "text-rose-700",
            )}
          >
            {isCorrect ? copy.correctLabel : copy.incorrectLabel}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {getPreflopActionSummaryLabel(feedback.selectedAction)}
          </p>
        </ReviewCard>

        <ReviewCard label={copy.recommendedLineLabel} className="border-accent/20 bg-accent/5">
          <p className="text-2xl font-semibold tracking-tight text-accent-strong">
            {getPreflopActionSummaryLabel(feedback.recommendedAction)}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            {answerBlock?.body ?? scenario.learningGoal}
          </p>
        </ReviewCard>

        <ReviewCard label={copy.whyLabel} className="border-border/70 bg-muted/12">
          <p className="text-sm leading-6 text-muted-foreground">{shortWhy}</p>
        </ReviewCard>

        <ReviewCard label={copy.learnLabel} className="border-border/70 bg-muted/12">
          <div className="flex flex-wrap gap-2">
            {scenario.keyConcepts.map((conceptId) => (
              <span
                key={`${scenario.id}-${conceptId}`}
                className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong"
              >
                {getPreflopConceptLabel(conceptId, language)}
              </span>
            ))}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{lessonText}</p>

          {surfacedLeakTags.length > 0 && !isCorrect ? (
            <div className="flex flex-wrap gap-2">
              {surfacedLeakTags.map((leakLabel) => (
                <span
                  key={`${scenario.id}-${leakLabel}`}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-700"
                >
                  {leakLabel}
                </span>
              ))}
            </div>
          ) : null}
        </ReviewCard>
      </div>

      {!isCorrect && feedback.selectedAction.feedbackHint ? (
        <div className="mt-4 rounded-[26px] border border-rose-200/70 bg-rose-50/80 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
            {copy.driftLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-900/80">
            {feedback.selectedAction.feedbackHint}
          </p>
        </div>
      ) : null}

      {firstAssumption ? (
        <div className="mt-4 rounded-[26px] border border-gold/20 bg-gold/10 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            {copy.assumptionLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {firstAssumption}
          </p>
        </div>
      ) : null}
    </section>
  );
}
