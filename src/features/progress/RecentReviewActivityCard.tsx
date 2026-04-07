import Link from "next/link";

import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getRecentReviewNotes } from "@/lib/persistence/snapshot-insights";
import { formatDateTimeLabel } from "@/lib/utils";
import type { PersistenceMode, HandReviewNote } from "@/types/training";

type RecentReviewActivityCardProps = {
  notes: HandReviewNote[];
  storageMode: PersistenceMode;
};

export function RecentReviewActivityCard({
  notes,
  storageMode,
}: RecentReviewActivityCardProps) {
  const recentNotes = getRecentReviewNotes(notes);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Recent review activity
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Structured note history
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "Saved review notes now travel with the signed-in account, so confusing spots and leak tags stay visible alongside recent training."
            : "Review notes stay local in this browser until you choose to sign in. They still feed the same leak tags and next-step guidance."}
        </p>
      </div>

      {recentNotes.length > 0 ? (
        <div className="space-y-3">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-border/70 bg-muted/20 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {note.title}
                    </h3>
                    <StatusPill>{note.streetFocus}</StatusPill>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Updated {formatDateTimeLabel(note.updatedAt)}
                  </p>
                </div>

                <Link
                  href="/review"
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                >
                  Open review
                </Link>
              </div>

              {note.leakTagIds.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.leakTagIds.slice(0, 2).map((leakTagId) => (
                    <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  No manual leak tags were assigned to this review note yet.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "No account-backed review notes are saved yet. Add one confusing spot from a training session and it will appear here."
            : "No local review notes are saved yet. Add one confusing spot and it will appear here with its leak tags."}
        </div>
      )}
    </SurfaceCard>
  );
}
