"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatDateTimeLabel } from "@/lib/utils";
import { getStudyTimelineEntries } from "@/lib/progress/study-timeline";
import type {
  HandReviewNote,
  PersistenceMode,
  TrainingSessionSummary,
} from "@/types/training";

type StudyTimelineCardProps = {
  sessions: TrainingSessionSummary[];
  notes: HandReviewNote[];
  storageMode: PersistenceMode;
  limit?: number;
};

export function StudyTimelineCard({
  sessions,
  notes,
  storageMode,
  limit = 6,
}: StudyTimelineCardProps) {
  const copy = useUiCopy();
  const timelineEntries = getStudyTimelineEntries({ sessions, notes, limit });

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.studyTimeline.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {copy.studyTimeline.title}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? copy.studyTimeline.descriptionAccount
            : copy.studyTimeline.descriptionLocal}
        </p>
      </div>

      {timelineEntries.length > 0 ? (
        <div className="space-y-3">
          {timelineEntries.map((entry) => (
            <div
              key={entry.id}
              className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={entry.tone}>{entry.badgeLabel}</StatusPill>
                    <StatusPill>{entry.contextLabel}</StatusPill>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {entry.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {formatDateTimeLabel(entry.timestamp)}
                  </p>
                </div>

                <Link
                  href={entry.route}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                >
                  {entry.actionLabel}
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill tone="accent">{entry.metricLabel}</StatusPill>
                {entry.leakTagIds.length > 0 ? (
                  entry.leakTagIds.map((leakTagId) => (
                    <LeakTagBadge key={`${entry.id}-${leakTagId}`} leakTagId={leakTagId} />
                  ))
                ) : (
                  <StatusPill tone="success">
                    {entry.kind === "session"
                      ? copy.studyTimeline.noRepeatLeakTags
                      : copy.studyTimeline.noManualLeakTags}
                  </StatusPill>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? copy.studyTimeline.emptyAccount
            : copy.studyTimeline.emptyLocal}
        </div>
      )}
    </SurfaceCard>
  );
}
