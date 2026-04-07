"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import {
  createEmptyLocalAppSnapshot,
  readLocalAppSnapshot,
} from "@/lib/persistence/local-app-snapshot";
import { loadPersistedAppSnapshot } from "@/lib/persistence/persisted-app-snapshot";
import {
  getAppSnapshotStats,
  getStudyAnalyticsSummary,
} from "@/lib/persistence/snapshot-insights";
import {
  createEmptyProgressSummary,
  getProgressSummary,
} from "@/lib/progress/progress-insights";
import type {
  PersistenceMode,
  ProgressSummary,
} from "@/types/training";

export function usePersistedAppSnapshot() {
  const { data: session, status } = useSession();
  const storageMode: PersistenceMode =
    status === "authenticated" ? "account" : "local";
  const [snapshot, setSnapshot] = useState(createEmptyLocalAppSnapshot);
  const [localBackupSnapshot, setLocalBackupSnapshot] = useState(
    createEmptyLocalAppSnapshot,
  );
  const [progressSummary, setProgressSummary] = useState<ProgressSummary>(
    createEmptyProgressSummary,
  );
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const latestRequestIdRef = useRef(0);
  const lastSuccessfulStorageModeRef = useRef<PersistenceMode>("local");
  const lastSuccessfulSnapshotRef = useRef(createEmptyLocalAppSnapshot());
  const lastSuccessfulProgressSummaryRef = useRef(createEmptyProgressSummary());

  const refreshSnapshot = useCallback(async () => {
    if (status === "loading") {
      return;
    }

    const requestId = latestRequestIdRef.current + 1;
    latestRequestIdRef.current = requestId;
    setIsRefreshing(true);

    const nextLocalBackupSnapshot = readLocalAppSnapshot();
    if (latestRequestIdRef.current === requestId) {
      setLocalBackupSnapshot(nextLocalBackupSnapshot);
    }

    try {
      const nextSnapshot = await loadPersistedAppSnapshot(storageMode);
      const nextProgressSummary = getProgressSummary(
        nextSnapshot.progress,
        nextSnapshot.handReviewNotes,
      );

      if (latestRequestIdRef.current !== requestId) {
        return;
      }

      setSnapshot(nextSnapshot);
      setProgressSummary(nextProgressSummary);
      lastSuccessfulStorageModeRef.current = storageMode;
      lastSuccessfulSnapshotRef.current = nextSnapshot;
      lastSuccessfulProgressSummaryRef.current = nextProgressSummary;
      setLoadError(null);
    } catch (error) {
      if (latestRequestIdRef.current !== requestId) {
        return;
      }

      const fallbackSnapshot =
        storageMode === "local"
          ? nextLocalBackupSnapshot
          : lastSuccessfulStorageModeRef.current === storageMode
            ? lastSuccessfulSnapshotRef.current
            : createEmptyLocalAppSnapshot();
      const fallbackProgressSummary =
        storageMode === "local"
          ? getProgressSummary(
              nextLocalBackupSnapshot.progress,
              nextLocalBackupSnapshot.handReviewNotes,
            )
          : lastSuccessfulStorageModeRef.current === storageMode
            ? lastSuccessfulProgressSummaryRef.current
            : createEmptyProgressSummary();

      setSnapshot(fallbackSnapshot);
      setProgressSummary(fallbackProgressSummary);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Failed to load persisted app data.",
      );
    } finally {
      if (latestRequestIdRef.current === requestId) {
        setHasLoaded(true);
        setIsRefreshing(false);
      }
    }
  }, [status, storageMode]);

  useEffect(() => {
    void refreshSnapshot();
  }, [refreshSnapshot, session?.user?.id]);

  const snapshotStats = useMemo(
    () => getAppSnapshotStats(snapshot),
    [snapshot],
  );
  const localBackupStats = useMemo(
    () => getAppSnapshotStats(localBackupSnapshot),
    [localBackupSnapshot],
  );
  const studyAnalytics = useMemo(
    () => getStudyAnalyticsSummary(snapshot),
    [snapshot],
  );

  return {
    snapshot,
    localBackupSnapshot,
    snapshotStats,
    localBackupStats,
    studyAnalytics,
    progressSummary,
    hasLoaded: hasLoaded && status !== "loading",
    isAuthenticated: storageMode === "account",
    loadError,
    isRefreshing,
    refreshSnapshot,
    storageMode,
    userEmail: session?.user?.email ?? null,
  };
}
