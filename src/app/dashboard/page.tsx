import Link from "next/link";

import { ModuleCard } from "@/components/trainer/ModuleCard";
import { PageHeader } from "@/components/trainer/PageHeader";
import { ScenarioPreviewCard } from "@/components/trainer/ScenarioPreviewCard";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { allScenarios } from "@/data/scenarios";
import { trainingModules } from "@/data/training-modules";
import {
  dashboardHighlights,
  dashboardScenarioSummary,
} from "@/features/dashboard/dashboard-content";
import { DashboardProgressOverview } from "@/features/progress/DashboardProgressOverview";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title="Structured module hub for the poker training system"
        description="The dashboard keeps the product framed as a training system, not a chart library. Phase 10 focuses on deploy readiness, clearer production expectations, and a reliable smoke-test path after release."
        aside={
          <>
            <StatusPill tone="success">Phase 10 live</StatusPill>
            <StatusPill>Deployment and smoke tests</StatusPill>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {dashboardHighlights.map((highlight) => (
          <SurfaceCard key={highlight.label} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {highlight.label}
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {highlight.value}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {highlight.detail}
            </p>
          </SurfaceCard>
        ))}
      </div>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
            Progress
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Persisted training summary
          </h2>
        </div>
        <DashboardProgressOverview />
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
            Modules
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Navigation and scaffold coverage
          </h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {trainingModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
            Scenario previews
          </p>
          <div className="grid gap-6 xl:grid-cols-2">
            {allScenarios.slice(0, 4).map((scenario) => (
              <ScenarioPreviewCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </div>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Sample content coverage
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            {dashboardScenarioSummary.map((summary) => (
              <li key={summary.moduleId} className="flex items-start justify-between gap-4">
                <span>{summary.title}</span>
                <StatusPill>{summary.count} seeded</StatusPill>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-accent/15 bg-accent/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-strong">
              Phase 10 note
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The preview cards still show the shared content model. Interactive
              feedback is live on five training routes, while the dashboard now
              layers on adaptive study guidance, retry-focused recommendations,
              recent review activity, a settings area, safer local/cloud
              migration messaging, local export/import/reset tools, and optional
              account-backed sync.
            </p>
            <Link
              href="/handbook"
              className="mt-4 inline-flex rounded-full border border-accent/25 bg-white px-4 py-2 text-sm font-semibold text-accent-strong transition hover:border-accent hover:bg-accent/10"
            >
              Open handbook route
            </Link>
          </div>
        </SurfaceCard>
      </section>
    </div>
  );
}
