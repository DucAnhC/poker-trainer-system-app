import { leakTags } from "@/data/leak-tags";
import type {
  RationaleBlock,
  SubmittedAnswerFeedback,
  TrainingScenario,
} from "@/types/training";

export type CoachNoteLanguage = "en" | "vi";

export interface CoachNote {
  modeLabel: string;
  title: string;
  body: string;
}

const maxCoachBodyLength = 240;

function compactText(value: string, maxLength = maxCoachBodyLength) {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  const cutoffIndex = normalizedValue.lastIndexOf(" ", maxLength - 1);
  const safeCutoffIndex = cutoffIndex > 80 ? cutoffIndex : maxLength;

  return `${normalizedValue.slice(0, safeCutoffIndex).trim()}...`;
}

function getFirstBlockBody(
  scenario: TrainingScenario,
  kinds: Array<RationaleBlock["kind"]>,
) {
  return scenario.rationaleBlocks.find((block) => kinds.includes(block.kind))?.body ?? null;
}

function getFirstLeakLabel(scenario: TrainingScenario) {
  const firstLeakTagId = scenario.mistakeTags[0];

  if (!firstLeakTagId) {
    return null;
  }

  return leakTags.find((leakTag) => leakTag.id === firstLeakTagId)?.label ?? null;
}

function getModuleNudge(scenario: TrainingScenario, language: CoachNoteLanguage) {
  if (language === "vi") {
    if (scenario.module === "pot-odds") {
      return "Nhìn giá call và equity cần trước khi chọn line.";
    }

    if (scenario.module === "board-texture") {
      return "Đọc board khô, động, paired hay monotone trước khi chọn takeaway.";
    }

    if (scenario.module === "player-types") {
      return "Tách baseline khỏi exploit, rồi kiểm tra read có đủ mạnh chưa.";
    }

    if (scenario.module === "postflop") {
      return "Đọc board, vị trí và mục đích action rồi mới khóa line.";
    }

    return "Đọc vị trí, stack và action history trước khi khóa line.";
  }

  if (scenario.module === "pot-odds") {
    return "Check the price and required equity before choosing the line.";
  }

  if (scenario.module === "board-texture") {
    return "Read whether the board is dry, dynamic, paired, or monotone before locking the takeaway.";
  }

  if (scenario.module === "player-types") {
    return "Separate baseline from exploit, then ask whether the read is strong enough.";
  }

  if (scenario.module === "postflop") {
    return "Read board state, position, and action purpose before locking the line.";
  }

  return "Read position, stack depth, and prior action before locking the line.";
}

export function buildNudgeCoachNote({
  scenario,
  language,
}: {
  scenario: TrainingScenario;
  language: CoachNoteLanguage;
}): CoachNote {
  const moduleNudge = getModuleNudge(scenario, language);
  const body =
    language === "vi"
      ? `${moduleNudge} Coach sẽ không lộ đáp án trước reveal.`
      : `${moduleNudge} The coach stays short and does not reveal the answer before commit.`;

  return {
    modeLabel: language === "vi" ? "Nudge coach" : "Nudge coach",
    title: language === "vi" ? "Cue nhanh trước khi chốt" : "Quick cue before you lock",
    body: compactText(body),
  };
}

export function buildSilentCoachNote({
  scenario,
  feedback,
  language,
}: {
  scenario: TrainingScenario;
  feedback: SubmittedAnswerFeedback;
  language: CoachNoteLanguage;
}): CoachNote {
  const reason =
    getFirstBlockBody(scenario, ["core-reason", "context-factor", "answer"]) ??
    scenario.learningGoal;
  const missCorrection =
    feedback.selectedAction.feedbackHint ??
    getFirstBlockBody(scenario, ["mistake-correction", "alternative-action"]) ??
    getFirstLeakLabel(scenario) ??
    reason;
  const isCorrect = feedback.attempt.isCorrect;

  if (language === "vi") {
    return {
      modeLabel: "Silent coach",
      title: isCorrect ? "Line này sạch" : "Sửa lệch chính",
      body: compactText(
        isCorrect
          ? `Giữ nhịp này: ${reason}`
          : `Điểm lệch chính: ${missCorrection}`,
      ),
    };
  }

  return {
    modeLabel: "Silent coach",
    title: isCorrect ? "Clean lock" : "Main correction",
    body: compactText(
      isCorrect
        ? `Keep this rhythm: ${reason}`
        : `Main drift: ${missCorrection}`,
    ),
  };
}
