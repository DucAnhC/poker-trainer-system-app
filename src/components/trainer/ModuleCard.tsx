import Link from "next/link";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { scenarioCountByModule } from "@/data/scenarios";
import type { TrainingModule } from "@/types/training";

type ModuleCardProps = {
  module: TrainingModule;
};

export function ModuleCard({ module }: ModuleCardProps) {
  const scenarioCount = scenarioCountByModule[module.id] ?? 0;
  const isInteractive = module.phaseStatus === "interactive";
  const isHandReview = module.id === "hand-review";

  return (
    <SurfaceCard className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {module.title}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {module.summary}
          </p>
        </div>
        <StatusPill tone={isInteractive ? "success" : "neutral"}>
          {isInteractive ? "Active" : "Scaffolded"}
        </StatusPill>
      </div>

      <div className="flex flex-wrap gap-2">
        {module.sourceTypeFocus.map((sourceType) => (
          <StatusPill key={sourceType}>{sourceType}</StatusPill>
        ))}
      </div>

      <ul className="space-y-2 text-sm text-muted-foreground">
        {module.learningFocus.map((focus) => (
          <li key={focus}>- {focus}</li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/70 pt-4">
        <p className="text-sm text-muted-foreground">
          {isHandReview
            ? "Manual review workflow"
            : `${scenarioCount} sample scenario${scenarioCount === 1 ? "" : "s"}`}
        </p>
        <Link
          href={module.route}
          className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
        >
          {module.ctaLabel ?? (isInteractive ? "Start training" : "Open scaffold")}
        </Link>
      </div>
    </SurfaceCard>
  );
}
