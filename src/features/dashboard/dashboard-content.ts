import { playerArchetypes } from "@/data/player-archetypes";
import { positions } from "@/data/positions";
import { allScenarios, scenarioCountByModule } from "@/data/scenarios";
import { stackDepths } from "@/data/stack-depths";
import { trainingModules } from "@/data/training-modules";

export const dashboardHighlights = [
  {
    label: "Phase status",
    value: "Phase 10 live",
    detail:
      "Training, review, adaptive retries, study-path guidance, account-backed persistence, and the settings/history layer now include deploy-focused docs plus a post-deploy validation path.",
  },
  {
    label: "Interactive modules",
    value: `${trainingModules.filter((module) => module.phaseStatus === "interactive").length}`,
    detail:
      "Hand review sits alongside five live training modules, with clearer recent activity, sync utilities, a settings area, and lightweight account-friendly analytics.",
  },
  {
    label: "Sample scenarios",
    value: `${allScenarios.length}`,
    detail: "Mock scenarios now power live early training sessions and dashboard summaries.",
  },
  {
    label: "Teaching anchors",
    value: `${positions.length} positions / ${playerArchetypes.length} archetypes`,
    detail: `Stack buckets scaffolded: ${stackDepths.map((stackDepth) => stackDepth.id).join(", ")}`,
  },
] as const;

export const dashboardChecklist = [
  "Decision quality stays ahead of one-hand results.",
  "Ranges, stack depth, board texture, and player types all stay visible in the content model.",
  "Simplifications, baseline recommendations, and exploits stay labeled inside structured feedback.",
  "Leak tags and review notes now feed back into progress and next-step guidance.",
  "Session history, weak-session summaries, and reset/export/import stay transparent across local and account modes.",
  "Postflop training stays practical and scoped instead of pretending to solve every tree.",
  "Mock data is small, typed, and authoring-validated so it can grow cleanly while backend persistence focuses only on user data.",
] as const;

export const dashboardScenarioSummary = trainingModules.map((module) => ({
  moduleId: module.id,
  title: module.title,
  route: module.route,
  count: scenarioCountByModule[module.id] ?? 0,
}));
