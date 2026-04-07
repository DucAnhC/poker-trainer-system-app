export type ReviewUiLanguage = "en" | "vi";

type ReviewCopy = {
  pageEyebrow: string;
  pageTitle: string;
  pageBody: string;
  savedReviews: string;
  lastUpdated: string;
  leakPeak: string;
  localMode: string;
  accountMode: string;
  saving: string;
  savedState: string;
  issueState: string;
  saveSuccessAccount: string;
  saveSuccessLocal: string;
  saveFailure: string;
  deleteSuccessAccount: string;
  deleteSuccessLocal: string;
  deleteFailure: string;
  deleteConfirm: string;
  listEyebrow: string;
  listTitle: string;
  listBodyAccount: string;
  listBodyLocal: string;
  noSavedTitle: string;
  noSavedBody: string;
  loadingTitle: string;
  loadingBody: string;
  loadIssue: string;
  retry: string;
  detailEyebrow: string;
  detailTitle: string;
  detailBody: string;
  deleteLabel: string;
  deletingLabel: string;
  noLeakTags: string;
  noLeakTagsAssigned: string;
  followUpLabel: string;
  openModuleLabel: string;
  formEyebrow: string;
  formTitle: string;
  formBody: string;
  snapshotLabel: string;
  decisionNoteLabel: string;
  leakTagsLabel: string;
  titleLabel: string;
  titleHint: string;
  titlePlaceholder: string;
  focusLabel: string;
  stackLabel: string;
  stackHint: string;
  stackPlaceholder: string;
  heroLabel: string;
  villainLabel: string;
  notSpecified: string;
  boardLabel: string;
  boardHint: string;
  boardPlaceholder: string;
  actionHistoryLabel: string;
  actionHistoryHint: string;
  actionHistoryPlaceholder: string;
  chosenActionLabel: string;
  chosenActionHint: string;
  chosenActionPlaceholder: string;
  uncertaintyLabel: string;
  uncertaintyHint: string;
  uncertaintyPlaceholder: string;
  noteLabel: string;
  noteHint: string;
  notePlaceholder: string;
  storageAccount: string;
  storageLocal: string;
  saveLabel: string;
  savingLabel: string;
  streetFocusLabels: Record<"general" | "preflop" | "flop" | "turn" | "river", string>;
  detailLabels: {
    hero: string;
    villain: string;
    stack: string;
    board: string;
    actionHistory: string;
    chosenAction: string;
    uncertainty: string;
    note: string;
    leakTags: string;
  };
};

const reviewCopy: Record<ReviewUiLanguage, ReviewCopy> = {
  en: {
    pageEyebrow: "Hand Review",
    pageTitle: "Capture one spot, one leak, one next step",
    pageBody: "Keep review practical: save the spot, tag the leak, and make the next study step obvious.",
    savedReviews: "Saved reviews",
    lastUpdated: "Last updated",
    leakPeak: "Top leak count",
    localMode: "Local notes",
    accountMode: "Cloud sync",
    saving: "Saving",
    savedState: "Saved",
    issueState: "Issue",
    saveSuccessAccount: "Review note saved to the signed-in account.",
    saveSuccessLocal: "Review note saved locally in this browser.",
    saveFailure: "Failed to save the review note.",
    deleteSuccessAccount: "Review note removed from the signed-in account.",
    deleteSuccessLocal: "Review note removed from local browser storage.",
    deleteFailure: "Failed to delete the review note.",
    deleteConfirm: "Delete this saved hand review note?",
    listEyebrow: "Saved list",
    listTitle: "Open a saved review",
    listBodyAccount: "Saved notes stay synced to the signed-in account.",
    listBodyLocal: "Saved notes stay in this browser until you remove them.",
    noSavedTitle: "No saved reviews",
    noSavedBody: "Save a note from the form and it will appear here.",
    loadingTitle: "Loading reviews",
    loadingBody: "Reading saved notes from the active storage mode.",
    loadIssue: "Load issue",
    retry: "Retry",
    detailEyebrow: "Review detail",
    detailTitle: "Select a saved review",
    detailBody: "The saved spot will open here with the key fields and the next study route.",
    deleteLabel: "Delete review",
    deletingLabel: "Deleting review...",
    noLeakTags: "No leak tags yet",
    noLeakTagsAssigned: "No leak tags assigned",
    followUpLabel: "Study next",
    openModuleLabel: "Open module",
    formEyebrow: "New review",
    formTitle: "Log one hand or one decision node",
    formBody: "Keep it short and structured. This is a drill notebook, not a parser.",
    snapshotLabel: "Spot snapshot",
    decisionNoteLabel: "Decision note",
    leakTagsLabel: "Leak tags",
    titleLabel: "Title",
    titleHint: "Short label for the spot you want to remember.",
    titlePlaceholder: "BTN vs BB top pair river fold",
    focusLabel: "Focus",
    stackLabel: "Stack",
    stackHint: "Optional. Use big blinds when that helps.",
    stackPlaceholder: "100",
    heroLabel: "Hero",
    villainLabel: "Villain",
    notSpecified: "Not specified",
    boardLabel: "Board",
    boardHint: "Optional. Keep it compact, for example Ah Kd 7c.",
    boardPlaceholder: "Ah Kd 7c",
    actionHistoryLabel: "Action line",
    actionHistoryHint: "Short line so future-you can rebuild the spot quickly.",
    actionHistoryPlaceholder: "CO opens, BTN calls, flop Qh 8h 4c, CO c-bets one-third...",
    chosenActionLabel: "Chosen action",
    chosenActionHint: "What you did or wanted to do.",
    chosenActionPlaceholder: "Called river raise",
    uncertaintyLabel: "Unsure about",
    uncertaintyHint: "The real question you want to solve.",
    uncertaintyPlaceholder: "Disciplined fold or too tight?",
    noteLabel: "Extra note",
    noteHint: "Reads, takeaway, or mental-game context.",
    notePlaceholder: "Previous result may have affected this decision.",
    storageAccount: "Saved notes sync to the signed-in account.",
    storageLocal: "Saved notes stay in this browser through localStorage.",
    saveLabel: "Save review",
    savingLabel: "Saving review...",
    streetFocusLabels: {
      general: "General",
      preflop: "Preflop",
      flop: "Flop",
      turn: "Turn",
      river: "River",
    },
    detailLabels: {
      hero: "Hero",
      villain: "Villain",
      stack: "Stack",
      board: "Board",
      actionHistory: "Action line",
      chosenAction: "Chosen action",
      uncertainty: "Unsure about",
      note: "Extra note",
      leakTags: "Leak tags",
    },
  },
  vi: {
    pageEyebrow: "Hand Review",
    pageTitle: "Ghi lai mot spot, mot leak, mot buoc hoc tiep",
    pageBody: "Giu review that dung: luu spot, gan leak, roi chi ro buoc hoc tiep theo.",
    savedReviews: "Review da luu",
    lastUpdated: "Lan cap nhat",
    leakPeak: "Leak lap nhieu nhat",
    localMode: "Luu local",
    accountMode: "Cloud sync",
    saving: "Dang luu",
    savedState: "Da luu",
    issueState: "Co loi",
    saveSuccessAccount: "Da luu review vao tai khoan dang dang nhap.",
    saveSuccessLocal: "Da luu review tren trinh duyet nay.",
    saveFailure: "Khong luu duoc review note.",
    deleteSuccessAccount: "Da xoa review khoi tai khoan dang dang nhap.",
    deleteSuccessLocal: "Da xoa review khoi local storage.",
    deleteFailure: "Khong xoa duoc review note.",
    deleteConfirm: "Xoa review da luu nay?",
    listEyebrow: "Saved list",
    listTitle: "Mo mot review da luu",
    listBodyAccount: "Cac note nay dang sync theo tai khoan dang dang nhap.",
    listBodyLocal: "Cac note nay dang o lai tren trinh duyet nay.",
    noSavedTitle: "Chua co review da luu",
    noSavedBody: "Luu mot note tu form ben trai va no se hien o day.",
    loadingTitle: "Dang tai review",
    loadingBody: "Dang doc danh sach review tu che do luu hien tai.",
    loadIssue: "Loi tai du lieu",
    retry: "Tai lai",
    detailEyebrow: "Review detail",
    detailTitle: "Chon mot review da luu",
    detailBody: "Spot da luu se mo o day cung key fields va buoc hoc tiep.",
    deleteLabel: "Xoa review",
    deletingLabel: "Dang xoa review...",
    noLeakTags: "Chua co leak tag",
    noLeakTagsAssigned: "Chua gan leak tag",
    followUpLabel: "Hoc tiep",
    openModuleLabel: "Mo module",
    formEyebrow: "New review",
    formTitle: "Ghi lai mot hand hoac mot nut quyet dinh",
    formBody: "Giu no ngan va co cau truc. Day la so tay drill, khong phai parser.",
    snapshotLabel: "Spot snapshot",
    decisionNoteLabel: "Decision note",
    leakTagsLabel: "Leak tags",
    titleLabel: "Tieu de",
    titleHint: "Nhan ngan cho spot ban muon nho lai.",
    titlePlaceholder: "BTN vs BB top pair river fold",
    focusLabel: "Trong tam",
    stackLabel: "Stack",
    stackHint: "Khong bat buoc. Dung big blind neu can.",
    stackPlaceholder: "100",
    heroLabel: "Hero",
    villainLabel: "Villain",
    notSpecified: "Khong ghi ro",
    boardLabel: "Board",
    boardHint: "Khong bat buoc. Viet gon, vi du Ah Kd 7c.",
    boardPlaceholder: "Ah Kd 7c",
    actionHistoryLabel: "Action line",
    actionHistoryHint: "Viet gon de lan sau nhin la dung lai duoc spot.",
    actionHistoryPlaceholder: "CO opens, BTN calls, flop Qh 8h 4c, CO c-bets mot phan ba...",
    chosenActionLabel: "Line da chon",
    chosenActionHint: "Ban da lam gi hoac dinh lam gi.",
    chosenActionPlaceholder: "Call river raise",
    uncertaintyLabel: "Chua chac",
    uncertaintyHint: "Cau hoi that su ban muon giai.",
    uncertaintyPlaceholder: "Day la fold ky luat hay qua tight?",
    noteLabel: "Ghi chu them",
    noteHint: "Read, takeaway hoac mental-game context.",
    notePlaceholder: "Ket qua hand truoc co the da anh huong toi quyet dinh nay.",
    storageAccount: "Review da luu se sync vao tai khoan dang dang nhap.",
    storageLocal: "Review da luu se o lai tren trinh duyet nay qua localStorage.",
    saveLabel: "Luu review",
    savingLabel: "Dang luu review...",
    streetFocusLabels: {
      general: "Tong quat",
      preflop: "Preflop",
      flop: "Flop",
      turn: "Turn",
      river: "River",
    },
    detailLabels: {
      hero: "Hero",
      villain: "Villain",
      stack: "Stack",
      board: "Board",
      actionHistory: "Action line",
      chosenAction: "Line da chon",
      uncertainty: "Chua chac",
      note: "Ghi chu them",
      leakTags: "Leak tags",
    },
  },
};

export function getReviewUiLanguage(locale: string): ReviewUiLanguage {
  return locale === "vi-VN" ? "vi" : "en";
}

export function getReviewCopy(language: ReviewUiLanguage) {
  return reviewCopy[language];
}
