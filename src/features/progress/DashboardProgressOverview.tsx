"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { RecommendationCard } from "@/components/trainer/RecommendationCard";
import { SessionSummaryPanel } from "@/components/trainer/SessionSummaryPanel";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { AccountModeCard } from "@/features/progress/AccountModeCard";
import { LocalDataToolsCard } from "@/features/progress/LocalDataToolsCard";
import { RetryQueueCard } from "@/features/progress/RetryQueueCard";
import { StudyAnalyticsCard } from "@/features/progress/StudyAnalyticsCard";
import { StudyPathCard } from "@/features/progress/StudyPathCard";
import { StudyTimelineCard } from "@/features/progress/StudyTimelineCard";
import { TopLeakThemesCard } from "@/features/progress/TopLeakThemesCard";
import { ModuleProgressCard } from "@/features/progress/ModuleProgressCard";
import {
  type FocusLens,
  focusLensOptions,
  getActiveSessionForModule,
  getFilteredRecommendations,
  getHasAnyStoredActivity,
  getHighlightedModuleIds,
  getLatestSession,
  getLensDescription,
  getLensLabel,
  getModuleRoute,
  getOrderedModules,
} from "@/features/progress/dashboard-selectors";
import { usePersistedProgressSummary } from "@/features/progress/usePersistedProgressSummary";
import { difficultyLabels, moduleLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function DashboardProgressOverview() {
  const {
    hasLoaded,
    isAuthenticated,
    loadError,
    progressSummary,
    refreshProgressSummary,
    isRefreshing,
    storageMode,
    userEmail,
    snapshot,
    snapshotStats,
    localBackupStats,
    studyAnalytics,
  } = usePersistedProgressSummary();
  const [focusLens, setFocusLens] = useState<FocusLens>("all");

  const orderedModules = useMemo(
    () => getOrderedModules(progressSummary, focusLens),
    [focusLens, progressSummary],
  );
  const interactiveTrainingModules = orderedModules.filter(
    (module) => module.phaseStatus === "interactive" && module.id !== "hand-review",
  );
  const latestSession = useMemo(
    () => getLatestSession(progressSummary),
    [progressSummary],
  );
  const filteredRecommendations = useMemo(
    () => getFilteredRecommendations(progressSummary, focusLens),
    [focusLens, progressSummary],
  );
  const highlightedModuleIds = useMemo(
    () => getHighlightedModuleIds(focusLens, progressSummary),
    [focusLens, progressSummary],
  );
  const featuredWeakestModule = progressSummary.weakestModules[0] ?? null;
  const featuredWeakDifficultyArea = progressSummary.weakDifficultyAreas[0] ?? null;
  const featuredLeakTag = progressSummary.leakTagStats[0] ?? null;
  const featuredWeakSession = progressSummary.recentWeakSessions[0] ?? null;
  const hasAnyStoredActivity = getHasAnyStoredActivity(progressSummary);

  if (!hasLoaded) {
    return (
      <div className="grid gap-6 lg:grid-cols-4">
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Reading persisted training progress."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing session history and weakness signals."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing review-note totals."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing next-step guidance."
        />
      </div>
    );
  }

  if (!hasAnyStoredActivity) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
          <AccountModeCard
            storageMode={storageMode}
            userEmail={userEmail}
            snapshotStats={snapshotStats}
            localBackupStats={localBackupStats}
          />
          <LocalDataToolsCard
            onDataChanged={refreshProgressSummary}
            storageMode={storageMode}
            userEmail={userEmail}
            snapshotStats={snapshotStats}
            localBackupStats={localBackupStats}
          />
        </div>

        <SurfaceCard className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {isAuthenticated ? "Account progress" : "Local progress"}
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              No saved training or review activity yet
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {isAuthenticated
                ? "Start with a training module, create a review note, or import existing browser data. The dashboard will then surface session history, weakness themes, and suggested next steps from the account-backed snapshot."
                : "Start with a training module or create a manual review note. The dashboard will then begin surfacing session history, weakness themes, and suggested next steps."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {interactiveTrainingModules.map((module) => (
              <Link
                key={module.id}
                href={module.route}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                Start {module.title}
              </Link>
            ))}
            <Link
              href="/review"
              className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Open Hand Review
            </Link>
            <Link
              href="/settings"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Open settings
            </Link>
          </div>
        </SurfaceCard>

        {loadError ? (
          <SurfaceCard className="space-y-3 border border-amber-200 bg-amber-50/80">
            <StatusPill tone="danger">Load issue</StatusPill>
            <p className="text-sm leading-6 text-muted-foreground">
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => void refreshProgressSummary()}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Retry loading saved data
            </button>
          </SurfaceCard>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
        <ProgressSummaryCard
          title="Total attempts"
          value={`${progressSummary.totalAttempts}`}
          description={
            storageMode === "account"
              ? "Every submitted quiz answer is saved to the signed-in account."
              : "Every submitted quiz answer is stored locally in this browser."
          }
          tone="accent"
        />
        <ProgressSummaryCard
          title="Total correct"
          value={`${progressSummary.correctCount}`}
          description="Correct answers across the active training modules."
          tone="success"
        />
        <ProgressSummaryCard
          title="Overall accuracy"
          value={formatPercent(progressSummary.overallAccuracy)}
          description="A lightweight study signal, not solver-grade analytics."
          tone="gold"
        />
        <ProgressSummaryCard
          title="Saved reviews"
          value={`${progressSummary.handReviewSummary.noteCount}`}
          description={
            storageMode === "account"
              ? `Structured hand review notes saved for ${userEmail ?? "this account"}.`
              : "Structured hand review notes stored locally."
          }
        />
        <ProgressSummaryCard
          title="Last completed session"
          value={formatDateTimeLabel(progressSummary.lastCompletedAt)}
          description="Most recent fully completed training run."
        />
      </div>

      {loadError ? (
        <SurfaceCard className="space-y-3 border border-amber-200 bg-amber-50/80">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="danger">Load issue</StatusPill>
            {isRefreshing ? <StatusPill tone="gold">Refreshing</StatusPill> : null}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {loadError} The dashboard is still showing the most recent data that loaded successfully.
          </p>
          <button
            type="button"
            onClick={() => void refreshProgressSummary()}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Retry loading saved data
          </button>
        </SurfaceCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <AccountModeCard
          storageMode={storageMode}
          userEmail={userEmail}
          snapshotStats={snapshotStats}
          localBackupStats={localBackupStats}
        />
        <StudyAnalyticsCard
          analytics={studyAnalytics}
          storageMode={storageMode}
        />
      </div>

      <SurfaceCard className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Resume training
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Fast entry points back into the study routine
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {isAuthenticated
              ? "Signed-in mode keeps recent sessions, review notes, and recommendations together so the next study block is easier to resume."
              : "Local mode still keeps recent sessions, review notes, and recommendations together. Sign in whenever you want the same flow to follow your account."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {interactiveTrainingModules.map((module) => {
            const activeSession = getActiveSessionForModule(
              progressSummary,
              module.id,
            );

            return (
              <Link
                key={module.id}
                href={module.route}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                {activeSession ? `Resume ${module.title}` : `Open ${module.title}`}
              </Link>
            );
          })}
          {!isAuthenticated ? (
            <Link
              href="/auth"
              className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Sign in for cloud sync
            </Link>
          ) : null}
          <Link
            href="/review"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Open Hand Review
          </Link>
          <Link
            href="/settings"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Open settings
          </Link>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
        <StudyTimelineCard
          sessions={progressSummary.recentSessions}
          notes={snapshot.handReviewNotes}
          storageMode={storageMode}
          limit={6}
        />
        <div className="space-y-6">
          <LocalDataToolsCard
            onDataChanged={refreshProgressSummary}
            storageMode={storageMode}
            userEmail={userEmail}
            snapshotStats={snapshotStats}
            localBackupStats={localBackupStats}
          />
          <SurfaceCard className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="accent">Account tools</StatusPill>
              {isRefreshing ? <StatusPill tone="gold">Refreshing</StatusPill> : null}
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Use the settings page for the full account, timeline, and progress-management view. The dashboard keeps the most important study actions close at hand.
            </p>
            <Link
              href="/settings"
              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Open settings
            </Link>
          </SurfaceCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <StudyPathCard studyPath={progressSummary.studyPath} />
        <RetryQueueCard retryQueue={progressSummary.retryQueue} />
      </div>

      {latestSession ? (
        <SessionSummaryPanel
          title="Most recent saved session"
          description={
            isAuthenticated
              ? "Sessions are stored as account-backed module runs. Active runs can appear before completion, while completed runs keep their own summary and leak signals."
              : "Sessions are stored locally as module runs. Active runs can appear before completion, while completed runs keep their own summary and leak signals."
          }
          sessionSummary={latestSession}
        />
      ) : null}

      <SurfaceCard className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Focus lens
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            Shape the dashboard around the current weak spot
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            These filters do not change the underlying data. They simply
            reorder and narrow the guidance so you can study by weakness, leak
            theme, or recent mistakes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {focusLensOptions.map((lens) => (
            <button
              key={lens}
              type="button"
              onClick={() => setFocusLens(lens)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                focusLens === lens
                  ? "border-accent/30 bg-accent/10 text-accent-strong"
                  : "border-border bg-white text-foreground hover:border-accent/40 hover:text-accent-strong"
              }`}
            >
              {getLensLabel(lens)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusPill tone="accent">{getLensLabel(focusLens)}</StatusPill>
          <p className="text-sm leading-6 text-muted-foreground">
            {getLensDescription(focusLens)}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Weakest module
            </p>
            {featuredWeakestModule ? (
              <div className="mt-3 space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {moduleLabels[featuredWeakestModule.moduleId]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="gold">
                    {formatPercent(featuredWeakestModule.accuracy)} accuracy
                  </StatusPill>
                  <StatusPill>{featuredWeakestModule.attempts} attempts</StatusPill>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No weak-module signal yet. A few attempts will make this more useful.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Weakest level
            </p>
            {featuredWeakDifficultyArea ? (
              <div className="mt-3 space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {moduleLabels[featuredWeakDifficultyArea.moduleId]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <DifficultyBadge difficulty={featuredWeakDifficultyArea.difficulty} />
                  <StatusPill tone="gold">
                    {formatPercent(featuredWeakDifficultyArea.accuracy)} accuracy
                  </StatusPill>
                  <StatusPill>
                    {featuredWeakDifficultyArea.attempts} attempts
                  </StatusPill>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {difficultyLabels[
                    featuredWeakDifficultyArea.difficulty
                  ]} spots are the weakest saved layer right now, so the adaptive
                  flow will tend to steer that level forward.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No difficulty-specific weakness signal has formed yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Most common leak
            </p>
            {featuredLeakTag ? (
              <div className="mt-3 space-y-3">
                <LeakTagBadge
                  leakTagId={featuredLeakTag.leakTagId}
                  count={featuredLeakTag.totalCount}
                />
                <p className="text-sm leading-6 text-muted-foreground">
                  This is a heuristic pattern built from missed training spots plus
                  manually tagged reviews.
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No repeat leak tag has surfaced strongly enough yet.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Recent weak session
            </p>
            {featuredWeakSession ? (
              <div className="mt-3 space-y-2">
                <p className="text-lg font-semibold text-foreground">
                  {moduleLabels[featuredWeakSession.moduleId]}
                </p>
                <div className="flex flex-wrap gap-2">
                  <StatusPill tone="gold">
                    {formatPercent(featuredWeakSession.accuracy)} accuracy
                  </StatusPill>
                  <StatusPill>
                    {featuredWeakSession.attemptedCount} attempted
                  </StatusPill>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {featuredWeakSession.weaknessNotes[0] ??
                    "A recent session showed enough misses to revisit this module."}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                No recent weak session stands out yet.
              </p>
            )}
          </div>
        </div>
      </SurfaceCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <TopLeakThemesCard leakTagStats={progressSummary.leakTagStats} />

        <SurfaceCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Suggested focus
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              Transparent next steps
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              These recommendations are rule-based heuristics driven by local
              accuracy, leak-tag patterns, review activity, and recent weak
              sessions. They are training guidance, not absolute truth.
            </p>
          </div>

          {filteredRecommendations.length > 0 ? (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.moduleId}
                  recommendation={recommendation}
                  route={getModuleRoute(recommendation.moduleId)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
              This focus lens does not have a strong recommendation signal yet.
              Switch back to the full view or log a few more attempts.
            </div>
          )}
        </SurfaceCard>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Module status
          </p>
          <StatusPill tone="accent">{getLensLabel(focusLens)}</StatusPill>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Active modules and study utilities
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {orderedModules.map((module) => (
          <ModuleProgressCard
            key={module.id}
            module={module}
            progressSummary={progressSummary}
            activeSession={getActiveSessionForModule(progressSummary, module.id)}
            isHighlighted={
              focusLens !== "all" && highlightedModuleIds.has(module.id)
            }
          />
        ))}
      </div>
    </div>
  );
}
