"use client";

import Link from "next/link";
import { useEffect } from "react";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-8">
      <SurfaceCard className="space-y-4 border border-amber-200 bg-amber-50/80">
        <div className="flex flex-wrap gap-2">
          <StatusPill tone="danger">Unexpected issue</StatusPill>
          <StatusPill tone="gold">Phase 10 deploy prep</StatusPill>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            This screen hit an unexpected error
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            The current route did not finish rendering cleanly. You can retry the
            screen, head back to the dashboard, or open settings to check account
            and persistence state.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            Retry this screen
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Open dashboard
          </Link>
          <Link
            href="/settings"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Open settings
          </Link>
        </div>
      </SurfaceCard>
    </div>
  );
}
