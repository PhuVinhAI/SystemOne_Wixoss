# Lá bài và giải quyết hiệu ứng

## Cách đọc lá

Mọi lá cần tên, loại, màu và nội dung luật. Các trường bổ sung tùy loại.

| Loại | Deck và cách sử dụng | Trường cần đọc |
| --- | --- | --- |
| Center LRIG | LRIG Deck. Mở ở Level 0, Grow trong Grow Phase cơ bản, tấn công trong LRIG Attack. | Level, Limit, LRIG type, Grow cost, điều kiện Grow, team, ability. |
| Assist LRIG | LRIG Deck. Hai vị trí hai bên Center, Grow theo Use Timing trên lá. | Level, phần cộng Limit, LRIG type, Grow cost, team, timing, ability. |
| PIECE | LRIG Deck. Dùng đúng timing khi đủ điều kiện, chuyển qua Check Zone, rồi loại khỏi trận sau khi xử lý. | Cost, Use Timing, Use Conditions, hiệu ứng, Team hoặc Dream Team nếu có. |
| SIGNI | Main Deck. Đưa vào SIGNI Zone để đấu, tấn công hoặc dùng ability. | Level, Power, Class, ability, Life Burst, Guard và các từ khóa nếu có. |
| Spell | Main Deck. Mặc định dùng từ hand trong Main Phase của mình, qua Check Zone và vào Trash sau khi xử lý. | Cost, hiệu ứng Spell và Life Burst nếu có. |

Tên card, LRIG type, team và Class phục vụ các phép kiểm tra khác nhau. Team trên LRIG được đối chiếu với điều kiện của Team ability hoặc PIECE. Dream Team kiểm tra điều kiện cụ thể in sau biểu tượng. Text phiên bản in cần đi cùng mã card để tra sửa đổi. [Quick Start, How to Read Cards](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf) · [Glossary, Team và Dream Team](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf)

## Ability và cửa sổ sử dụng

| Loại | Thời điểm |
| --- | --- |
| Constant | Hiệu lực liên tục khi điều kiện hiện tại thỏa, thường khi lá trên field. |
| Auto | Đăng ký trigger khi có sự kiện hoặc thời điểm khớp. Từ “may” cho phép lựa chọn ở phần hiệu ứng có ghi. |
| Enter | Đăng ký khi SIGNI hoặc LRIG xuất hiện trên field. Không có cost thì bắt buộc kích hoạt. Với Enter có cost, có thể bỏ qua hoặc trả đủ. |
| Action | Người chơi khai báo dùng, trả cost và xử lý hiệu ứng. Mặc định dùng ở Main Phase của mình. Khi ghi timing khác, dùng theo timing đó. |
| Life Burst | Người có Life Cloth vừa bị crush có thể kích hoạt nếu lá có Burst Icon. |

Các biểu tượng **1/Turn**, **2/Turn**, **1/Game** giới hạn số lần theo nhãn in trên ability. Đọc bộ đếm theo phạm vi và đối tượng của lá được hỗ trợ. Ngoài Main Phase và Attack Phase, một số lá có **Spell Cut-in** để can thiệp trước khi Spell của đối thủ xử lý. FAQ không cho phép phản ứng tùy ý với mọi hành động. Spell Cut-in áp dụng cho Spell của đối thủ theo timing của lá. [Glossary, Action, Triggered ability, Use timing](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Rules for using of cards](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Chi phí, mode và target

1. Kiểm tra quyền sử dụng và timing. Với hiệu ứng có mode, chọn mode ngay lúc khai báo. Nếu chọn nhiều mode, xử lý theo thứ tự in trên lá và chỉ chọn mỗi mode một lần.
2. Trả **đủ** chi phí trước khi giải quyết hiệu ứng. Ener trắng, đỏ, xanh dương, xanh lá hoặc đen cần đúng màu. Yêu cầu Ener colorless chấp nhận mọi màu. Lá colorless thông thường không trả chi phí màu. **Multi Ener** cho phép lá được dùng như một màu khi trả Ener từ Ener Zone. Màu in trên lá giữ nguyên trong các ngữ cảnh khác. **Coin** là tài nguyên đếm riêng, tối đa năm. **Exceed N** chuyển N lá underneath phù hợp từ chồng LRIG/Assist sang LRIG Trash.
3. Chọn target hợp lệ ngay trước khi xử lý phần hiệu ứng liên quan. Các target cùng bước được chọn đồng thời. “Then” có thể tạo bước chọn sau khi thao tác trước đã hoàn tất. Nếu hiệu ứng yêu cầu đúng hai target ở zone công khai và chỉ có một target hợp lệ, không chọn một để thay cho hai. Nếu ghi “up to two”, có thể chọn 0, 1 hoặc 2. Áp dụng Shadow theo phạm vi nguồn hoặc điều kiện ghi trên lá.
4. Giải quyết phần hiệu ứng có thể thực hiện. Ví dụ, hiệu ứng bắt discard hai lá khi chỉ còn một thì discard một. Chi phí bắt discard hai lá vẫn cần cả hai mới dùng được.

[Glossary, Cost, Colorless, Multi Ener, Mode và Target](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, General Rules và Action](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Trigger và kiểm tra luật

Trigger có thể phát sinh khi trả cost hoặc đang xử lý effect. Chờ hành động hiện tại hoàn tất, gồm bước chuyển lá sau khi sử dụng. Sau đó xử lý các **rule-based action** trước trigger. Nếu nhiều trigger chờ, Turn Player giải quyết từng trigger mình điều khiển theo thứ tự họ chọn, sau đó đến Non-Turn Player theo quy tắc của Glossary. Trigger đã ghi nhận vẫn có thể xử lý khi lá nguồn rời field hoặc mất ability, theo FAQ.

Ví dụ rule-based action gồm Vanish SIGNI Power ≤ 0, dọn SIGNI vượt Level/Limit, Refresh, chuyển Life Cloth đã crush vào Ener khi không dùng Life Burst, xử lý chồng LRIG có tập LRIG type trùng hẳn, và dọn lá underneath khi Rise SIGNI rời field. Nếu cần chọn SIGNI để sửa Level/Limit, ưu tiên nhóm vượt Level, rồi nhóm vừa đổi Level kể từ lần kiểm tra trước, rồi nhóm còn lại. Chọn từng lá đến khi field hợp lệ. [Glossary, tr. 7 và 9](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Trigger Ability](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)
