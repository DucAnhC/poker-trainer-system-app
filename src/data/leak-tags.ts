import type { LeakTag } from "@/types/poker";
import type { TrainingModuleId } from "@/types/training";

export interface LeakTagDefinition extends LeakTag {
  moduleFocus: TrainingModuleId[];
  guidanceNote: string;
}

export const leakTags: LeakTagDefinition[] = [
  {
    id: "overvalued-one-pair",
    label: "Quá tay với một đôi",
    category: "postflop-planning",
    description:
      "Tiếp tục bet hoặc call với hand một đôi mà chưa tôn trọng đủ kết cấu board, action trước đó hoặc áp lực range.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện đọc board và ghi chú hand có cấu trúc để tách hand value khỏi các bluff-catcher mong manh.",
  },
  {
    id: "called-too-wide",
    label: "Call quá rộng",
    category: "discipline",
    description:
      "Tiếp tục với một range quá lỏng so với vị trí, line trước đó hoặc xu hướng người chơi trong tình huống này.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Quay lại bài luyện preflop về kỷ luật tiếp tục và dùng phần xem lại hand để tìm đúng chỗ sự tò mò đã thay thế kỷ luật range.",
  },
  {
    id: "folded-too-much",
    label: "Fold quá nhiều",
    category: "discipline",
    description:
      "Bỏ qua các lần tiếp tục có lời quá thường xuyên, nhất là trước các range rộng hoặc quá hung hăng.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Bài luyện theo kiểu người chơi giúp tách line thật sự mạnh khỏi những kiểu đối thủ bluff quá đà.",
  },
  {
    id: "bluffed-bad-target",
    label: "Bluff sai mục tiêu",
    category: "player-adjustment",
    description:
      "Chọn line gây áp lực vào một kiểu người chơi hoặc range không fold đủ nhiều.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện kiểu người chơi để ghép tần suất bluff với đúng đối thủ thay vì bluff theo autopilot.",
  },
  {
    id: "ignored-position",
    label: "Bỏ qua vị trí",
    category: "range-thinking",
    description:
      "Bỏ lỡ tác động của vị trí lên range open, chất lượng call và khả năng hiện thực hóa equity postflop.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Bài luyện preflop và ghi chú xem lại hand nên luôn giữ vị trí của Hero và Villain hiện rõ trong mọi quyết định.",
  },
  {
    id: "poor-pot-odds-intuition",
    label: "Cảm giác Pot Odds kém",
    category: "math",
    description:
      "Đọc sai giá của một lần tiếp tục hoặc đánh giá quá cao khả năng cải thiện của hand hay draw.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Quay lại bài luyện Pot Odds khi giá, số outs hoặc các quyết định về equity sạch vẫn còn mơ hồ.",
  },
  {
    id: "weak-board-texture-recognition",
    label: "Đọc kết cấu board yếu",
    category: "postflop-planning",
    description:
      "Đối xử board tĩnh và board động quá giống nhau hoặc bỏ lỡ việc kết cấu này đang có lợi cho ai.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Bài luyện đọc board giúp nối cấu trúc flop với tần suất c-bet, mức độ thận trọng và kế hoạch ở street sau.",
  },
  {
    id: "auto-cbet",
    label: "C-bet quá tự động",
    category: "postflop-planning",
    description:
      "Continuation-bet mà không có lý do đủ rõ về value, protection hoặc fold equity trong đúng bối cảnh board và range này.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện Postflop và đọc board để tách những board nên gây áp lực khỏi những tình huống cần check nhiều hơn.",
  },
  {
    id: "gave-up-too-often",
    label: "Bỏ cuộc quá sớm",
    category: "postflop-planning",
    description:
      "Check hoặc fold quá sớm dù bối cảnh board và range vẫn còn ủng hộ việc tiếp tục gây áp lực hoặc lấy value.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Bài luyện Postflop giúp nhận ra khi nào việc bet vẫn còn mục đích rõ ràng thay vì đầu hàng quá nhanh.",
  },
  {
    id: "weak-turn-discipline",
    label: "Kỷ luật turn yếu",
    category: "postflop-planning",
    description:
      "Bỏ lỡ việc turn card đã đổi value, protection hoặc động lực bluff thế nào và vẫn tiếp tục dùng kế hoạch ở flop một cách tự động.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Dùng các tình huống turn trong bài luyện Postflop để tập khi nào nên tiếp tục barrel, khi nào nên chậm lại và khi nào việc kìm cỡ pot sạch hơn.",
  },
  {
    id: "ignored-player-type-postflop",
    label: "Bỏ qua kiểu người chơi ở postflop",
    category: "player-adjustment",
    description:
      "Chọn một line postflop mà không điều chỉnh theo việc đối thủ fold quá nhiều, call quá nhiều hay under-bluff.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Bài luyện Postflop và kiểu người chơi đi cùng nhau khi line tốt nhất phụ thuộc vào đúng người đang ở trong pot.",
  },
  {
    id: "poor-pot-control",
    label: "Kìm cỡ pot kém",
    category: "postflop-planning",
    description:
      "Làm pot phình quá mạnh với hand trung bình hoặc check back ở tình huống vốn đang muốn value và protection rõ ràng.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Quay lại các tình huống Postflop so sánh bet với check back để hand một đôi không còn trôi giữa value và bluff-catch một cách mơ hồ.",
  },
  {
    id: "missed-value-bet",
    label: "Lỡ value bet",
    category: "postflop-planning",
    description:
      "Bỏ qua một cú bet postflop có tính thực chiến khi vẫn còn đủ hand yếu hơn có thể call.",
    moduleFocus: ["postflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện Postflop để luôn hỏi còn hand yếu hơn nào tiếp tục thay vì mặc định chơi an toàn với các hand value vừa đến mạnh.",
  },
  {
    id: "poor-player-type-adjustment",
    label: "Điều chỉnh theo kiểu người chơi kém",
    category: "player-adjustment",
    description:
      "Bám quá chặt vào default sai hoặc over-adjust ở một tình huống vốn có một line exploit sạch hơn.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện kiểu người chơi để so sánh line cơ bản với các độ lệch exploit lớn trong một khung có kiểm soát.",
  },
  {
    id: "autopilot-preflop",
    label: "Quyết định preflop theo autopilot",
    category: "range-thinking",
    description:
      "Bấm một nút preflop quen tay mà không dành đủ chú ý cho vị trí, độ sâu stack hoặc action trước đó.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Bài luyện Preflop nên làm chậm quyết định lại và buộc người học phải đọc đủ tình huống trước khi hành động.",
  },
  {
    id: "emotional-decision",
    label: "Quyết định theo cảm xúc",
    category: "review-habit",
    description:
      "Quyết định bị chi phối bởi bực bội, sợ hãi hoặc cái tôi nhiều hơn là bởi logic range thực tế.",
    moduleFocus: ["hand-review"],
    guidanceNote:
      "Bàn xem lại hand là nơi phù hợp để gắn nhãn các lỗi do cảm xúc mà không tự phán xét bản thân.",
  },
  {
    id: "opened-too-wide",
    label: "Open quá rộng",
    category: "range-thinking",
    description:
      "Tham gia pot với một range quá yếu so với vị trí hoặc action trước đó.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Dùng bài luyện Preflop để siết lại open ở vị trí đầu và hiểu chỗ nào mới thật sự được open rộng.",
  },
  {
    id: "dominated-call",
    label: "Call bị dominated",
    category: "discipline",
    description:
      "Tiếp tục với một hand chơi rất tệ trước range mạnh hơn trong tình huống đó.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Leak call bị dominated thường được sửa tốt nhất bằng việc tăng kỷ luật range trước khi nghĩ đến các exploit cầu kỳ.",
  },
  {
    id: "ignored-stack-depth",
    label: "Bỏ qua độ sâu stack",
    category: "range-thinking",
    description:
      "Bỏ lỡ việc stack nông hay sâu làm đổi giá trị hand và ngưỡng tiếp tục ra sao.",
    moduleFocus: ["preflop", "hand-review"],
    guidanceNote:
      "Chạy lại các tình huống preflop nhạy với stack cho tới khi cùng một hand cho cảm giác khác nhau rõ ở 40bb và 100bb.",
  },
  {
    id: "ignored-price",
    label: "Bỏ qua giá",
    category: "math",
    description:
      "Ra quyết định về toán mà không tôn trọng pot odds hoặc chi phí để tiếp tục.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Bài luyện Pot Odds nên là điểm quay lại đầu tiên khi bản thân mức giá đã bị bỏ qua hoặc đoán mò.",
  },
  {
    id: "chased-bad-draw",
    label: "Đuổi draw xấu",
    category: "math",
    description:
      "Tiếp tục với quá ít outs sạch hoặc implied odds thiếu thực tế.",
    moduleFocus: ["pot-odds", "hand-review"],
    guidanceNote:
      "Xem lại giá, số outs sạch và việc tiền ở street sau có thật sự tồn tại hay không.",
  },
  {
    id: "ignored-board-texture",
    label: "Bỏ qua kết cấu board",
    category: "postflop-planning",
    description:
      "Đối xử một board động như board tĩnh hoặc bỏ lỡ tương tác giữa hai range.",
    moduleFocus: ["board-texture", "postflop", "hand-review"],
    guidanceNote:
      "Bài luyện đọc board là cách sạch nhất để ngừng mang cùng một logic c-bet lên mọi flop.",
  },
  {
    id: "missed-thin-value",
    label: "Lỡ value mỏng",
    category: "player-adjustment",
    description:
      "Bỏ qua một cú exploit value bet thực tế trước người chơi call quá rộng.",
    moduleFocus: ["player-types", "postflop", "hand-review"],
    guidanceNote:
      "Bài luyện kiểu người chơi giúp tách thin value liều lĩnh khỏi thin value exploit có lợi.",
  },
  {
    id: "paid-off-tight-strength",
    label: "Trả tiền cho line quá chặt",
    category: "player-adjustment",
    description:
      "Call xuống quá nhẹ trước một range thường under-bluff.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Dùng bài luyện kiểu người chơi và ghi chú xem lại hand để bình thường hóa các cú fold kỷ luật trước những line nặng value.",
  },
  {
    id: "ignored-archetype-tendency",
    label: "Bỏ qua xu hướng kiểu người chơi",
    category: "player-adjustment",
    description:
      "Làm ngơ trước xu hướng lớn mà bài luyện đang yêu cầu bạn phải điều chỉnh theo.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Bài luyện kiểu người chơi nên làm xu hướng giả định trở nên thật rõ trước khi bạn chọn exploit.",
  },
  {
    id: "overfolded-versus-aggression",
    label: "Overfold trước áp lực",
    category: "player-adjustment",
    description:
      "Bỏ cuộc quá nhanh ở tình huống mà một đối thủ hung hăng đáng lẽ phải có đủ bluff.",
    moduleFocus: ["player-types", "hand-review"],
    guidanceNote:
      "Bài luyện kiểu người chơi giúp tách line thật sự nặng value khỏi một kiểu đối thủ vốn over-bluff quá thường.",
  },
  {
    id: "result-oriented",
    label: "Nhìn kết quả thay vì quyết định",
    category: "review-habit",
    description:
      "Đánh giá line dựa trên kết quả cuối cùng thay vì chất lượng của quyết định.",
    moduleFocus: ["hand-review"],
    guidanceNote:
      "Dùng phần xem lại hand để đặt lại tay bài quanh range, bối cảnh và chất lượng quyết định thay vì chỉ nhìn bài chạy ra sao.",
  },
];

export const leakTagMap = Object.fromEntries(
  leakTags.map((leakTag) => [leakTag.id, leakTag]),
) as Record<string, LeakTagDefinition>;
