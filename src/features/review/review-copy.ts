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
    pageEyebrow: "Study desk",
    pageTitle: "Ghi 1 spot, 1 leak, 1 bước học tiếp",
    pageBody: "Giữ review ngắn, sắc và đúng hand. Chụp spot, chốt line, đánh dấu chỗ còn vướng.",
    savedReviews: "Note đã lưu",
    lastUpdated: "Cập nhật cuối",
    leakPeak: "Leak lặp nhiều",
    localMode: "Lưu local",
    accountMode: "Cloud sync",
    saving: "Đang lưu",
    savedState: "Đã lưu",
    issueState: "Có lỗi",
    saveSuccessAccount: "Đã lưu review vào tài khoản đang đăng nhập.",
    saveSuccessLocal: "Đã lưu review trên trình duyệt này.",
    saveFailure: "Không lưu được review note.",
    deleteSuccessAccount: "Đã xóa review khỏi tài khoản đang đăng nhập.",
    deleteSuccessLocal: "Đã xóa review khỏi local storage.",
    deleteFailure: "Không xóa được review note.",
    deleteConfirm: "Xóa review đã lưu này?",
    listEyebrow: "Kho note",
    listTitle: "Mở note đã lưu",
    listBodyAccount: "Các note này đang sync theo tài khoản đang đăng nhập.",
    listBodyLocal: "Các note này đang ở lại trên trình duyệt này.",
    noSavedTitle: "Chưa có review đã lưu",
    noSavedBody: "Lưu một note từ bàn review và nó sẽ hiện ở đây.",
    loadingTitle: "Đang tải review",
    loadingBody: "Đang đọc danh sách review từ chế độ lưu hiện tại.",
    loadIssue: "Lỗi tải dữ liệu",
    retry: "Tải lại",
    detailEyebrow: "Review note",
    detailTitle: "Chọn một review đã lưu",
    detailBody: "Spot đã lưu sẽ mở ở đây cùng line đã chọn, leak chính và bước học tiếp.",
    deleteLabel: "Xóa review",
    deletingLabel: "Đang xóa review...",
    noLeakTags: "Chưa có leak tag",
    noLeakTagsAssigned: "Chưa gắn leak tag",
    followUpLabel: "Học tiếp",
    openModuleLabel: "Mở module",
    formEyebrow: "Review mới",
    formTitle: "Chốt 1 hand note",
    formBody: "Ghi nhanh spot, line đã chọn và câu hỏi còn vướng. Đây là study desk, không phải form quản trị.",
    snapshotLabel: "Spot snapshot",
    decisionNoteLabel: "Decision note",
    leakTagsLabel: "Leak tags",
    titleLabel: "Tiêu đề",
    titleHint: "Nhãn ngắn cho spot bạn muốn nhớ lại.",
    titlePlaceholder: "BTN vs BB top pair river fold",
    focusLabel: "Trọng tâm",
    stackLabel: "Stack",
    stackHint: "Không bắt buộc. Dùng bb nếu dễ đọc hơn.",
    stackPlaceholder: "100",
    heroLabel: "Hero",
    villainLabel: "Villain",
    notSpecified: "Không ghi rõ",
    boardLabel: "Board",
    boardHint: "Không bắt buộc. Viết gọn, ví dụ Ah Kd 7c.",
    boardPlaceholder: "Ah Kd 7c",
    actionHistoryLabel: "Line trước đó",
    actionHistoryHint: "Viết ngắn để lần sau dựng lại spot ngay.",
    actionHistoryPlaceholder: "CO open, BTN call, flop Qh 8h 4c, CO c-bet 1/3...",
    chosenActionLabel: "Line đã chọn",
    chosenActionHint: "Bạn đã làm gì hoặc định làm gì.",
    chosenActionPlaceholder: "Call river raise",
    uncertaintyLabel: "Chưa chắc",
    uncertaintyHint: "Câu hỏi thật sự bạn muốn giải.",
    uncertaintyPlaceholder: "Đây là fold kỷ luật hay quá tight?",
    noteLabel: "Note thêm",
    noteHint: "Read, takeaway hoặc yếu tố mental game.",
    notePlaceholder: "Kết quả hand trước có thể đã ảnh hưởng tới quyết định này.",
    storageAccount: "Review đã lưu sẽ sync vào tài khoản đang đăng nhập.",
    storageLocal: "Review đã lưu sẽ ở lại trên trình duyệt này qua localStorage.",
    saveLabel: "Chốt review",
    savingLabel: "Đang lưu review...",
    streetFocusLabels: {
      general: "Tổng quát",
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
      actionHistory: "Line trước đó",
      chosenAction: "Line đã chọn",
      uncertainty: "Chưa chắc",
      note: "Note thêm",
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
