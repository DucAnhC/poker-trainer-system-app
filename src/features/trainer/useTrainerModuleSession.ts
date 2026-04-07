"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  getContentPacksForModule,
  getPrimaryContentPack,
} from "@/data/content-packs";
import { trainingModules } from "@/data/training-modules";
import { useTrainingSession } from "@/features/trainer/useTrainingSession";
import type {
  ContentPack,
  Difficulty,
  DifficultyProgressRecord,
  InteractiveTrainingModuleId,
  ModuleProgressRecord,
  TrainingDifficultyFilter,
  TrainingScenario,
  TrainerQueueMode,
} from "@/types/training";

type ScopedModuleProgress = ModuleProgressRecord | DifficultyProgressRecord;

function normalizeDifficultyFilter(
  value: string | null,
): TrainingDifficultyFilter | null {
  if (value === "beginner" || value === "intermediate" || value === "advanced-lite") {
    return value;
  }

  if (value === "all") {
    return "all";
  }

  return null;
}

export function useTrainerModuleSession<T extends TrainingScenario>(
  moduleId: InteractiveTrainingModuleId,
  scenarios: T[],
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const availableContentPacks = getContentPacksForModule(moduleId);
  const requestedPackId = searchParams.get("pack");
  const requestedDifficulty = normalizeDifficultyFilter(
    searchParams.get("difficulty"),
  );
  const defaultPackId = availableContentPacks[0]?.id ?? null;
  const requestedPackIsValid = availableContentPacks.some(
    (contentPack) => contentPack.id === requestedPackId,
  );

  const [selectedContentPackId, setSelectedContentPackId] = useState<string | null>(
    requestedPackIsValid ? requestedPackId : defaultPackId,
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<TrainingDifficultyFilter>(requestedDifficulty ?? "all");
  const [queueMode, setQueueMode] = useState<TrainerQueueMode>("adaptive");

  useEffect(() => {
    const nextPackId = requestedPackIsValid ? requestedPackId : defaultPackId;

    if (nextPackId && nextPackId !== selectedContentPackId) {
      setSelectedContentPackId(nextPackId);
    }
  }, [defaultPackId, requestedPackId, requestedPackIsValid, selectedContentPackId]);

  useEffect(() => {
    if (requestedDifficulty && requestedDifficulty !== selectedDifficulty) {
      setSelectedDifficulty(requestedDifficulty);
    }
  }, [requestedDifficulty, selectedDifficulty]);

  const filteredScenarios = useMemo(
    () =>
      selectedContentPackId
        ? scenarios.filter(
            (scenario) => scenario.contentPackId === selectedContentPackId,
          )
        : scenarios,
    [scenarios, selectedContentPackId],
  );

  const availablePackDifficulties = useMemo(
    () =>
      [...new Set(filteredScenarios.map((scenario) => scenario.difficulty))] as Difficulty[],
    [filteredScenarios],
  );

  useEffect(() => {
    if (
      selectedDifficulty !== "all" &&
      !availablePackDifficulties.includes(selectedDifficulty)
    ) {
      setSelectedDifficulty("all");
    }
  }, [availablePackDifficulties, selectedDifficulty]);

  useEffect(() => {
    const currentQuery = searchParams.toString();
    const nextParams = new URLSearchParams(currentQuery);

    if (selectedContentPackId) {
      nextParams.set("pack", selectedContentPackId);
    } else {
      nextParams.delete("pack");
    }

    if (selectedDifficulty !== "all") {
      nextParams.set("difficulty", selectedDifficulty);
    } else {
      nextParams.delete("difficulty");
    }

    const nextQuery = nextParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [
    pathname,
    router,
    searchParams,
    selectedContentPackId,
    selectedDifficulty,
  ]);

  const session = useTrainingSession(moduleId, filteredScenarios, {
    difficultyFilter: selectedDifficulty,
    queueMode,
  });
  const activeContentPack =
    (selectedContentPackId ? availableContentPacks.find(
      (contentPack) => contentPack.id === selectedContentPackId,
    ) : null) ??
    getPrimaryContentPack(moduleId) ??
    createFallbackContentPack(moduleId);
  const moduleProgress = session.overallProgressSummary.moduleProgress[moduleId];
  const scopedProgress: ScopedModuleProgress =
    selectedDifficulty === "all"
      ? moduleProgress
      : moduleProgress.difficultyProgress[selectedDifficulty];

  return {
    activeContentPack,
    availableContentPacks,
    moduleProgress,
    queueMode,
    scopedProgress,
    selectedContentPackId,
    selectedDifficulty,
    session,
    setQueueMode,
    setSelectedContentPackId,
    setSelectedDifficulty,
  };
}

function createFallbackContentPack(
  moduleId: InteractiveTrainingModuleId,
): ContentPack {
  const moduleDefinition = trainingModules.find(
    (candidateModule) => candidateModule.id === moduleId,
  );

  return {
    id: `${moduleId}-fallback-pack`,
    moduleId,
    title: moduleDefinition?.title ?? "Training Pack",
    focusLabel: "Core concepts",
    summary:
      moduleDefinition?.summary ??
      "Core scenarios for this trainer module while the content pack metadata catches up.",
    route: moduleDefinition?.route ?? "/dashboard",
    conceptTags: [moduleId],
    difficultyFocus: ["beginner", "intermediate", "advanced-lite"],
    learningHighlights: ["Core module coverage"],
    relatedPackIds: [],
    studyPathOrder: 999,
  };
}
