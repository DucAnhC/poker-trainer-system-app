"use client";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { scenarioCountByContentPack } from "@/data/scenarios";
import { preflopScenarios } from "@/data/scenarios/preflop-scenarios";
import { useTrainerModuleSession } from "@/features/trainer/useTrainerModuleSession";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

import { PreflopDecisionPanel } from "@/features/preflop/PreflopDecisionPanel";
import { PreflopFeedbackPanel } from "@/features/preflop/PreflopFeedbackPanel";
import { PreflopSessionStrip } from "@/features/preflop/PreflopSessionStrip";
import { PreflopTableStatePanel } from "@/features/preflop/PreflopTableStatePanel";
import {
  getPreflopDrillCopy,
  getPreflopUiLanguage,
} from "@/features/preflop/preflop-trainer-copy";

function CompletionStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="min-w-0 rounded-[24px] border border-white/10 bg-black/14 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-100/55">
        {label}
      </p>
      <p className="mt-2 break-words text-3xl font-semibold text-white text-pretty">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300 text-pretty">{note}</p>
    </div>
  );
}

export function PreflopTrainer() {
  const copy = useUiCopy();
  const language = getPreflopUiLanguage(copy.locale);
  const drillCopy = getPreflopDrillCopy(language);
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
      <section className="rounded-[36px] border border-emerald-950/20 bg-[linear-gradient(180deg,rgba(4,24,22,0.98),rgba(8,23,32,0.98))] p-5 text-white shadow-panel sm:p-6">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/75">
            {drillCopy.pageEyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {drillCopy.completionTitle}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300">
            {drillCopy.completionBody}
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <CompletionStat
            label={drillCopy.completionAccuracy}
            value={formatPercent(session.accuracy)}
            note={`${session.correctCount} / ${session.answeredCount}`}
          />
          <CompletionStat
            label={drillCopy.completionCorrect}
            value={`${moduleProgress.correctCount}`}
            note={`${scopedProgress.attempts} ${drillCopy.allTimeAttempts.toLowerCase()}`}
          />
          <CompletionStat
            label={drillCopy.completionSaved}
            value={formatDateTimeLabel(session.completionTimestamp)}
            note={
              session.storageMode === "account"
                ? drillCopy.completionModeAccount
                : drillCopy.completionModeLocal
            }
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={session.handleRestartSession}
            className="rounded-full bg-[linear-gradient(135deg,rgba(34,197,94,0.96),rgba(13,148,136,0.96))] px-5 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:brightness-105"
          >
            {drillCopy.completionRestart}
          </button>
          <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200">
            {activeContentPack.title}
          </span>
        </div>
      </section>
    );
  }

  if (!session.currentScenario) {
    return (
      <section className="rounded-[32px] border border-border/70 bg-surface/90 p-6 shadow-panel">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-strong">
          {drillCopy.pageEyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {drillCopy.emptyTitle}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          {drillCopy.emptyBody}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <PreflopSessionStrip
        language={language}
        activeContentPack={activeContentPack}
        availableContentPacks={availableContentPacks}
        selectedContentPackId={selectedContentPackId}
        onSelectContentPack={setSelectedContentPackId}
        scenarioCountByPackId={scenarioCountByContentPack}
        availableDifficulties={session.availableDifficulties}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
        queueMode={queueMode}
        onSelectQueueMode={setQueueMode}
        answeredCount={session.answeredCount}
        totalQuestions={session.totalQuestions}
        accuracy={session.accuracy}
        attempts={scopedProgress.attempts}
        retryItemCount={session.retryQueueItems.length}
        storageMode={session.storageMode}
        isPersisting={session.isPersisting}
        persistenceError={session.persistenceError}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] xl:items-start">
        <PreflopTableStatePanel
          language={language}
          scenario={session.currentScenario}
          activeContentPack={activeContentPack}
          questionNumber={session.questionNumber}
          totalQuestions={session.totalQuestions}
          retryHint={session.currentRetryHint}
        />

        <PreflopDecisionPanel
          language={language}
          scenario={session.currentScenario}
          selectedActionId={session.selectedActionId}
          answerPhase={session.answerPhase}
          feedback={session.feedback}
          canSubmit={session.canSubmit}
          canAdvance={session.canAdvance}
          hasSubmitted={session.hasSubmitted}
          isLastScenario={session.isLastScenario}
          onSelectAction={session.handleSelectAction}
          onSubmit={session.handleSubmitAnswer}
          onNext={session.handleNextScenario}
          onRestart={session.handleRestartSession}
        />
      </div>

      <PreflopFeedbackPanel
        language={language}
        scenario={session.currentScenario}
        feedback={session.feedback}
      />
    </div>
  );
}
