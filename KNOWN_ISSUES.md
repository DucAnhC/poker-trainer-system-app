# KNOWN_ISSUES.md

## Product / learning flow
- Reveal flow đã có lock -> reveal -> next và làm lại spot hiện tại trên Preflop + tactical modules; vẫn cần tiếp tục harden recap cuối buổi
- Auto-next / flow học cũ từng gây học kém hiệu quả
- Mistake tags đã được lưu theo attempt; cần tiếp tục làm UI phân tích lỗi sâu hơn
- Confidence system chưa có
- Session loop cơ bản đã có; còn thiếu confidence và session coach thật

---

## Content
- Content pool còn mỏng
- Nhiều module chưa đủ spot depth
- Curriculum nền cho equity / outs / probability / mental math chưa đầy đủ
- Spot Family chưa được triển khai

---

## AI tutor
- Coach đã có nudge / silent note rule-based trong trainer flow, nhưng chưa phải AI tutor cá nhân hóa
- Silent Coach rule-based đã xuất hiện sau reveal; chưa có LLM/adaptive coach
- Chưa có Session Coach thật
- Chưa có related spot suggestion đúng nghĩa
- Chưa có leak profile

---

## Layout / UI
- Một số màn từng có:
  - overflow
  - support boxes quá nhiều
  - composition chưa thật gọn
- Player Types từng là module dễ vỡ layout nhất
- Preflop và Pot Odds từng cần pass composition riêng
- Cần tiếp tục giảm fragmentation và tăng hierarchy

---

## Technical / state
- Từng có bug filter / level jump
- Từng có saving indicator jitter
- Cần tiếp tục chuẩn hóa state machine trong trainer flow
