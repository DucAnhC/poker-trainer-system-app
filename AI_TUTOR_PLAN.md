# AI_TUTOR_PLAN.md

## Mục tiêu
Xây AI tutor như một **coach system**, không phải chatbot poker tự do.

---

## Nguyên tắc
AI tutor phải:
- ngắn
- đúng ngữ cảnh
- không phá flow
- không nói thay user quá nhiều
- không biến app thành chat app

AI tutor không được:
- giải thích dài dòng mọi lúc
- spam sau mỗi action
- trả lời tự do không bám metadata
- bịa line như solver giả

---

## 1. Silent Coach
### Kích hoạt
Sau khi user đã reveal kết quả.

### Nhiệm vụ
- chỉ ra lỗi chính
- nêu nguyên tắc đúng
- đưa 1 takeaway
- gợi ý 1 spot tương tự

### Ví dụ output
- “Bạn đang over-fold trước half-pot dù có 9 outs sạch.”
- “Board này khô, c-bet nhỏ hợp lý hơn line lớn.”

---

## 2. Nudge Coach
### Kích hoạt
Trước khi user chốt line.

### Nhiệm vụ
- gợi ý tư duy ngắn
- không lộ đáp án

### Ví dụ
- “Nhìn lại pot size.”
- “Board này khô hay động?”
- “Read này đã đủ mạnh chưa?”
- “Ai có range advantage?”

---

## 3. Session Coach
### Kích hoạt
Sau 5–10 câu hoặc cuối session.

### Nhiệm vụ
- nêu lỗi lặp nhiều nhất
- nêu điểm mạnh
- chốt 1 nguyên tắc cần khóa lại
- gợi ý module / spot tiếp theo

---

## 4. Related Spot Suggestion
Sau khi user sai hoặc do dự, gợi ý:
- 1 spot cùng family
- 1 spot gần giống
- 1 spot có bẫy khác

---

## 5. Why-not-other-options
AI tutor nên có khả năng nói ngắn:
- vì sao line A sai
- vì sao line B trông hợp lý nhưng vẫn kém hơn
- khi nào line B mới đúng

---

## 6. Dữ liệu AI cần dùng
Mỗi spot nên có:
- module
- street
- hero / villain position
- hand / board
- action history
- correct option
- explanation short
- principle tags
- difficulty
- villain profile
- math metadata
- mistake family

---

## 7. Thứ tự build hợp lý
### Build trước
1. Silent Coach
2. Nudge Coach
3. Session Coach
4. Related Spot Suggestion

### Build sau
- Leak Profile powered feedback
- Adaptive coaching
- Play vs Archetype coach
- AI session planner
- Table companion sâu hơn

---

## 8. UI placement
AI tutor nên xuất hiện ở:
- coach seat
- reveal panel
- session recap

Không nên bắt đầu bằng:
- chat sidebar khổng lồ
- floating chatbot toàn năng
