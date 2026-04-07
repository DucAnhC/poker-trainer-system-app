import Link from "next/link";

import { getContentPackRoute } from "@/data/content-packs";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getConceptLabel } from "@/lib/training/concepts";
import { moduleLabels } from "@/lib/poker/labels";
import type { RetryQueueItem } from "@/types/training";

type RetryQueueCardProps = {
  retryQueue: RetryQueueItem[];
};

export function RetryQueueCard({ retryQueue }: RetryQueueCardProps) {
  const visibleItems = retryQueue.slice(0, 4);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Weak concept review
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Suggested retries
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          This is the lightweight repetition layer. Scenarios with repeat misses
          or strong leak-theme overlap rise to the front so they can resurface
          sooner.
        </p>
      </div>

      {visibleItems.length > 0 ? (
        <div className="space-y-3">
          {visibleItems.map((retryItem) => (
            <div
              key={retryItem.scenarioId}
              className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="gold">Suggested retry</StatusPill>
                <StatusPill>{moduleLabels[retryItem.moduleId]}</StatusPill>
                <DifficultyBadge difficulty={retryItem.difficulty} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {retryItem.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {retryItem.reason}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {retryItem.supportingLeakTagIds.length > 0 ? (
                  retryItem.supportingLeakTagIds.slice(0, 2).map((leakTagId) => (
                    <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
                  ))
                ) : (
                  retryItem.supportingConceptTags
                    .slice(0, 2)
                    .map((conceptTag) => (
                      <StatusPill key={conceptTag}>
                        {getConceptLabel(conceptTag)}
                      </StatusPill>
                    ))
                )}
              </div>
              <Link
                href={getContentPackRoute(retryItem.contentPackId, {
                  difficulty: retryItem.difficulty,
                })}
                className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                Open {moduleLabels[retryItem.moduleId]}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/10 p-5 text-sm leading-6 text-muted-foreground">
          No retry queue signal is strong enough yet. A few repeated misses will
          make the review suggestions more useful.
        </div>
      )}
    </SurfaceCard>
  );
}
