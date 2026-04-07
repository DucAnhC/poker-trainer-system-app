import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { moduleLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";
import type { TrainingSessionSummary } from "@/types/training";

type SessionSummaryPanelProps = {
  title: string;
  description: string;
  sessionSummary: TrainingSessionSummary;
};

export function SessionSummaryPanel({
  title,
  description,
  sessionSummary,
}: SessionSummaryPanelProps) {
  return (
    <SurfaceCard className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Session summary
        </p>
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Attempted
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {sessionSummary.attemptedCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Correct
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {sessionSummary.correctCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Accuracy
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {formatPercent(sessionSummary.accuracy)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Modules used
        </p>
        <div className="flex flex-wrap gap-2">
          {sessionSummary.modulesUsed.map((moduleId) => (
            <StatusPill key={moduleId} tone="accent">
              {moduleLabels[moduleId]}
            </StatusPill>
          ))}
          <StatusPill
            tone={sessionSummary.status === "completed" ? "success" : "gold"}
          >
            {sessionSummary.status === "completed" ? "Completed" : "Active"}
          </StatusPill>
          <StatusPill>
            {formatDateTimeLabel(
              sessionSummary.status === "completed"
                ? sessionSummary.completedAt
                : sessionSummary.lastActivityAt,
            )}
          </StatusPill>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Most common leak tags triggered
        </p>
        <div className="flex flex-wrap gap-2">
          {sessionSummary.topLeakTagIds.length > 0 ? (
            sessionSummary.topLeakTagIds.map((leakTagId) => (
              <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
            ))
          ) : (
            <StatusPill tone="success">No repeat leak tags surfaced</StatusPill>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Strengths
          </p>
          <ul className="space-y-2 text-sm leading-6 text-emerald-900">
            {sessionSummary.strengthNotes.length > 0 ? (
              sessionSummary.strengthNotes.map((note) => <li key={note}>- {note}</li>)
            ) : (
              <li>- You completed a structured training run and saved it locally.</li>
            )}
          </ul>
        </div>

        <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
            Weaknesses
          </p>
          <ul className="space-y-2 text-sm leading-6 text-amber-950">
            {sessionSummary.weaknessNotes.length > 0 ? (
              sessionSummary.weaknessNotes.map((note) => <li key={note}>- {note}</li>)
            ) : (
              <li>- No strong repeat weakness theme surfaced in this session yet.</li>
            )}
          </ul>
        </div>
      </div>
    </SurfaceCard>
  );
}
