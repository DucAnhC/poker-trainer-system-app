"use client";

import Link from "next/link";

import { PageHeader } from "@/components/trainer/PageHeader";
import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { ProgressSummaryCard } from "@/components/trainer/ProgressSummaryCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { AccountControlsCard } from "@/features/settings/AccountControlsCard";
import { AccountModeCard } from "@/features/progress/AccountModeCard";
import { LocalDataToolsCard } from "@/features/progress/LocalDataToolsCard";
import { RecentReviewActivityCard } from "@/features/progress/RecentReviewActivityCard";
import { RecentSessionsCard } from "@/features/progress/RecentSessionsCard";
import { StudyAnalyticsCard } from "@/features/progress/StudyAnalyticsCard";
import { StudyTimelineCard } from "@/features/progress/StudyTimelineCard";
import { getHasAnyStoredActivity } from "@/features/progress/dashboard-selectors";
import { usePersistedProgressSummary } from "@/features/progress/usePersistedProgressSummary";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";

export function SettingsWorkspace() {
  const copy = useUiCopy();
  const {
    hasLoaded,
    isAuthenticated,
    isRefreshing,
    loadError,
    progressSummary,
    refreshProgressSummary,
    storageMode,
    userEmail,
    snapshot,
    snapshotStats,
    localBackupStats,
    studyAnalytics,
  } = usePersistedProgressSummary();
  const hasAnyStoredActivity = getHasAnyStoredActivity(progressSummary);

  if (!hasLoaded) {
    return (
      <div className="grid gap-6 lg:grid-cols-4">
        <ProgressSummaryCard
          title={copy.settings.loadingTitle}
          value="..."
          description={copy.settings.loadingDescription}
        />
        <ProgressSummaryCard
          title={copy.settings.loadingTitle}
          value="..."
          description={copy.settings.loadingDescription}
        />
        <ProgressSummaryCard
          title={copy.settings.loadingTitle}
          value="..."
          description={copy.settings.loadingDescription}
        />
        <ProgressSummaryCard
          title={copy.settings.loadingTitle}
          value="..."
          description={copy.settings.loadingDescription}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={copy.settings.eyebrow}
        title={copy.settings.title}
        description={copy.settings.description}
        aside={
          <>
            <StatusPill tone="success">{copy.settings.eyebrow}</StatusPill>
            <StatusPill>
              {storageMode === "account"
                ? copy.settings.cloudMode
                : copy.settings.localMode}
            </StatusPill>
            {isRefreshing ? (
              <StatusPill tone="gold">{copy.settings.refreshing}</StatusPill>
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <ProgressSummaryCard
          title={copy.settings.persistenceMode}
          value={
            storageMode === "account"
              ? copy.settings.accountValue
              : copy.settings.localValue
          }
          description={
            storageMode === "account"
              ? copy.settings.signedInAs(userEmail ?? copy.settings.accountValue)
              : copy.settings.localDescription
          }
          tone="accent"
        />
        <ProgressSummaryCard
          title={copy.settings.totalAttempts}
          value={`${progressSummary.totalAttempts}`}
          description={copy.settings.savedAnswersDescription}
          tone="success"
        />
        <ProgressSummaryCard
          title={copy.settings.overallAccuracy}
          value={formatPercent(progressSummary.overallAccuracy)}
          description={copy.settings.overallAccuracyNote}
          tone="gold"
        />
        <ProgressSummaryCard
          title={copy.settings.lastSavedActivity}
          value={formatDateTimeLabel(snapshotStats.lastActivityAt)}
          description={copy.settings.lastSavedActivityNote}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <AccountModeCard
          storageMode={storageMode}
          userEmail={userEmail}
          snapshotStats={snapshotStats}
          localBackupStats={localBackupStats}
        />
        <AccountControlsCard
          storageMode={storageMode}
          userEmail={userEmail}
          snapshotStats={snapshotStats}
          localBackupStats={localBackupStats}
          isRefreshing={isRefreshing}
          onRefresh={refreshProgressSummary}
        />
      </div>

      {loadError ? (
        <SurfaceCard className="space-y-3 border border-amber-200 bg-amber-50/80">
          <StatusPill tone="danger">{copy.settings.loadIssue}</StatusPill>
          <p className="text-sm leading-6 text-muted-foreground">{loadError}</p>
          <button
            type="button"
            onClick={() => void refreshProgressSummary()}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            {copy.settings.retryLoading}
          </button>
        </SurfaceCard>
      ) : null}

      {!hasAnyStoredActivity ? (
        <SurfaceCard className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
              {copy.settings.gettingStartedEyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              {copy.settings.noDataTitle}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {isAuthenticated
                ? copy.settings.noDataSignedIn
                : copy.settings.noDataSignedOut}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
            >
              {copy.settings.openDashboard}
            </Link>
            <Link
              href="/review"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              {copy.settings.addReview}
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                >
                {copy.settings.signInLater}
              </Link>
            ) : null}
          </div>
        </SurfaceCard>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <StudyTimelineCard
          sessions={progressSummary.recentSessions}
          notes={snapshot.handReviewNotes}
          storageMode={storageMode}
          limit={10}
        />
        <StudyAnalyticsCard analytics={studyAnalytics} storageMode={storageMode} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentSessionsCard
          sessions={progressSummary.recentSessions}
          storageMode={storageMode}
        />
        <RecentReviewActivityCard
          notes={snapshot.handReviewNotes}
          storageMode={storageMode}
        />
      </div>

      <LocalDataToolsCard
        onDataChanged={refreshProgressSummary}
        storageMode={storageMode}
        userEmail={userEmail}
        snapshotStats={snapshotStats}
        localBackupStats={localBackupStats}
      />
    </div>
  );
}
