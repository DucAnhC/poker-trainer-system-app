import Link from "next/link";

import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import type { StudyPathStep } from "@/types/training";

type StudyPathCardProps = {
  studyPath: StudyPathStep[];
};

function getStatusTone(status: StudyPathStep["status"]) {
  if (status === "completed") {
    return "success" as const;
  }

  if (status === "recommended") {
    return "gold" as const;
  }

  if (status === "in-progress") {
    return "accent" as const;
  }

  return "neutral" as const;
}

function getStatusLabel(status: StudyPathStep["status"]) {
  if (status === "up-next") {
    return "Up next";
  }

  if (status === "in-progress") {
    return "In progress";
  }

  if (status === "recommended") {
    return "Recommended";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Planned";
}

export function StudyPathCard({ studyPath }: StudyPathCardProps) {
  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Study path
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Guided pack progression
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          This path is intentionally light and heuristic. It gives you a clean
          order for the core modules, then adapts when a weak area deserves a detour.
        </p>
      </div>

      <div className="space-y-3">
        {studyPath.map((step, index) => (
          <div
            key={step.contentPackId}
            className="space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="accent">Step {index + 1}</StatusPill>
                  <StatusPill tone={getStatusTone(step.status)}>
                    {getStatusLabel(step.status)}
                  </StatusPill>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.reason}
                </p>
              </div>
              <Link
                href={step.route}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
              >
                Open pack
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {step.difficultyFocus.map((difficulty) => (
                <DifficultyBadge key={`${step.contentPackId}-${difficulty}`} difficulty={difficulty} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
