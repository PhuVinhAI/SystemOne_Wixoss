# Vòng lượt và tài nguyên

Hai người thay phiên làm **Turn Player**. Lượt gồm **Up → Draw → Ener → Grow → Main → Attack → End**. Attack Phase được bỏ qua ở lượt đầu tiên của trận.

| Phase | Hành vi |
| --- | --- |
| Up | Up các SIGNI và LRIG của Turn Player, trừ lá Frozen. Xóa Frozen của các lá thuộc Turn Player vào cuối Up Phase. |
| Draw | Rút hai lá bắt buộc, trừ lượt đầu người đi trước rút một. Nếu chỉ còn một lá khi phải rút hai, rút lá đó, xử lý Refresh nếu đủ điều kiện rồi sang Ener Phase. |
| Ener | Chọn một lá trên tay **hoặc** một SIGNI trên field của mình, đưa vào Ener Zone. Có thể bỏ qua. Chỉ làm một lần ở phase này. |
| Grow | Có thể Grow Center LRIG một lần. |
| Main | Đặt SIGNI, dùng Spell/Action/PIECE, Grow Assist hoặc Retire theo các điều kiện bên dưới. |
| Attack | Xử lý các bước trong [chương chiến đấu](04-combat.md). |
| End | Giải quyết trigger “at the end of turn”. Nếu Turn Player có trên sáu lá, người đó chọn discard đến sáu. Sau đó các hiệu ứng hết hạn tại thời điểm này kết thúc đồng thời và chuyển lượt. Đối thủ giữ số lá trên tay của mình. |

Ví dụ, “this turn”, “until end of turn” và “until the next end phase” kết thúc ở bước hết hạn tương ứng. Một người có thể giữ trên sáu lá trong các phần khác của lượt hoặc trong lượt đối thủ. [Quick Start, Playing the Game](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf) · [Glossary, Turn và End phase](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, tr. 2–3](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Grow và điều kiện đặt SIGNI

**Center Grow:** chọn lá Center phù hợp từ LRIG Deck có ít nhất một LRIG type chung và level cao hơn đúng một, đáp ứng thêm điều kiện in trên lá, trả Grow cost rồi đặt lá mới lên chồng hiện tại.

**Assist Grow:** dùng timing ghi trên lá, chẳng hạn Main Phase của mình hoặc cửa sổ Attack Phase phù hợp. Mỗi bước Grow vẫn cần type chung, tăng đúng một level và trả đủ chi phí. Level mới của Assist không vượt Level hiện tại của Center. Có thể Grow nhiều lần nếu mỗi lần đều hợp lệ.

**Đặt SIGNI:** kiểm tra slot trống, Level của SIGNI **≤ Level của Center**, và tổng Level sau khi đặt **≤ Limit hiệu lực**. Limit hiệu lực gồm Limit của Center và phần cộng từ Assist hoặc hiệu ứng áp dụng. Với Center Level 2, Limit 5, hai SIGNI Level 2 có thể cùng đứng trên field. SIGNI Level 2 thứ ba chỉ đặt được nếu Limit hiệu lực đạt ít nhất 6. SIGNI Level 3 vẫn không đặt được với Center Level 2. [Quick Start, chú thích 3 và 7](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf) · [Glossary, Grow, Level, Limit](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf)

## Main Phase

Turn Player chọn thứ tự các hành động hợp lệ. Sau mỗi hành động, hoàn tất hiệu ứng và các xử lý phát sinh trước khi nhận lựa chọn tiếp theo.

- Đặt SIGNI từ hand vào slot hợp lệ.
- Dùng Spell từ hand hoặc Action hợp lệ trên field.
- Dùng PIECE hoặc Grow Assist có timing Main Phase từ LRIG Deck.
- **Retire** một lần mỗi lượt trong Main Phase. Chọn một đến ba SIGNI của mình trên field và chuyển đồng thời vào Trash của chủ lá. Lá Frozen vẫn có thể Retire. Không dùng Ener do Retire tự sinh vì đích của Retire là Trash. [Quick Start, Main Phase](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf) · [Glossary, Retire](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Main phase](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)

## Ener và Refresh

**Ener Charge N** trên lá chuyển N lá từ đỉnh Main Deck vào Ener Zone, theo số lá có thể xử lý. Hành động tùy chọn trong Ener Phase chuyển lá từ hand hoặc field. Khi trả Ener, đưa các lá Ener dùng trả vào Trash. [Quick Start, chú thích 6 và 11](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf)

Khi Main Deck đạt 0, kiểm tra Refresh tại điểm kiểm tra luật. Xáo Trash thành Main Deck mới trước. Sau đó nếu còn Life Cloth, chuyển một Life Cloth vào Trash theo luật Refresh. Thao tác này không chạy chuỗi Crush hoặc Life Burst. Nếu Trash cũng trống, chờ đến khi có lá vào Trash. Nếu Main Deck cạn trong lúc xử lý một hiệu ứng, hoàn tất phần có thể xử lý rồi mới Refresh. Spell vừa xử lý đi vào Trash trước bước xáo này. Khi Turn Player Refresh lần thứ hai trong chính lượt của mình, lượt kết thúc sau lần Refresh đó. Cạn Main Deck tự nó không làm thua. [Glossary, Refresh](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) · [FAQ, Deck out](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf)
