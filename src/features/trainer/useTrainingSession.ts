"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import {
  buildLiveTrainingSessionSummary,
  createEmptyProgressSummary,
  getProgressSummary,
} from "@/lib/progress/progress-insights";
import {
  persistCloudQuizAttempt,
  persistCloudTrainingSession,
} from "@/lib/persistence/cloud-app-data";
import { loadPersistedAppSnapshot } from "@/lib/persistence/persisted-app-snapshot";
import { calculateAccuracy } from "@/lib/progress/metrics";
import {
  recordQuizAttempt,
  recordTrainingSession,
} from "@/lib/progress/local-progress-storage";
import {
  getModuleRetryQueueItems,
  getRetryItemForScenario,
  orderScenariosByRetryPriority,
} from "@/lib/training/retry-queue";
import { createTrainingSession } from "@/lib/training/session-state";
import type {
  Difficulty,
  InteractiveTrainingModuleId,
  ProgressSummary,
  QuizAttempt,
  RetryQueueItem,
  SubmittedAnswerFeedback,
  TrainingDifficultyFilter,
  TrainingScenario,
  TrainingSession,
  TrainingSessionSummary,
  TrainerQueueMode,
} from "@/types/training";
import { difficultyLevels } from "@/types/training";

function createAttemptId(sessionId: string, scenarioId: string) {
  return `${sessionId}:${scenarioId}:${Date.now()}`;
}

function getInitialProgressSummary() {
  if (typeof window === "undefined") {
    return createEmptyProgressSummary();
  }

  return getProgressSummary();
}

function buildScenarioSignature(scenarios: TrainingScenario[]) {
  return scenarios.map((scenario) => scenario.id).join("|");
}

function sortDifficulties(left: Difficulty, right: Difficulty) {
  return difficultyLevels.indexOf(left) - difficultyLevels.indexOf(right);
}

export function useTrainingSession<T extends TrainingScenario>(
  module: InteractiveTrainingModuleId,
  scenarios: T[],
  options?: {
    difficultyFilter?: TrainingDifficultyFilter;
    queueMode?: TrainerQueueMode;
  },
) {
  const difficultyFilter = options?.difficultyFilter ?? "all";
  const queueMode = options?.queueMode ?? "adaptive";
  const { data: authSession, status: authStatus } = useSession();
  const isAuthenticated = authStatus === "authenticated";
  const storageMode: "account" | "local" =
    isAuthenticated ? "account" : "local";

  const [overallProgressSummary, setOverallProgressSummary] =
    useState<ProgressSummary>(getInitialProgressSummary);

  const availableDifficulties = useMemo(
    () =>
      [...new Set(scenarios.map((scenario) => scenario.difficulty))].sort(
        sortDifficulties,
      ),
    [scenarios],
  );

  const filteredScenarios = useMemo(
    () =>
      difficultyFilter === "all"
        ? scenarios
        : scenarios.filter((scenario) => scenario.difficulty === difficultyFilter),
    [difficultyFilter, scenarios],
  );

  const retryQueueItems = useMemo(
    () =>
      getModuleRetryQueueItems(
        overallProgressSummary.retryQueue,
        module,
        difficultyFilter,
      ),
    [difficultyFilter, module, overallProgressSummary.retryQueue],
  );

  const activeScenarios = useMemo(
    () =>
      queueMode === "adaptive"
        ? orderScenariosByRetryPriority(filteredScenarios, retryQueueItems)
        : filteredScenarios,
    [filteredScenarios, queueMode, retryQueueItems],
  );

  const scenarioSignature = useMemo(
    () => buildScenarioSignature(activeScenarios),
    [activeScenarios],
  );
  const activeScenarioIds = useMemo(
    () => activeScenarios.map((scenario) => scenario.id),
    [activeScenarios],
  );

  const [session, setSession] = useState<TrainingSession>(() =>
    createTrainingSession(module, activeScenarioIds),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SubmittedAnswerFeedback | null>(null);
  const [attemptIds, setAttemptIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [surfacedLeakTags, setSurfacedLeakTags] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(activeScenarios.length === 0);
  const [completionTimestamp, setCompletionTimestamp] = useState<string | null>(
    null,
  );
  const [isPersistingAttempt, setIsPersistingAttempt] = useState(false);
  const [isPersistingSession, setIsPersistingSession] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const hasMountedForScenarioSignature = useRef(false);

  const refreshPersistedProgressSummary = useCallback(async () => {
    if (authStatus === "loading") {
      return;
    }

    try {
      const snapshot = await loadPersistedAppSnapshot(storageMode);

      setOverallProgressSummary(
        getProgressSummary(snapshot.progress, snapshot.handReviewNotes),
      );
      setPersistenceError(null);
    } catch {
      setPersistenceError(
        storageMode === "account"
          ? "Chưa thể làm mới tiến độ đã lưu trên tài khoản ngay lúc này."
          : "Chưa thể làm mới tiến độ đang lưu trên trình duyệt ngay lúc này.",
      );
    }
  }, [authStatus, storageMode]);

  const currentScenario = activeScenarios[currentIndex] ?? null;
  const currentRetryHint = getRetryItemForScenario(
    retryQueueItems,
    currentScenario?.id,
  );
  const currentSessionSummary: TrainingSessionSummary =
    buildLiveTrainingSessionSummary({
      moduleId: module,
      attemptedCount: attemptIds.length,
      correctCount,
      surfacedLeakTagIds: surfacedLeakTags,
      startedAt: session.startedAt,
      lastActivityAt: session.lastActivityAt,
      completedAt: completionTimestamp,
    });

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    if (isAuthenticated) {
      let isCancelled = false;
      setIsPersistingSession(true);
      void persistCloudTrainingSession(session)
        .then(() => {
          if (isCancelled) {
            return;
          }

          setPersistenceError(null);
          void refreshPersistedProgressSummary();
        })
        .catch((error) => {
          if (isCancelled) {
            return;
          }

          setPersistenceError(
            error instanceof Error
              ? error.message
              : "Không thể đồng bộ nhịp học hiện tại lên tài khoản đang đăng nhập.",
          );
        })
        .finally(() => {
          if (!isCancelled) {
            setIsPersistingSession(false);
          }
        });

      return () => {
        isCancelled = true;
      };
    }

    setPersistenceError(null);
    setIsPersistingSession(false);
    setIsPersistingAttempt(false);
    try {
      recordTrainingSession(session);
    } catch {
      setPersistenceError("Không thể ghi tiến độ lên trình duyệt này.");
    }
  }, [authStatus, isAuthenticated, refreshPersistedProgressSummary, session]);

  useEffect(() => {
    void refreshPersistedProgressSummary();
  }, [
    refreshPersistedProgressSummary,
    attemptIds.length,
    completionTimestamp,
    authSession?.user?.id,
  ]);

  useEffect(() => {
    if (!hasMountedForScenarioSignature.current) {
      hasMountedForScenarioSignature.current = true;
      return;
    }

    const nextSession = createTrainingSession(
      module,
      activeScenarioIds,
    );

    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedActionId(null);
    setFeedback(null);
    setAttemptIds([]);
    setCorrectCount(0);
    setSurfacedLeakTags([]);
    setCompletionTimestamp(null);
    setIsComplete(activeScenarioIds.length === 0);
    setPersistenceError(null);
    setIsPersistingAttempt(false);
    setIsPersistingSession(false);
  }, [activeScenarioIds, module, scenarioSignature]);

  function handleSelectAction(actionId: string) {
    if (feedback || isComplete) {
      return;
    }

    setSelectedActionId(actionId);
  }

  function handleSubmitAnswer() {
    if (!currentScenario || !selectedActionId || feedback) {
      return;
    }

    const selectedAction = currentScenario.candidateActions.find(
      (candidateAction) => candidateAction.id === selectedActionId,
    );
    const recommendedAction = currentScenario.candidateActions.find(
      (candidateAction) =>
        candidateAction.id === currentScenario.recommendedActionId,
    );

    if (!selectedAction || !recommendedAction) {
      return;
    }

    const createdAt = new Date().toISOString();
    const isCorrect = selectedAction.id === recommendedAction.id;
    const nextAttemptIds = [
      ...attemptIds,
      createAttemptId(session.id, currentScenario.id),
    ];
    const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const nextSurfacedLeakTags = isCorrect
      ? surfacedLeakTags
      : [...new Set([...surfacedLeakTags, ...currentScenario.mistakeTags])];
    const attempt: QuizAttempt = {
      id: nextAttemptIds[nextAttemptIds.length - 1],
      sessionId: session.id,
      scenarioId: currentScenario.id,
      module,
      selectedActionId: selectedAction.id,
      recommendedActionId: recommendedAction.id,
      isCorrect,
      sourceType: currentScenario.sourceType,
      difficulty: currentScenario.difficulty,
      mistakeTags: isCorrect ? [] : currentScenario.mistakeTags,
      conceptTags: currentScenario.keyConcepts,
      createdAt,
    };

    const nextSession: TrainingSession = {
      ...session,
      lastActivityAt: createdAt,
      attemptIds: nextAttemptIds,
      correctCount: nextCorrectCount,
      surfacedLeakTags: nextSurfacedLeakTags,
    };

    if (isAuthenticated) {
      setIsPersistingAttempt(true);
      setPersistenceError(null);
      void persistCloudQuizAttempt(attempt)
        .then(() => {
          setPersistenceError(null);
          void refreshPersistedProgressSummary();
        })
        .catch((error) => {
          setPersistenceError(
            error instanceof Error
              ? error.message
              : "Không thể đồng bộ câu trả lời mới nhất lên tài khoản đang đăng nhập.",
          );
        })
        .finally(() => {
          setIsPersistingAttempt(false);
        });
    } else {
      try {
        recordQuizAttempt(attempt);
        setPersistenceError(null);
      } catch {
        setPersistenceError("Không thể ghi tiến độ lên trình duyệt này.");
      }
    }

    setSession(nextSession);
    setAttemptIds(nextAttemptIds);
    setCorrectCount(nextCorrectCount);
    setSurfacedLeakTags(nextSurfacedLeakTags);

    setFeedback({
      attempt,
      selectedAction,
      recommendedAction,
    });
  }

  function handleNextScenario() {
    if (!feedback) {
      return;
    }

    if (currentIndex === activeScenarios.length - 1) {
      const completedAt = new Date().toISOString();
      const completedSession: TrainingSession = {
        ...session,
        lastActivityAt: completedAt,
        completedAt,
      };

      setSession(completedSession);
      setCompletionTimestamp(completedAt);
      setIsComplete(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedActionId(null);
    setFeedback(null);
  }

  function handleRestartSession() {
    const nextSession = createTrainingSession(
      module,
      activeScenarioIds,
    );

    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedActionId(null);
    setFeedback(null);
    setAttemptIds([]);
    setCorrectCount(0);
    setSurfacedLeakTags([]);
    setCompletionTimestamp(null);
    setIsComplete(activeScenarioIds.length === 0);
    setPersistenceError(null);
    setIsPersistingAttempt(false);
    setIsPersistingSession(false);
  }

  return {
    activeScenarios,
    availableDifficulties,
    retryQueueItems,
    currentRetryHint,
    currentScenario,
    currentIndex,
    selectedActionId,
    feedback,
    isComplete,
    questionNumber: currentIndex + 1,
    totalQuestions: activeScenarios.length,
    answeredCount: attemptIds.length,
    correctCount,
    accuracy:
      calculateAccuracy(correctCount, attemptIds.length),
    hasSubmitted: Boolean(feedback),
    isLastScenario: currentIndex === activeScenarios.length - 1,
    canSubmit: Boolean(selectedActionId) && !feedback,
    completionTimestamp,
    storageMode,
    isPersisting:
      storageMode === "account" && (isPersistingAttempt || isPersistingSession),
    persistenceError,
    overallProgressSummary,
    currentSessionSummary,
    handleSelectAction,
    handleSubmitAnswer,
    handleNextScenario,
    handleRestartSession,
  };
}
