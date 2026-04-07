import type { LocalAppSnapshot } from "@/lib/persistence/local-app-snapshot";
import type { HandReviewNote, QuizAttempt, TrainingSession } from "@/types/training";

async function parseJsonResponse<T>(
  response: Response,
  fallbackMessage: string,
) {
  const payload = (await response.json().catch(() => null)) as
    | (T & {
        message?: string;
      })
    | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? fallbackMessage);
  }

  if (!payload) {
    throw new Error(fallbackMessage);
  }

  return payload;
}

export async function fetchCloudAppSnapshot() {
  const response = await fetch("/api/account/app-snapshot", {
    method: "GET",
    cache: "no-store",
  });

  return parseJsonResponse<LocalAppSnapshot>(
    response,
    "Failed to load account-backed data.",
  );
}

export async function mergeLocalSnapshotIntoCloud(snapshot: LocalAppSnapshot) {
  const response = await fetch("/api/account/import-local", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snapshot,
    }),
  });

  return parseJsonResponse<{
    message: string;
    snapshot: LocalAppSnapshot;
  }>(response, "Failed to import local data into the signed-in account.");
}

export async function persistCloudQuizAttempt(attempt: QuizAttempt) {
  const response = await fetch("/api/account/attempts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attempt,
    }),
  });

  return parseJsonResponse<{ attempt: QuizAttempt }>(
    response,
    "Failed to save the training attempt to the account.",
  );
}

export async function persistCloudTrainingSession(
  session: TrainingSession,
) {
  const response = await fetch("/api/account/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session,
    }),
  });

  return parseJsonResponse<{ session: TrainingSession }>(
    response,
    "Failed to save the training session to the account.",
  );
}

export async function persistCloudHandReviewNote(note: HandReviewNote) {
  const response = await fetch("/api/account/review-notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      note,
    }),
  });

  return parseJsonResponse<{ note: HandReviewNote }>(
    response,
    "Failed to save the review note to the account.",
  );
}

export async function deleteCloudHandReviewNote(noteId: string) {
  const response = await fetch(`/api/account/review-notes/${noteId}`, {
    method: "DELETE",
  });

  return parseJsonResponse<{ ok: true }>(
    response,
    "Failed to delete the review note from the account.",
  );
}
