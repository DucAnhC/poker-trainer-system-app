import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import Link from "next/link";

import { getContentPackRoute } from "@/data/content-packs";
import { LeakTagBadge } from "@/components/ui/LeakTagBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getConceptLabel } from "@/lib/training/concepts";
import { moduleLabels } from "@/lib/poker/labels";
import type { RecommendedFocusArea } from "@/types/training";

type RecommendationCardProps = {
  recommendation: RecommendedFocusArea;
  route: string;
};

export function RecommendationCard({
  recommendation,
  route,
}: RecommendationCardProps) {
  const targetRoute =
    recommendation.contentPackId
      ? getContentPackRoute(recommendation.contentPackId, {
          difficulty: recommendation.difficulty ?? null,
        })
      : route;

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="gold">Suggested focus</StatusPill>
          <StatusPill>{recommendation.heuristicLabel}</StatusPill>
          {recommendation.difficulty ? (
            <DifficultyBadge difficulty={recommendation.difficulty} />
          ) : null}
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {recommendation.title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {recommendation.reason}
        </p>
      </div>

      {recommendation.supportingLeakTagIds.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {recommendation.supportingLeakTagIds.map((leakTagId) => (
            <LeakTagBadge key={leakTagId} leakTagId={leakTagId} />
          ))}
        </div>
      ) : null}

      {recommendation.supportingConceptTags?.length ? (
        <div className="flex flex-wrap gap-2">
          {recommendation.supportingConceptTags.slice(0, 3).map((conceptTag) => (
            <StatusPill key={`${recommendation.moduleId}-${conceptTag}`}>
              {getConceptLabel(conceptTag)}
            </StatusPill>
          ))}
        </div>
      ) : null}

      <Link
        href={targetRoute}
        className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
      >
        Open {recommendation.title ?? moduleLabels[recommendation.moduleId]}
      </Link>
    </SurfaceCard>
  );
}
