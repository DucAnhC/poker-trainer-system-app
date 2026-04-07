import Link from "next/link";

import { PageHeader } from "@/components/trainer/PageHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";

const handbookSections = [
  "Poker learning principles",
  "Preflop fundamentals",
  "Postflop fundamentals",
  "Pot odds, outs, and equity",
  "Player types and exploits",
  "Common beginner leaks",
  "Training modes and content structure",
] as const;

export default function HandbookPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Handbook"
        title="Reference concepts that will support future training flows"
        description="The app does not render the full markdown handbook yet, but the route exists so the platform structure already includes a dedicated learning-reference area."
        aside={
          <>
            <StatusPill tone="accent">Handbook route ready</StatusPill>
            <StatusPill>Content rendering deferred</StatusPill>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Planned handbook coverage
          </h2>
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            {handbookSections.map((section) => (
              <li key={section}>- {section}</li>
            ))}
          </ul>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Current note
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            The handbook content already exists in `/docs/handbook`. A later
            phase can decide whether to render that material directly in the app
            or keep it synced through a content pipeline.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            Back to dashboard
          </Link>
        </SurfaceCard>
      </div>
    </div>
  );
}
