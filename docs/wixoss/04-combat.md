# Chiến đấu và Life Cloth

## Trình tự Attack Phase

| Bước | Ai chọn | Hành động |
| --- | --- | --- |
| Pre-Attack | Turn Player | Xử lý trigger đầu Attack Phase, rồi cho phép Grow Assist, PIECE và Action đủ điều kiện timing Attack Phase. |
| Defense | Non-Turn Player | Grow Assist, PIECE và Action đủ điều kiện timing Attack Phase. Khi qua cửa sổ này, Turn Player không quay lại Pre-Attack. |
| SIGNI Attack | Turn Player | Chọn một SIGNI upped để tấn công. Xử lý đòn đánh và mọi phát sinh trước khi chọn SIGNI kế tiếp, hoặc kết thúc bước. |
| LRIG Attack | Turn Player | Có thể tấn công bằng Center LRIG upped. Assist LRIG không tấn công. Khi đã sang LRIG Attack, bước SIGNI Attack đã kết thúc. |
| Guard | Non-Turn Player | Với đòn Center LRIG đã khai báo, có thể discard một lá có Guard từ hand để ngăn damage của đòn đó. |

[Quick Start, Attack Phase](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf) · [Glossary, Attack phase và Guard](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Attack phase](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Xử lý đòn SIGNI

1. Khai báo tấn công và Down SIGNI tấn công.
2. Nếu lane đối diện có SIGNI, so Power hiện tại. Power bên tấn công lớn hơn hoặc bằng thì **Vanish** SIGNI phòng thủ, chuyển nó từ field vào Ener Zone. Nếu Power bên tấn công thấp hơn, cả hai ở lại field. SIGNI tấn công vẫn downed sau đòn đánh. Trong cả hai trường hợp có battle, đòn cơ bản này không gây damage trực tiếp lên người chơi.
3. Nếu lane đối diện trống, đòn tấn công gây **damage** trực tiếp. Guard cơ bản không áp dụng cho SIGNI.

## Xử lý đòn Center LRIG

Khai báo đòn tấn công và Down Center LRIG. Các SIGNI trên bàn không chắn đòn này. Nếu đối thủ dùng Guard, lá Guard đi từ hand vào Trash và damage của đòn bị ngăn. Nếu đối thủ bỏ qua, đòn gây damage. [Glossary, Attack, Battle, Guard](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf)

## Damage, Crush và Life Burst

- **Damage với 0 Life Cloth:** người nhận thua trận.
- **Damage khi còn Life Cloth:** crush lá trên cùng. Lật ngửa trong Check Zone. Nếu có Burst Icon, chủ lá chọn kích hoạt Life Burst hoặc bỏ qua. Khi xử lý xong, chuyển lá từ Check Zone vào Ener Zone.
- **Hiệu ứng chỉ ghi Crush:** xử lý số lá thực sự có. Khi còn 0 Life Cloth, thao tác không gây damage và không làm thua. Bản thân việc dùng Life Burst cũng khác với dùng lá đó như Spell hoặc đặt SIGNI lên field. [Glossary, Crush, Damage, Life Burst](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Life Cloth](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Từ khóa chiến đấu

| Từ khóa | Kết quả |
| --- | --- |
| Assassin | Đánh như lane trước mặt trống và gây damage thay vì battle. Vì không battle nên Lancer không trigger từ đòn này. |
| Lancer | Sau khi SIGNI tấn công thực sự Vanish SIGNI đối thủ bằng battle, crush thêm một Life Cloth nếu có. Vanish bằng ability hoặc một hiệu ứng thay thế Vanish không thỏa trigger. Nhiều Lancer vẫn chỉ crush một. |
| S Lancer | Khi đủ điều kiện Vanish qua battle, crush một nếu đối thủ còn Life Cloth. Nếu đối thủ hết Life Cloth, gây damage. Có cả Lancer và S Lancer thì áp dụng S Lancer. |
| Double Crush | Damage từ đòn tấn công này crush tối đa hai lá. Nếu chỉ còn một lá, chỉ crush một và trận tiếp tục. Hai Life Burst phát sinh do đòn này được người bị crush chọn thứ tự. Một Guard chặn toàn bộ damage của đòn LRIG. |

Double Crush không tăng số Life Cloth bị crush riêng bởi trigger Lancer hoặc S Lancer. [Glossary, Assassin, Double Crush, Lancer và S Lancer](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, tr. 3–4](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)
