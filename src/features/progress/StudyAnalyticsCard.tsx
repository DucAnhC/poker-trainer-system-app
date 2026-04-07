import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDateTimeLabel } from "@/lib/utils";
import type { StudyAnalyticsSummary } from "@/lib/persistence/snapshot-insights";
import type { PersistenceMode } from "@/types/training";

type StudyAnalyticsCardProps = {
  analytics: StudyAnalyticsSummary;
  storageMode: PersistenceMode;
};

export function StudyAnalyticsCard({
  analytics,
  storageMode,
}: StudyAnalyticsCardProps) {
  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Study analytics
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Lightweight account-friendly trends
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "These are simple account-backed study signals designed to help with review and next-step decisions, not heavy analytics."
            : "These local study signals help you see recent momentum without turning the dashboard into an analytics project."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Attempts in 7 days
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {analytics.attemptsLast7Days}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Completed sessions in 30 days
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {analytics.completedSessionsLast30Days}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Review notes in 30 days
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {analytics.reviewNotesLast30Days}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Active study days in 14 days
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {analytics.activeStudyDaysLast14Days}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone="accent">
          {analytics.activeModuleCount} modules touched
        </StatusPill>
        <StatusPill>
          Last review:{" "}
          {analytics.lastReviewUpdatedAt
            ? formatDateTimeLabel(analytics.lastReviewUpdatedAt)
            : "No recent review yet"}
        </StatusPill>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Last saved training activity:{" "}
        {analytics.lastTrainingActivityAt
          ? formatDateTimeLabel(analytics.lastTrainingActivityAt)
          : "No saved training yet"}
      </p>
    </SurfaceCard>
  );
}
