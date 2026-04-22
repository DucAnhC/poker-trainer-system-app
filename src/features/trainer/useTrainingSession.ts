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
} from "@/lib/training/retry-queue";
import {
  buildRetryQueueSignature,
  buildTrainerSessionConfigSignature,
  buildTrainerSessionPlan,
  shouldRefreshTrainerSessionPlan,
  type TrainerSessionPlan,
} from "@/lib/training/session-plan";
import { createTrainingSession } from "@/lib/training/session-state";
import type {
  Difficulty,
  InteractiveTrainingModuleId,
  ProgressSummary,
  QuizAttempt,
  RetryQueueItem,
  SubmittedAnswerFeedback,
  TrainingAnswerPhase,
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

function sortDifficulties(left: Difficulty, right: Difficulty) {
  return difficultyLevels.indexOf(left) - difficultyLevels.indexOf(right);
}

const SAVE_INDICATOR_DELAY_MS = 180;
const SAVE_INDICATOR_MIN_VISIBLE_MS = 700;

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

  const liveRetryQueueItems = useMemo(
    () =>
      getModuleRetryQueueItems(
        overallProgressSummary.retryQueue,
        module,
        difficultyFilter,
      ),
    [difficultyFilter, module, overallProgressSummary.retryQueue],
  );

  const sessionConfigSignature = useMemo(
    () =>
      buildTrainerSessionConfigSignature({
        moduleId: module,
        difficultyFilter,
        queueMode,
        scenarios: filteredScenarios,
      }),
    [difficultyFilter, filteredScenarios, module, queueMode],
  );
  const retryQueueSignature = useMemo(
    () => buildRetryQueueSignature(liveRetryQueueItems),
    [liveRetryQueueItems],
  );
  const [sessionPlan, setSessionPlan] = useState<TrainerSessionPlan<T>>(() =>
    buildTrainerSessionPlan({
      scenarios: filteredScenarios,
      retryQueueItems: liveRetryQueueItems,
      queueMode,
    }),
  );

  const [session, setSession] = useState<TrainingSession>(() =>
    createTrainingSession(module, sessionPlan.scenarioIds),
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [answerPhase, setAnswerPhase] = useState<TrainingAnswerPhase>("idle");
  const [feedback, setFeedback] = useState<SubmittedAnswerFeedback | null>(null);
  const [attemptIds, setAttemptIds] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [surfacedLeakTags, setSurfacedLeakTags] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(
    sessionPlan.scenarioIds.length === 0,
  );
  const [completionTimestamp, setCompletionTimestamp] = useState<string | null>(
    null,
  );
  const [isSaveIndicatorVisible, setIsSaveIndicatorVisible] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const sessionConfigSignatureRef = useRef(sessionConfigSignature);
  const retryQueueSignatureRef = useRef(retryQueueSignature);
  const hasSubmittedCurrentScenarioRef = useRef(false);
  const isSaveIndicatorVisibleRef = useRef(false);
  const pendingVisibleSaveCountRef = useRef(0);
  const saveIndicatorDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const saveIndicatorHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const saveIndicatorShownAtRef = useRef<number | null>(null);
  const shouldShowNextSessionSaveRef = useRef(false);

  const clearSaveIndicatorTimers = useCallback(() => {
    if (saveIndicatorDelayTimeoutRef.current) {
      clearTimeout(saveIndicatorDelayTimeoutRef.current);
      saveIndicatorDelayTimeoutRef.current = null;
    }

    if (saveIndicatorHideTimeoutRef.current) {
      clearTimeout(saveIndicatorHideTimeoutRef.current);
      saveIndicatorHideTimeoutRef.current = null;
    }
  }, []);

  const setSaveIndicatorVisibility = useCallback((nextVisibility: boolean) => {
    isSaveIndicatorVisibleRef.current = nextVisibility;
    setIsSaveIndicatorVisible(nextVisibility);
  }, []);

  const beginVisibleSave = useCallback(() => {
    pendingVisibleSaveCountRef.current += 1;

    if (saveIndicatorHideTimeoutRef.current) {
      clearTimeout(saveIndicatorHideTimeoutRef.current);
      saveIndicatorHideTimeoutRef.current = null;
    }

    if (isSaveIndicatorVisibleRef.current || saveIndicatorDelayTimeoutRef.current) {
      return;
    }

    saveIndicatorDelayTimeoutRef.current = setTimeout(() => {
      saveIndicatorDelayTimeoutRef.current = null;

      if (pendingVisibleSaveCountRef.current <= 0) {
        return;
      }

      saveIndicatorShownAtRef.current = Date.now();
      setSaveIndicatorVisibility(true);
    }, SAVE_INDICATOR_DELAY_MS);
  }, [setSaveIndicatorVisibility]);

  const endVisibleSave = useCallback(() => {
    pendingVisibleSaveCountRef.current = Math.max(
      0,
      pendingVisibleSaveCountRef.current - 1,
    );

    if (pendingVisibleSaveCountRef.current > 0) {
      return;
    }

    if (saveIndicatorDelayTimeoutRef.current) {
      clearTimeout(saveIndicatorDelayTimeoutRef.current);
      saveIndicatorDelayTimeoutRef.current = null;
    }

    if (!isSaveIndicatorVisibleRef.current) {
      return;
    }

    const shownAt = saveIndicatorShownAtRef.current ?? Date.now();
    const elapsed = Date.now() - shownAt;
    const remainingVisibleTime = Math.max(
      SAVE_INDICATOR_MIN_VISIBLE_MS - elapsed,
      0,
    );

    if (saveIndicatorHideTimeoutRef.current) {
      clearTimeout(saveIndicatorHideTimeoutRef.current);
    }

    saveIndicatorHideTimeoutRef.current = setTimeout(() => {
      saveIndicatorHideTimeoutRef.current = null;
      saveIndicatorShownAtRef.current = null;
      setSaveIndicatorVisibility(false);
    }, remainingVisibleTime);
  }, [setSaveIndicatorVisibility]);

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

  const activeScenarios = sessionPlan.scenarios;
  const retryQueueItems = sessionPlan.retryQueueItems;
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

  useEffect(
    () => () => {
      clearSaveIndicatorTimers();
    },
    [clearSaveIndicatorTimers],
  );

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    if (isAuthenticated) {
      let isCancelled = false;
      const showVisibleSave = shouldShowNextSessionSaveRef.current;
      shouldShowNextSessionSaveRef.current = false;

      if (showVisibleSave) {
        beginVisibleSave();
      }

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
            if (showVisibleSave) {
              endVisibleSave();
            }
          }
        });

      return () => {
        isCancelled = true;
      };
    }

    setPersistenceError(null);
    pendingVisibleSaveCountRef.current = 0;
    shouldShowNextSessionSaveRef.current = false;
    clearSaveIndicatorTimers();
    saveIndicatorShownAtRef.current = null;
    setSaveIndicatorVisibility(false);
    try {
      recordTrainingSession(session);
    } catch {
      setPersistenceError("Không thể ghi tiến độ lên trình duyệt này.");
    }
  }, [
    authStatus,
    beginVisibleSave,
    endVisibleSave,
    isAuthenticated,
    refreshPersistedProgressSummary,
    session,
    clearSaveIndicatorTimers,
    setSaveIndicatorVisibility,
  ]);

  useEffect(() => {
    void refreshPersistedProgressSummary();
  }, [
    refreshPersistedProgressSummary,
    attemptIds.length,
    completionTimestamp,
    authSession?.user?.id,
  ]);

  const isSessionPristine =
    currentIndex === 0 &&
    answerPhase === "idle" &&
    !feedback &&
    attemptIds.length === 0 &&
    !completionTimestamp;

  useEffect(() => {
    if (
      !shouldRefreshTrainerSessionPlan({
        currentConfigSignature: sessionConfigSignatureRef.current,
        nextConfigSignature: sessionConfigSignature,
        currentRetryQueueSignature: retryQueueSignatureRef.current,
        nextRetryQueueSignature: retryQueueSignature,
        isSessionPristine,
      })
    ) {
      return;
    }

    const nextPlan = buildTrainerSessionPlan({
      scenarios: filteredScenarios,
      retryQueueItems: liveRetryQueueItems,
      queueMode,
    });
    const nextSession = createTrainingSession(
      module,
      nextPlan.scenarioIds,
    );

    sessionConfigSignatureRef.current = sessionConfigSignature;
    retryQueueSignatureRef.current = retryQueueSignature;
    hasSubmittedCurrentScenarioRef.current = false;
    setSessionPlan(nextPlan);
    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedActionId(null);
    setAnswerPhase("idle");
    setFeedback(null);
    setAttemptIds([]);
    setCorrectCount(0);
    setSurfacedLeakTags([]);
    setCompletionTimestamp(null);
    setIsComplete(nextPlan.scenarioIds.length === 0);
    setPersistenceError(null);
    pendingVisibleSaveCountRef.current = 0;
    shouldShowNextSessionSaveRef.current = false;
    clearSaveIndicatorTimers();
    saveIndicatorShownAtRef.current = null;
    setSaveIndicatorVisibility(false);
  }, [
    answerPhase,
    attemptIds.length,
    clearSaveIndicatorTimers,
    completionTimestamp,
    feedback,
    filteredScenarios,
    isSessionPristine,
    liveRetryQueueItems,
    module,
    queueMode,
    retryQueueSignature,
    sessionConfigSignature,
    setSaveIndicatorVisibility,
  ]);

  function handleSelectAction(actionId: string) {
    if (
      feedback ||
      isComplete ||
      answerPhase === "revealed" ||
      answerPhase === "next-ready"
    ) {
      return;
    }

    setSelectedActionId(actionId);
    setAnswerPhase("selected");
  }

  function handleSubmitAnswer() {
    if (
      !currentScenario ||
      !selectedActionId ||
      feedback ||
      answerPhase !== "selected" ||
      hasSubmittedCurrentScenarioRef.current
    ) {
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

    hasSubmittedCurrentScenarioRef.current = true;

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
      setPersistenceError(null);
      beginVisibleSave();
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
          endVisibleSave();
        });
    } else {
      try {
        recordQuizAttempt(attempt);
        setPersistenceError(null);
      } catch {
        setPersistenceError("Không thể ghi tiến độ lên trình duyệt này.");
      }
    }

    if (isAuthenticated) {
      shouldShowNextSessionSaveRef.current = true;
    }

    setSession(nextSession);
    setAttemptIds(nextAttemptIds);
    setCorrectCount(nextCorrectCount);
    setSurfacedLeakTags(nextSurfacedLeakTags);
    setAnswerPhase("revealed");
    setFeedback({
      attempt,
      selectedAction,
      recommendedAction,
    });
  }

  function handleNextScenario() {
    if (!feedback || (answerPhase !== "revealed" && answerPhase !== "next-ready")) {
      return;
    }

    if (currentIndex === activeScenarios.length - 1) {
      const completedAt = new Date().toISOString();
      const completedSession: TrainingSession = {
        ...session,
        lastActivityAt: completedAt,
        completedAt,
      };

      if (isAuthenticated) {
        shouldShowNextSessionSaveRef.current = true;
      }

      setSession(completedSession);
      setCompletionTimestamp(completedAt);
      setIsComplete(true);
      return;
    }

    hasSubmittedCurrentScenarioRef.current = false;
    setCurrentIndex((index) => index + 1);
    setSelectedActionId(null);
    setAnswerPhase("idle");
    setFeedback(null);
  }

  function handleRetryCurrentScenario() {
    if (!currentScenario || !feedback || isComplete) {
      return;
    }

    hasSubmittedCurrentScenarioRef.current = false;
    setSelectedActionId(null);
    setAnswerPhase("idle");
    setFeedback(null);
  }

  function handleRestartSession() {
    const nextPlan = buildTrainerSessionPlan({
      scenarios: filteredScenarios,
      retryQueueItems: liveRetryQueueItems,
      queueMode,
    });
    const nextSession = createTrainingSession(
      module,
      nextPlan.scenarioIds,
    );

    sessionConfigSignatureRef.current = sessionConfigSignature;
    retryQueueSignatureRef.current = retryQueueSignature;
    hasSubmittedCurrentScenarioRef.current = false;
    setSessionPlan(nextPlan);
    setSession(nextSession);
    setCurrentIndex(0);
    setSelectedActionId(null);
    setAnswerPhase("idle");
    setFeedback(null);
    setAttemptIds([]);
    setCorrectCount(0);
    setSurfacedLeakTags([]);
    setCompletionTimestamp(null);
    setIsComplete(nextPlan.scenarioIds.length === 0);
    setPersistenceError(null);
    pendingVisibleSaveCountRef.current = 0;
    shouldShowNextSessionSaveRef.current = false;
    clearSaveIndicatorTimers();
    saveIndicatorShownAtRef.current = null;
    setSaveIndicatorVisibility(false);
  }

  return {
    activeScenarios,
    availableDifficulties,
    retryQueueItems,
    currentRetryHint,
    currentScenario,
    currentIndex,
    selectedActionId,
    answerPhase,
    feedback,
    isComplete,
    questionNumber: currentIndex + 1,
    totalQuestions: activeScenarios.length,
    answeredCount: attemptIds.length,
    correctCount,
    accuracy:
      calculateAccuracy(correctCount, attemptIds.length),
    hasSubmitted:
      answerPhase === "revealed" || answerPhase === "next-ready",
    isLastScenario: currentIndex === activeScenarios.length - 1,
    canSubmit:
      answerPhase === "selected" &&
      Boolean(selectedActionId) &&
      !hasSubmittedCurrentScenarioRef.current,
    canAdvance:
      (answerPhase === "revealed" || answerPhase === "next-ready") &&
      Boolean(feedback),
    canRetryCurrentScenario: Boolean(currentScenario && feedback && !isComplete),
    completionTimestamp,
    storageMode,
    isPersisting: storageMode === "account" && isSaveIndicatorVisible,
    persistenceError,
    overallProgressSummary,
    currentSessionSummary,
    handleSelectAction,
    handleSubmitAnswer,
    handleNextScenario,
    handleRetryCurrentScenario,
    handleRestartSession,
  };
}
