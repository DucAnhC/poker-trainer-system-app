import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn, formatDateTimeLabel } from "@/lib/utils";
import type { HandReviewNote } from "@/types/training";

type ReviewCardProps = {
  note: HandReviewNote;
  isSelected: boolean;
  onSelect: (noteId: string) => void;
};

export function ReviewCard({ note, isSelected, onSelect }: ReviewCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(note.id)}
      className="w-full text-left"
    >
      <SurfaceCard
        className={cn(
          "space-y-3 border-border/70 p-5 transition hover:border-accent/30",
          isSelected && "border-accent/40 bg-accent/5",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="accent">{note.streetFocus}</StatusPill>
          <StatusPill>{formatDateTimeLabel(note.updatedAt)}</StatusPill>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{note.title}</h3>
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {note.uncertainty}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {note.leakTagIds.length > 0 ? (
            note.leakTagIds.slice(0, 3).map((leakTagId) => (
              <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
            ))
          ) : (
            <StatusPill>No leak tags yet</StatusPill>
          )}
        </div>
      </SurfaceCard>
    </button>
  );
}
