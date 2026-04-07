import type {
  Difficulty,
  InteractiveTrainingModuleId,
  SourceType,
  TrainerQueueMode,
} from "@/types/training";

export type UiLanguage = "en" | "vi";

type ModuleTrainerCopy = {
  eyebrow: string;
  activeTitle: string;
  activeDescription: string;
  statusPill: string;
  answerTitle: string;
  answerDescription: string;
  feedbackPlaceholder: string;
  completionTitle: string;
  completionDescription: string;
  recapTitle: string;
  recapBullets: string[];
  restartButton: string;
  emptyAny: string;
  emptyByDifficulty: (difficultyLabel: string) => string;
  completionStoredAccount: string;
  completionStoredLocal: string;
};

export const uiCopy = {
  en: {
    locale: "en-US",
    appName: "Poker Trainer System",
    header: {
      tagline: "Fast read. Fast decision. Fast correction.",
    },
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      settings: "Settings",
      preflop: "Preflop Trainer",
      "pot-odds": "Pot Odds Quiz",
      "board-texture": "Board Texture",
      postflop: "Postflop Trainer",
      "player-types": "Player Types",
      review: "Hand Review",
    },
    language: {
      label: "UI language",
      english: "EN",
      vietnamese: "VI",
    },
    authStatus: {
      checking: "Checking account",
      accountSyncOn: "Account sync on",
      accountModeDescription:
        "Progress, sessions, and review notes sync to your account.",
      localMode: "Local mode",
      localModeDescription: "Progress stays in this browser until you sign in.",
      settings: "Settings",
      signIn: "Sign in",
      signOut: "Sign out",
      signedInFallback: "Signed in",
    },
    authPage: {
      accountModeEyebrow: "Account mode",
      alreadySignedInTitle: "You are already signed in",
      alreadySignedInDescription:
        "Your study data can sync to the account now. If this browser still has separate local data, import tools stay available from the dashboard or settings.",
      backToDashboard: "Return to dashboard",
      openSettings: "Open settings",
      accessEyebrow: "Account access",
      signInTitle: "Sign in",
      createAccountTitle: "Create account",
      intro:
        "Local mode still works, but signing in keeps progress, sessions, and review notes in sync.",
      signInTab: "Sign in",
      createAccountTab: "Create account",
      displayName: "Display name",
      optional: "Optional",
      email: "Email",
      password: "Password",
      passwordHint: "Minimum 8 characters",
      submitWorking: "Working...",
      syncAvailable: "Account sync available",
      localModeSupported: "Local mode still supported",
      manualMerge: "Manual merge keeps local copy",
      missingCredentials: "Enter both email and password.",
      createAccountFailed: "Failed to create the account.",
      signInFailed: "Sign-in failed. Check your email and password.",
      accountCreated: "Account created and signed in successfully.",
      signedInSuccess: "Signed in successfully.",
      authenticationFailed: "Authentication failed.",
    },
    settings: {
      eyebrow: "Settings",
      title: "Account and study data",
      description:
        "Keep sync, backups, and recent study history in one practical place.",
      loadingTitle: "Loading",
      loadingDescription: "Reading current study data.",
      gettingStartedEyebrow: "Getting started",
      noDataTitle: "No saved study data yet",
      noDataSignedIn:
        "Your account is ready. Start a module, add a review note, or import local browser data.",
      noDataSignedOut:
        "You can stay local or sign in later. Start a module or add a review note first.",
      openDashboard: "Open dashboard",
      addReview: "Add a review note",
      signInLater: "Sign in later for sync",
      loadIssue: "Load issue",
      retryLoading: "Retry loading saved data",
      signedInAs: (email: string) => `Signed in as ${email}.`,
      savedAnswersDescription:
        "Saved trainer answers across the current persistence mode.",
      persistenceMode: "Persistence mode",
      totalAttempts: "Total attempts",
      overallAccuracy: "Overall accuracy",
      lastSavedActivity: "Last saved activity",
      accountValue: "Account",
      localValue: "Local",
      localDescription:
        "Progress and review notes are still fully usable without signing in.",
      overallAccuracyNote: "A practical study signal, not solver analytics.",
      lastSavedActivityNote: "Most recent persisted session or review update.",
      refreshing: "Refreshing",
      cloudMode: "Cloud-backed mode",
      localMode: "Local mode",
    },
    accountControls: {
      eyebrow: "Account controls",
      titleAccount: "Manage synced study data",
      titleLocal: "Move between local and account modes",
      descriptionAccount: (email: string) =>
        `Signed in as ${email}. Refresh saved data, manage sign-out, or jump back into study quickly.`,
      descriptionLocal:
        "Local mode stays fully usable. Sign in later only when you want account-backed progress.",
      currentSnapshot: "Current snapshot",
      accountBackedData: "Account-backed data",
      browserLocalData: "Browser-local data",
      noSavedActivity: "No saved activity yet",
      lastSavedActivity: "Last saved activity",
      nextSafeAction: "Next safe action",
      importToolsBelow: "Review import tools below",
      keepTrainingOrRefresh: "Keep training or refresh data",
      keepTrainingLocal: "Keep training locally or create an account",
      localBackupWaiting: (attempts: number, notes: number) =>
        `This browser still has ${attempts} local attempts and ${notes} local review notes ready for manual merge.`,
      noSeparateLocalData: "No separate browser-only study data is waiting right now.",
      localModeHelp:
        "Sign in only when you want account-backed persistence. Local trainer flow still works normally.",
      signedInMode: "Signed-in mode",
      localMode: "Local mode",
      signedInAccount: "Signed-in account",
      accountSyncOptional: "Account sync is optional",
      localBackupWaitingPill: "Local backup waiting",
      refreshSavedData: "Refresh saved data",
      refreshing: "Refreshing...",
      signOut: "Sign out",
      signInOrCreate: "Sign in or create account",
      openDashboard: "Open dashboard",
      openHandReview: "Open hand review",
    },
    localDataTools: {
      eyebrow: "Local data tools",
      title: "Export, import, or reset safely",
      descriptionAccount:
        "These tools manage browser-local backups alongside account sync. Export and reset stay local. Import-to-account merges and keeps the current local copy.",
      descriptionLocal:
        "These tools only affect this browser. Import replaces the local snapshot, and reset clears local progress after confirmation.",
      noLocalDataToExport: "There is no saved local browser data to export yet.",
      exportedBackup: (attempts: number, sessions: number, notes: number) =>
        `Local browser backup exported as JSON with ${attempts} attempts, ${sessions} sessions, and ${notes} review notes.`,
      importApplied: (attempts: number, sessions: number, notes: number) =>
        `Local browser backup imported successfully. This browser now has ${attempts} attempts, ${sessions} sessions, and ${notes} review notes.`,
      localImportConfirm: (
        importedAttempts: number,
        importedSessions: number,
        importedNotes: number,
        currentAttempts: number,
        currentSessions: number,
        currentNotes: number,
      ) =>
        `Import this JSON backup and replace the current browser snapshot?\n\nImported file: ${importedAttempts} attempts, ${importedSessions} sessions, ${importedNotes} review notes.\nCurrent browser data: ${currentAttempts} attempts, ${currentSessions} sessions, ${currentNotes} review notes.`,
      importCanceled: "Import canceled. Current local progress was not changed.",
      importReadFailed: "Import failed while reading the selected file.",
      noLocalDataToAccount:
        "No local browser data was found to import into the signed-in account.",
      accountImportConfirm:
        "Merge this browser's local progress and review notes into the signed-in account? Existing account data will be kept, matching items merge by id, and the local browser copy will stay in place.",
      accountImportCanceled:
        "Account import canceled. Local browser data was not changed.",
      accountImportDone: (attempts: number, sessions: number, notes: number) =>
        `The account now shows ${attempts} attempts, ${sessions} sessions, and ${notes} review notes.`,
      accountImportFailed:
        "Failed to import local data into the signed-in account.",
      noLocalDataToReset: "There is no local browser data to reset right now.",
      resetConfirm: (attempts: number, sessions: number, notes: number) =>
        `Reset all local training progress, sessions, and review notes in this browser?\n\nThis will remove ${attempts} attempts, ${sessions} sessions, and ${notes} review notes from this browser only.`,
      resetCanceled: "Reset canceled. Current local data was kept.",
      resetDone:
        "All local training progress and review notes were reset in this browser. Account-backed data, if any, was not touched.",
      localBrowserBackup: "Local browser backup",
      readyForBackup: "Ready for backup or merge",
      noLocalDataSaved: "No local data saved",
      localBackupSummary: (attempts: number, sessions: number, notes: number) =>
        `${attempts} attempts, ${sessions} sessions, and ${notes} review notes currently live in this browser.`,
      signedInAccount: "Signed-in account",
      importBehavior: "Import behavior",
      accountDataExists: "Account data already exists",
      accountReadyFirstImport: "Account is ready for its first import",
      localImportReplacesSnapshot: "Local import replaces this browser snapshot",
      accountSummary: (attempts: number, sessions: number, notes: number, email: string) =>
        `${attempts} attempts, ${sessions} sessions, and ${notes} review notes are currently saved for ${email}.`,
      localImportHelp:
        "JSON imports replace the local browser snapshot only after confirmation. Reset also stays local and never touches account data.",
      mergeByStableIds: "Merge by stable ids",
      localCopyStays: "Local copy stays in place",
      existingAccountDataKept: "Existing account data is kept",
      mergeExplanation:
        "Importing local data into the account is additive and merge-oriented. The app does not silently wipe either side.",
      exportJson: "Export JSON",
      noLocalDataExportButton: "No local data to export",
      importJson: "Import JSON",
      resetLocalData: "Reset local",
      noLocalDataResetButton: "No local data to reset",
      importing: "Importing...",
      importLocalToAccount: "Import local data to account",
      noLocalDataImportButton: "No local data to import",
      localBackupTools: "Local backup tools",
      localOnly: "Local only",
      syncingTo: (email: string) => `Syncing to ${email}`,
      jsonValidation: "JSON validation on import",
      resetRequiresConfirm: "Reset requires confirmation",
      neutral: "Note",
      success: "Done",
      danger: "Issue",
    },
    accountMode: {
      eyebrow: "Account state",
      titleAccount: "Signed-in sync is active",
      titleLocal: "Local study mode is active",
      descriptionAccount: (email: string) =>
        `Progress, sessions, and review notes now save to ${email}. The dashboard reads the account snapshot first and still keeps local browser tools available below.`,
      descriptionLocal:
        "You can keep training without an account. Progress, sessions, and review notes stay in this browser until you sign in for sync.",
      cloudBackedMode: "Cloud-backed mode",
      localOnlyMode: "Local-only mode",
      signInWhenReady: "Sign in when you want sync",
      localBackupStillAvailable: "Local backup still available",
      currentSource: "Current source",
      accountSnapshot: "Account snapshot",
      browserSnapshot: "Browser snapshot",
      savedSummary: (attempts: number, sessions: number, notes: number) =>
        `${attempts} attempts, ${sessions} sessions, and ${notes} review notes saved.`,
      lastSavedActivity: "Last saved activity",
      noSavedActivity: "No saved activity yet",
      syncGuidance: "Sync guidance",
      separateBackupExists: "A separate local backup exists",
      noExtraImportWaiting: "No extra local import is waiting",
      accountModeOptional: "Account mode is optional",
      localBackupWaiting: (attempts: number, notes: number) =>
        `This browser still has ${attempts} local attempts and ${notes} local review notes available for manual merge.`,
      noExtraLocalData:
        "This browser does not currently have extra local study data waiting to merge.",
      localModeHelp:
        "Signing in keeps the current trainer flow intact while making progress, sessions, and review notes available beyond this browser.",
      signInForSync: "Sign in for sync",
      keepStudyingLocal: "Keep studying locally",
    },
    recentSessions: {
      eyebrow: "Recent activity",
      title: "Session history",
      descriptionAccount:
        "Each session is one module run stored for the signed-in account. Active runs stay visible so you can resume later.",
      descriptionLocal:
        "Each session is one module run stored in this browser. Active runs stay visible so you can resume later.",
      completed: "Completed",
      active: "Active",
      lastActivity: "Last activity",
      resumeModule: "Resume module",
      openModule: "Open module",
      attempted: (count: number) => `${count} attempted`,
      correct: (count: number) => `${count} correct`,
      accuracy: (value: string) => `${value} accuracy`,
      noRepeatLeakTags: "No repeat leak tags surfaced",
      emptyAccount:
        "No account-backed training sessions have been saved yet. Finish a module run and it will show up here.",
      emptyLocal:
        "No local training sessions have been saved yet. Start a module and recent activity will appear here.",
    },
    studyTimeline: {
      eyebrow: "Study timeline",
      title: "Recent training and review history",
      descriptionAccount:
        "This timeline blends account-backed sessions and review notes so the recent study block is easier to read.",
      descriptionLocal:
        "This timeline blends local sessions and review notes so recent study flow is easier to scan.",
      noRepeatLeakTags: "No repeat leak tags surfaced",
      noManualLeakTags: "No manual leak tags assigned",
      emptyAccount:
        "No account-backed study history is saved yet. Finish a training run or add a review note to start filling this timeline.",
      emptyLocal:
        "No local study history is saved yet. Finish a module run or add a review note to start filling this timeline.",
    },
    trainer: {
      difficultyLabels: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        "advanced-lite": "Advanced-lite",
      } satisfies Record<Difficulty, string>,
      sourceTypeLabels: {
        simplification: "Beginner simplification",
        baseline: "Baseline",
        exploit: "Exploit",
      } satisfies Record<SourceType, string>,
      sourceTypeDescriptions: {
        simplification:
          "A deliberate shortcut so the core lesson is easier to see.",
        baseline:
          "The practical default line for this training setup, not universal truth.",
        exploit:
          "An adjustment to the stated read or tendency, so the read matters.",
      } satisfies Record<SourceType, string>,
      queueModeLabels: {
        adaptive: "Adaptive",
        default: "Original",
      } satisfies Record<TrainerQueueMode, string>,
      moduleNames: {
        preflop: "Preflop Trainer",
        "pot-odds": "Pot Odds Quiz",
        "board-texture": "Board Texture Quiz",
        "player-types": "Player Types Quiz",
        postflop: "Postflop Trainer",
      } satisfies Record<InteractiveTrainingModuleId, string>,
      shared: {
        interactiveModule: "Interactive",
        progressAutosaves: "Autosave on",
        sessionSaved: "Session saved",
        sessionProgress: "Session progress",
        sessionAccuracy: "Session accuracy",
        allTimeAttempts: "All-time attempts",
        completedLabel: "Completed",
        correctAnswers: (count: number) => `${count} correct`,
        notYetCompleted: "Not yet completed",
        submittedInRun: "Submitted in this run.",
        accuracyUpdates: "Updates after each answer.",
        lastCompleted: (value: string) => `Last completed: ${value}`,
        questionCounter: (current: number, total: number) =>
          `Spot ${current} / ${total}`,
        suggestedRetry: "Suggested retry",
        decisionSpot: "Decision spot",
        spotState: "Spot state",
        keyConcepts: "Key concepts",
        extraTags: "Spot tags",
        reviewWeakConcepts: "Review weak concepts",
        answerEyebrow: "Choose your line",
        selectedAction: "Selected action",
        selectActionFirst: "Choose one action first.",
        readyToSubmit: "Lock the line when you are ready.",
        submitAnswer: "Submit",
        nextSpot: "Next spot",
        finishSession: "Finish session",
        restart: "Restart",
        reviewAfterSubmit: "Check the feedback, then move on.",
        feedbackWaitingTitle: "Submit to open feedback",
        feedbackWaitingBody:
          "Answer first. The coach card will then show the recommended line and the short why.",
        bestAnswer: "Best answer",
        yourChoice: "Your choice",
        correct: "Correct",
        incorrect: "Review this one",
        recommendedAction: "Recommended action",
        whyBest: "Why this works",
        sourceType: "Training mode",
        assumptions: "Training assumptions",
        mistakeTags: "Mistake tags",
        studyNext: "Study next",
        chosenLineDrifted: "Why your line drifted",
        followUpEyebrow: "Next drill",
        followUpTitle: "Keep the concept chain moving",
        followUpDescription:
          "One sensible next step, not a wall of extra theory.",
        openPack: "Open pack",
        followUpToneReview: "Review next",
        followUpToneAdvance: "Step up",
        followUpToneRelated: "Related concept",
        answerSummaryEyebrow: "Answer summary",
        answerSummaryTitle: "What the stored training answer is saying",
        whyFitsEyebrow: "Why it fits",
        whyFitsTitle: "Main reasons the line works here",
        weakerLinesEyebrow: "Weaker lines",
        weakerLinesTitle: "Why the tempting alternatives lose value",
        mistakePatternEyebrow: "Mistake pattern",
        mistakePatternTitle: "What the wrong line often gets wrong",
        setupEyebrow: "Quick setup",
        setupTitle: "Tune the drill",
        setupDescription:
          "Keep support nearby without letting it compete with the decision.",
        packSection: "Pack",
        packSectionHint: "Keep one concept family in focus.",
        difficultySection: "Level",
        difficultySectionHint: "Pick how sharp you want the spots.",
        orderSection: "Order",
        orderSectionHint: "Adaptive brings recent misses forward.",
        packAnchors: "Pack anchors",
        packLevels: "Pack levels",
        allLevels: "All levels",
        noWeakConcepts:
          "No repeat weak concepts have built up strongly in this pack yet.",
        weakConceptCount: (count: number) => `${count} weak concepts`,
        saving: "Saving",
        syncIssue: "Sync issue",
        localAutosave: "Local autosave",
        localAutosaveDescription:
          "Answers and session summaries save in this browser.",
        accountAutosave: "Account autosave",
        accountAutosaveDescription:
          "Answers and session summaries save to the signed-in account.",
        selectedPack: "Selected pack",
        availablePack: "Available pack",
        scenarios: (count: number) => `${count} scenarios`,
        sessionRecap: "Session recap",
        runAnother: "Run another set",
        backToDashboard: "Back to dashboard",
      },
      modules: {
        preflop: {
          eyebrow: "Preflop Trainer",
          activeTitle: "Drill clean preflop decisions",
          activeDescription:
            "Read the spot, choose the cleanest line, then move straight to the next hand.",
          statusPill: "Position + stack",
          answerTitle: "Choose an action",
          answerDescription:
            "Pick the cleanest line for this exact preflop state.",
          feedbackPlaceholder:
            "Submit to see the coach card and the short why behind the preferred line.",
          completionTitle: "Preflop session complete",
          completionDescription:
            "Quick recap saved. Run another batch whenever you are ready.",
          recapTitle: "What this run drilled",
          recapBullets: [
            "Position, stack depth, and action history stayed front and center.",
            "Feedback stayed tied to the stored training rationale.",
            "Guidance remained clearly marked as baseline or simplification.",
          ],
          restartButton: "Run another preflop set",
          emptyAny: "No preflop scenarios are available right now.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `No ${difficultyLabel.toLowerCase()} preflop scenarios are seeded yet. Try another level.`,
          completionStoredAccount: "Progress was saved to the signed-in account.",
          completionStoredLocal: "Progress is stored locally in this browser.",
        },
        "pot-odds": {
          eyebrow: "Pot Odds Quiz",
          activeTitle: "Drill quick pot-odds decisions",
          activeDescription:
            "Compare the price, make the call-or-fold choice, then move on.",
          statusPill: "Price + equity",
          answerTitle: "Choose the math answer",
          answerDescription:
            "Keep the decision practical: is the continue good enough or not?",
          feedbackPlaceholder:
            "Submit to reveal the short math explanation and the recommended line.",
          completionTitle: "Pot-odds session complete",
          completionDescription:
            "The run is saved. You can jump straight into another set.",
          recapTitle: "What this run drilled",
          recapBullets: [
            "Price versus rough equity stayed the core lesson.",
            "Feedback stayed practical instead of calculator-heavy.",
            "The module kept the math fast and decision-focused.",
          ],
          restartButton: "Run another pot-odds set",
          emptyAny: "No pot-odds questions are available right now.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `No ${difficultyLabel.toLowerCase()} pot-odds questions are seeded yet. Try another level.`,
          completionStoredAccount: "Quiz progress was saved to the signed-in account.",
          completionStoredLocal:
            "Local progress survives refresh without extra setup.",
        },
        "board-texture": {
          eyebrow: "Board Texture Quiz",
          activeTitle: "Read the board, then decide faster",
          activeDescription:
            "Identify the texture quickly and lock in the clean takeaway.",
          statusPill: "Texture read",
          answerTitle: "Choose the best takeaway",
          answerDescription:
            "Focus on the broad message of this board, not a full solver tree.",
          feedbackPlaceholder:
            "Submit to see the recommended classification and the short reason behind it.",
          completionTitle: "Board-texture session complete",
          completionDescription:
            "Your latest read-and-react run is saved and ready for the next one.",
          recapTitle: "What this run drilled",
          recapBullets: [
            "Dry versus dynamic recognition stayed practical.",
            "The trainer stayed range-aware without getting solver-heavy.",
            "The flow stayed narrow enough for fast repetition.",
          ],
          restartButton: "Run another board-texture set",
          emptyAny: "No board-texture questions are available right now.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `No ${difficultyLabel.toLowerCase()} board-texture questions are seeded yet. Try another level.`,
          completionStoredAccount:
            "Board-texture progress was saved to the signed-in account.",
          completionStoredLocal:
            "Local progress survives refresh without extra backend scope.",
        },
        "player-types": {
          eyebrow: "Player Types Quiz",
          activeTitle: "Practice practical player-type adjustments",
          activeDescription:
            "Read the tendency, choose the adjustment, then keep the session moving.",
          statusPill: "Baseline vs exploit",
          answerTitle: "Choose the best adjustment",
          answerDescription:
            "Identify the broad tendency first, then take the cleanest response.",
          feedbackPlaceholder:
            "Submit to see the recommended adjustment and the short exploit note.",
          completionTitle: "Player-types session complete",
          completionDescription:
            "Your exploit-practice run is saved and ready for another batch.",
          recapTitle: "What this run drilled",
          recapBullets: [
            "Broad reads stayed useful without pretending to be precise.",
            "Baseline versus exploit language stayed explicit.",
            "The module stayed disciplined and quick to review.",
          ],
          restartButton: "Run another player-types set",
          emptyAny: "No player-type questions are available right now.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `No ${difficultyLabel.toLowerCase()} player-type questions are seeded yet. Try another level.`,
          completionStoredAccount:
            "Exploit-practice progress was saved to the signed-in account.",
          completionStoredLocal: "Progress remains local and lightweight in this browser.",
        },
        postflop: {
          eyebrow: "Postflop Trainer",
          activeTitle: "Drill simple postflop decisions",
          activeDescription:
            "Read the hand state fast, choose the line, then review the correction.",
          statusPill: "Board + range",
          answerTitle: "Choose the cleanest line",
          answerDescription:
            "Think about the purpose of the action and pick the clearest line.",
          feedbackPlaceholder:
            "Submit to open the coach card with the core reason and weaker alternatives.",
          completionTitle: "Postflop session complete",
          completionDescription:
            "The latest postflop run is saved and ready for the next grind.",
          recapTitle: "What this run drilled",
          recapBullets: [
            "Single-decision spots kept the learning practical.",
            "Feedback stayed concise and purpose-driven.",
            "Adaptive retries can surface weak board and line patterns sooner.",
          ],
          restartButton: "Run another postflop set",
          emptyAny: "No postflop scenarios are available right now.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `No ${difficultyLabel.toLowerCase()} postflop scenarios are seeded yet. Try another level.`,
          completionStoredAccount:
            "Postflop progress was saved to the signed-in account.",
          completionStoredLocal: "Local progress survives refresh in this browser.",
        },
      } satisfies Record<InteractiveTrainingModuleId, ModuleTrainerCopy>,
    },
  },
  vi: {
    locale: "vi-VN",
    appName: "Poker Trainer System",
    header: {
      tagline: "Nhìn nhanh. Chọn nhanh. Sửa nhanh.",
    },
    nav: {
      home: "Trang chủ",
      dashboard: "Dashboard",
      settings: "Cài đặt",
      preflop: "Preflop Trainer",
      "pot-odds": "Pot Odds Quiz",
      "board-texture": "Board Texture",
      postflop: "Postflop Trainer",
      "player-types": "Player Types",
      review: "Hand Review",
    },
    language: {
      label: "Ngôn ngữ",
      english: "EN",
      vietnamese: "VI",
    },
    authStatus: {
      checking: "Đang kiểm tra tài khoản",
      accountSyncOn: "Đang sync tài khoản",
      accountModeDescription:
        "Progress, session và review note đang lưu theo tài khoản.",
      localMode: "Chế độ local",
      localModeDescription: "Progress đang lưu trên trình duyệt này.",
      settings: "Cài đặt",
      signIn: "Đăng nhập",
      signOut: "Đăng xuất",
      signedInFallback: "Đã đăng nhập",
    },
    authPage: {
      accountModeEyebrow: "Chế độ tài khoản",
      alreadySignedInTitle: "Bạn đã đăng nhập",
      alreadySignedInDescription:
        "Dữ liệu học có thể sync theo tài khoản. Nếu trình duyệt này còn dữ liệu local riêng, bạn vẫn có thể import thủ công từ dashboard hoặc settings.",
      backToDashboard: "Về dashboard",
      openSettings: "Mở cài đặt",
      accessEyebrow: "Tài khoản",
      signInTitle: "Đăng nhập",
      createAccountTitle: "Tạo tài khoản",
      intro:
        "Bạn vẫn có thể dùng local mode, nhưng đăng nhập sẽ giúp progress, session và review note sync ổn định hơn.",
      signInTab: "Đăng nhập",
      createAccountTab: "Tạo tài khoản",
      displayName: "Tên hiển thị",
      optional: "Không bắt buộc",
      email: "Email",
      password: "Mật khẩu",
      passwordHint: "Tối thiểu 8 ký tự",
      submitWorking: "Đang xử lý...",
      syncAvailable: "Có sync tài khoản",
      localModeSupported: "Vẫn hỗ trợ local mode",
      manualMerge: "Merge thủ công, giữ bản local",
      missingCredentials: "Nhập đủ email và mật khẩu.",
      createAccountFailed: "Không tạo được tài khoản.",
      signInFailed: "Đăng nhập thất bại. Kiểm tra lại email và mật khẩu.",
      accountCreated: "Đã tạo tài khoản và đăng nhập thành công.",
      signedInSuccess: "Đăng nhập thành công.",
      authenticationFailed: "Xác thực thất bại.",
    },
    settings: {
      eyebrow: "Cài đặt",
      title: "Tài khoản và dữ liệu học",
      description:
        "Giữ phần sync, backup và lịch sử học gần nhau, gọn và dễ dùng.",
      loadingTitle: "Đang tải",
      loadingDescription: "Đang đọc dữ liệu học hiện tại.",
      gettingStartedEyebrow: "Bắt đầu",
      noDataTitle: "Chưa có dữ liệu học",
      noDataSignedIn:
        "Tài khoản đã sẵn sàng. Hãy mở một module, thêm review note, hoặc import dữ liệu local.",
      noDataSignedOut:
        "Bạn có thể dùng local mode hoặc đăng nhập sau. Hãy bắt đầu một module hoặc thêm review note trước.",
      openDashboard: "Mở dashboard",
      addReview: "Thêm review note",
      signInLater: "Đăng nhập sau để sync",
      loadIssue: "Có lỗi tải dữ liệu",
      retryLoading: "Tải lại dữ liệu",
      signedInAs: (email: string) => `Đang đăng nhập bằng ${email}.`,
      savedAnswersDescription:
        "Các đáp án trainer đã lưu trong chế độ lưu hiện tại.",
      persistenceMode: "Chế độ lưu",
      totalAttempts: "Tổng attempts",
      overallAccuracy: "Độ chính xác",
      lastSavedActivity: "Lần lưu gần nhất",
      accountValue: "Tài khoản",
      localValue: "Local",
      localDescription:
        "Không cần đăng nhập vẫn dùng đủ progress và review note.",
      overallAccuracyNote: "Tín hiệu học tập thực dụng, không phải solver analytics.",
      lastSavedActivityNote: "Session hoặc review update gần nhất đã được lưu.",
      refreshing: "Đang làm mới",
      cloudMode: "Chế độ cloud",
      localMode: "Chế độ local",
    },
    accountControls: {
      eyebrow: "Điều khiển tài khoản",
      titleAccount: "Quản lý dữ liệu đang sync",
      titleLocal: "Chuyển giữa local và tài khoản",
      descriptionAccount: (email: string) =>
        `Đang đăng nhập bằng ${email}. Bạn có thể làm mới dữ liệu, đăng xuất, hoặc quay lại học ngay.`,
      descriptionLocal:
        "Local mode vẫn dùng đầy đủ. Chỉ đăng nhập khi bạn muốn lưu theo tài khoản.",
      currentSnapshot: "Snapshot hiện tại",
      accountBackedData: "Dữ liệu theo tài khoản",
      browserLocalData: "Dữ liệu local trên trình duyệt",
      noSavedActivity: "Chưa có dữ liệu đã lưu",
      lastSavedActivity: "Lần lưu gần nhất",
      nextSafeAction: "Bước an toàn tiếp theo",
      importToolsBelow: "Xem tools import bên dưới",
      keepTrainingOrRefresh: "Tiếp tục học hoặc làm mới dữ liệu",
      keepTrainingLocal: "Tiếp tục local hoặc tạo tài khoản",
      localBackupWaiting: (attempts: number, notes: number) =>
        `Trình duyệt này vẫn còn ${attempts} attempts local và ${notes} review notes để merge thủ công.`,
      noSeparateLocalData: "Hiện không có dữ liệu local riêng chờ merge.",
      localModeHelp:
        "Chỉ đăng nhập khi bạn muốn có persistence theo tài khoản. Flow trainer local vẫn hoạt động bình thường.",
      signedInMode: "Chế độ đăng nhập",
      localMode: "Chế độ local",
      signedInAccount: "Tài khoản đang đăng nhập",
      accountSyncOptional: "Sync tài khoản là tùy chọn",
      localBackupWaitingPill: "Có backup local chờ xử lý",
      refreshSavedData: "Làm mới dữ liệu",
      refreshing: "Đang làm mới...",
      signOut: "Đăng xuất",
      signInOrCreate: "Đăng nhập hoặc tạo tài khoản",
      openDashboard: "Mở dashboard",
      openHandReview: "Mở hand review",
    },
    localDataTools: {
      eyebrow: "Công cụ dữ liệu local",
      title: "Export, import hoặc reset an toàn",
      descriptionAccount:
        "Các tool này quản lý backup local song song với account sync. Export và reset chỉ tác động local. Import lên tài khoản sẽ merge và giữ bản local hiện tại.",
      descriptionLocal:
        "Các tool này chỉ tác động lên trình duyệt này. Import sẽ thay snapshot local, còn reset sẽ xóa dữ liệu local sau khi bạn xác nhận.",
      noLocalDataToExport: "Chưa có dữ liệu local để export.",
      exportedBackup: (attempts: number, sessions: number, notes: number) =>
        `Đã export backup JSON với ${attempts} attempts, ${sessions} sessions và ${notes} review notes.`,
      importApplied: (attempts: number, sessions: number, notes: number) =>
        `Đã import backup JSON. Trình duyệt này hiện có ${attempts} attempts, ${sessions} sessions và ${notes} review notes.`,
      localImportConfirm: (
        importedAttempts: number,
        importedSessions: number,
        importedNotes: number,
        currentAttempts: number,
        currentSessions: number,
        currentNotes: number,
      ) =>
        `Import backup JSON này và thay snapshot hiện tại trên trình duyệt?\n\nFile import có ${importedAttempts} attempts, ${importedSessions} sessions và ${importedNotes} review notes.\nDữ liệu local hiện tại có ${currentAttempts} attempts, ${currentSessions} sessions và ${currentNotes} review notes.`,
      importCanceled: "Đã hủy import. Dữ liệu local hiện tại không đổi.",
      importReadFailed: "Import thất bại khi đọc file đã chọn.",
      noLocalDataToAccount:
        "Không tìm thấy dữ liệu local để import lên tài khoản.",
      accountImportConfirm:
        "Bạn có muốn merge progress và review notes local của trình duyệt này vào tài khoản đang đăng nhập không? Dữ liệu tài khoản hiện có sẽ được giữ nguyên, các item trùng sẽ merge theo id, và bản local vẫn được giữ lại.",
      accountImportCanceled:
        "Đã hủy import lên tài khoản. Dữ liệu local không đổi.",
      accountImportDone: (attempts: number, sessions: number, notes: number) =>
        `Tài khoản hiện có ${attempts} attempts, ${sessions} sessions và ${notes} review notes.`,
      accountImportFailed:
        "Không import được dữ liệu local lên tài khoản.",
      noLocalDataToReset: "Hiện chưa có dữ liệu local để reset.",
      resetConfirm: (attempts: number, sessions: number, notes: number) =>
        `Reset toàn bộ progress, sessions và review notes local trên trình duyệt này?\n\nThao tác này sẽ xóa ${attempts} attempts, ${sessions} sessions và ${notes} review notes khỏi trình duyệt này.`,
      resetCanceled: "Đã hủy reset. Dữ liệu local hiện tại được giữ nguyên.",
      resetDone:
        "Đã reset toàn bộ progress và review notes local trên trình duyệt này. Dữ liệu theo tài khoản không bị tác động.",
      localBrowserBackup: "Backup local trên trình duyệt",
      readyForBackup: "Sẵn sàng để backup hoặc merge",
      noLocalDataSaved: "Chưa có dữ liệu local",
      localBackupSummary: (attempts: number, sessions: number, notes: number) =>
        `Hiện có ${attempts} attempts, ${sessions} sessions và ${notes} review notes trên trình duyệt này.`,
      signedInAccount: "Tài khoản đang đăng nhập",
      importBehavior: "Cách import hoạt động",
      accountDataExists: "Tài khoản đã có dữ liệu",
      accountReadyFirstImport: "Tài khoản sẵn sàng cho lần import đầu",
      localImportReplacesSnapshot: "Import local sẽ thay snapshot hiện tại",
      accountSummary: (attempts: number, sessions: number, notes: number, email: string) =>
        `Hiện đang lưu ${attempts} attempts, ${sessions} sessions và ${notes} review notes cho ${email}.`,
      localImportHelp:
        "JSON import chỉ thay snapshot local sau khi bạn xác nhận. Reset cũng chỉ tác động local, không chạm vào dữ liệu tài khoản.",
      mergeByStableIds: "Merge theo id ổn định",
      localCopyStays: "Giữ nguyên bản local",
      existingAccountDataKept: "Giữ nguyên dữ liệu tài khoản cũ",
      mergeExplanation:
        "Import local lên tài khoản theo hướng cộng dồn và merge. App không tự xóa im lặng bên nào cả.",
      exportJson: "Export JSON",
      noLocalDataExportButton: "Không có dữ liệu để export",
      importJson: "Import JSON",
      resetLocalData: "Reset local",
      noLocalDataResetButton: "Không có dữ liệu để reset",
      importing: "Đang import...",
      importLocalToAccount: "Import local lên tài khoản",
      noLocalDataImportButton: "Không có dữ liệu để import",
      localBackupTools: "Tool backup local",
      localOnly: "Chỉ local",
      syncingTo: (email: string) => `Đang sync tới ${email}`,
      jsonValidation: "Có kiểm tra JSON khi import",
      resetRequiresConfirm: "Reset cần xác nhận",
      neutral: "Ghi chú",
      success: "Xong",
      danger: "Có lỗi",
    },
    accountMode: {
      eyebrow: "Trạng thái tài khoản",
      titleAccount: "Đang sync theo tài khoản",
      titleLocal: "Đang học ở chế độ local",
      descriptionAccount: (email: string) =>
        `Progress, sessions và review notes đang lưu vào ${email}. Dashboard sẽ đọc snapshot tài khoản trước, nhưng bạn vẫn có thể dùng local tools bên dưới.`,
      descriptionLocal:
        "Bạn vẫn có thể học mà không cần tài khoản. Progress, sessions và review notes sẽ ở lại trên trình duyệt này cho tới khi bạn đăng nhập để sync.",
      cloudBackedMode: "Chế độ cloud",
      localOnlyMode: "Chỉ local",
      signInWhenReady: "Khi cần sync thì đăng nhập",
      localBackupStillAvailable: "Vẫn còn backup local",
      currentSource: "Nguồn hiện tại",
      accountSnapshot: "Snapshot tài khoản",
      browserSnapshot: "Snapshot trình duyệt",
      savedSummary: (attempts: number, sessions: number, notes: number) =>
        `Đã lưu ${attempts} attempts, ${sessions} sessions và ${notes} review notes.`,
      lastSavedActivity: "Lần lưu gần nhất",
      noSavedActivity: "Chưa có dữ liệu đã lưu",
      syncGuidance: "Gợi ý sync",
      separateBackupExists: "Có một backup local riêng",
      noExtraImportWaiting: "Không có local import nào chờ thêm",
      accountModeOptional: "Chế độ tài khoản là tùy chọn",
      localBackupWaiting: (attempts: number, notes: number) =>
        `Trình duyệt này vẫn có ${attempts} attempts local và ${notes} review notes để merge thủ công.`,
      noExtraLocalData:
        "Hiện không có dữ liệu local riêng nào chờ merge vào tài khoản.",
      localModeHelp:
        "Đăng nhập sẽ giữ nguyên flow trainer hiện tại, đồng thời giúp progress, sessions và review notes theo được sang nơi khác ngoài trình duyệt này.",
      signInForSync: "Đăng nhập để sync",
      keepStudyingLocal: "Tiếp tục học local",
    },
    recentSessions: {
      eyebrow: "Hoạt động gần đây",
      title: "Lịch sử session",
      descriptionAccount:
        "Mỗi session là một lượt chạy module được lưu cho tài khoản đang đăng nhập. Session đang dở vẫn hiện ở đây để bạn quay lại tiếp tục.",
      descriptionLocal:
        "Mỗi session là một lượt chạy module được lưu trên trình duyệt này. Session đang dở vẫn hiện ở đây để bạn quay lại tiếp tục.",
      completed: "Hoàn tất",
      active: "Đang học",
      lastActivity: "Hoạt động gần nhất",
      resumeModule: "Học tiếp",
      openModule: "Mở module",
      attempted: (count: number) => `${count} attempted`,
      correct: (count: number) => `${count} đúng`,
      accuracy: (value: string) => `${value} accuracy`,
      noRepeatLeakTags: "Chưa nổi lên leak tag lặp rõ rệt",
      emptyAccount:
        "Chưa có session nào được lưu theo tài khoản. Hoàn tất một lượt module và nó sẽ hiện ở đây.",
      emptyLocal:
        "Chưa có session local nào được lưu. Hãy bắt đầu một module và hoạt động gần đây sẽ hiện ở đây.",
    },
    studyTimeline: {
      eyebrow: "Timeline học",
      title: "Lịch sử học và review gần đây",
      descriptionAccount:
        "Timeline này ghép session theo tài khoản với review notes để bạn nhìn nhịp học gần đây dễ hơn.",
      descriptionLocal:
        "Timeline này ghép session local với review notes để bạn scan nhịp học gần đây nhanh hơn.",
      noRepeatLeakTags: "Chưa nổi lên leak tag lặp rõ rệt",
      noManualLeakTags: "Chưa gán leak tag thủ công",
      emptyAccount:
        "Chưa có lịch sử học theo tài khoản. Hãy hoàn tất một lượt training hoặc thêm review note để timeline bắt đầu hiện dữ liệu.",
      emptyLocal:
        "Chưa có lịch sử học local. Hãy hoàn tất một lượt module hoặc thêm review note để timeline bắt đầu hiện dữ liệu.",
    },
    trainer: {
      difficultyLabels: {
        beginner: "Cơ bản",
        intermediate: "Trung cấp",
        "advanced-lite": "Nâng cao nhẹ",
      } satisfies Record<Difficulty, string>,
      sourceTypeLabels: {
        simplification: "Simplification",
        baseline: "Baseline",
        exploit: "Exploit",
      } satisfies Record<SourceType, string>,
      sourceTypeDescriptions: {
        simplification:
          "Một shortcut có chủ đích để bài học chính hiện ra rõ hơn.",
        baseline:
          "Line mặc định thực dụng cho đúng bộ giả định này, không phải chân lý tuyệt đối.",
        exploit:
          "Một adjustment theo read hoặc tendency đã nêu, nên read vẫn quan trọng.",
      } satisfies Record<SourceType, string>,
      queueModeLabels: {
        adaptive: "Adaptive",
        default: "Thứ tự gốc",
      } satisfies Record<TrainerQueueMode, string>,
      moduleNames: {
        preflop: "Preflop Trainer",
        "pot-odds": "Pot Odds Quiz",
        "board-texture": "Board Texture Quiz",
        "player-types": "Player Types Quiz",
        postflop: "Postflop Trainer",
      } satisfies Record<InteractiveTrainingModuleId, string>,
      shared: {
        interactiveModule: "Đang hoạt động",
        progressAutosaves: "Tự lưu",
        sessionSaved: "Đã lưu session",
        sessionProgress: "Tiến độ session",
        sessionAccuracy: "Độ chính xác",
        allTimeAttempts: "Tổng attempts",
        completedLabel: "Hoàn tất",
        correctAnswers: (count: number) => `${count} đúng`,
        notYetCompleted: "Chưa hoàn tất",
        submittedInRun: "Đã nộp trong lượt này.",
        accuracyUpdates: "Cập nhật sau mỗi đáp án.",
        lastCompleted: (value: string) => `Lần gần nhất: ${value}`,
        questionCounter: (current: number, total: number) =>
          `Spot ${current} / ${total}`,
        suggestedRetry: "Nên ôn lại",
        decisionSpot: "Spot hiện tại",
        spotState: "Trạng thái hand",
        keyConcepts: "Concept chính",
        extraTags: "Tags",
        reviewWeakConcepts: "Ôn điểm yếu",
        answerEyebrow: "Chọn line",
        selectedAction: "Hành động đã chọn",
        selectActionFirst: "Chọn một hành động trước.",
        readyToSubmit: "Sẵn sàng thì nộp line này.",
        submitAnswer: "Nộp đáp án",
        nextSpot: "Spot tiếp theo",
        finishSession: "Kết thúc session",
        restart: "Làm lại",
        reviewAfterSubmit: "Xem feedback ngắn rồi qua spot tiếp.",
        feedbackWaitingTitle: "Nộp để xem feedback",
        feedbackWaitingBody:
          "Trả lời trước. Coach card sẽ hiện line nên chọn và lý do ngắn gọn.",
        bestAnswer: "Line nên chọn",
        yourChoice: "Bạn đã chọn",
        correct: "Đúng",
        incorrect: "Nên xem lại",
        recommendedAction: "Hành động nên chọn",
        whyBest: "Vì sao line này tốt hơn",
        sourceType: "Kiểu hướng dẫn",
        assumptions: "Giả định training",
        mistakeTags: "Mistake tags",
        studyNext: "Nên học tiếp gì",
        chosenLineDrifted: "Vì sao line đã lệch",
        followUpEyebrow: "Bài kế tiếp",
        followUpTitle: "Giữ mạch học tiếp tục",
        followUpDescription:
          "Một bước hợp lý tiếp theo, không phải thêm một bức tường chữ.",
        openPack: "Mở pack",
        followUpToneReview: "Ôn tiếp",
        followUpToneAdvance: "Tăng độ khó",
        followUpToneRelated: "Concept liên quan",
        answerSummaryEyebrow: "Tóm tắt đáp án",
        answerSummaryTitle: "Line training đang muốn nói gì",
        whyFitsEyebrow: "Vì sao hợp spot",
        whyFitsTitle: "Những lý do chính khiến line này tốt hơn",
        weakerLinesEyebrow: "Line yếu hơn",
        weakerLinesTitle: "Vì sao các line dễ chọn khác lại kém hơn",
        mistakePatternEyebrow: "Mẫu lỗi",
        mistakePatternTitle: "Line sai thường lệch ở đâu",
        setupEyebrow: "Thiết lập nhanh",
        setupTitle: "Chỉnh bài drill",
        setupDescription:
          "Giữ phần hỗ trợ ở gần, nhưng không để nó tranh spotlight với quyết định.",
        packSection: "Pack",
        packSectionHint: "Giữ session tập trung vào một nhóm concept.",
        difficultySection: "Mức độ",
        difficultySectionHint: "Chọn độ khó cho spot.",
        orderSection: "Thứ tự",
        orderSectionHint: "Adaptive sẽ đẩy lỗi gần đây lên trước.",
        packAnchors: "Concept trong pack",
        packLevels: "Level của pack",
        allLevels: "Tất cả level",
        noWeakConcepts: "Pack này chưa tích đủ lỗi lặp để cần ôn lại rõ hơn.",
        weakConceptCount: (count: number) => `${count} concept yếu`,
        saving: "Đang lưu",
        syncIssue: "Lỗi sync",
        localAutosave: "Tự lưu local",
        localAutosaveDescription:
          "Đáp án và session summary lưu ngay trên trình duyệt này.",
        accountAutosave: "Tự lưu tài khoản",
        accountAutosaveDescription:
          "Đáp án và session summary lưu vào tài khoản đang đăng nhập.",
        selectedPack: "Pack đang chọn",
        availablePack: "Pack có sẵn",
        scenarios: (count: number) => `${count} scenario`,
        sessionRecap: "Tóm tắt session",
        runAnother: "Chạy thêm một lượt",
        backToDashboard: "Về dashboard",
      },
      modules: {
        preflop: {
          eyebrow: "Preflop Trainer",
          activeTitle: "Drill decision preflop nhanh và gọn",
          activeDescription:
            "Nhìn spot, chọn line sạch nhất, rồi qua hand tiếp theo.",
          statusPill: "Position + stack",
          answerTitle: "Chọn hành động",
          answerDescription:
            "Chọn line gọn nhất cho đúng bối cảnh preflop này.",
          feedbackPlaceholder:
            "Nộp đáp án để mở coach card và xem vì sao line đó tốt hơn.",
          completionTitle: "Hoàn tất lượt preflop",
          completionDescription:
            "Lượt này đã được lưu. Khi muốn, bạn có thể drill tiếp ngay.",
          recapTitle: "Lượt này vừa ôn gì",
          recapBullets: [
            "Position, stack depth và action history vẫn là trọng tâm.",
            "Feedback bám vào rationale đã lưu sẵn.",
            "Guidance vẫn được gắn nhãn baseline hoặc simplification rõ ràng.",
          ],
          restartButton: "Chạy thêm preflop set",
          emptyAny: "Hiện chưa có scenario preflop.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `Chưa có scenario preflop ở mức ${difficultyLabel.toLowerCase()}. Hãy thử level khác.`,
          completionStoredAccount: "Progress đã lưu vào tài khoản đang đăng nhập.",
          completionStoredLocal: "Progress đang lưu local trên trình duyệt này.",
        },
        "pot-odds": {
          eyebrow: "Pot Odds Quiz",
          activeTitle: "Drill pot odds nhanh như ở bàn",
          activeDescription:
            "Nhìn giá, chốt call hay fold, rồi qua spot tiếp theo.",
          statusPill: "Price + equity",
          answerTitle: "Chọn đáp án math",
          answerDescription:
            "Giữ quyết định ở mức thực chiến: tiếp tục có lời hay không?",
          feedbackPlaceholder:
            "Nộp đáp án để xem giải thích math ngắn và line nên chọn.",
          completionTitle: "Hoàn tất lượt pot odds",
          completionDescription:
            "Kết quả lượt này đã được lưu. Bạn có thể vào lượt mới ngay.",
          recapTitle: "Lượt này vừa ôn gì",
          recapBullets: [
            "Trọng tâm vẫn là price so với equity ước lượng.",
            "Feedback giữ ở mức thực dụng, không nặng máy tính.",
            "Nhịp luyện vẫn nhanh và thiên về quyết định.",
          ],
          restartButton: "Chạy thêm pot odds set",
          emptyAny: "Hiện chưa có câu hỏi pot odds.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `Chưa có câu hỏi pot odds ở mức ${difficultyLabel.toLowerCase()}. Hãy thử level khác.`,
          completionStoredAccount: "Tiến độ quiz đã lưu vào tài khoản.",
          completionStoredLocal: "Tiến độ local vẫn giữ được sau khi refresh.",
        },
        "board-texture": {
          eyebrow: "Board Texture Quiz",
          activeTitle: "Đọc texture nhanh rồi chốt takeaway",
          activeDescription:
            "Nhìn board, hiểu texture, rồi khóa quyết định chính ngay.",
          statusPill: "Texture read",
          answerTitle: "Chọn takeaway tốt nhất",
          answerDescription:
            "Tập trung vào ý chính của board này, không cần dựng cả solver tree.",
          feedbackPlaceholder:
            "Nộp đáp án để xem classification nên chọn và lý do ngắn gọn.",
          completionTitle: "Hoàn tất lượt board texture",
          completionDescription:
            "Lượt đọc board vừa rồi đã được lưu và sẵn sàng cho vòng tiếp theo.",
          recapTitle: "Lượt này vừa ôn gì",
          recapBullets: [
            "Nhận diện dry hay dynamic vẫn ở mức thực dụng.",
            "Flow vẫn bám theo range mà không biến thành solver-heavy.",
            "Spot đủ hẹp để có thể grind nhiều hand liên tiếp.",
          ],
          restartButton: "Chạy thêm board texture set",
          emptyAny: "Hiện chưa có câu hỏi board texture.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `Chưa có câu hỏi board texture ở mức ${difficultyLabel.toLowerCase()}. Hãy thử level khác.`,
          completionStoredAccount: "Tiến độ board texture đã lưu vào tài khoản.",
          completionStoredLocal: "Tiến độ local vẫn giữ được sau khi refresh.",
        },
        "player-types": {
          eyebrow: "Player Types Quiz",
          activeTitle: "Luyện adjustment theo player type",
          activeDescription:
            "Đọc tendency, chọn adjustment, rồi đi tiếp không sa vào đoán mò.",
          statusPill: "Baseline vs exploit",
          answerTitle: "Chọn adjustment tốt nhất",
          answerDescription:
            "Xác định tendency chính trước, rồi chọn phản ứng sạch nhất.",
          feedbackPlaceholder:
            "Nộp đáp án để xem adjustment nên chọn và ghi chú exploit ngắn.",
          completionTitle: "Hoàn tất lượt player types",
          completionDescription:
            "Lượt exploit practice này đã được lưu và sẵn cho vòng tiếp.",
          recapTitle: "Lượt này vừa ôn gì",
          recapBullets: [
            "Broad reads vẫn hữu ích nhưng không giả vờ chính xác tuyệt đối.",
            "Ngôn ngữ baseline và exploit vẫn tách rõ ràng.",
            "Flow vẫn gọn, nhanh và đúng trọng tâm ra quyết định.",
          ],
          restartButton: "Chạy thêm player types set",
          emptyAny: "Hiện chưa có câu hỏi player type.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `Chưa có câu hỏi player type ở mức ${difficultyLabel.toLowerCase()}. Hãy thử level khác.`,
          completionStoredAccount: "Tiến độ exploit practice đã lưu vào tài khoản.",
          completionStoredLocal: "Progress đang giữ local và vẫn dùng bình thường.",
        },
        postflop: {
          eyebrow: "Postflop Trainer",
          activeTitle: "Drill decision postflop theo hand state",
          activeDescription:
            "Đọc trạng thái hand nhanh, chọn line, rồi nhận correction ngay.",
          statusPill: "Board + range",
          answerTitle: "Chọn line sạch nhất",
          answerDescription:
            "Nghĩ về mục đích của action rồi chọn line rõ ràng nhất.",
          feedbackPlaceholder:
            "Nộp đáp án để mở coach card với lý do chính và các line yếu hơn.",
          completionTitle: "Hoàn tất lượt postflop",
          completionDescription:
            "Lượt postflop này đã được lưu và sẵn sàng cho vòng grind tiếp.",
          recapTitle: "Lượt này vừa ôn gì",
          recapBullets: [
            "Spot một quyết định giúp việc học vẫn thực dụng.",
            "Feedback giữ ngắn, rõ và bám vào mục đích của action.",
            "Adaptive retry có thể đẩy các lỗi board và line lên sớm hơn.",
          ],
          restartButton: "Chạy thêm postflop set",
          emptyAny: "Hiện chưa có scenario postflop.",
          emptyByDifficulty: (difficultyLabel: string) =>
            `Chưa có scenario postflop ở mức ${difficultyLabel.toLowerCase()}. Hãy thử level khác.`,
          completionStoredAccount: "Tiến độ postflop đã lưu vào tài khoản.",
          completionStoredLocal: "Tiến độ local vẫn giữ được sau khi refresh.",
        },
      } satisfies Record<InteractiveTrainingModuleId, ModuleTrainerCopy>,
    },
  },
} as const;

export function getDefaultUiLanguage(): UiLanguage {
  return "vi";
}

export type UiCopy = (typeof uiCopy)[UiLanguage];
