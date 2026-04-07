import Link from "next/link";

import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { trainingModules } from "@/data/training-modules";
import { positionLabels } from "@/lib/poker/labels";
import { getReviewNoteFocusAreas } from "@/lib/review/review-focus";
import { formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";

type ReviewDetailCardProps = {
  note: HandReviewNote | null;
  onDelete: (noteId: string) => void;
  isDeleting?: boolean;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

export function ReviewDetailCard({
  note,
  onDelete,
  isDeleting = false,
}: ReviewDetailCardProps) {
  if (!note) {
    return (
      <SurfaceCard className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Review detail
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Select a saved review
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          The full note will appear here with the structured fields, manual leak
          tags, and the key uncertainty you wanted to review.
        </p>
      </SurfaceCard>
    );
  }

  const reviewFocusAreas = getReviewNoteFocusAreas(note, 2);

  return (
    <SurfaceCard className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="accent">{note.streetFocus}</StatusPill>
            <StatusPill>{formatDateTimeLabel(note.updatedAt)}</StatusPill>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">{note.title}</h2>
        </div>

        <button
          type="button"
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
        >
          {isDeleting ? "Deleting review..." : "Delete review"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailRow label="Hero position" value={note.heroPosition ? positionLabels[note.heroPosition] : null} />
        <DetailRow
          label="Villain position"
          value={note.villainPosition ? positionLabels[note.villainPosition] : null}
        />
        <DetailRow
          label="Effective stack"
          value={
            typeof note.effectiveStackBb === "number"
              ? `${note.effectiveStackBb}bb`
              : null
          }
        />
        <DetailRow label="Board" value={note.board} />
      </div>

      <DetailRow label="Action history" value={note.actionHistorySummary} />
      <DetailRow label="Chosen action" value={note.chosenAction} />
      <DetailRow label="Main uncertainty" value={note.uncertainty} />
      <DetailRow label="Optional note" value={note.note} />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Assigned leak tags
        </p>
        <div className="flex flex-wrap gap-2">
          {note.leakTagIds.length > 0 ? (
            note.leakTagIds.map((leakTagId) => (
              <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
            ))
          ) : (
            <StatusPill>No leak tags assigned</StatusPill>
          )}
        </div>
      </div>

      {reviewFocusAreas.length > 0 ? (
        <div className="space-y-3 rounded-2xl border border-accent/15 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Suggested follow-up study
          </p>
          <div className="space-y-3">
            {reviewFocusAreas.map((focusArea) => {
              const route =
                trainingModules.find((module) => module.id === focusArea.moduleId)
                  ?.route ?? "/dashboard";

              return (
                <div
                  key={focusArea.moduleId}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill tone="gold">{focusArea.heuristicLabel}</StatusPill>
                      <span className="text-sm font-semibold text-foreground">
                        {focusArea.title}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {focusArea.reason}
                    </p>
                  </div>
                  <Link
                    href={route}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
                  >
                    Open module
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
