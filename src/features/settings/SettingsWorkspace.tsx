"use client";

import Link from "next/link";

import { PageHeader } from "@/components/trainer/PageHeader";
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
          title="Loading"
          value="..."
          description="Reading current account or local mode."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Reading recent study history."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing account controls and data tools."
        />
        <ProgressSummaryCard
          title="Loading"
          value="..."
          description="Preparing settings and progress management."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Manage account mode, study data, and recent history in one place"
        description="Settings stays intentionally lightweight in Phase 10: clearer account controls, safer local/cloud data tools, readable study history, and deploy-friendly account guidance."
        aside={
          <>
            <StatusPill tone="success">Phase 10 live</StatusPill>
            <StatusPill>
              {storageMode === "account" ? "Cloud-backed mode" : "Local mode"}
            </StatusPill>
            {isRefreshing ? <StatusPill tone="gold">Refreshing</StatusPill> : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <ProgressSummaryCard
          title="Persistence mode"
          value={storageMode === "account" ? "Account" : "Local"}
          description={
            storageMode === "account"
              ? `Signed in as ${userEmail ?? "the current account"}.`
              : "Progress and review notes are still fully usable without signing in."
          }
          tone="accent"
        />
        <ProgressSummaryCard
          title="Total attempts"
          value={`${progressSummary.totalAttempts}`}
          description="Saved quiz answers across the current persistence mode."
          tone="success"
        />
        <ProgressSummaryCard
          title="Overall accuracy"
          value={formatPercent(progressSummary.overallAccuracy)}
          description="A practical study signal, not solver-style analytics."
          tone="gold"
        />
        <ProgressSummaryCard
          title="Last saved activity"
          value={formatDateTimeLabel(snapshotStats.lastActivityAt)}
          description="Most recent persisted session or review update."
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
          <StatusPill tone="danger">Load issue</StatusPill>
          <p className="text-sm leading-6 text-muted-foreground">{loadError}</p>
          <button
            type="button"
            onClick={() => void refreshProgressSummary()}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Retry loading saved data
          </button>
        </SurfaceCard>
      ) : null}

      {!hasAnyStoredActivity ? (
        <SurfaceCard className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Getting started
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              No saved study data yet
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {isAuthenticated
                ? "Your account is ready. Start a module, add a review note, or import local browser data and this settings page will begin showing timeline history and safer data-management context."
                : "You can stay local or sign in later. Start a module or add a review note first, then this page will begin showing saved study history and data controls that matter."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Open dashboard
            </Link>
            <Link
              href="/review"
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Add a review note
            </Link>
            {!isAuthenticated ? (
              <Link
                href="/auth"
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                Sign in later for sync
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
