"use client";

import Link from "next/link";

import { PageHeader } from "@/components/trainer/PageHeader";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { ScenarioCard } from "@/components/trainer/ScenarioCard";
import { SessionSummaryPanel } from "@/components/trainer/SessionSummaryPanel";
import { TrainerInteractionPanel } from "@/components/trainer/TrainerInteractionPanel";
import { TrainerSessionSetupCard } from "@/components/trainer/TrainerSessionSetupCard";
import { TrainerControls } from "@/components/trainer/TrainerControls";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { postflopScenarios } from "@/data/scenarios/postflop-scenarios";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { difficultyLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function PostflopTrainer() {
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
  } = useTrainerModuleSession("postflop", postflopScenarios);

  if (session.isComplete) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Postflop Trainer"
          title="Postflop session complete"
          description="The lightweight postflop trainer stays practical: common flop, turn, and river decisions with clearly labeled assumptions, difficulty-aware study flow, and synced study history rather than a full solver tree."
          aside={
            <>
              <StatusPill tone="success">Session saved</StatusPill>
              <StatusPill>Postflop progress logged</StatusPill>
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
                ? `${moduleProgress.correctCount} correct answers stored for the postflop module.`
                : `${scopedProgress.correctCount} correct answers stored at ${difficultyLabels[selectedDifficulty].toLowerCase()} level.`
            }
            tone="accent"
          />
          <ProgressSummaryCard
            title="Completed"
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? "Postflop progress was saved to the signed-in account."
                : "Local progress survives refresh without backend or account scope."
            }
            tone="gold"
          />
        </div>

        <SessionSummaryPanel
          title="Latest postflop session"
          description="This summary stays deliberately lightweight: one completed run, its top leak themes, and a quick read on whether the main problems were overly passive lines, poor pot control, or board-reading issues."
          sessionSummary={session.currentSessionSummary}
        />

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            What stayed in scope
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- Postflop spots stay single-opponent, mock-data-first, and explanation-led.</li>
            <li>- Feedback uses reusable answer, reasoning, alternative-line, and mistake-pattern sections.</li>
            <li>- Difficulty filters and adaptive retries surface weak concepts without pretending to be a full curriculum engine.</li>
            <li>- Full solver trees, balanced frequencies, and deeper branching remain intentionally deferred.</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={session.handleRestartSession}
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Run another postflop session
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
            ? "No postflop scenarios are available right now."
            : `No ${difficultyLabels[selectedDifficulty].toLowerCase()} postflop scenarios are seeded yet. Try another difficulty level.`}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Postflop Trainer"
        title="Practice simple flop, turn, and river decisions with a lightweight postflop module"
        description="These spots stay intentionally teachable: one clear decision, enough context to reason about board texture and ranges, and concise feedback that explains why betting, checking, folding, or barreling makes sense."
        aside={
          <>
            <StatusPill tone="success">Interactive module</StatusPill>
            <StatusPill>{difficultyLabels[session.currentScenario.difficulty]}</StatusPill>
            <StatusPill>Adaptive study flow</StatusPill>
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
            answerTitle="Choose the cleanest line"
            answerDescription="Focus on the purpose of the action. Ask whether betting, checking, raising, or folding best fits the ranges, the board, and any player tendency the scenario is labeling."
            feedbackPlaceholder="Submit an answer to reveal the structured explanation: answer summary, core reasoning, weaker alternatives, and any leak tags the wrong line would reinforce."
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
