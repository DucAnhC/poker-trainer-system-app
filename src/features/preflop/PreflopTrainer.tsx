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
import { preflopScenarios } from "@/data/scenarios/preflop-scenarios";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function PreflopTrainer() {
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
  } = useTrainerModuleSession("preflop", preflopScenarios);

  if (session.isComplete) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Preflop Trainer"
          title="Session complete"
          description="This early MVP flow keeps the feedback tied to position, stack depth, and action history while saving progress in the active persistence mode."
          aside={
            <>
              <StatusPill tone="success">Session saved</StatusPill>
              <StatusPill>
                {session.storageMode === "account"
                  ? "Account progress updated"
                  : "Local progress updated"}
              </StatusPill>
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
                ? `${moduleProgress.correctCount} correct answers stored for the preflop module.`
                : `${scopedProgress.correctCount} correct answers stored at ${difficultyLabels[selectedDifficulty].toLowerCase()} level.`
            }
            tone="accent"
          />
          <ProgressSummaryCard
            title="Completed"
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? "Progress was saved to the signed-in account."
                : "Progress is stored in localStorage and survives refresh."
            }
            tone="gold"
          />
        </div>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            What stayed in scope
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- Position-aware mock scenarios are interactive.</li>
            <li>- Feedback is immediate and tied to the stored rationale blocks.</li>
            <li>- Recommendations are still clearly framed as baseline or simplification training guidance.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={session.handleRestartSession}
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Run another preflop session
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
            ? "No preflop scenarios are available right now."
            : `No ${difficultyLabels[selectedDifficulty].toLowerCase()} preflop scenarios are seeded yet. Try another difficulty level.`}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Preflop Trainer"
        title="Practice common preflop decisions with lightweight scenario drills"
        description="This MVP trains small but real decisions: read the spot, choose the cleanest action under the stated assumptions, review the answer, and move to the next hand."
        aside={
          <>
            <StatusPill tone="success">Interactive module</StatusPill>
            <StatusPill>{difficultyLabels[session.currentScenario.difficulty]}</StatusPill>
            <StatusPill>Progress autosaves</StatusPill>
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
            answerTitle="Choose an action"
            answerDescription="Pick the cleanest training answer for this exact context. Once you submit, the module will show the recommended line and why it fits the range and stack assumptions."
            feedbackPlaceholder="Submit your answer to see whether it matches the stored training recommendation, plus the short rationale blocks and any tagged simplification notes."
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
