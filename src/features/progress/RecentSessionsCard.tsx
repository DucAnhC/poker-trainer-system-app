import Link from "next/link";

import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { trainingModules } from "@/data/training-modules";
import { moduleLabels } from "@/lib/poker/labels";
import { formatDateTimeLabel, formatPercent } from "@/lib/utils";
import type { TrainingSessionSummary } from "@/types/training";

type RecentSessionsCardProps = {
  sessions: TrainingSessionSummary[];
  storageMode?: "local" | "account";
};

function getModuleRoute(moduleId: TrainingSessionSummary["moduleId"]) {
  return trainingModules.find((module) => module.id === moduleId)?.route ?? "/dashboard";
}

export function RecentSessionsCard({
  sessions,
  storageMode = "local",
}: RecentSessionsCardProps) {
  const visibleSessions = sessions.slice(0, 5);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Recent activity
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Session history
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "Each session is one module run stored for the signed-in account. Active runs stay visible so you can resume the study block later."
            : "Each session is one module run stored locally in this browser. Active runs stay visible so you can resume the study block later."}
        </p>
      </div>

      {visibleSessions.length > 0 ? (
        <div className="space-y-3">
          {visibleSessions.map((session) => (
            <div
              key={session.sessionId}
              className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {moduleLabels[session.moduleId]}
                    </h3>
                    <StatusPill
                      tone={session.status === "completed" ? "success" : "gold"}
                    >
                      {session.status === "completed" ? "Completed" : "Active"}
                    </StatusPill>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Last activity: {formatDateTimeLabel(session.lastActivityAt)}
                  </p>
                </div>

                <Link
                  href={getModuleRoute(session.moduleId)}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                >
                  {session.status === "active" ? "Resume module" : "Open module"}
                </Link>
              </div>

              <div className="flex flex-wrap gap-2">
                <StatusPill>{session.attemptedCount} attempted</StatusPill>
                <StatusPill tone="success">{session.correctCount} correct</StatusPill>
                <StatusPill tone="accent">
                  {formatPercent(session.accuracy)} accuracy
                </StatusPill>
              </div>

              <div className="flex flex-wrap gap-2">
                {session.topLeakTagIds.length > 0 ? (
                  session.topLeakTagIds.slice(0, 2).map((leakTagId) => (
                    <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
                  ))
                ) : (
                  <StatusPill tone="success">
                    No repeat leak tags surfaced
                  </StatusPill>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "No account-backed training sessions have been saved yet. Finish a module run and the signed-in dashboard will show it here."
            : "No local training sessions have been saved yet. Start a module and the dashboard will show your recent activity here."}
        </div>
      )}
    </SurfaceCard>
  );
}
