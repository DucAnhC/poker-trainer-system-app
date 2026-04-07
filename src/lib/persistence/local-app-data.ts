import {
  createEmptyLocalAppSnapshot,
  readLocalAppSnapshot,
  replaceLocalAppSnapshot,
  resetLocalAppSnapshot,
} from "@/lib/persistence/local-app-snapshot";
import type { ProgressSnapshot } from "@/lib/progress/local-progress-storage";
import type { HandReviewNote } from "@/types/training";

export const localAppDataSchema = "poker-trainer-system/local-app-data";
export const localAppDataVersion = 1;

export interface LocalAppDataExport {
  schema: typeof localAppDataSchema;
  version: number;
  exportedAt: string;
  progress: ProgressSnapshot;
  handReviewNotes: HandReviewNote[];
}

type ImportResult =
  | {
      ok: true;
      data: LocalAppDataExport;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

function normalizeExportedAt(value: unknown) {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return new Date().toISOString();
  }

  return parsedValue.toISOString();
}

function createEmptyLocalAppDataExport(): LocalAppDataExport {
  const emptySnapshot = createEmptyLocalAppSnapshot();

  return {
    schema: localAppDataSchema,
    version: localAppDataVersion,
    exportedAt: new Date().toISOString(),
    progress: emptySnapshot.progress,
    handReviewNotes: emptySnapshot.handReviewNotes,
  };
}

function normalizeLocalAppDataExport(
  value: Partial<LocalAppDataExport> | null | undefined,
): LocalAppDataExport {
  return {
    schema: localAppDataSchema,
    version:
      typeof value?.version === "number" && Number.isFinite(value.version)
        ? Math.max(1, Math.round(value.version))
        : localAppDataVersion,
    exportedAt: normalizeExportedAt(value?.exportedAt),
    progress:
      value?.progress && typeof value.progress === "object"
        ? value.progress
        : createEmptyLocalAppSnapshot().progress,
    handReviewNotes: Array.isArray(value?.handReviewNotes)
      ? value.handReviewNotes
      : [],
  };
}

export function readLocalAppDataExport(): LocalAppDataExport {
  const snapshot = readLocalAppSnapshot();

  return {
    schema: localAppDataSchema,
    version: localAppDataVersion,
    exportedAt: new Date().toISOString(),
    progress: snapshot.progress,
    handReviewNotes: snapshot.handReviewNotes,
  };
}

export function serializeLocalAppDataExport() {
  return JSON.stringify(readLocalAppDataExport(), null, 2);
}

export function applyLocalAppDataImport(data: LocalAppDataExport) {
  replaceLocalAppSnapshot({
    progress: data.progress,
    handReviewNotes: data.handReviewNotes,
  });
}

export function resetLocalAppData() {
  resetLocalAppSnapshot();
}

export function parseLocalAppDataImport(rawValue: string): ImportResult {
  if (!rawValue.trim()) {
    return {
      ok: false,
      message: "Import data was empty. Choose a saved JSON export first.",
    };
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<LocalAppDataExport>;

    if (!parsedValue || typeof parsedValue !== "object") {
      return {
        ok: false,
        message: "Import data must be a JSON object exported by this app.",
      };
    }

    const normalizedValue = normalizeLocalAppDataExport(parsedValue);
    const hasRecognizableShape =
      parsedValue.schema === localAppDataSchema ||
      "progress" in parsedValue ||
      "handReviewNotes" in parsedValue;

    if (!hasRecognizableShape) {
      return {
        ok: false,
        message:
          "Import data did not match the expected local backup shape for this app.",
      };
    }

    return {
      ok: true,
      data: normalizedValue,
      message:
        "Local backup parsed successfully. Existing local progress will be replaced on import.",
    };
  } catch {
    return {
      ok: false,
      message: "Import failed because the file was not valid JSON.",
    };
  }
}

export function createDownloadedBackupFilename() {
  const dateLabel = new Date().toISOString().slice(0, 10);
  return `poker-trainer-system-backup-${dateLabel}.json`;
}

export function createEmptyLocalBackupPreview() {
  return createEmptyLocalAppDataExport();
}
