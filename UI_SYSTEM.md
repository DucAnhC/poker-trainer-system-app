# UI_SYSTEM.md

## Mục tiêu
Giữ app đi đúng hướng: **poker training room**, không quay lại kiểu dashboard box dày đặc.

---
## Định hướng tham chiếu thiết kế

UI system của dự án này đi theo tinh thần của:

- **Natural8 / GGPoker** về cảm giác client poker, vùng hành động rõ, và không khí bàn chơi
- **bề mặt huấn luyện chiến thuật** về độ rõ ràng khi học và ra quyết định
- **study workstation** về review hand, coach recap, và hỗ trợ học tập

Dự án này **không nhằm sao chép nguyên bản** các sản phẩm đó.

Thay vào đó, UI nên kế thừa các yếu tố sau:

- cảm giác đang ngồi vào một bàn poker thật
- vùng hành động rõ ràng, nhìn là muốn bấm
- không khí tối, premium, có chiều sâu
- hình ảnh poker trực quan theo vật thể như:
  - lá bài
  - board
  - pot
  - hero / villain
  - action flow

Đồng thời vẫn phải giữ được bản sắc riêng của một app huấn luyện, gồm:

- lớp học phủ lên trải nghiệm bàn chơi
- answer reveal flow rõ ràng
- coach system hỗ trợ đúng lúc
- support content có cấu trúc
- hierarchy rõ giữa scene chính, decision rail, support card, và coach
---
## Nguyên tắc bố cục
Mỗi màn trainer nên có hierarchy như sau:

1. Spot / Title
2. Main scene
3. Decision rail
4. Key support block
5. Coach seat
6. Secondary learning aids

---

## Những gì phải giữ
- dark tactical style
- decision rail bên phải
- premium surfaces
- board / hand / pot / scene objects rõ ràng
- hierarchy đọc được
- support cards không lấn main scene

---

## Những gì phải tránh
- quá nhiều box nhỏ ngang hàng
- scene bị chia vụn
- cột info quá hẹp
- support panel dày đặc như admin dashboard
- box trong box trong box
- visual noise quá mức

---

## Rule cho support cards
- ưu tiên ít card hơn nhưng mạnh hơn
- support info nên gộp theo nhóm liên quan
- secondary content có thể xuống dưới thay vì chen ngang
- text phải có đủ bề ngang để đọc
- không có cột chữ dựng đứng hoặc bó quá chặt

---

## Rule cho main scene
Main scene phải đọc như:
- đây là spot gì
- ai là hero
- ai là villain
- board / hand / pot / context là gì
- quyết định nào đang cần chọn

Người dùng không được mất 3–5 giây để hiểu “đâu là trọng tâm”.

---

## Rule cho decision rail
- luôn rõ
- luôn ổn định
- không ép main scene bị bó quá mức
- action options phải đọc nhanh
- reveal / selected / locked state phải khác biệt rõ

---

## Rule cho coach seat
- chỉ hỗ trợ
- không dominate page
- text ngắn
- không cạnh tranh trọng số với decision rail
- phù hợp hơn ở dạng coach card hơn là chat app

---

## Rule responsive
- stack support cards sớm hơn thay vì bó hẹp
- tránh overflow
- giảm fragmentation ở màn hẹp
- giữ readability trước trang trí

---

## Rule typography
- title lớn, rõ
- body đủ line-height
- label / metadata thống nhất
- text tiếng Việt không bị bó cột
- không lạm dụng uppercase ở đoạn dài
