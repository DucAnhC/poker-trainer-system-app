import { leakTagMap } from "@/data/leak-tags";
import {
  readJsonStorageValue,
  removeStorageValue,
  writeJsonStorageValue,
} from "@/lib/persistence/local-storage";
import { handReviewStorageKey } from "@/lib/persistence/storage-keys";
import type { PositionId } from "@/types/poker";
import type { HandReviewNote, ReviewStreetFocus } from "@/types/training";

type LegacyHandReviewNote = {
  id?: string;
  title?: string;
  situationSummary?: string;
  selfDiagnosis?: string;
  lessonLearned?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
};

const positionIds = new Set<PositionId>(["UTG", "HJ", "CO", "BTN", "SB", "BB"]);
const reviewStreetFocuses = new Set<ReviewStreetFocus>([
  "preflop",
  "flop",
  "turn",
  "river",
  "general",
]);

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTimestamp(value: unknown) {
  if (typeof value !== "string") {
    return new Date().toISOString();
  }

  const parsedValue = new Date(value);

  if (Number.isNaN(parsedValue.getTime())) {
    return new Date().toISOString();
  }

  return parsedValue.toISOString();
}

function normalizePosition(value: unknown): PositionId | null {
  if (typeof value === "string" && positionIds.has(value as PositionId)) {
    return value as PositionId;
  }

  return null;
}

function normalizeStreetFocus(value: unknown): ReviewStreetFocus {
  if (
    typeof value === "string" &&
    reviewStreetFocuses.has(value as ReviewStreetFocus)
  ) {
    return value as ReviewStreetFocus;
  }

  return "general";
}

function normalizeEffectiveStack(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function normalizeLeakTagIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as HandReviewNote["leakTagIds"];
  }

  return [...new Set(
    value.filter(
      (tagId): tagId is HandReviewNote["leakTagIds"][number] =>
        typeof tagId === "string" && Boolean(leakTagMap[tagId]),
    ),
  )];
}

export function createHandReviewNoteId() {
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeHandReviewNote(
  input: Partial<HandReviewNote & LegacyHandReviewNote>,
): HandReviewNote {
  const createdAt = normalizeTimestamp(input.createdAt);
  const updatedAt = normalizeTimestamp(input.updatedAt ?? input.createdAt);

  return {
    id: normalizeText(input.id) || createHandReviewNoteId(),
    title: normalizeText(input.title) || "Untitled review",
    streetFocus: normalizeStreetFocus(input.streetFocus),
    heroPosition: normalizePosition(input.heroPosition),
    villainPosition: normalizePosition(input.villainPosition),
    effectiveStackBb: normalizeEffectiveStack(input.effectiveStackBb),
    board: normalizeText(input.board),
    actionHistorySummary:
      normalizeText(input.actionHistorySummary) ||
      normalizeText(input.situationSummary),
    chosenAction: normalizeText(input.chosenAction),
    uncertainty:
      normalizeText(input.uncertainty) || normalizeText(input.selfDiagnosis),
    note: normalizeText(input.note) || normalizeText(input.lessonLearned),
    leakTagIds: normalizeLeakTagIds(input.leakTagIds ?? input.tags),
    createdAt,
    updatedAt,
  };
}

function sortNotesByUpdatedAt(notes: HandReviewNote[]) {
  return [...notes].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function readHandReviewNotes() {
  const parsedValue = readJsonStorageValue<unknown>(handReviewStorageKey);

  if (!Array.isArray(parsedValue)) {
    return [] as HandReviewNote[];
  }

  return sortNotesByUpdatedAt(
    parsedValue.map((note) =>
      normalizeHandReviewNote(
        (note as Partial<HandReviewNote & LegacyHandReviewNote>) ?? {},
      ),
    ),
  );
}

export function writeHandReviewNotes(notes: HandReviewNote[]) {
  writeJsonStorageValue(
    handReviewStorageKey,
    sortNotesByUpdatedAt(notes.map(normalizeHandReviewNote)),
  );
}

export function replaceHandReviewNotes(
  notes: Array<Partial<HandReviewNote & LegacyHandReviewNote>>,
) {
  writeHandReviewNotes(notes.map((note) => normalizeHandReviewNote(note)));
}

export function saveHandReviewNote(note: HandReviewNote) {
  const nextNote = normalizeHandReviewNote(note);
  const currentNotes = readHandReviewNotes();
  const existingIndex = currentNotes.findIndex(
    (currentNote) => currentNote.id === nextNote.id,
  );

  if (existingIndex >= 0) {
    const updatedNotes = [...currentNotes];
    updatedNotes[existingIndex] = nextNote;
    writeHandReviewNotes(updatedNotes);
    return;
  }

  writeHandReviewNotes([nextNote, ...currentNotes]);
}

export function deleteHandReviewNote(noteId: string) {
  const currentNotes = readHandReviewNotes();

  writeHandReviewNotes(
    currentNotes.filter((currentNote) => currentNote.id !== noteId),
  );
}

export function resetHandReviewNotes() {
  removeStorageValue(handReviewStorageKey);
}
