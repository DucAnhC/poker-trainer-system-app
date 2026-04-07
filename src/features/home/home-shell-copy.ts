import type { SourceType, TrainingModuleId } from "@/types/training";

export type ShellLanguage = "en" | "vi";

type HomeShellCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  primaryCta: string;
  secondaryCta: string;
  tertiaryCta: string;
  heroChips: string[];
  snapshotTitle: string;
  snapshotLabels: {
    modules: string;
    spots: string;
    review: string;
    mode: string;
  };
  snapshotValues: {
    review: string;
    mode: string;
  };
  modulesEyebrow: string;
  modulesTitle: string;
  modulesDescription: string;
  loopTitle: string;
  loopBullets: string[];
  scopeTitle: string;
  scopeBullets: string[];
};

type ModuleShellCopy = {
  code: string;
  title: string;
  summary: string;
  focuses: string[];
  cta: string;
  footer: string;
  tone:
    | "emerald"
    | "cyan"
    | "amber"
    | "slate"
    | "rose"
    | "neutral";
};

const sourceLabels: Record<ShellLanguage, Record<SourceType, string>> = {
  vi: {
    simplification: "Simplified",
    baseline: "Baseline",
    exploit: "Exploit",
  },
  en: {
    simplification: "Simplified",
    baseline: "Baseline",
    exploit: "Exploit",
  },
};

const homeShellCopy: Record<ShellLanguage, HomeShellCopy> = {
  vi: {
    heroEyebrow: "Poker Decision Trainer",
    heroTitle: "Một nhịp training. Nhiều spot. Ít chữ hơn.",
    heroDescription:
      "Vào app là vào nhịp drill: chọn module, đọc nhanh, chốt line, review ngắn rồi lặp lại.",
    primaryCta: "Vào Preflop",
    secondaryCta: "Mở bảng học",
    tertiaryCta: "Cài đặt",
    heroChips: ["Nhìn nhanh", "Chọn nhanh", "Sửa nhanh"],
    snapshotTitle: "Snapshot hiện tại",
    snapshotLabels: {
      modules: "Module",
      spots: "Spot mẫu",
      review: "Review",
      mode: "Lưu",
    },
    snapshotValues: {
      review: "Hand Review",
      mode: "Cloud + Local",
    },
    modulesEyebrow: "Module",
    modulesTitle: "Chọn bài drill hiện tại.",
    modulesDescription: "Cùng một phong cách trainer. Cùng một nhịp ra quyết định.",
    loopTitle: "Nhịp học",
    loopBullets: ["Đọc spot nhanh", "Chốt line nhanh", "Review ngắn rồi lặp lại"],
    scopeTitle: "Hiện có",
    scopeBullets: [
      "Preflop, Pot Odds, Texture, Player Types, Postflop",
      "Hand Review, retry queue, local/cloud save",
      "Trainer tập trung, không phải chart viewer",
    ],
  },
  en: {
    heroEyebrow: "Poker Decision Trainer",
    heroTitle: "One training rhythm. More spots. Less clutter.",
    heroDescription:
      "Open the app, pick a module, read fast, lock a line, review briefly, and repeat.",
    primaryCta: "Open Preflop",
    secondaryCta: "Open dashboard",
    tertiaryCta: "Settings",
    heroChips: ["Fast read", "Fast decision", "Fast correction"],
    snapshotTitle: "Live snapshot",
    snapshotLabels: {
      modules: "Live modules",
      spots: "Sample spots",
      review: "Review",
      mode: "Save",
    },
    snapshotValues: {
      review: "Hand Review",
      mode: "Cloud + Local",
    },
    modulesEyebrow: "Modules",
    modulesTitle: "Pick the current drill.",
    modulesDescription: "One design language. One training rhythm.",
    loopTitle: "Training loop",
    loopBullets: ["Read the spot fast", "Lock the line fast", "Review briefly and repeat"],
    scopeTitle: "Current scope",
    scopeBullets: [
      "Preflop, Pot Odds, Texture, Player Types, Postflop",
      "Hand Review, retry queue, local/cloud save",
      "A focused trainer, not a chart library",
    ],
  },
};

const moduleShellCopy: Record<ShellLanguage, Record<TrainingModuleId, ModuleShellCopy>> = {
  vi: {
    preflop: {
      code: "PF",
      title: "Preflop Drill",
      summary: "Open, Fold, Call, 3-bet theo vị trí và stack.",
      focuses: ["Open/Fold", "Vs Open", "Stack"],
      cta: "Vào drill",
      footer: "Decision",
      tone: "emerald",
    },
    "pot-odds": {
      code: "ODDS",
      title: "Pot Odds",
      summary: "Tính giá call, outs và equity nhanh hơn.",
      focuses: ["Price", "Outs", "Equity"],
      cta: "Làm quiz",
      footer: "Math",
      tone: "cyan",
    },
    "board-texture": {
      code: "TEXT",
      title: "Board Texture",
      summary: "Đọc board khô, động và range interaction.",
      focuses: ["Dry", "Dynamic", "Range"],
      cta: "Vào quiz",
      footer: "Pattern",
      tone: "amber",
    },
    postflop: {
      code: "POST",
      title: "Postflop",
      summary: "C-bet, barrel, pot control và line cơ bản.",
      focuses: ["C-bet", "Turn", "Control"],
      cta: "Vào trainer",
      footer: "Street",
      tone: "slate",
    },
    "player-types": {
      code: "TYPE",
      title: "Player Types",
      summary: "Chỉnh line theo archetype, baseline và exploit.",
      focuses: ["Reads", "Exploit", "Adjust"],
      cta: "Vào quiz",
      footer: "Adjust",
      tone: "rose",
    },
    "hand-review": {
      code: "REV",
      title: "Hand Review",
      summary: "Ghi note hand, gắn leak và giữ bài học rõ ràng.",
      focuses: ["Notes", "Leaks", "Review"],
      cta: "Mở review",
      footer: "Review",
      tone: "neutral",
    },
  },
  en: {
    preflop: {
      code: "PF",
      title: "Preflop Drill",
      summary: "Open, fold, call, and 3-bet spots with position and stack context.",
      focuses: ["Open/Fold", "Vs Open", "Stack"],
      cta: "Open drill",
      footer: "Decision drill",
      tone: "emerald",
    },
    "pot-odds": {
      code: "ODDS",
      title: "Pot Odds",
      summary: "Quick price, outs, and equity decisions.",
      focuses: ["Price", "Outs", "Equity"],
      cta: "Open quiz",
      footer: "Math drill",
      tone: "cyan",
    },
    "board-texture": {
      code: "TEXT",
      title: "Board Texture",
      summary: "Read dry, dynamic, and range-interaction boards faster.",
      focuses: ["Dry", "Dynamic", "Range"],
      cta: "Open quiz",
      footer: "Pattern drill",
      tone: "amber",
    },
    postflop: {
      code: "POST",
      title: "Postflop",
      summary: "Train c-bets, barrels, and practical postflop branches.",
      focuses: ["C-bet", "Turn", "Control"],
      cta: "Open trainer",
      footer: "Street drill",
      tone: "slate",
    },
    "player-types": {
      code: "TYPE",
      title: "Player Types",
      summary: "Adjust cleanly against common archetypes and exploit lines.",
      focuses: ["Reads", "Exploit", "Adjust"],
      cta: "Open quiz",
      footer: "Adjustment drill",
      tone: "rose",
    },
    "hand-review": {
      code: "REV",
      title: "Hand Review",
      summary: "Store notes, leak tags, and short lessons from real hands.",
      focuses: ["Notes", "Leaks", "Review"],
      cta: "Open review",
      footer: "Review route",
      tone: "neutral",
    },
  },
};

export function getShellLanguage(locale: string): ShellLanguage {
  return locale === "vi-VN" ? "vi" : "en";
}

export function getHomeShellCopy(language: ShellLanguage) {
  return homeShellCopy[language];
}

export function getModuleShellCopy(
  moduleId: TrainingModuleId,
  language: ShellLanguage,
) {
  return moduleShellCopy[language][moduleId];
}

export function getSourceShellLabel(
  sourceType: SourceType,
  language: ShellLanguage,
) {
  return sourceLabels[language][sourceType];
}
