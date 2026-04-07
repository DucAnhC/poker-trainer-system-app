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
import { playerTypeScenarios } from "@/data/scenarios/player-type-scenarios";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function PlayerTypesQuiz() {
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
  } = useTrainerModuleSession("player-types", playerTypeScenarios);

  if (session.isComplete) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Player Types Quiz"
          title="Exploit-adjustment session complete"
          description="This module stays disciplined on purpose: broad archetypes, concise adjustments, and clear baseline-versus-exploit labels without pretending every read is precise."
          aside={
            <>
              <StatusPill tone="success">Session saved</StatusPill>
              <StatusPill>Exploit practice logged</StatusPill>
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
                ? `${moduleProgress.correctCount} correct answers stored for the player types module.`
                : `${scopedProgress.correctCount} correct answers stored at ${difficultyLabels[selectedDifficulty].toLowerCase()} level.`
            }
            tone="accent"
          />
          <ProgressSummaryCard
            title="Completed"
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? "Exploit-practice progress was saved to the signed-in account."
                : "Progress remains local and lightweight for the MVP."
            }
            tone="gold"
          />
        </div>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            How this module stays grounded
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- Broad archetypes are treated as training shortcuts, not mind-reading.</li>
            <li>- Feedback makes baseline versus exploit language explicit.</li>
            <li>- Advanced live-read systems and population analytics remain deferred.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={session.handleRestartSession}
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Run another player types session
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
            ? "No player-type questions are available right now."
            : `No ${difficultyLabels[selectedDifficulty].toLowerCase()} player-type questions are seeded yet. Try another difficulty level.`}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Player Types Quiz"
        title="Practice practical opponent adjustments without fake precision"
        description="Read the archetype, compare the baseline with the exploit, and choose the clearest adjustment for the exact tendency the scenario is labeling."
        aside={
          <>
            <StatusPill tone="success">Interactive module</StatusPill>
            <StatusPill>{difficultyLabels[session.currentScenario.difficulty]}</StatusPill>
            <StatusPill>Baseline vs exploit</StatusPill>
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
            answerTitle="Choose the best adjustment"
            answerDescription="Stay practical: identify the broad tendency first, then choose the simplest exploit or baseline answer that matches the read. The goal is disciplined adjustment, not guessing wildly."
            feedbackPlaceholder="Submit your answer to reveal the recommended adjustment, the short explanation blocks, and any exploit assumptions attached to the player type."
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
