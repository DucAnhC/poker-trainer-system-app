# ROADMAP.md

## Mục tiêu tổng
Biến `poker-trainer-system-app` từ một quiz app poker thành một **poker training room** có cảm giác như đang chơi thật, với learning loop rõ ràng, content có cấu trúc, và AI coach hỗ trợ đúng lúc.

---

## Nguyên tắc ưu tiên
1. Ưu tiên **learning flow** trước polish nhỏ.
2. Ưu tiên **product loop** trước feature AI phức tạp.
3. Ưu tiên **content depth** trước hiệu ứng trình diễn.
4. Không quay lại kiểu **dashboard card dày đặc**.
5. Mọi thay đổi lớn phải giữ:
   - decision rail bên phải
   - dark tactical poker style
   - scene hierarchy rõ ràng

---

## Phase 1 — Stabilize core trainer loop
### Mục tiêu
Làm cho app học được thực sự, không còn kiểu trả lời xong là xong.

### Việc cần làm
- Chuẩn hóa state:
  - `idle`
  - `selected`
  - `locked`
  - `revealed`
  - `ready_next`
- Bỏ auto-next
- Thêm answer reveal flow rõ ràng:
  - đúng / sai
  - line chuẩn
  - vì sao
  - takeaway
- Thêm nút:
  - Câu tiếp theo
  - Làm lại câu này
- Fix các bug state / saving indicator / filter jump

### Done khi
- User trả lời xong không bị nhảy câu
- Có reveal state rõ
- Không còn state bug gây giật

---

## Phase 2 — Product loop
### Mục tiêu
Tạo nhịp học khiến người dùng muốn quay lại.

### Việc cần làm
- Streak
- Session mode:
  - 5 câu
  - 10 câu
  - 3 phút
- Confidence before answer:
  - chắc cao
  - chắc vừa
  - đoán
- Mistake tagging
- Recap cuối session

### Done khi
- App có cảm giác “vào buổi tập”
- Có recap ngắn cuối buổi
- Có dữ liệu về confidence và mistake type

---

## Phase 3 — Content engine
### Mục tiêu
Biến app từ demo thành trainer thật.

### Việc cần làm
- Xây `CONTENT_MATRIX.md`
- Tăng spot theo family
- Thêm difficulty tiers:
  - basic
  - medium
  - advanced
- Thêm Spot Family flow
- Thêm multi-street hand flow ở các module phù hợp

### Done khi
- Mỗi module có family rõ ràng
- Nội dung không còn lặp sớm
- Có thể dẫn user sang spot liên quan

---

## Phase 4 — AI tutor v1
### Mục tiêu
AI coach hỗ trợ đúng vai, không phá flow.

### Việc cần làm
- Silent Coach
- Nudge Coach
- Session Coach
- Related spot suggestion
- Why-not-other-options explanation

### Không làm ở phase này
- chatbot tự do toàn năng
- full conversational table companion
- solver-like AI tự bịa line

### Done khi
- Coach nói ngắn, đúng ngữ cảnh
- Không phá nhịp chơi
- Có recap session có giá trị

---

## Phase 5 — Advanced trainer
### Mục tiêu
Tăng chiều sâu và giữ chân user lâu dài.

### Việc cần làm
- Leak Profile
- Adaptive difficulty
- Play vs Archetype
- Daily Challenge
- Weekly Theme
- Replay your mistakes
- AI session planner

---

## Ưu tiên ngắn hạn
### Rất nên làm ngay
1. Reveal flow hoàn chỉnh
2. Streak + session mode
3. Confidence tap
4. Mistake tagging
5. Content matrix
6. Spot Family
7. Silent Coach

### Chưa nên lao vào ngay
- full AI table companion
- multiplayer-like simulation
- quá nhiều animation
- polish UI vô hạn
