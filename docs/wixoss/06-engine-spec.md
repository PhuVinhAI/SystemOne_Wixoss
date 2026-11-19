# Đặc tả triển khai

Đây là cấu trúc đề xuất cho engine số. Hành vi luật tham chiếu các chương [vòng lượt](03-turn-and-resources.md), [chiến đấu](04-combat.md) và [giải quyết hiệu ứng](05-cards-and-effects.md).

## Trạng thái trận

| Đối tượng | Trường cần lưu |
| --- | --- |
| Định nghĩa lá | Mã in, tên, loại, màu, Level/Limit/Power theo loại, LRIG type/team/Class, cost, timing, điều kiện và khả năng được hỗ trợ. |
| Bản thể lá | ID riêng, chủ sở hữu, người điều khiển hiện tại nếu luật cần phân biệt, vị trí, hướng, quyền xem mặt, trạng thái Freeze, hiệu ứng tạm, các lá underneath và attached. |
| Người chơi | Main Deck và Life Cloth có thứ tự, hand, LRIG Deck, Ener, Check, Trash, LRIG Trash, vùng loại khỏi trận, ba slot LRIG, ba slot SIGNI và Coin nếu được dùng. |
| Trận | Người đi trước, Turn Player, số lượt, phase, attack step, đòn LRIG đang chờ Guard, số Refresh của mỗi bên trong lượt hiện hành, Retire, giới hạn ability, trigger đang chờ và trạng thái thắng/thua. |
| Lựa chọn đang chờ | Người có quyền chọn, loại lựa chọn, ứng viên hợp lệ và giới hạn. Ví dụ gồm mulligan, trả Ener, chọn target, Guard, Life Burst hay chọn thứ tự trigger. |

Dùng lane chung cho hai bên hoặc lưu ánh xạ đối diện rõ ràng. Với client quay bàn theo góc nhìn người chơi, giữ cùng một ID lane trong engine dù vị trí trái/phải hiển thị đảo nhau.

## Vòng xử lý

1. Xác định hành động hoặc lựa chọn đang hợp lệ từ phase, bên có quyền, trạng thái hiện hành và text hiệu lực.
2. Nhận đúng một quyết định hoặc nhóm lựa chọn mà luật yêu cầu đồng thời. Kiểm tra lại ở trạng thái hiện tại trước khi áp dụng.
3. Áp dụng hành động, trả cost và xử lý effect. Ghi nhận các trigger phát sinh đến hết lần xử lý hoặc đến khi cần người chơi chọn tiếp.
4. Xử lý các rule-based action đủ điều kiện ở điểm kiểm tra. Xử lý trigger theo thứ tự quy định, kiểm tra luật lại ở các điểm tương ứng.
5. Nếu trận tiếp tục, mở lựa chọn kế tiếp. Nếu có kết quả thắng/thua, đóng hành động của trận.

Giữ riêng các sự kiện **Vanish**, **Retire**, **Damage**, **Crush**, **Life Burst**, **Guard** và **Refresh** vì đích lá, trigger và điều kiện kết thúc khác nhau. Ví dụ, Crush lật Life Cloth để kiểm tra Life Burst, còn Life Cloth mất bởi Refresh đi thẳng vào Trash.

## Giao diện và kiểm thử

- Chỉ gửi cho mỗi client dữ liệu họ được xem theo [quyền xem zone](02-board-and-zones.md). Với zone ẩn, giữ số lượng hoặc mặt sau khi giao diện cần thể hiện. Quyền xem mặt cũng áp dụng cho log người chơi đọc được.
- Hiển thị người đang đi, phase/step, Level/Limit hiệu lực, SIGNI upped/downed và số Life Cloth. Cho phép bỏ qua các lựa chọn tùy ý như Ener, Grow, Guard và Life Burst tại đúng cửa sổ.
- Ghi lại hành động, thứ tự lá được lật và kết quả thay đổi zone để có thể phát lại lỗi. Kiểm thử với thứ tự deck và đầu vào xác định, rồi so trạng thái và sự kiện với [ca nghiệm thu](07-acceptance-cases.md).
- Khi engine cung cấp nước đi cho một đối thủ máy, danh sách hành động phải lấy từ trạng thái luật hiện hành. Đầu vào của đối thủ máy dùng cùng quyền xem như người chơi tương ứng. Bộ xử lý luật kiểm tra lại hành động được chọn.

Chọn bộ lá hỗ trợ trước khi triển khai các hiệu ứng nâng cao như Acce, Craft/Resona, Virus hoặc những cơ chế ngoài các chương luật nền. Với mỗi lá hỗ trợ, ghi điều kiện, cửa sổ, chi phí, target, thay đổi trạng thái và ca kiểm thử theo card FAQ hoặc errata khi có. [Rules tiếng Anh](https://www.takaratomy.co.jp/products/en.wixoss/rules/)
