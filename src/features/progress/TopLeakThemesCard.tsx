import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import type { LeakTagStat } from "@/types/training";

type TopLeakThemesCardProps = {
  leakTagStats: LeakTagStat[];
};

export function TopLeakThemesCard({ leakTagStats }: TopLeakThemesCardProps) {
  const topLeakTags = leakTagStats.slice(0, 4);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Leak themes
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Recent repeat leak tags
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          These counts combine wrong-answer tags from training with manually
          assigned review tags. They are heuristic signals, not perfect diagnoses.
        </p>
      </div>

      {topLeakTags.length > 0 ? (
        <div className="space-y-3">
          {topLeakTags.map((leakTagStat) => (
            <div
              key={leakTagStat.leakTagId}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
            >
              <LeakTagBadge
                leakTagId={leakTagStat.leakTagId}
                count={leakTagStat.totalCount}
              />
              <div className="flex flex-wrap gap-2">
                <StatusPill>{leakTagStat.trainingCount} training</StatusPill>
                <StatusPill tone="gold">{leakTagStat.reviewCount} review</StatusPill>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
          No leak tags have been recorded yet. Once you miss a few spots or tag a
          review note, this card will start showing the recurring themes.
        </div>
      )}
    </SurfaceCard>
  );
}
