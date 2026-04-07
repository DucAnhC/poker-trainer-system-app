"use client";

import Link from "next/link";

import { useUiCopy } from "@/components/i18n/UiLanguageProvider";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import type { FollowUpSuggestion } from "@/types/training";

type FollowUpSuggestionsPanelProps = {
  suggestions: FollowUpSuggestion[];
};

function getToneLabel(
  tone: FollowUpSuggestion["tone"],
  copy: ReturnType<typeof useUiCopy>,
) {
  if (tone === "review") {
    return copy.trainer.shared.followUpToneReview;
  }

  if (tone === "advance") {
    return copy.trainer.shared.followUpToneAdvance;
  }

  return copy.trainer.shared.followUpToneRelated;
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
  const copy = useUiCopy();

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          {copy.trainer.shared.followUpEyebrow}
        </p>
        <h3 className="text-xl font-semibold text-foreground">
          {copy.trainer.shared.followUpTitle}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {copy.trainer.shared.followUpDescription}
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
                {getToneLabel(suggestion.tone, copy)}
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
              {copy.trainer.shared.openPack}
            </Link>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
