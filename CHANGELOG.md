# CHANGELOG.md

## Hiện tại
- App đã có deploy trên Vercel
- DB dùng Neon Postgres
- Auth/account mode đã chạy
- Repo app đã ổn định hơn
- Đã có nhiều vòng refactor UI theo hướng tactical poker table

---

## Những thay đổi lớn gần đây
- Thêm nhịp `retry current spot` sau reveal cho Preflop và các tactical modules, giữ `next spot` và `restart set` tách bạch hơn.
- Coach seat trong decision/reveal flow chuyển từ placeholder chung sang nudge / silent coach note ngắn, bám vào module cue, rationale, feedback hint và mistake tag.
- Kéo toàn app gần hơn về shared visual direction
- Tăng cảm giác poker client / training room
- Refactor Preflop thành module tham chiếu
- Pot Odds, Texture, Postflop, Player Types, Review được kéo gần hơn về cùng hệ ngôn ngữ
- Thử nghiệm decision rail + coach seat

---

## Ghi chú
Changelog này hiện mới ở mức khung.  
Sau này nên ghi theo format:
- ngày
- thay đổi
- lý do
- ảnh hưởng
