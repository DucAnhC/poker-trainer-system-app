"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import { formatDateTimeLabel } from "@/lib/utils";
import type { PersistenceMode } from "@/types/training";

type AccountControlsCardProps = {
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
  isRefreshing: boolean;
  onRefresh: () => void | Promise<void>;
};

export function AccountControlsCard({
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
  isRefreshing,
  onRefresh,
}: AccountControlsCardProps) {
  const hasLocalBackupWaiting =
    storageMode === "account" && hasAppSnapshotData(localBackupStats);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Account controls
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {storageMode === "account"
            ? "Manage synced study data"
            : "Move between local and account modes"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? `You are signed in as ${userEmail ?? "the current account"}. Use these controls to refresh the current snapshot, manage sign-out, and jump back into the study flow without hunting through the dashboard.`
            : "Local mode stays fully usable. When you want account-backed progress later, sign in without losing the current browser workflow."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Current snapshot
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account" ? "Account-backed data" : "Browser-local data"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Last saved activity:{" "}
            {snapshotStats.lastActivityAt
              ? formatDateTimeLabel(snapshotStats.lastActivityAt)
              : "No saved activity yet"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Next safe action
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasLocalBackupWaiting
                ? "Review local-to-account import tools below"
                : "Keep training or refresh account data"
              : "Keep training locally or create an account"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? hasLocalBackupWaiting
                ? `This browser still has ${localBackupStats.attemptCount} local attempts and ${localBackupStats.reviewNoteCount} local review notes available for manual merge.`
                : "No separate browser-only study data is waiting for merge right now."
              : "Sign in only when you want account-backed persistence. Nothing about the local trainer flow breaks if you keep using the app anonymously."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
          {storageMode === "account" ? "Signed-in mode" : "Local mode"}
        </StatusPill>
        {storageMode === "account" ? (
          <StatusPill>{userEmail ?? "Signed-in account"}</StatusPill>
        ) : (
          <StatusPill tone="gold">Account sync is optional</StatusPill>
        )}
        {hasLocalBackupWaiting ? (
          <StatusPill tone="gold">Local backup waiting</StatusPill>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isRefreshing}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isRefreshing ? "Refreshing..." : "Refresh saved data"}
        </button>

        {storageMode === "account" ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/settings" })}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Sign out
          </button>
        ) : (
          <Link
            href="/auth"
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            Sign in or create account
          </Link>
        )}

        <Link
          href="/dashboard"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          Open dashboard
        </Link>

        <Link
          href="/review"
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          Open hand review
        </Link>
      </div>
    </SurfaceCard>
  );
}
