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
import { boardTextureScenarios } from "@/data/scenarios/board-texture-scenarios";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function BoardTextureQuiz() {
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
  } = useTrainerModuleSession("board-texture", boardTextureScenarios);

  if (session.isComplete) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Board Texture Quiz"
          title="Board-reading session complete"
          description="This module keeps the focus on practical texture recognition: identify the board, understand the broad takeaway, and move on without pretending the app solves the whole postflop tree."
          aside={
            <>
              <StatusPill tone="success">Session saved</StatusPill>
              <StatusPill>Texture progress logged</StatusPill>
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
                ? `${moduleProgress.correctCount} correct answers stored for the board texture module.`
                : `${scopedProgress.correctCount} correct answers stored at ${difficultyLabels[selectedDifficulty].toLowerCase()} level.`
            }
            tone="accent"
          />
          <ProgressSummaryCard
            title="Completed"
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? "Board-texture progress was saved to the signed-in account."
                : "Local progress survives refresh without adding backend scope."
            }
            tone="gold"
          />
        </div>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            What this module is teaching
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- Dry versus dynamic recognition is now interactive.</li>
            <li>- The feedback stays range-aware and practical instead of solver-heavy.</li>
            <li>- Full multi-street postflop trees are still intentionally deferred.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={session.handleRestartSession}
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Run another board texture session
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
            ? "No board texture questions are available right now."
            : `No ${difficultyLabels[selectedDifficulty].toLowerCase()} board texture questions are seeded yet. Try another difficulty level.`}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Board Texture Quiz"
        title="Practice board reading with clear, practical texture takeaways"
        description="Each spot keeps the postflop lesson intentionally narrow: identify what kind of board this is, decide what that means for broad strategy, and review the explanation without drifting into a full solver tree."
        aside={
          <>
            <StatusPill tone="success">Interactive module</StatusPill>
            <StatusPill>{difficultyLabels[session.currentScenario.difficulty]}</StatusPill>
            <StatusPill>Postflop concept focus</StatusPill>
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
            answerTitle="Choose the best takeaway"
            answerDescription="Focus on the broad training message: how coordinated or static the board is, whose range connects more naturally, and whether c-betting becomes more comfortable or more cautious."
            feedbackPlaceholder="Submit an answer to reveal the recommended classification, the short rationale blocks, and any training assumptions attached to the board."
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
