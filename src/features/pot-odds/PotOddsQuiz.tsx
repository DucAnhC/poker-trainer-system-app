"use client";

import Link from "next/link";

import { PageHeader } from "@/components/trainer/PageHeader";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { ScenarioCard } from "@/components/trainer/ScenarioCard";
import { TrainerInteractionPanel } from "@/components/trainer/TrainerInteractionPanel";
import { TrainerSessionSetupCard } from "@/components/trainer/TrainerSessionSetupCard";
import { TrainerControls } from "@/components/trainer/TrainerControls";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { potOddsScenarios } from "@/data/scenarios/pot-odds-scenarios";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function PotOddsQuiz() {
  const {
    activeContentPack,
    availableContentPacks,
    moduleProgress,
    queueMode,
    scopedProgress,
    selectedContentPackId,
    selectedDifficulty,
    session,
    setSelectedContentPackId,
    setQueueMode,
    setSelectedDifficulty,
  } = useTrainerModuleSession("pot-odds", potOddsScenarios);

  if (session.isComplete) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Pot Odds Quiz"
          title="Quiz run complete"
          description="The early math trainer stays intentionally approachable: simple price decisions, immediate feedback, and lightweight persistence without calculator-heavy complexity."
          aside={
            <>
              <StatusPill tone="success">Session saved</StatusPill>
              <StatusPill>Math practice logged</StatusPill>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <ProgressSummaryCard
            title="Session accuracy"
            value={formatPercent(session.accuracy)}
            description={`${session.correctCount} of ${session.answeredCount} answers were correct in this run.`}
            tone="success"
          />
          <ProgressSummaryCard
            title="All-time attempts"
            value={`${scopedProgress.attempts}`}
            description={
              selectedDifficulty === "all"
                ? `${moduleProgress.correctCount} correct answers stored for the pot odds module.`
                : `${scopedProgress.correctCount} correct answers stored at ${difficultyLabels[selectedDifficulty].toLowerCase()} level.`
            }
            tone="accent"
          />
          <ProgressSummaryCard
            title="Completed"
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? "Quiz progress was saved to the signed-in account."
                : "Local progress survives refresh without needing accounts or APIs."
            }
            tone="gold"
          />
        </div>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Why this module stays simple
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- The goal is quick decision-quality math, not solver-grade precision.</li>
            <li>- Explanations emphasize price, rough equity, and clean outs.</li>
            <li>- More advanced implied-odds and postflop complexity remain deferred.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={session.handleRestartSession}
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Run another pot odds session
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Back to dashboard
            </Link>
          </div>
        </SurfaceCard>
      </div>
    );
  }

  if (!session.currentScenario) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted-foreground">
          {selectedDifficulty === "all"
            ? "No pot odds questions are available right now."
            : `No ${difficultyLabels[selectedDifficulty].toLowerCase()} pot odds questions are seeded yet. Try another difficulty level.`}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Pot Odds Quiz"
        title="Practice clean call-or-fold math with approachable training prompts"
        description="Each question gives just enough context to reason about the price, your draw quality, and whether a continue makes sense under the simplified assumptions."
        aside={
          <>
            <StatusPill tone="success">Interactive module</StatusPill>
            <StatusPill>{difficultyLabels[session.currentScenario.difficulty]}</StatusPill>
            <StatusPill>Math-focused feedback</StatusPill>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ProgressSummaryCard
          title="Session progress"
          value={`${session.answeredCount}/${session.totalQuestions}`}
          description="Questions submitted in the current run."
          tone="accent"
        />
        <ProgressSummaryCard
          title="Session accuracy"
          value={formatPercent(session.accuracy)}
          description="Updates after each submitted answer."
          tone="success"
        />
        <ProgressSummaryCard
          title="All-time attempts"
          value={`${scopedProgress.attempts}`}
          description={`Last completed: ${formatDateTimeLabel(
            scopedProgress.lastCompletedAt,
          )}`}
          tone="gold"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <ScenarioCard
          scenario={session.currentScenario}
          questionNumber={session.questionNumber}
          totalQuestions={session.totalQuestions}
          retryHint={session.currentRetryHint}
        />

        <div className="space-y-6">
          <TrainerSessionSetupCard
            packTitle={activeContentPack.title}
            packSummary={activeContentPack.summary}
            packHighlights={activeContentPack.learningHighlights}
            availableContentPacks={availableContentPacks}
            selectedContentPackId={selectedContentPackId}
            onSelectContentPack={setSelectedContentPackId}
            scenarioCountByPackId={scenarioCountByContentPack}
            availableDifficulties={session.availableDifficulties}
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            queueMode={queueMode}
            onSelectQueueMode={setQueueMode}
            retryItems={session.retryQueueItems}
            storageMode={session.storageMode}
            isPersisting={session.isPersisting}
            persistenceError={session.persistenceError}
          />

          <TrainerInteractionPanel
            scenario={session.currentScenario}
            feedback={session.feedback}
            progressSummary={session.overallProgressSummary}
            selectedActionId={session.selectedActionId}
            onSelectAction={session.handleSelectAction}
            hasSubmitted={session.hasSubmitted}
            answerTitle="Choose the math answer"
            answerDescription="Keep the decision practical: compare the price with your likely drawing equity, then choose the clearest profitable or unprofitable continue."
            feedbackPlaceholder="Submit an answer to reveal the recommended line, a short math explanation, and any simplification notes attached to the spot."
          />

          <TrainerControls
            canSubmit={session.canSubmit}
            hasSubmitted={session.hasSubmitted}
            isLastScenario={session.isLastScenario}
            isComplete={session.isComplete}
            onSubmit={session.handleSubmitAnswer}
            onNext={session.handleNextScenario}
            onRestart={session.handleRestartSession}
          />
        </div>
      </div>
    </div>
  );
}
