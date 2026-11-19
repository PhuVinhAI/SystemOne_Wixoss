# WIXOSS English Edition — tài liệu game

Đặc tả trận WIXOSS hai người theo cấu trúc một Center LRIG và hai Assist LRIG của English Edition. Dùng các chương dưới đây để thiết kế bàn chơi, xác định hành động hợp lệ và kiểm thử luật. Tên phase, zone và từ khóa giữ theo tên trên lá bài.

| Chương | Nội dung |
| --- | --- |
| [Deck và thiết lập trận](01-match-and-decks.md) | Kiểm tra deck, Open, mulligan, Life Cloth và điều kiện thắng |
| [Bàn chơi và thông tin](02-board-and-zones.md) | Sơ đồ lane, zone ẩn/công khai, vị trí và trạng thái lá |
| [Vòng lượt và tài nguyên](03-turn-and-resources.md) | Bảy phase, Grow, Level/Limit, Retire, Refresh |
| [Chiến đấu và Life Cloth](04-combat.md) | Năm bước tấn công, so Power, Guard, Damage và Life Burst |
| [Lá bài và giải quyết hiệu ứng](05-cards-and-effects.md) | Cách đọc lá, timing, cost, target, trigger và từ khóa |
| [Đặc tả triển khai](06-engine-spec.md) | Trạng thái, quyền chọn, sự kiện, thông tin gửi cho từng người chơi |
| [Ca nghiệm thu](07-acceptance-cases.md) | Tình huống có đầu vào và kết quả mong đợi |

## Một trận diễn ra thế nào

1. Mỗi bên chuẩn bị hai deck, mở ba LRIG Level 0, giữ năm lá trên tay sau mulligan và bắt đầu với bảy Life Cloth.
2. Hai bên thay nhau rút bài, tích Ener, Grow Center LRIG và đặt SIGNI vào tối đa ba lane. Ener dùng để trả chi phí cho Grow, lá bài và ability.
3. SIGNI có thể đấu với SIGNI đối diện hoặc gây damage qua lane trống. Center LRIG tấn công độc lập với các lane và đối thủ có cơ hội Guard.
4. Damage khi còn Life Cloth thường làm lật một lá và có thể mở Life Burst. Khi đã hết Life Cloth, nhận thêm damage thì thua.

## Bộ luật nền

Phạm vi là luật trận đấu cơ bản và các ngoại lệ đã mô tả trong từng chương. Danh mục lá hỗ trợ, hiệu ứng riêng, errata và giới hạn giải đấu phụ thuộc bộ lá hoặc chế độ được chọn khi triển khai. Tra card theo mã in và dùng FAQ/errata của chính lá khi hành vi của nó cần xử lý riêng. FAQ tổng quát năm 2021 có câu trả lời về giới hạn màu cũ. Bản đặc tả dùng cập nhật có hiệu lực từ 19/04/2024. [Rules tiếng Anh](https://www.takaratomy.co.jp/products/en.wixoss/rules/) · [Cập nhật cấu trúc deck](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_update_v1/) · [Card List](https://www.takaratomy.co.jp/products/en.wixoss/card/) · [Errata](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_errata/)

Nguồn luật chung gồm [Beginner Guide](https://www.takaratomy.co.jp/products/en.wixoss/beginner/), [Quick Start Guide v1.0](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf1.pdf), [Play Sheet v1.0](https://www.takaratomy.co.jp/products/en.wixoss/beginner/pdf2.pdf), [Glossary v9.0.0](https://www.takaratomy.co.jp/products/en.wixoss/rules/rule_v9.pdf) và [FAQ v2.0.0](https://www.takaratomy.co.jp/products/en.wixoss/rules/faq_v2.pdf).
