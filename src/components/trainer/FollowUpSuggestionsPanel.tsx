import Link from "next/link";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import type { FollowUpSuggestion } from "@/types/training";

type FollowUpSuggestionsPanelProps = {
  suggestions: FollowUpSuggestion[];
};

function getToneLabel(tone: FollowUpSuggestion["tone"]) {
  if (tone === "review") {
    return "Review next";
  }

  if (tone === "advance") {
    return "Step up";
  }

  return "Related concept";
}

function getToneStyle(tone: FollowUpSuggestion["tone"]) {
  if (tone === "review") {
    return "gold" as const;
  }

  if (tone === "advance") {
    return "success" as const;
  }

  return "accent" as const;
}

export function FollowUpSuggestionsPanel({
  suggestions,
}: FollowUpSuggestionsPanelProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Suggested next study step
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          Keep the concept chain moving
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          These follow-up suggestions are lightweight and rule-based. They connect
          the current spot to a sensible next drill instead of treating every miss
          or correct answer the same way.
        </p>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="rounded-2xl border border-border/70 bg-muted/20 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={getToneStyle(suggestion.tone)}>
                {getToneLabel(suggestion.tone)}
              </StatusPill>
            </div>
            <h4 className="mt-3 text-lg font-semibold text-foreground">
              {suggestion.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {suggestion.reason}
            </p>
            <Link
              href={suggestion.route}
              className="mt-4 inline-flex rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Open pack
            </Link>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
