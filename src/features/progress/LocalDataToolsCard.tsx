"use client";

import { type ChangeEvent, useRef, useState } from "react";

import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { mergeLocalSnapshotIntoCloud } from "@/lib/persistence/cloud-app-data";
import {
  applyLocalAppDataImport,
  createDownloadedBackupFilename,
  parseLocalAppDataImport,
  resetLocalAppData,
  serializeLocalAppDataExport,
} from "@/lib/persistence/local-app-data";
import { readLocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import {
  getAppSnapshotStats,
  hasAppSnapshotData,
  type AppSnapshotStats,
} from "@/lib/persistence/snapshot-insights";
import type { PersistenceMode } from "@/types/training";

type LocalDataToolsCardProps = {
  onDataChanged: () => void;
  storageMode: PersistenceMode;
  userEmail: string | null;
  snapshotStats: AppSnapshotStats;
  localBackupStats: AppSnapshotStats;
};

type ToolMessage = {
  tone: "neutral" | "success" | "danger";
  text: string;
};

function downloadJsonFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
}

export function LocalDataToolsCard({
  onDataChanged,
  storageMode,
  userEmail,
  snapshotStats,
  localBackupStats,
}: LocalDataToolsCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<ToolMessage | null>(null);
  const [isImportingToAccount, setIsImportingToAccount] = useState(false);
  const hasLocalBackupData = hasAppSnapshotData(localBackupStats);
  const hasAccountData =
    storageMode === "account" && hasAppSnapshotData(snapshotStats);

  function handleExport() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: "There is no saved local browser data to export yet.",
      });
      return;
    }

    downloadJsonFile(
      createDownloadedBackupFilename(),
      serializeLocalAppDataExport(),
    );
    setMessage({
      tone: "success",
      text: `Local browser backup exported as JSON with ${localBackupStats.attemptCount} attempts, ${localBackupStats.sessionCount} sessions, and ${localBackupStats.reviewNoteCount} review notes.`,
    });
  }

  async function handleImportChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    try {
      const rawValue = await selectedFile.text();
      const parsedResult = parseLocalAppDataImport(rawValue);

      if (!parsedResult.ok) {
        setMessage({
          tone: "danger",
          text: parsedResult.message,
        });
        return;
      }

      const importStats = getAppSnapshotStats({
        progress: parsedResult.data.progress,
        handReviewNotes: parsedResult.data.handReviewNotes,
      });

      if (typeof window !== "undefined") {
        const shouldImport = window.confirm(
          `Import this JSON backup and replace the current browser snapshot?\n\nImported file: ${importStats.attemptCount} attempts, ${importStats.sessionCount} sessions, ${importStats.reviewNoteCount} review notes.\nCurrent browser data: ${localBackupStats.attemptCount} attempts, ${localBackupStats.sessionCount} sessions, ${localBackupStats.reviewNoteCount} review notes.`,
        );

        if (!shouldImport) {
          setMessage({
            tone: "neutral",
            text: "Import canceled. Current local progress was not changed.",
          });
          return;
        }
      }

      applyLocalAppDataImport(parsedResult.data);
      onDataChanged();
      setMessage({
        tone: "success",
        text: `Local browser backup imported successfully. This browser now has ${parsedResult.data.progress.attempts.length} attempts, ${parsedResult.data.progress.sessions.length} sessions, and ${parsedResult.data.handReviewNotes.length} review notes.`,
      });
    } catch {
      setMessage({
        tone: "danger",
        text: "Import failed while reading the selected file.",
      });
    }
  }

  async function handleImportToAccount() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: "No local browser data was found to import into the signed-in account.",
      });
      return;
    }

    if (typeof window !== "undefined") {
      const shouldImport = window.confirm(
        "Merge this browser's local progress and review notes into the signed-in account? Existing account data will be kept, matching items merge by id, and the local browser copy will stay in place.",
      );

      if (!shouldImport) {
        setMessage({
          tone: "neutral",
          text: "Account import canceled. Local browser data was not changed.",
        });
        return;
      }
    }

    setIsImportingToAccount(true);

    try {
      const localSnapshot = readLocalAppSnapshot();
      const result = await mergeLocalSnapshotIntoCloud(localSnapshot);
      onDataChanged();
      setMessage({
        tone: "success",
        text: `${result.message} The account now shows ${result.snapshot.progress.attempts.length} attempts, ${result.snapshot.progress.sessions.length} sessions, and ${result.snapshot.handReviewNotes.length} review notes.`,
      });
    } catch (error) {
      setMessage({
        tone: "danger",
        text:
          error instanceof Error
            ? error.message
            : "Failed to import local data into the signed-in account.",
      });
    } finally {
      setIsImportingToAccount(false);
    }
  }

  function handleReset() {
    if (!hasLocalBackupData) {
      setMessage({
        tone: "neutral",
        text: "There is no local browser data to reset right now.",
      });
      return;
    }

    if (typeof window !== "undefined") {
      const shouldReset = window.confirm(
        `Reset all local training progress, sessions, and review notes in this browser?\n\nThis will remove ${localBackupStats.attemptCount} attempts, ${localBackupStats.sessionCount} sessions, and ${localBackupStats.reviewNoteCount} review notes from this browser only.`,
      );

      if (!shouldReset) {
        setMessage({
          tone: "neutral",
          text: "Reset canceled. Current local data was kept.",
        });
        return;
      }
    }

    resetLocalAppData();
    onDataChanged();
    setMessage({
      tone: "success",
      text: "All local training progress and review notes were reset in this browser. Account-backed data, if any, was not touched.",
    });
  }

  return (
    <SurfaceCard className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent-strong">
          Local data tools
        </p>
        <h2 className="text-2xl font-semibold text-foreground">
          Export, import, or reset safely
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          {storageMode === "account"
            ? "These tools manage browser-local backups alongside account sync. Export and reset only affect this browser. The import-to-account action performs a merge and keeps the current local copy in place."
            : "These tools only affect this browser&apos;s local data. Import replaces the current local snapshot, and reset clears progress plus saved review notes after confirmation."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Local browser backup
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {hasLocalBackupData ? "Ready for backup or merge" : "No local data saved"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {localBackupStats.attemptCount} attempts, {localBackupStats.sessionCount} sessions,
            and {localBackupStats.reviewNoteCount} review notes currently live in this browser.
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {storageMode === "account" ? "Signed-in account" : "Import behavior"}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">
            {storageMode === "account"
              ? hasAccountData
                ? "Account data already exists"
                : "Account is ready for its first import"
              : "Local import replaces this browser snapshot"}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {storageMode === "account"
              ? `${snapshotStats.attemptCount} attempts, ${snapshotStats.sessionCount} sessions, and ${snapshotStats.reviewNoteCount} review notes are currently saved for ${userEmail ?? "the signed-in account"}.`
              : "JSON imports replace the local browser snapshot only after confirmation. Reset also stays local and never touches account data."}
          </p>
        </div>
      </div>

      {storageMode === "account" ? (
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
          <div className="flex flex-wrap gap-2">
            <StatusPill tone="success">Merge by stable ids</StatusPill>
            <StatusPill tone="accent">Local copy stays in place</StatusPill>
            {hasAccountData ? <StatusPill tone="gold">Existing account data is kept</StatusPill> : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Importing local data into the account is additive and merge-oriented. This app does not silently wipe either side, and it does not try to do advanced conflict resolution.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={!hasLocalBackupData}
          className="rounded-full bg-accent-strong px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
        >
          {hasLocalBackupData ? "Export JSON backup" : "No local data to export"}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent-strong"
        >
          Import JSON backup
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!hasLocalBackupData}
          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {hasLocalBackupData ? "Reset local data" : "No local data to reset"}
        </button>
        {storageMode === "account" ? (
          <button
            type="button"
            onClick={handleImportToAccount}
            disabled={isImportingToAccount || !hasLocalBackupData}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isImportingToAccount
              ? "Importing..."
              : hasLocalBackupData
                ? "Import local data to account"
                : "No local data to import"}
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportChange}
      />

      <div className="flex flex-wrap gap-2">
        <StatusPill tone="accent">{storageMode === "account" ? "Local backup tools" : "Local only"}</StatusPill>
        {storageMode === "account" ? (
          <StatusPill tone="success">
            Syncing to {userEmail ?? "account"}
          </StatusPill>
        ) : null}
        <StatusPill>JSON validation on import</StatusPill>
        <StatusPill tone="danger">Reset requires confirmation</StatusPill>
      </div>

      {message ? (
        <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
          <StatusPill tone={message.tone}>{message.tone}</StatusPill>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {message.text}
          </p>
        </div>
      ) : null}
    </SurfaceCard>
  );
}
