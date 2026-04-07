import Link from "next/link";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import { formatDateTimeLabel } from "@/lib/utils";
import type { PersistenceMode } from "@/types/training";

type AccountModeCardProps = {
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
};

export function AccountModeCard({
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
}: AccountModeCardProps) {
  const hasSeparateLocalBackup =
    storageMode === "account" && hasAppSnapshotData(localBackupStats);

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Account state
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          {storageMode === "account"
            ? "Signed-in sync is active"
            : "Local study mode is active"}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? `Progress, sessions, and review notes now save to ${userEmail ?? "the signed-in account"}. The dashboard is reading the account-backed snapshot first and still keeps local browser tools available below.`
            : "You can keep training without an account. Progress, sessions, and review notes stay in this browser until you decide to sign in for account-backed persistence."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusPill tone={storageMode === "account" ? "success" : "accent"}>
          {storageMode === "account" ? "Cloud-backed mode" : "Local-only mode"}
        </StatusPill>
        {storageMode === "account" ? (
          <StatusPill>{userEmail ?? "Signed-in account"}</StatusPill>
        ) : (
          <StatusPill tone="gold">Sign in when you want sync</StatusPill>
        )}
        {hasSeparateLocalBackup ? (
          <StatusPill tone="gold">Local backup still available</StatusPill>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Current source
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account" ? "Account snapshot" : "Browser snapshot"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {snapshotStats.attemptCount} attempts, {snapshotStats.sessionCount} sessions,
            and {snapshotStats.reviewNoteCount} review notes saved.
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
            Sync guidance
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasSeparateLocalBackup
                ? "A separate local backup exists"
                : "No extra local import is waiting"
              : "Account mode is optional"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? hasSeparateLocalBackup
                ? `This browser still has ${localBackupStats.attemptCount} local attempts and ${localBackupStats.reviewNoteCount} local review notes available for manual merge.`
                : "This browser does not currently have extra local study data waiting to be merged into the signed-in account."
              : "Signing in keeps the current trainer flow intact while making progress, sessions, and review notes available beyond this browser."}
          </p>
        </div>
      </div>

      {storageMode === "local" ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/auth"
            className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent"
          >
            Sign in for sync
          </Link>
          <Link
            href="/review"
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
          >
            Keep studying locally
          </Link>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
