import Link from "next/link";

import { ModuleCard } from "@/components/trainer/ModuleCard";
import { PageHeader } from "@/components/trainer/PageHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { trainingModules } from "@/data/training-modules";
import {
  dashboardChecklist,
  dashboardHighlights,
} from "@/features/dashboard/dashboard-content";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <SurfaceCard className="space-y-6 overflow-hidden bg-gradient-to-br from-surface via-surface to-emerald-50">
          <PageHeader
            eyebrow="Decision quality over memorization"
            title="Train No-Limit Hold&apos;em decisions with structure, not static charts."
            description="Phase 10 keeps the guided study loop intact while focusing on deployment support, production configuration clarity, and a cleaner post-deploy validation path."
            aside={
              <>
                <StatusPill tone="success">Phase 10 live</StatusPill>
                <StatusPill>Deploy readiness</StatusPill>
              </>
            }
          />

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-accent-strong px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent"
            >
              Open dashboard
            </Link>
            <Link
              href="/trainer/preflop"
              className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Explore preflop module
            </Link>
            <Link
              href="/settings"
              className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
            >
              Open settings
            </Link>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Foundation snapshot
          </p>
          <div className="space-y-4">
            {dashboardHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="rounded-2xl border border-border/70 bg-muted/30 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {highlight.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {highlight.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {highlight.detail}
                </p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
            Current modules
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            The trainer now spans preflop, math, texture, player-type, and lightweight postflop practice
          </h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {trainingModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            What this repository now guarantees
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {dashboardChecklist.map((checklistItem) => (
              <li key={checklistItem}>- {checklistItem}</li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Intentionally deferred
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>- No AI coaching, solver integrations, or advanced analytics dashboards.</li>
            <li>- No advanced solver-style poker logic or full postflop engine.</li>
            <li>- No admin CMS or full hand-history import.</li>
          </ul>
        </SurfaceCard>
      </section>
    </div>
  );
}
