"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { PageHeader } from "@/components/trainer/PageHeader";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { ScenarioCard } from "@/components/trainer/ScenarioCard";
import { TrainerCompletionCard } from "@/components/trainer/TrainerCompletionCard";
import { TrainerInteractionPanel } from "@/components/trainer/TrainerInteractionPanel";
import { TrainerSessionSetupCard } from "@/components/trainer/TrainerSessionSetupCard";
import { TrainerStatsStrip } from "@/components/trainer/TrainerStatsStrip";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { playerTypeScenarios } from "@/data/scenarios/player-type-scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function PlayerTypesQuiz() {
  const copy = useUiCopy();
  const moduleCopy = copy.trainer.modules["player-types"];
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
      <div className="space-y-6">
        <PageHeader
          eyebrow={moduleCopy.eyebrow}
          title={moduleCopy.completionTitle}
          description={moduleCopy.completionDescription}
          aside={
            <>
              <StatusPill tone="success">{copy.trainer.shared.sessionSaved}</StatusPill>
              <StatusPill>{moduleCopy.statusPill}</StatusPill>
            </>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <ProgressSummaryCard
            title={copy.trainer.shared.sessionAccuracy}
            value={formatPercent(session.accuracy)}
            description={`${session.correctCount} / ${session.answeredCount}`}
            tone="success"
          />
          <ProgressSummaryCard
            title={copy.trainer.shared.allTimeAttempts}
            value={`${scopedProgress.attempts}`}
            description={copy.trainer.shared.correctAnswers(moduleProgress.correctCount)}
            tone="accent"
          />
          <ProgressSummaryCard
            title={copy.trainer.shared.completedLabel}
            value={formatDateTimeLabel(session.completionTimestamp)}
            description={
              session.storageMode === "account"
                ? moduleCopy.completionStoredAccount
                : moduleCopy.completionStoredLocal
            }
            tone="gold"
          />
        </div>

        <TrainerCompletionCard
          title={moduleCopy.recapTitle}
          bullets={moduleCopy.recapBullets}
          restartLabel={moduleCopy.restartButton}
          onRestart={session.handleRestartSession}
        />
      </div>
    );
  }

  if (!session.currentScenario) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted-foreground">
          {selectedDifficulty === "all"
            ? moduleCopy.emptyAny
            : moduleCopy.emptyByDifficulty(
                copy.trainer.difficultyLabels[selectedDifficulty],
              )}
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={moduleCopy.eyebrow}
        title={moduleCopy.activeTitle}
        description={moduleCopy.activeDescription}
        aside={
          <>
            <StatusPill tone="success">{copy.trainer.shared.interactiveModule}</StatusPill>
            <StatusPill>
              {copy.trainer.difficultyLabels[session.currentScenario.difficulty]}
            </StatusPill>
            <StatusPill tone="gold">{moduleCopy.statusPill}</StatusPill>
          </>
        }
      />

      <TrainerStatsStrip
        answeredCount={session.answeredCount}
        totalQuestions={session.totalQuestions}
        accuracy={session.accuracy}
        attempts={scopedProgress.attempts}
        lastCompletedAt={scopedProgress.lastCompletedAt}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.82fr)]">
        <div className="space-y-5">
          <ScenarioCard
            scenario={session.currentScenario}
            questionNumber={session.questionNumber}
            totalQuestions={session.totalQuestions}
            retryHint={session.currentRetryHint}
          />

          <TrainerInteractionPanel
            scenario={session.currentScenario}
            feedback={session.feedback}
            progressSummary={session.overallProgressSummary}
            selectedActionId={session.selectedActionId}
            onSelectAction={session.handleSelectAction}
            hasSubmitted={session.hasSubmitted}
            answerTitle={moduleCopy.answerTitle}
            answerDescription={moduleCopy.answerDescription}
            feedbackPlaceholder={moduleCopy.feedbackPlaceholder}
            canSubmit={session.canSubmit}
            isLastScenario={session.isLastScenario}
            onSubmit={session.handleSubmitAnswer}
            onNext={session.handleNextScenario}
            onRestart={session.handleRestartSession}
          />
        </div>

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
      </div>
    </div>
  );
}
