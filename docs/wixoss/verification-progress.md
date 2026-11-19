# Tiến trình kiểm tra từng lá

Cập nhật: 2026-11-19 (hoàn tất)

Mục tiêu: đọc từng hồ sơ lá trong toàn bộ deck và pack, đối chiếu với Card List/FAQ chính thức, sửa lỗi ngay khi phát hiện và ghi lại tiến trình để có thể tiếp tục sau khi ngữ cảnh bị nén.

Quy ước trạng thái:

- `OK`: đã đọc, nội dung khớp nguồn, không có lỗi.
- `OK*`: đã đọc, khớp nguồn nhưng có ghi chú đối chiếu.
- `FIXED`: đã đọc và đã sửa lỗi.
- `TODO`: chưa đọc.

## Tổng quan

| Phạm vi | Tổng lá | Đã đọc | Còn lại |
| --- | ---: | ---: | ---: |
| Deck (10 set) | 256 | 256 | 0 |
| Pack (19 set) | 1.863 | 1.863 | 0 |

## Nhật ký sửa lỗi

- Đã sửa 245 dòng bảng bị vỡ do giá trị nhiều dòng: 18 dòng trong deck (`Cost`, `Use timing`) và 227 dòng trong pack (`Cost`, `Use timing`, `Minh họa`). Đã đối chiếu lại 227 file pack với Card List: 0 lệch.
- D01: chuẩn hóa text/power text/FAQ về đúng nguyên văn nguồn; bổ sung mục FAQ cho 10 lá không có FAQ; sửa `Use timing` của D01-021 từ `Main Phase` thành `—` (nguồn để trống).
- EXD01: ghi chú 4 ảnh biến thể `LC(P)` không có trên CDN cho 006, 007, 009, 010.
- D01: sửa thiếu dòng trống trước `## FAQ chính thức` ở 001, 002, 003, 005, 008.
- D01-014: thêm ghi chú FAQ nguồn bị lỗi (entry thứ hai lặp lại câu hỏi ở phần trả lời).
- D09-P05: sửa `Use timing` từ `3` thành `—` (nguồn dùng cột coin count cho Dona START, không phải timing).
- P06-004: sửa `Màu` từ `Trắng / 　` thành `Trắng` (nguồn `color` = `W` kèm khoảng trắng toàn giác bị renderer tách thành màu thứ hai).
- P06-031: sửa `Ghi chú minh họa` bị tách dòng giữa hai artist thành một dòng `れん / はしもとなおや` (nguồn `artist` nhiều dòng).
- P06-037, 038, 040: cùng lỗi tách dòng artist trong `Ghi chú minh họa`, đã gộp lần lượt `れん / イチゼン`, `ハタパグ / 北熊`, `夜ノみつき / アカバネ` (bảng vốn đã đúng).
- P06-042, 044, 045: cùng lỗi tách dòng artist, đã gộp lần lượt `神澤葉 / はしもとなおや`, `志月 / BUZZ`, `神澤葉 / はしもとなおや`.
- P06-057, 061, 062: cùng lỗi tách dòng artist, đã gộp lần lượt `コウサク / ぶんたん`, `狐ノ沢 / エイチ`, `志月 / pepo`.
- P06-066: cùng lỗi tách dòng artist, đã gộp `松本エイト / かにゃぴぃ`.
- P06-075: cùng lỗi tách dòng artist, đã gộp `狐ノ沢 / かにゃぴぃ`.
- P06-084: cùng lỗi tách dòng artist, đã gộp `Tota / 匡吉`.
- P07-008: gộp artist `霜月友 / Hitoto*`; `Use timing` từ `4` thành `—` (với LRIG, trường gốc `guard_coin_timing` hiển thị ở nhãn Coin, không phải timing).
- P07-009, 010, 013, 016: `Use timing` số (2, 1, 1, 3) -> `—` theo cùng quy ước Coin của LRIG; 009/010 gộp artist nhiều dòng.
- P07-019: `Use timing` 4 -> `—` cùng quy ước.
- P07-027: `Use timing` 3 -> `—` cùng quy ước.
- P07-033: `Use timing` 2 -> `—` cùng quy ước.
- P08-008: gộp artist `繭咲悠 / イチゼン`.
- P08-009: gộp artist `単ル / かわすみ`.
- P08-086: Use timing 1 -> — (với LRIG, trường gốc guard_coin_timing hiển thị ở nhãn Coin, không phải timing).
- P09-005, 006, 007, 008: Use timing (2, 2, 2, 1) -> — cùng quy ước LRIG; gộp artist nhiều dòng (005 `村上ゆいち / Hitoto*`, 007 `霜月友 / Hitoto*`, 008 `bomi / よん`).
- P11-085: Use timing 3 -> — (Carnival -0- là LRIG, giá trị 3 là coin khởi đầu, không phải timing).
- P12-008: trim khoảng trắng toàn giác cuối LRIG type `Mikomiko　` -> `Mikomiko`.
- P12-009: Use timing 2 -> — (Mel - Lady of the Camellias là LRIG, coin khởi đầu); trim khoảng trắng toàn giác cuối LRIG type `Mel　` -> `Mel`.
- P12-020: Use timing 3 -> — (Mel - Cherry Blossom là LRIG, coin khởi đầu); trim LRIG type `Mel　`. Các lá 017–019, 021–022 cũng trim `Mikomiko　`/`Mel　`.
- P12-026: Use timing 3 -> — (Layla =Neutral= là LRIG, coin khởi đầu).
- P13-010: Use timing 3 -> — (Nanashi, Part Three Calamity là LRIG, coin khởi đầu).
- P13-023: Use timing 2 -> — (Nanashi, Part Zero Calamity là LRIG, coin khởi đầu).
- P14-006, 007, 008: gộp artist nhiều dòng trong `Ghi chú minh họa` lần lượt `夕子 / Niθ`, `ぺろん / マツモトミツアキ`, `山吹色 / 斎木こまり`.
- P14-009: gộp artist nhiều dòng `コウサク / pupps`.
- P14-018: trim khoảng trắng toàn giác cuối tên `Ann II, Principled Practice　`.
- P14-028: Use timing 4 -> — (Mama ♥ 0 là LRIG, coin khởi đầu).
- P14-034: Use timing 3 -> — (Guzuko, Worthless Queen là LRIG, coin khởi đầu).
- P14-071: gộp artist nhiều dòng `かにゃぴぃ / Niθ`.
- P14-075, 077, 079: gộp artist nhiều dòng lần lượt `Mika Pikazo / sola`, `通常版：Mika Pikazo / パラ版：アカバネ`, `Mika Pikazo / Nardack`.
- P14-082, 085: gộp artist nhiều dòng lần lượt `通常版：Mika Pikazo / パラ版：茶ちえ`, `通常版：Mika Pikazo / パラ版：Hitoto*`.
- P15-006, 008: Use timing 4/2 -> — (Liberator Ril / Warrior Carnival #T# là LRIG, coin khởi đầu).
- P15-009, 012, 018, 021, SP01, SP03, SP04: Use timing 2/1/3/3/1/3/3 -> — (các LRIG, giá trị là coin khởi đầu).
- P15-011: trim khoảng trắng toàn giác cuối tên `Professor! Defender Dr. Tamago　`.

## Ghi chú nguồn đã biết

- D01-003: Card List ghi `At =Tva=`, ảnh in `At =Två=`; tài liệu dùng tên in và mã lá làm định danh.
- D01-009: FAQ nguồn có lỗi chính tả `described before":"`; giữ nguyên.
- D01-014: FAQ thứ hai trên trang chính thức có phần `A.` lặp lại câu hỏi, không phải câu trả lời; giữ nguyên nguồn.
- D01-020: FAQ nguồn dùng ngưỡng "more than 5", khác giới hạn bốn bản cùng tên trong Glossary; deck dùng bốn bản theo Card List.
- D01-021: `guard_coin_timing` để trống trong nguồn.
- EXD01-006/007/009/010: rarity `LC(P)` có trong Card List nhưng CDN không trả ảnh `P`.

## Deck

### WXDi-D01-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D01-001 | At =Noll=, the Opened Gate | FIXED | Team/Master `owata` đúng nguồn; đã sửa dòng trống trước FAQ |
| WXDi-D01-002 | At =Ett=, the Opened Gate | FIXED | Đã sửa dòng trống trước FAQ |
| WXDi-D01-003 | At =Två=, the Opened Gate | OK* | Tên in `Två`, Card List `Tva`; đã sửa dòng trống trước FAQ |
| WXDi-D01-004 | At =Tre=, the Opened Gate | OK | Text và 3 FAQ khớp nguồn |
| WXDi-D01-005 | Tawil =Noll=, Awakened One | FIXED | Đã sửa dòng trống trước FAQ |
| WXDi-D01-006 | Tawil =Screech= | OK | Text và FAQ khớp nguồn |
| WXDi-D01-007 | Tawil =Rainbow= | OK | Text và 3 FAQ khớp nguồn |
| WXDi-D01-008 | Umr =Noll=, Key to Salvation | FIXED | Đã sửa dòng trống trước FAQ |
| WXDi-D01-009 | Umr =Draw= | OK* | FAQ khớp nguồn; nguồn có lỗi chính tả `described before":"` |
| WXDi-D01-010 | Umr =Down= | FIXED | `Use timing` đã chuẩn hóa thành `Main Phase / Attack Phase` |
| WXDi-D01-011 | Harmonic Call | OK | Text và 4 FAQ khớp nguồn |
| WXDi-D01-012 | Camelopar, Natural Planet | OK | Text khớp nguồn, không có FAQ |
| WXDi-D01-013 | Sen no Rikyu, Jade General | OK* | Life Burst Ener Charge 3; có phần diễn giải Life Burst ngoài nguồn |
| WXDi-D01-014 | Zwei =Slow Loris= | OK* | FAQ thứ hai bị lỗi nguồn (A lặp lại Q); đã thêm ghi chú |
| WXDi-D01-015 | Tobiel, Full Armed | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D01-016 | Assylen, Natural Crystal | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D01-017 | Atalanta, Jade Angel | OK | Text khớp nguồn, không có FAQ |
| WXDi-D01-018 | Water Buffalo, Phantom Aquatic Beast | OK | Text khớp nguồn, không có FAQ |
| WXDi-D01-019 | Koalala, Phantom Terra Beast | OK | Text khớp nguồn, không có FAQ |
| WXDi-D01-020 | Servant ♯ | OK* | FAQ nguồn dùng ngưỡng "more than 5"; hồ sơ giữ nguyên và deck dùng 4 bản |
| WXDi-D01-021 | Polygenesis | FIXED | `Use timing` nguồn trống, đã sửa thành `—`; text/FAQ khớp |

### WXDi-D02-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D02-001 | Lize, Level 0 | OK | Lv0, limit 0, grow 《W》×０; không có text/FAQ |
| WXDi-D02-002 | [Center] Lize, Level 1 | OK | Lv1, limit 2, grow 《W》×０; không có FAQ |
| WXDi-D02-003 | [Center] Lize, Level 2 | OK | Lv2, limit 5, grow 《W》×１; không có FAQ |
| WXDi-D02-004 | [Center] Lize, Level 3 | OK | Team Action và [Enter] khớp nguồn; 2 FAQ khớp |
| WXDi-D02-005 | Ange, Level 0 | OK | Lv0, limit 0, grow 《W》×０; không có FAQ |
| WXDi-D02-006 | [Assist] Ange, Level 1 | OK | ASSIST, timing Main Phase, grow 《C》×０; không có FAQ |
| WXDi-D02-007 | [Assist] Ange, Level 2 | OK | Limit ＋１, grow 《C》×２; FAQ khớp nguồn |
| WXDi-D02-008 | Toko, Level 0 | OK | Màu đen, Lv0, grow 《B》×０; không có FAQ |
| WXDi-D02-009 | [Assist] Toko, Level 1 | OK | Text và FAQ "then" khớp nguồn |
| WXDi-D02-010 | [Assist] Toko, Level 2 | OK | Text và FAQ "up to two" khớp nguồn |
| WXDi-D02-011 | Samba Carnival | OK | PIECE, cost 《C》×５, [Use Conditions] khớp; FAQ khớp |
| WXDi-D02-012 | Chihiro Yuki, Code 2434 | OK | Text khớp nguồn, không có FAQ |
| WXDi-D02-013 | Ichigo Ushimi, Code 2434 | OK | Text và 2 FAQ khớp nguồn |
| WXDi-D02-014 | Kazaki Morinaka, Code 2434 | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D02-015 | Era Otogibara, Code 2434 | OK | Hai [Enter] và FAQ khớp nguồn |
| WXDi-D02-016 | Kaede Higuchi, Code 2434 | OK | Text, Life Burst và 2 FAQ khớp nguồn |
| WXDi-D02-017 | Rin Shizuka, Code 2434 | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D02-018 | Sara Hoshikawa, Code 2434 | OK | Màu trắng/đen, text khớp nguồn, không có FAQ |
| WXDi-D02-019 | Mao Matsukai, Code 2434 | OK | Màu trắng/đen, text khớp nguồn, không có FAQ |
| WXDi-D02-020 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn; không có FAQ |
| WXDi-D02-021 | In Wonderland | OK | Cost hai dòng đã gộp đúng; timing nguồn trống để `—`; FAQ khớp |

Đã kiểm tra 37 ảnh (21 ảnh gốc + 16 ảnh biến thể) đủ theo rarity.

### WXDi-D03-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D03-001 | Hirana, a Spark of Hope | OK | Lv0, grow 《R》×０; không có text/FAQ |
| WXDi-D03-002 | Hirana, a Dream of a Miracle | OK | Lv1, limit 2; không có FAQ |
| WXDi-D03-003 | Hirana, a Glimpse of the Truth | OK | Lv2, limit 5; không có FAQ |
| WXDi-D03-004 | Hirana, a Step Towards the Top | OK | Team Constant + [Enter] + [Action] khớp; 3 FAQ khớp |
| WXDi-D03-005 | Akino, Bound for the Future | OK | Lv0, grow 《W》×０; không có FAQ |
| WXDi-D03-006 | Akino*Rock | OK | ASSIST, timing Main Phase; FAQ compulsory [Enter] khớp |
| WXDi-D03-007 | Akino*Paper | OK | Grow 《C》×５, timing Main Phase / Attack Phase; FAQ khớp |
| WXDi-D03-008 | Rei, On the Wings of Tomorrow | OK | Lv0, grow 《U》×０; không có FAQ |
| WXDi-D03-009 | Rei*Flash Blade | OK | Text và FAQ compulsory [Enter] khớp |
| WXDi-D03-010 | Rei*Empty Blade | OK | Grow 《C》×１; không có FAQ |
| WXDi-D03-011 | Glory Grow | OK | PIECE, cost 《R》×０, [Use Conditions] khớp; không có FAQ |
| WXDi-D03-012 | Romail, Lightly Armed | OK | Text khớp nguồn, không có FAQ |
| WXDi-D03-013 | Lancelot, Crimson General | OK | Text khớp nguồn, không có FAQ |
| WXDi-D03-014 | Volcanic, Natural Crystal | OK | Life Burst khớp nguồn, không có FAQ |
| WXDi-D03-015 | Kagutsuchi, Crimson Angel | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D03-016 | Letti, Heavy Armed | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D03-017 | Adamanthia, Natural Crystal | OK | Text và FAQ khớp nguồn |
| WXDi-D03-018 | Bronze, Natural Crystal | OK | Màu đỏ/xanh dương, text khớp nguồn |
| WXDi-D03-019 | Silvana, Natural Crystal | OK | Màu đỏ/xanh dương, text khớp nguồn |
| WXDi-D03-020 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn |
| WXDi-D03-021 | Deafening Inferno | OK | SPELL, text và Life Burst khớp nguồn |

Đã kiểm tra 26 ảnh (21 ảnh gốc + 5 ảnh biến thể) đủ theo rarity.

### WXDi-D04-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D04-001 | MC LION - Standby | OK | Lv0, grow 《W》×０; không có text/FAQ |
| WXDi-D04-002 | MC LION - 1st Verse | OK | Lv1, limit 2; không có FAQ |
| WXDi-D04-003 | MC LION - 2nd Verse | OK | Lv2, limit 5; không có FAQ |
| WXDi-D04-004 | MC LION - 3rd Verse | OK | Team Enter + [Action] khớp; 2 FAQ khớp |
| WXDi-D04-005 | DJ LOVIT - Standby | OK | Lv0, grow 《R》×０; không có FAQ |
| WXDi-D04-006 | DJ LOVIT - SCRATCH | OK | Text và FAQ compulsory [Enter] khớp |
| WXDi-D04-007 | DJ LOVIT - MIX | OK | Hai [Enter] và chú giải Assassin/Lancer khớp; không có FAQ |
| WXDi-D04-008 | VJ WOLF - Standby | OK | Lv0, grow 《G》×０; không có FAQ |
| WXDi-D04-009 | VJ WOLF - CUE | OK | Text và FAQ compulsory [Enter] khớp |
| WXDi-D04-010 | VJ WOLF - SYNC | OK | Text, timing và FAQ khớp (giữ lỗi chính tả nguồn "prosecced") |
| WXDi-D04-011 | Endless Punchline | OK | PIECE, cost 《W》×０, text và 2 FAQ khớp |
| WXDi-D04-012 | F - Lite, Code: Art | OK | Text khớp nguồn, không có FAQ |
| WXDi-D04-013 | Michael, Blessed Angel | OK | Text khớp nguồn, không có FAQ |
| WXDi-D04-014 | Amazoness, Jade General | OK | Life Burst khớp nguồn, không có FAQ |
| WXDi-D04-015 | Athena, Blessed Angel | OK | Text và FAQ khớp nguồn |
| WXDi-D04-016 | Chandelier, Code: Art | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D04-017 | Flopsy, Phantom Terra Beast | OK | Text và Life Burst khớp nguồn; không có FAQ |
| WXDi-D04-018 | Triomphe, Code: Maze | OK | Màu trắng/xanh lá, text khớp nguồn |
| WXDi-D04-019 | Babel, Code: Maze | OK | Màu trắng/xanh lá, text khớp nguồn |
| WXDi-D04-020 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn |
| WXDi-D04-021 | Good Dig | OK | SPELL, cost hai dòng đã gộp, text và 2 FAQ khớp |

Đã kiểm tra 26 ảnh (21 ảnh gốc + 5 ảnh biến thể) đủ theo rarity.

### WXDi-D05-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D05-001 | Newborn Dr. Tamago | OK | Lv0, grow 《U》×０; không có text/FAQ |
| WXDi-D05-002 | Let's Go! Dr. Tamago | OK | Lv1, limit 2; không có FAQ |
| WXDi-D05-003 | You Can Do It! Dr. Tamago | OK | Lv2, limit 5; không có FAQ |
| WXDi-D05-004 | Never Give Up! Dr. Tamago | OK | Team Enter + [Auto] + [Action] khớp; 2 FAQ khớp |
| WXDi-D05-005 | Newborn Nova | OK | Lv0, grow 《W》×０; không có FAQ |
| WXDi-D05-006 | Nova =Dirty= | OK | Text khớp nguồn, không có FAQ |
| WXDi-D05-007 | Nova =Chopper= | OK | Grow 《C》×０, timing Main Phase / Attack Phase; không có FAQ |
| WXDi-D05-008 | Newborn Bang | OK | Lv0, grow 《G》×０; không có FAQ |
| WXDi-D05-009 | Bang =Crescendo= | OK | Text và FAQ compulsory [Enter] khớp |
| WXDi-D05-010 | Bang =Repeat= | OK | Hai [Enter] và FAQ khớp |
| WXDi-D05-011 | Hanpanai ★ Destruction | OK | PIECE, cost 《U》×０, text khớp; không có FAQ |
| WXDi-D05-012 | Sharkspeare, Azure Evil | OK | Text và FAQ khớp nguồn |
| WXDi-D05-013 | Curson, Blessed Evil | OK | Text, Life Burst và FAQ khớp nguồn |
| WXDi-D05-014 | Carmilla Screw, Azure Evil | OK | Text và 3 FAQ khớp (giữ dấu ？ toàn rộng của nguồn) |
| WXDi-D05-015 | Captain Hook, Azure Evil | OK | Text, Life Burst và 2 FAQ khớp |
| WXDi-D05-016 | Shimpachi, Azure General | OK | Text và Life Burst khớp; không có FAQ |
| WXDi-D05-017 | Giacobinids, Natural Planet | OK | Text khớp nguồn, không có FAQ |
| WXDi-D05-018 | Procyon A, Natural Planet | OK | Màu trắng/xanh dương, text khớp nguồn |
| WXDi-D05-019 | Sirius, Natural Planet | OK | Màu trắng/xanh dương, text khớp nguồn |
| WXDi-D05-020 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn |
| WXDi-D05-021 | RANDOM DRAIN | OK* | Nguồn có khoảng trắng cuối tên, không giữ được trong heading; text và 2 FAQ khớp |

Đã kiểm tra 26 ảnh (21 ảnh gốc + 5 ảnh biến thể) đủ theo rarity.

### WXDi-D06-EN — 21/21 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D06-001 | Muzica START | OK | Lv0, grow 《B》×０; không có text/FAQ |
| WXDi-D06-002 | Muzica, Vogue 1 | OK | Lv1, limit 2; không có FAQ |
| WXDi-D06-003 | Muzica, Vogue 2 | OK | Lv2, limit 5; không có FAQ |
| WXDi-D06-004 | Muzica, Vogue 3 | OK | Team Constant + [Enter] + [Action] khớp; 4 FAQ khớp |
| WXDi-D06-005 | Madoka START | OK | Lv0, grow 《U》×０; không có FAQ |
| WXDi-D06-006 | Madoka//Float | OK | Text và chú giải cost khớp; không có FAQ |
| WXDi-D06-007 | Madoka//Dub | OK | Hai [Enter], timing và FAQ khớp |
| WXDi-D06-008 | Sanga START | OK | Lv0, grow 《G》×０; không có FAQ |
| WXDi-D06-009 | Sanga//Aerial | OK | Text và chú giải Lancer khớp; không có FAQ |
| WXDi-D06-010 | Sanga//Shake | OK | Text và 2 FAQ khớp (nguồn lặp câu hỏi, giữ nguyên) |
| WXDi-D06-011 | Salvage the Future | OK | PIECE, cost 《B》×０, text khớp; không có FAQ |
| WXDi-D06-012 | Noboribetsu, Code: Maze | OK | Hai [Auto] và FAQ khớp nguồn |
| WXDi-D06-013 | He, Natural Element | OK | Text và 2 FAQ khớp nguồn |
| WXDi-D06-014 | Gaap, Doomed Angel | OK | Text, Life Burst và 2 FAQ khớp |
| WXDi-D06-015 | Ge, Natural Element | OK | Text, Life Burst và 2 FAQ khớp |
| WXDi-D06-016 | Aconis Type: Drei | OK | Text và FAQ khớp nguồn |
| WXDi-D06-017 | Anna Mirage, Doomed Evil | OK | [Rise], Life Burst khớp; không có FAQ |
| WXDi-D06-018 | Green Gas Type: Eins | OK | Màu xanh lá/đen, text khớp nguồn |
| WXDi-D06-019 | Tick - Tock, Azure Doomed Evil | OK | Màu xanh dương/đen, text khớp nguồn |
| WXDi-D06-020 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn |
| WXDi-D06-021 | Enervating Melody | OK | SPELL, text và Life Burst khớp nguồn |

Đã kiểm tra 26 ảnh (21 ảnh gốc + 5 ảnh biến thể) đủ theo rarity.

### WXDi-D07-EN — 22/22 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D07-001 | Ex Zero | OK | Lv0, grow 《R》×０; artist có tiền tố Drawing/Color khớp nguồn |
| WXDi-D07-002 | Ex One | OK | [Constant] Soul và FAQ khớp nguồn |
| WXDi-D07-003 | Ex Two | OK | [Constant] Soul và 2 FAQ khớp nguồn |
| WXDi-D07-004 | Ex Three | OK | [Auto] + 2 [Action] và 3 FAQ khớp nguồn |
| WXDi-D07-005 | Deus Zero | OK | Lv0, grow 《B》×０; không có FAQ |
| WXDi-D07-006 | Deus Drive | OK | Text và FAQ compulsory [Enter] khớp |
| WXDi-D07-007 | Deus Shield | OK | Hai [Enter], Limit ＋1 và 4 FAQ khớp |
| WXDi-D07-008 | Machina Zero | OK | Lv0, grow 《B》×０; không có FAQ |
| WXDi-D07-009 | Machina Wing Slash | OK | Hai [Enter] và FAQ khớp |
| WXDi-D07-010 | Machina Smash | OK | Hai [Enter] và chú giải cost khớp; không có FAQ |
| WXDi-D07-011 | TRIGGER OF VICTORY | OK | PIECE, cost 《C》×１, text và FAQ khớp |
| WXDi-D07-012 | Chime of the Blessed Key | OK | PIECE, cost 《C》×０, text và FAQ khớp |
| WXDi-D07-013 | Cargo, Code: Ride | OK | Text, Life Burst và FAQ khớp |
| WXDi-D07-014 | Baphomet, Doomed Evil | OK | Text và FAQ khớp nguồn |
| WXDi-D07-015 | Lancelot, Crimson General | OK | Text khớp nguồn, không có FAQ |
| WXDi-D07-016 | Musca, Natural Planet | OK | Text và Life Burst khớp nguồn |
| WXDi-D07-017 | Gull - Wing, Code: Accel | OK | Team Auto + [Action] và 2 FAQ khớp |
| WXDi-D07-018 | Devil Stinger, Phantom Aquatic Beast | OK | Text, Life Burst và 2 FAQ khớp |
| WXDi-D07-019 | Obelisk, Code: Anti | OK | Text và 4 FAQ khớp nguồn |
| WXDi-D07-020 | Eckesachs, Lightly Armed | OK | Màu đỏ/đen, text khớp nguồn |
| WXDi-D07-021 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp nguồn |
| WXDi-D07-022 | Burning Calamity | OK | SPELL, cost hai dòng đã gộp, text và FAQ khớp |

Đã kiểm tra 26 ảnh (22 ảnh gốc + 4 ảnh biến thể) đủ theo rarity.

### WXDi-D08-EN — 23/23 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D08-001 | Tamayorihime, New Moon Miko | OK | Lv0, grow 《W》×０; FAQ nguồn rỗng |
| WXDi-D08-002 | Tamayorihime, Crescent Moon Miko | OK | Lv1, limit 2; FAQ nguồn rỗng |
| WXDi-D08-003 | Tamayorihime, Half Moon Miko | OK | Lv2, limit 5; FAQ nguồn rỗng |
| WXDi-D08-004 | Tamayorihime, Musical Moon Miko | OK | Text và FAQ khớp nguồn |
| WXDi-D08-005 | Hanayo, Zero | OK | Lv0, grow 《R》×０; FAQ nguồn rỗng |
| WXDi-D08-006 | Hanayo, Camellia | OK | Text và FAQ khớp nguồn |
| WXDi-D08-007 | Hanayo, Orchid | OK | Text và FAQ khớp nguồn |
| WXDi-D08-008 | Midoriko, Battle Girl | OK | Lv0, grow 《G》×０; FAQ nguồn rỗng |
| WXDi-D08-009 | Midoriko, Gemmation | OK | Text khớp nguồn; FAQ nguồn rỗng |
| WXDi-D08-010 | Midoriko, Reinforcement | OK | Hai [Enter], timing Main Phase / Attack Phase; FAQ nguồn rỗng |
| WXDi-D08-011 | Go to the Top! | OK | PIECE, cost 《C》×３, text khớp; FAQ nguồn rỗng |
| WXDi-D08-012 | Burning Curiosity | OK | PIECE, Exceed 4 và FAQ khớp |
| WXDi-D08-013 | Aglaea, Blessed Angel | OK | Text và FAQ khớp nguồn |
| WXDi-D08-014 | Haniel, Blessed Angel | OK | Text, Life Burst và FAQ khớp |
| WXDi-D08-015 | Romail, Lightly Armed | OK | Text khớp nguồn; FAQ nguồn rỗng |
| WXDi-D08-016 | Michael, Blessed Angel | OK | Text khớp nguồn; FAQ nguồn rỗng |
| WXDi-D08-017 | Bow, High Armed | OK | Life Burst khớp nguồn; FAQ nguồn rỗng |
| WXDi-D08-018 | Athena, Blessed Angel | OK | Text và 2 FAQ khớp nguồn |
| WXDi-D08-019 | Arc Athena, Holy Angel | OK | Text khớp nguồn; FAQ nguồn rỗng |
| WXDi-D08-020 | Letti, Heavy Armed | OK* | Số bản 3 theo deck list; text và 2 FAQ khớp |
| WXDi-D08-021 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp; FAQ nguồn rỗng |
| WXDi-D08-022 | Get Big Bible | OK | SPELL, cost hai dòng đã gộp, text và 2 FAQ khớp |
| WXDi-D08-023 | Arcgwyn, Blessed Angel Queen | OK* | Số bản 1 theo deck list; text, Life Burst khớp; FAQ nguồn rỗng |

Đã kiểm tra 43 ảnh (23 ảnh gốc + 20 ảnh biến thể) đủ theo rarity.

### WXDi-D09-EN — 57/57 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-D09-CO-01 | Coin Card WXDi-D09-CO-01 | OK | TOKEN ngoài deck, 2 bản; nguồn không có tên/FAQ |
| WXDi-D09-H01 | Hirana, a Spark of Hope | OK | Lv0, grow 《R》×０; không có FAQ |
| WXDi-D09-H02 | Hirana, a Dream of a Miracle | OK | Lv1, limit 2; không có FAQ |
| WXDi-D09-H03 | Hirana, a Glimpse of the Truth | OK | Lv2, limit 5; không có FAQ |
| WXDi-D09-H04 | Hirana, a Step Towards the Top | OK | Text D09 (có chú giải Team) khớp nguồn |
| WXDi-D09-H05 | Tamayorihime, New Moon Miko | OK | Lv0, grow 《W》×０; không có FAQ |
| WXDi-D09-H06 | Tama Loud Voice | OK | Text khớp nguồn, không có FAQ |
| WXDi-D09-H07 | Tama Aura | OK | Text khớp nguồn, không có FAQ |
| WXDi-D09-H08 | Machina Zero | OK* | Artist nguồn có khoảng trắng cuối, đã trim; không có FAQ |
| WXDi-D09-H09 | Machina Wing Slash | OK | Hai [Enter] khớp nguồn |
| WXDi-D09-H10 | Machina Smash | OK | Hai [Enter], timing Main Phase / Attack Phase khớp |
| WXDi-D09-H11 | Entwined Supremacy | OK | PIECE, [Dream Team], cost 《R》×１ khớp |
| WXDi-D09-H12 | Go to the Top! | OK | PIECE, cost 《C》×３, artist keypot khớp |
| WXDi-D09-H13 | Nobunaga, Crimson General Queen | OK | 2 bản; [Rise] + [Enter] + [Action] khớp |
| WXDi-D09-H14 | Diabride, Natural Engagement Crystal | OK | 1 bản; text và Life Burst khớp |
| WXDi-D09-H15 | Hanayo//Memoria, Natural Pyroxene | OK | 2 bản; hai [Auto] khớp |
| WXDi-D09-H16 | Halberd, Full Armed | OK | 2 bản; text khớp nguồn |
| WXDi-D09-H17 | Flathro Commander, Roaring Flame | OK | 2 bản; hai [Auto] khớp |
| WXDi-D09-H18 | Ereshkigal, Doomed Evil Queen | OK | 1 bản; text và Life Burst khớp |
| WXDi-D09-H19 | Hera, Crimson Evil | OK | 4 bản; text khớp nguồn |
| WXDi-D09-H20 | Fornax, Natural Planet | OK | 2 bản; text và Life Burst khớp |
| WXDi-D09-H21 | Yuzuki//Memoria, Phantom Dragon | OK | 2 bản; text và Life Burst khớp |
| WXDi-D09-H22 | Decarabia, Crimson Evil | OK | 4 bản; Life Burst khớp |
| WXDi-D09-H23 | Tristan, Crimson General | OK | 2 bản; Life Burst khớp |
| WXDi-D09-H24 | Samidare, Lightly Armed | OK | 2 bản; text và Life Burst khớp |
| WXDi-D09-H25 | Eckesachs, Lightly Armed | OK | 2 bản; màu đỏ/đen khớp |
| WXDi-D09-H26 | Romail, Lightly Armed | OK | 4 bản; artist `かにゃぴい` khớp nguồn D09 |
| WXDi-D09-H27 | Lancelot, Crimson General | OK | 2 bản; text khớp nguồn |
| WXDi-D09-H28 | Servant ♯ | OK | 4 bản; Guard, Multi Ener, Life Burst khớp |
| WXDi-D09-H29 | Vulcanic Scythe | OK | 2 bản; Exceed 7 và Life Burst khớp |
| WXDi-D09-P01 | Code Piruluk | OK | Lv0, grow 《U》×０; không có FAQ |
| WXDi-D09-P02 | Code Piruluk K | OK | Lv1, limit 2; không có FAQ |
| WXDi-D09-P03 | Code Piruluk M | OK | Lv2, limit 5; không có FAQ |
| WXDi-D09-P04 | Code Piruluk xi | OK | Text khớp nguồn, không có FAQ |
| WXDi-D09-P05 | Dona START | FIXED | `Use timing` nguồn là coin count `3`, đã sửa thành `—`; text khớp |
| WXDi-D09-P06 | Dona "Cheer Me On!" | OK | Hai [Enter] và chú giải coin khớp |
| WXDi-D09-P07 | Dona "Go, Go!" | OK | Hai [Enter] khớp nguồn |
| WXDi-D09-P08 | Madoka START | OK | Lv0, grow 《U》×０; không có FAQ |
| WXDi-D09-P09 | Madoka//Float | OK | Text và chú giải cost khớp |
| WXDi-D09-P10 | Madoka//Clap | OK | Ba [Enter] khớp nguồn |
| WXDi-D09-P11 | Summer Live Blues | OK | PIECE, cost 《U》×２, text khớp |
| WXDi-D09-P12 | Burning Curiosity | OK | PIECE, Exceed 4 khớp nguồn |
| WXDi-D09-P13 | Exia, Blessed Angel Queen | OK | 1 bản; text và Life Burst khớp |
| WXDi-D09-P14 | Yukime//Memoria, Blessed Warlord | OK | 2 bản; text và Life Burst khớp |
| WXDi-D09-P15 | Orochimaru, Blessed Evil Queen | OK | 2 bản; lựa chọn ①/② khớp |
| WXDi-D09-P16 | Firefly Squid, Aquatic Phantom Deity | OK | 2 bản; [Harmony] + hai [Auto] khớp |
| WXDi-D09-P17 | Brynhildr, Azure Angel Queen | OK | 1 bản; text và Life Burst khớp |
| WXDi-D09-P18 | Mikomiko//Memoria, Bacteria Queen | OK | 2 bản; text khớp nguồn |
| WXDi-D09-P19 | Audomula, Azure Angel | OK | 4 bản; hai [Auto] khớp |
| WXDi-D09-P20 | Bruno, Azure General | OK | 2 bản; [Constant] khớp nguồn |
| WXDi-D09-P21 | Heqet, Azure Angel | OK | 4 bản; text khớp nguồn |
| WXDi-D09-P22 | Focalor, Azure Evil | OK | 4 bản; Life Burst khớp |
| WXDi-D09-P23 | Manomin, Azure Evil | OK | 4 bản; text khớp nguồn |
| WXDi-D09-P24 | Servant ♯ | OK | 4 bản; Guard, Multi Ener, Life Burst khớp |
| WXDi-D09-P25 | Call Out | OK | 2 bản; Exceed 7 và Life Burst khớp |
| WXDi-D09-P26 | RECOVERY | OK | 2 bản; Bet và Life Burst khớp |
| WXDi-D09-P27 | RANDOM DRAIN | OK* | 4 bản; nguồn có khoảng trắng cuối tên, đã trim; text khớp |

Đã kiểm tra 58 ảnh (57 ảnh gốc + 1 ảnh biến thể TK(P)) đủ theo rarity. README khớp số lượng: 52 + 52 lá deck và 2 coin card.

### WXDi-EXD01-EN — 28/28 (hoàn tất)

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-EXD01-001 | Urith, Enma | OK | Lv0, grow 《B》×０; không có text/FAQ |
| WXDi-EXD01-002 | Urith, Burning Enma | OK | Lv1, limit 2; không có FAQ |
| WXDi-EXD01-003 | Urith, Fatal Enma | OK | Lv2, limit 5; không có FAQ |
| WXDi-EXD01-004 | Urith, Maniacal Enma | OK | [Enter] + 2 [Action] khớp nguồn |
| WXDi-EXD01-005 | Akino, Bound for the Future | OK | Lv0, grow 《W》×０; không có FAQ |
| WXDi-EXD01-006 | Akino*Rock | OK* | Text khớp; LC(P) không có ảnh CDN, đã ghi chú |
| WXDi-EXD01-007 | Akino*Bye - Bye! | OK* | Text khớp; LC(P) không có ảnh CDN, đã ghi chú |
| WXDi-EXD01-008 | Newborn Dr. Tamago | OK | Lv0, grow 《U》×０; không có FAQ |
| WXDi-EXD01-009 | Tamago =Beating= | OK* | Text khớp; LC(P) không có ảnh CDN, đã ghi chú |
| WXDi-EXD01-010 | Tamago =Cymbal Roll= | OK* | Text khớp; LC(P) không có ảnh CDN, đã ghi chú |
| WXDi-EXD01-011 | Miasma Labyrinth | OK | PIECE, cost hai dòng đã gộp, text khớp |
| WXDi-EXD01-012 | Never Surrender | OK | PIECE, cost 《C》×０, text khớp |
| WXDi-EXD01-013 | Ronove, Azure Evil | OK | Text và Life Burst khớp |
| WXDi-EXD01-014 | Karasawa, Doomed General | OK | Text khớp nguồn |
| WXDi-EXD01-015 | Baphomet, Doomed Evil | OK | Text khớp nguồn |
| WXDi-EXD01-016 | Mastema, Blessed Doomed Angel | OK | Màu trắng/đen, text khớp nguồn |
| WXDi-EXD01-017 | Curson, Blessed Evil | OK | Text và Life Burst khớp |
| WXDi-EXD01-018 | Brutus, Doomed General | OK | Text khớp nguồn |
| WXDi-EXD01-019 | Caesar, Wicked General | OK | Text khớp nguồn |
| WXDi-EXD01-020 | Typhon, Doomed Evil | OK | Text và Life Burst khớp |
| WXDi-EXD01-021 | Buckler, High Armed | OK | Life Burst khớp nguồn |
| WXDi-EXD01-022 | Izo, Doomed General | OK | Text và Life Burst khớp |
| WXDi-EXD01-023 | Anna Mirage, Doomed Evil | OK | Text và Life Burst khớp |
| WXDi-EXD01-024 | Dark Energie, Full Armed | OK | Text khớp nguồn |
| WXDi-EXD01-025 | Dragon Maid, Phantom Dragon Queen | OK | Hai [Auto] khớp nguồn |
| WXDi-EXD01-026 | Phalaris, Code: Ancients | OK | [Harmony] + [Auto] khớp nguồn |
| WXDi-EXD01-027 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |
| WXDi-EXD01-028 | Reticle Digger | OK | SPELL, Exceed 4 và text khớp |

Đã kiểm tra 28 ảnh gốc; 4 ảnh `LC(P)` của 006/007/009/010 không có trên CDN và đã được ghi chú từ trước.

### Tổng kết deck

Đã đọc và đối chiếu đủ 256/256 lá của 10 set deck. Lỗi tìm thấy trong giai đoạn này: D09-P05 `Use timing` (đã sửa). Các ghi chú nguồn còn lại đã được giữ nguyên và ghi rõ.

## Pack

Tổng 1.863 lá trên 19 set. Đang đọc theo thứ tự P00 → P16, CP01, CP02.

### WXDi-P00 (99 lá) — hoàn tất

Đã đọc và đối chiếu đủ 99/99 lá với Card List và FAQ chính thức. Không có lỗi.

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P00-001 | Super Helesta Saber | OK | — |
| WXDi-P00-002 | Counter Alchemy | OK | — |
| WXDi-P00-003 | Ancient Echo | OK | — |
| WXDi-P00-004 | Future Code | OK | — |
| WXDi-P00-005 | Chime of the Blessed Key | OK | — |
| WXDi-P00-006 | Assault Cerberus | OK | — |
| WXDi-P00-007 | Tawil =Ett= | OK | — |
| WXDi-P00-008 | Tawil =Två= | OK | — |
| WXDi-P00-009 | Tawil =Tre= | OK | — |
| WXDi-P00-010 | Tawil =Eibon= | OK | — |
| WXDi-P00-011 | Tawil =Bubbles= | OK | — |
| WXDi-P00-012 | Tawil =Burst= | OK | — |
| WXDi-P00-013 | Umr =Ett= | OK | — |
| WXDi-P00-014 | Umr =Två= | OK | — |
| WXDi-P00-015 | Umr =Tre= | OK | — |
| WXDi-P00-016 | Umr =Freeze= | OK | — |
| WXDi-P00-017 | Umr =Shatter= | OK | — |
| WXDi-P00-018 | Umr =Clear= | OK | FAQ rút bài khi tay trống khớp |
| WXDi-P00-019 | At =Charge= | OK | — |
| WXDi-P00-020 | At =Forte= | OK | — |
| WXDi-P00-021 | At =Reminder= | OK | FAQ "if you do" khớp |
| WXDi-P00-022 | At =Discovery= | OK | FAQ Double Crush khớp |
| WXDi-P00-023 | At =Repair= | OK | FAQ yêu cầu đủ 7 lá khớp |
| WXDi-P00-024 | [Assist] Lize, Level 1 | OK | — |
| WXDi-P00-025 | [Assist] Lize, Level 2 | OK | — |
| WXDi-P00-026 | [Assist] Lize, Level 1' | OK | — |
| WXDi-P00-027 | [Assist] Lize, Level 2' | OK | FAQ Enercost khớp |
| WXDi-P00-028 | [Assist] Lize, Level 2'' | OK | 2 FAQ khớp |
| WXDi-P00-029 | [Center] Ange, Level 1 | OK | — |
| WXDi-P00-030 | [Center] Ange, Level 2 | OK | — |
| WXDi-P00-031 | [Center] Ange, Level 3 | OK | 2 FAQ Team khớp |
| WXDi-P00-032 | [Assist] Ange, Level 1' | OK | — |
| WXDi-P00-033 | [Assist] Ange, Level 2' | OK | — |
| WXDi-P00-034 | [Assist] Ange, Level 2'' | OK | FAQ Enercost khớp |
| WXDi-P00-035 | [Center] Toko, Level 1 | OK | — |
| WXDi-P00-036 | [Center] Toko, Level 2 | OK | — |
| WXDi-P00-037 | [Center] Toko, Level 3 | OK | 2 FAQ khớp |
| WXDi-P00-038 | [Assist] Toko, Level 1' | OK | — |
| WXDi-P00-039 | [Assist] Toko, Level 2' | OK | FAQ Enercost khớp |
| WXDi-P00-040 | [Assist] Toko, Level 2'' | OK | 2 FAQ khớp |
| WXDi-P00-041 | Ars Almal, Code 2434 | OK | 2 FAQ khớp |
| WXDi-P00-042 | Himawari Honma, Code 2434 | OK | FAQ khớp |
| WXDi-P00-043 | Mars, Crimson Angel Queen | OK | 3 FAQ khớp |
| WXDi-P00-044 | Shub-Niggura, Crimson Evil Queen | OK | 3 FAQ khớp |
| WXDi-P00-045 | Yog-Sothoth, Code: Labyrinth | OK | 2 FAQ khớp |
| WXDi-P00-046 | Parthenos, Code: Ancients | OK | 2 FAQ khớp; Life Burst khớp |
| WXDi-P00-047 | Amino Acid, Natural Bacteria Queen | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-048 | Azathoth, Phantom Spirit Queen | OK | FAQ Team khớp |
| WXDi-P00-049 | Lulu Suzuhara, Code 2434 | OK* | FAQ nguồn ghi nhầm <ANCIENT SURPRISE>, giữ nguyên văn |
| WXDi-P00-050 | Nui Sociere, Code 2434 | OK | — |
| WXDi-P00-051 | Roa Yuzuki, Code 2434 | OK | Life Burst khớp |
| WXDi-P00-052 | Sister Claire, Code 2434 | OK | Life Burst khớp |
| WXDi-P00-053 | Meiji Warabeda, Code 2434 | OK | Life Burst khớp |
| WXDi-P00-054 | Ryushen, Code 2434 | OK | — |
| WXDi-P00-055 | Mikoto Rindou, Code 2434 | OK | Chỉ có Life Burst |
| WXDi-P00-056 | Furen Slash | OK | SPELL, cost hai dòng đã gộp |
| WXDi-P00-057 | Eyris, Crimson Angel | OK | FAQ khớp |
| WXDi-P00-058 | Imagawa, Crimson General | OK | — |
| WXDi-P00-059 | Byleth, Crimson Evil | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-060 | Hera, Crimson Evil | OK | 2 FAQ khớp |
| WXDi-P00-061 | Hotarumaru, High Armed | OK | 2 FAQ khớp |
| WXDi-P00-062 | Calydon, Phantom Terra Beast | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-063 | Tadakatsu, Crimson General | OK | Chỉ có Life Burst |
| WXDi-P00-064 | Nelian, Natural Crystal | OK | Life Burst khớp |
| WXDi-P00-065 | Battle Beat | OK | SPELL, Life Burst khớp |
| WXDi-P00-066 | Njord, Azure Angel | OK | FAQ khớp |
| WXDi-P00-067 | Clepsydra, Code: Maze | OK | — |
| WXDi-P00-068 | Neon Tetra, Phantom Aquatic Beast | OK | Life Burst khớp |
| WXDi-P00-069 | Hypnos, Azure Angel | OK | — |
| WXDi-P00-070 | Slime Mage, Azure Evil | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-071 | High Circus, Code: Maze | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-072 | Gan Ning, Azure General | OK | FAQ khớp |
| WXDi-P00-073 | Vela, Natural Planet | OK | Chỉ có Life Burst |
| WXDi-P00-074 | Blue Opener | OK | SPELL, Life Burst khớp |
| WXDi-P00-075 | Skanda, Jade Evil | OK | 2 FAQ khớp; Life Burst khớp |
| WXDi-P00-076 | Kawanii, Code: Maze | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-077 | Sloth, Phantom Terra Beast | OK | — |
| WXDi-P00-078 | Buer, Jade Evil | OK | Chỉ có Life Burst |
| WXDi-P00-079 | Blacksaddle, Phantom Aquatic Beast | OK | — |
| WXDi-P00-080 | Creation Tone | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-081 | Ratna Petit, Code 2434 | OK | FAQ khớp |
| WXDi-P00-082 | Fuyuki Hakase, Code 2434 | OK | — |
| WXDi-P00-083 | Melissa Kinrenka, Code 2434 | OK | Life Burst khớp |
| WXDi-P00-084 | Mirei Gundo, Code 2434 | OK | — |
| WXDi-P00-085 | Tamaki Fumino, Code 2434 | OK | Chỉ có Life Burst |
| WXDi-P00-086 | Rena Yorumi, Code 2434 | OK | FAQ khớp; Life Burst khớp |
| WXDi-P00-087 | Dola, Code 2434 | OK | Chỉ có Life Burst |
| WXDi-P00-088 | Darkness Eater | OK | SPELL, Life Burst khớp |
| WXDi-P00-089 | Sara Hoshikawa, Code 2434 | OK | Màu trắng/đen |
| WXDi-P00-090 | Mao Matsukai, Code 2434 | OK | Màu trắng/đen |
| WXDi-P00-091 | Bronze, Natural Crystal | OK | Màu đỏ/xanh dương |
| WXDi-P00-092 | Silvana, Natural Crystal | OK | Màu đỏ/xanh dương |
| WXDi-P00-093 | Pandada, Phantom Terra Beast | OK | Màu đỏ/xanh lá |
| WXDi-P00-094 | Koalala, Phantom Terra Beast | OK | Màu đỏ/xanh lá |
| WXDi-P00-095 | Water Buffalo, Phantom Aquatic Beast | OK | Màu xanh dương/xanh lá |
| WXDi-P00-096 | Tree Froggy, Phantom Aquatic Beast | OK | Màu xanh dương/xanh lá |
| WXDi-P00-097 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |
| WXDi-P00-098 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |
| WXDi-P00-099 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |

### WXDi-P01 (99 lá) — hoàn tất

Đã đọc và đối chiếu đủ 99/99 lá với Card List và FAQ chính thức. Không có lỗi.

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P01-001 | Go to the Top! | OK | PIECE, Use Conditions + text khớp |
| WXDi-P01-002 | Silent Assassin | OK | PIECE, text khớp |
| WXDi-P01-003 | Great! Re - ver - sal! | OK | PIECE, text khớp |
| WXDi-P01-004 | Code: L/O | OK | PIECE, text khớp |
| WXDi-P01-005 | Nightmare■Step | OK | 2 FAQ khớp |
| WXDi-P01-006 | Never Surrender | OK | — |
| WXDi-P01-007 | ●Tap Down Tap● | OK | Attack Phase |
| WXDi-P01-008 | Kyururi ☆ Kyururira | OK | Main/Attack Phase |
| WXDi-P01-009 | Akino*Thumbs Up! | OK | — |
| WXDi-P01-010 | Akino*Peace! | OK | FAQ Enter bắt buộc khớp |
| WXDi-P01-011 | Akino*Bye - Bye! | OK | FAQ khớp |
| WXDi-P01-012 | Rei*Lunar Blossom | OK | FAQ khớp |
| WXDi-P01-013 | Rei*Absolute Zero | OK | — |
| WXDi-P01-014 | Rei*Rending Blade | OK | — |
| WXDi-P01-015 | DJ LOVIT - SCRATCHx2 | OK | — |
| WXDi-P01-016 | DJ LOVIT - BEATJUG | OK | — |
| WXDi-P01-017 | DJ LOVIT - CROSSFADE | OK | FAQ Life Burst khớp |
| WXDi-P01-018 | VJ WOLF - LASER | OK | 2 FAQ khớp |
| WXDi-P01-019 | VJ WOLF - STREAM | OK | — |
| WXDi-P01-020 | VJ WOLF - MIRAGE | OK | 3 FAQ khớp |
| WXDi-P01-021 | Nova =Mute= | OK | — |
| WXDi-P01-022 | Nova =Slash= | OK | — |
| WXDi-P01-023 | Nova =Supernova= | OK | FAQ khớp |
| WXDi-P01-024 | Bang =Pianissimo= | OK | FAQ khớp |
| WXDi-P01-025 | Bang =Da Capo= | OK | 2 FAQ khớp |
| WXDi-P01-026 | Bang =Big Bang= | OK | FAQ thủ tục 7 bước khớp |
| WXDi-P01-027 | Madoka//Slide | OK | — |
| WXDi-P01-028 | Madoka//Break | OK | FAQ khớp |
| WXDi-P01-029 | Madoka//Clap | OK | — |
| WXDi-P01-030 | Sanga//Swing | OK | — |
| WXDi-P01-031 | Sanga//Strike | OK | FAQ Double Crush khớp |
| WXDi-P01-032 | Sanga//Parallel | OK | — |
| WXDi-P01-033 | Arcgwyn, Blessed Angel Queen | OK | Life Burst chọn 1 khớp |
| WXDi-P01-034 | Libra, Natural Planet Queen | OK | FAQ "up to" khớp |
| WXDi-P01-035 | PRJ - MAP, Code: Heart | OK | 2 FAQ Team khớp |
| WXDi-P01-036 | Nobunaga, Crimson General Queen | OK | Rise + Action khớp |
| WXDi-P01-037 | Rose Quartz, Natural Crystal Brilliance | OK | FAQ Team khớp |
| WXDi-P01-038 | Fenrir, Azure Evil Queen | OK | FAQ Team khớp |
| WXDi-P01-039 | Saturne, Natural Planet Queen | OK | 2 FAQ khớp; Life Burst khớp |
| WXDi-P01-040 | Robin Hood, Jade General Queen | OK | 4 FAQ khớp |
| WXDi-P01-041 | Quin, Code: Labyrinth | OK | 2 FAQ khớp; Life Burst khớp |
| WXDi-P01-042 | Osagitsune, Phantom Terra Beast God | OK | FAQ khớp |
| WXDi-P01-043 | Dark Energie, Full Armed | OK | — |
| WXDi-P01-044 | Lanling Type: Drei | OK | FAQ Team khớp |
| WXDi-P01-045 | Haniel, Blessed Angel | OK | Life Burst khớp |
| WXDi-P01-046 | Zhao Yun, Blessed General | OK | Shadow–Level khớp |
| WXDi-P01-047 | Andras, Blessed Evil | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-048 | Alphard, Natural Planet | OK | 2 FAQ khớp |
| WXDi-P01-049 | Ma Chao, Blessed General | OK | Shadow–SIGNI khớp |
| WXDi-P01-050 | Bow, High Armed | OK | Chỉ có Life Burst |
| WXDi-P01-051 | Salangidae, Phantom Aquatic Beast | OK | Life Burst khớp |
| WXDi-P01-052 | Stand Up | OK | SPELL, FAQ khớp |
| WXDi-P01-053 | Sita, Crimson Angel | OK | Chỉ có Life Burst |
| WXDi-P01-054 | Yue Fei, Crimson General | OK | — |
| WXDi-P01-055 | Amethystal, Natural Crystal | OK | FAQ khớp |
| WXDi-P01-056 | C2H2, Natural Element | OK | Life Burst khớp |
| WXDi-P01-057 | Rama, Crimson Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-058 | Shokudai - kiri, High Armed | OK | FAQ khớp |
| WXDi-P01-059 | Carina, Natural Planet | OK | FAQ khớp |
| WXDi-P01-060 | Resonating Sound of Destruction | OK | SPELL, Life Burst khớp |
| WXDi-P01-061 | Charon, Azure Angel | OK | — |
| WXDi-P01-062 | Bradamante, Azure General | OK | — |
| WXDi-P01-063 | Antila, Natural Planet | OK | Life Burst khớp |
| WXDi-P01-064 | Regalecus, Phantom Aquatic Beast | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-065 | Cocytus, Azure Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-066 | Focalor, Azure Evil | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-067 | Coelacanth, Phantom Aquatic Beast | OK* | Tên nguồn có xuống dòng đầu, đã trim |
| WXDi-P01-068 | Trouble | OK | SPELL, Life Burst khớp |
| WXDi-P01-069 | Garmr, Jade Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-070 | Maid Marian, Jade General | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-071 | Vassago, Jade Evil | OK | FAQ khớp |
| WXDi-P01-072 | Hyakkoko, Phantom Terra Beast | OK | — |
| WXDi-P01-073 | Skadi, Jade Angel | OK | FAQ khớp |
| WXDi-P01-074 | Pavo, Natural Planet | OK | FAQ khớp |
| WXDi-P01-075 | Kiyosumi, Code: Maze | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-076 | Musuzaku, Phantom Terra Beast | OK | — |
| WXDi-P01-077 | Great Snake | OK | SPELL, Life Burst khớp |
| WXDi-P01-078 | Azrael, Doomed Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-079 | Sgathaich, Doomed General | OK | — |
| WXDi-P01-080 | Baal, Doomed Evil | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-081 | Fragarach, Lightly Armed | OK | — |
| WXDi-P01-082 | Horologium, Natural Planet | OK | FAQ khớp |
| WXDi-P01-083 | Paimon, Doomed Evil | OK | FAQ khớp |
| WXDi-P01-084 | Gram, High Armed | OK | — |
| WXDi-P01-085 | Dagger Type: Zwei | OK | — |
| WXDi-P01-086 | Corvus, Natural Planet | OK | Chỉ có Life Burst |
| WXDi-P01-087 | Kawasaki, Code: Maze | OK | FAQ khớp; Life Burst khớp |
| WXDi-P01-088 | Under Attractive | OK | SPELL, Life Burst khớp |
| WXDi-P01-089 | Percival, Blessed Crimson General | OK | Màu trắng/đỏ |
| WXDi-P01-090 | Gawain, Blessed Crimson General | OK | Màu trắng/đỏ |
| WXDi-P01-091 | Procyon A, Natural Planet | OK | Màu trắng/xanh dương |
| WXDi-P01-092 | Sirius, Natural Planet | OK | Màu trắng/xanh dương |
| WXDi-P01-093 | Triomphe, Code: Maze | OK | Màu trắng/xanh lá |
| WXDi-P01-094 | Babel, Code: Maze | OK | Màu trắng/xanh lá |
| WXDi-P01-095 | Imp, Azure Doomed Evil | OK | Màu xanh dương/đen |
| WXDi-P01-096 | Tick - Tock, Azure Doomed Evil | OK | Màu xanh dương/đen |
| WXDi-P01-097 | Green Gas Type: Eins | OK | Màu xanh lá/đen |
| WXDi-P01-098 | Cobra Type: Zwei | OK | Màu xanh lá/đen |
| WXDi-P01-099 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |

### WXDi-P02 (96 lá) — hoàn tất

Đã đọc và đối chiếu đủ 96/96 lá với Card List và FAQ chính thức. Không có lỗi nội dung.

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P02-001 | Illusions and Lightning | OK | PIECE, 2 mode khớp |
| WXDi-P02-002 | ITTEN - TOPPA | OK | 2 FAQ khớp |
| WXDi-P02-003 | Azure Black GAIA | OK* | Tên nguồn có khoảng trắng cuối, đã trim; 2 FAQ khớp |
| WXDi-P02-004 | Heaven's Door | OK | FAQ khớp |
| WXDi-P02-005 | Zeno Cluster | OK | FAQ khớp |
| WXDi-P02-006 | End of the Turn | OK | Spell Cut-In; 2 FAQ khớp |
| WXDi-P02-007 | Akino, Bound for Dreams | OK | — |
| WXDi-P02-008 | Akino, Bound for Brightness | OK | — |
| WXDi-P02-009 | Akino, Bound for Valor | OK | Team + Action khớp |
| WXDi-P02-010 | Hirana*On - Stage | OK | — |
| WXDi-P02-011 | Hirana*Glowing | OK | FAQ Servant# khớp |
| WXDi-P02-012 | Hirana*Honest and Earnest | OK | — |
| WXDi-P02-013 | Hirana*Power On | OK | — |
| WXDi-P02-014 | DJ LOVIT - 1st Verse | OK | — |
| WXDi-P02-015 | DJ LOVIT - 2nd Verse | OK | — |
| WXDi-P02-016 | DJ LOVIT - 3rd Verse | OK | Team + Action khớp |
| WXDi-P02-017 | MC LION - DIG | OK | — |
| WXDi-P02-018 | MC LION - STANDUP | OK | FAQ khớp |
| WXDi-P02-019 | MC LION - DISRESPECT | OK | 3 [Enter] khớp |
| WXDi-P02-020 | MC LION - DOPE | OK | — |
| WXDi-P02-021 | Bang, Singer of Melodies | OK | — |
| WXDi-P02-022 | Bang, Front and Center | OK | — |
| WXDi-P02-023 | Bang, Read to Fight | OK | 2 FAQ khớp |
| WXDi-P02-024 | Tamago =Double Stroke Roll= | OK | — |
| WXDi-P02-025 | Tamago =Beating= | OK | — |
| WXDi-P02-026 | Tamago =Jet Stick= | OK | — |
| WXDi-P02-027 | Tamago =Drumroll= | OK | FAQ Shadow khớp |
| WXDi-P02-028 | Madoka, Vogue 1 | OK | — |
| WXDi-P02-029 | Madoka, Vogue 2 | OK | — |
| WXDi-P02-030 | Madoka, Vogue 3 | OK | Team + Action khớp |
| WXDi-P02-031 | Muzica//Dolphin | OK | FAQ khớp |
| WXDi-P02-032 | Muzica//Power Move | OK | — |
| WXDi-P02-033 | Muzica//Splits | OK | FAQ khớp |
| WXDi-P02-034 | Muzica//Groovy | OK | FAQ khớp |
| WXDi-P02-035 | Yaekiri, Full Armed | OK | FAQ khớp |
| WXDi-P02-036 | Casseopeia, Natural Planet Queen | OK | — |
| WXDi-P02-037 | Daji, Crimson Evil Queen | OK | 2 FAQ khớp; Life Burst khớp |
| WXDi-P02-038 | Phoenix, Natural Planet Queen | OK | — |
| WXDi-P02-039 | Buffalo, Phantom Terra Beast God | OK | FAQ khớp |
| WXDi-P02-040 | Amabie, Azure Angel Queen | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-041 | Royal Blue, Natural Crystal Brilliance | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-042 | ZrO2, Natural Element Queen | OK | FAQ khớp |
| WXDi-P02-043 | Influen D Type: Drei | OK | 4 FAQ khớp |
| WXDi-P02-044 | Gauche Agnese, Natural Plant Queen | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-045 | Valkyrie, Doomed Angel Queen | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-046 | Phalaris, Code: Ancients | OK | — |
| WXDi-P02-047 | Pele, Blessed Angel | OK | FAQ khớp |
| WXDi-P02-048 | Kogitsunemaru, Lightly Armed | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-049 | Totorisa, Code: Maze | OK | FAQ khớp |
| WXDi-P02-050 | Circe, Blessed Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-051 | Circinus, Natural Planet | OK | — |
| WXDi-P02-052 | Symphorce, Code: Maze | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-053 | Dekasanbashi, Code: Maze | OK | FAQ khớp |
| WXDi-P02-054 | White Betta, Phantom Aquatic Beast | OK | — |
| WXDi-P02-055 | A Shade of Bravery | OK | SPELL, cost 《W》×1 giữ nguyên |
| WXDi-P02-056 | Kamuy - huci, Crimson Angel | OK | FAQ khớp |
| WXDi-P02-057 | Zepar, Crimson Evil | OK | — |
| WXDi-P02-058 | Mensah, Natural Planet | OK | Life Burst khớp |
| WXDi-P02-059 | Nuncha, High Armed | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-060 | S - Tove, Code: Art | OK | FAQ khớp |
| WXDi-P02-061 | Hamster, Phantom Terra Beast | OK | FAQ khớp |
| WXDi-P02-062 | Boudica, Crimson General | OK | — |
| WXDi-P02-063 | In Perfect Harmony | OK | SPELL |
| WXDi-P02-064 | Heqet, Azure Angel | OK | — |
| WXDi-P02-065 | Snow Myu, Code: Maze | OK | — |
| WXDi-P02-066 | Hassi, Phantom Aquatic Beast | OK | Life Burst khớp |
| WXDi-P02-067 | Gaghiel, Azure Angel | OK | FAQ khớp; Life Burst khớp |
| WXDi-P02-068 | Hijikata, Azure General | OK | FAQ khớp |
| WXDi-P02-069 | Dorado, Natural Planet | OK | Chỉ có Life Burst |
| WXDi-P02-070 | Con Aqua, Master Trickster | OK | — |
| WXDi-P02-071 | Spinning Harmony | OK | SPELL |
| WXDi-P02-072 | Kamapua'a, Jade Angel | OK | — |
| WXDi-P02-073 | Ophiuchus, Natural Planet | OK | Life Burst khớp |
| WXDi-P02-074 | Parajulis, Phantom Aquatic Beast | OK | — |
| WXDi-P02-075 | Sitri, Jade Evil | OK | Chỉ có Life Burst |
| WXDi-P02-076 | Cicuta Virosa Type: Zwei | OK | — |
| WXDi-P02-077 | Palustre, Phantom Aquatic Beast | OK | — |
| WXDi-P02-078 | Fujisapa, Code: Maze | OK | — |
| WXDi-P02-079 | Fennec, Phantom Terra Beast | OK | Life Burst khớp |
| WXDi-P02-080 | Heterophony | OK | SPELL |
| WXDi-P02-081 | Nyx, Doomed Angel | OK | — |
| WXDi-P02-082 | Gamigin, Doomed Evil | OK | — |
| WXDi-P02-083 | Mo, Natural Element | OK | Life Burst khớp |
| WXDi-P02-084 | Erebus, Doomed Angel | OK | — |
| WXDi-P02-085 | Chen Gong, Doomed General | OK | Chỉ có Life Burst |
| WXDi-P02-086 | Agares, Doomed Evil | OK | Life Burst khớp |
| WXDi-P02-087 | Tucana, Natural Planet | OK | — |
| WXDi-P02-088 | E - Fone, Code: Art | OK | — |
| WXDi-P02-089 | Search Light | OK | SPELL |
| WXDi-P02-090 | Bronze, Natural Crystal | OK | Màu đỏ/xanh dương |
| WXDi-P02-091 | Silvana, Natural Crystal | OK | Màu đỏ/xanh dương |
| WXDi-P02-092 | Pandada, Phantom Terra Beast | OK | Màu đỏ/xanh lá |
| WXDi-P02-093 | Koalala, Phantom Terra Beast | OK | Màu đỏ/xanh lá |
| WXDi-P02-094 | Water Buffalo, Phantom Aquatic Beast | OK | Màu xanh dương/xanh lá |
| WXDi-P02-095 | Tree Froggy, Phantom Aquatic Beast | OK | Màu xanh dương/xanh lá |
| WXDi-P02-096 | Servant ♯ | OK | Guard, Multi Ener, Life Burst khớp |

### WXDi-P03 (96 lá) — hoàn tất

Đã đọc và đối chiếu đủ 96/96 lá với Card List và FAQ chính thức. Không có lỗi nội dung; 003 ghi chú FAQ chính thức bị lệch nội dung câu hỏi nhưng giữ nguyên văn bản gốc.

| Mã | Tên | Trạng thái | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P03-001 | SONG OF WIXOSS | OK | 3 FAQ khớp |
| WXDi-P03-002 | G - G - G | OK | FAQ khớp |
| WXDi-P03-003 | Apex Warriors | OK* | FAQ nguồn lặp câu hỏi sai, giữ nguyên văn |
| WXDi-P03-004 | LIFE LOOP RESPECTS | OK | 2 FAQ khớp |
| WXDi-P03-005 | RHAPSODY PARTY | OK | Exceed 4; 2 FAQ khớp |
| WXDi-P03-006 | Burning Curiosity | OK | FAQ khớp |
| WXDi-P03-007 | Rei, On the Wings of Truth | OK | — |
| WXDi-P03-008 | Rei, On the Wings of Azure Sky | OK | — |
| WXDi-P03-009 | Rei, On the Wings of Supremacy | OK | FAQ Team khớp |
| WXDi-P03-010 | Akino*Clap | OK | — |
| WXDi-P03-011 | Hirana*Kaboom | OK | FAQ khớp |
| WXDi-P03-012 | Hirana*Stamp | OK | 2 FAQ khớp |
| WXDi-P03-013 | Rei*Divine Majesty | OK | FAQ khớp |
| WXDi-P03-014 | VJ WOLF - 1st Verse | OK | — |
| WXDi-P03-015 | VJ WOLF - 2nd Verse | OK | — |
| WXDi-P03-016 | VJ WOLF - 3rd Verse | OK | FAQ khớp |
| WXDi-P03-017 | MC LION - BUILD UP | OK | FAQ khớp |
| WXDi-P03-018 | MC LION - DROP | OK | — |
| WXDi-P03-019 | DJ LOVIT - RE: EDIT | OK | FAQ khớp |
| WXDi-P03-020 | VJ WOLF - REVERB | OK | — |
| WXDi-P03-021 | Nova, Prelude | OK | — |
| WXDi-P03-022 | Nova, Fighting Spirit | OK | — |
| WXDi-P03-023 | Nova, Skyfeather | OK | FAQ khớp |
| WXDi-P03-024 | Nova =Outro= | OK | 4 FAQ khớp |
| WXDi-P03-025 | Tamago =Cymbal Roll= | OK | 2 FAQ khớp |
| WXDi-P03-026 | Tamago =Accents= | OK | — |
| WXDi-P03-027 | Bang =Solo= | OK | FAQ khớp |
| WXDi-P03-028 | Sanga, Vogue 1 | OK | — |
| WXDi-P03-029 | Sanga, Vogue 2 | OK | — |
| WXDi-P03-030 | Sanga, Vogue 3 | OK | FAQ khớp |
| WXDi-P03-031 | Madoka//Arrangement | OK | 2 FAQ khớp |
| WXDi-P03-032 | Sanga//Reboot | OK | — |
| WXDi-P03-033 | Muzica//Stomping | OK | — |
| WXDi-P03-034 | Muzica//Power Bomb | OK | 2 FAQ khớp |
| WXDi-P03-035 | Koumei, Blessed General Queen | OK | FAQ khớp |
| WXDi-P03-036 | P-Nlight, Code: Heart | OK | FAQ khớp |
| WXDi-P03-037 | Blue Whaleen, Aquatic Phantom Queen | OK | FAQ khớp |
| WXDi-P03-038 | Zeusias, Crimson Angel Queen | OK | 2 FAQ khớp |
| WXDi-P03-039 | Cocco Lupico, Phantom Beast Deity | OK | FAQ khớp |
| WXDi-P03-040 | Waffle Ice, Code: Order | OK | 2 FAQ khớp |
| WXDi-P03-041 | Firefly Squid, Aquatic Phantom Deity | OK | — |
| WXDi-P03-042 | Demeter, Jade Angel Queen | OK | 2 FAQ khớp |
| WXDi-P03-043 | Giroppon, Code: Labyrinth | OK | 3 FAQ khớp |
| WXDi-P03-044 | Saber Tiger, Phantom Beast Deity | OK | 2 FAQ khớp |
| WXDi-P03-045 | Ereshkigal, Doomed Evil Queen | OK | FAQ khớp |
| WXDi-P03-046 | Ac, Natural Element Queen | OK | 3 FAQ khớp |
| WXDi-P03-047 | Aglaea, Blessed Angel | OK | — |
| WXDi-P03-048 | Aquiel, Blessed Evil | OK | — |
| WXDi-P03-049 | Typo, Natural Planet | OK | FAQ khớp |
| WXDi-P03-050 | Ishikirimaru, High Armed | OK | — |
| WXDi-P03-051 | R-Mlight, Code: Art | OK | FAQ khớp |
| WXDi-P03-052 | Elena, Code: Anti | OK | — |
| WXDi-P03-053 | Himejijo, Code: Maze | OK | FAQ khớp |
| WXDi-P03-054 | Miracle Draw | OK | 2 FAQ khớp |
| WXDi-P03-055 | Bifrons, Crimson Evil | OK | FAQ khớp |
| WXDi-P03-056 | Rubellite, Natural Crystal | OK | 2 FAQ khớp |
| WXDi-P03-057 | Truck Mixer, Code: Ride | OK | — |
| WXDi-P03-058 | Iris, Crimson Angel | OK | — |
| WXDi-P03-059 | Globaeia, Natural Planet | OK | — |
| WXDi-P03-060 | Tengu Zaru, Phantom Terra Beast | OK | FAQ khớp |
| WXDi-P03-061 | B-Lanket, Code: Art | OK | — |
| WXDi-P03-062 | Mandrill, Phantom Terra Beast | OK | — |
| WXDi-P03-063 | Eternal Influence | OK | — |
| WXDi-P03-064 | Audomula, Azure Angel | OK | FAQ khớp |
| WXDi-P03-065 | Ronove, Azure Evil | OK | 2 FAQ khớp |
| WXDi-P03-066 | Hydras, Natural Planet | OK | — |
| WXDi-P03-067 | Apatite, Natural Crystal | OK | FAQ khớp |
| WXDi-P03-068 | Primora, Code: Maze | OK | — |
| WXDi-P03-069 | Tobijei, Phantom Aquatic Beast | OK | FAQ khớp |
| WXDi-P03-070 | Lu Xun, Azure General | OK | FAQ khớp |
| WXDi-P03-071 | Lapis Lazuli, Natural Crystal | OK | — |
| WXDi-P03-072 | THRILLING | OK | — |
| WXDi-P03-073 | Wutugu, Jade General | OK | FAQ khớp |
| WXDi-P03-074 | Marai, Jade Beauty | OK | 2 FAQ khớp |
| WXDi-P03-075 | Orangutan, Phantom Terra Beast | OK | — |
| WXDi-P03-076 | Churin, Natural Plant | OK | — |
| WXDi-P03-077 | Akufuku, Code: Maze | OK | — |
| WXDi-P03-078 | Octodon, Phantom Terra Beast | OK | 2 FAQ khớp |
| WXDi-P03-079 | Solenostomus, Phantom Aquatic Beast | OK | — |
| WXDi-P03-080 | Affection | OK | FAQ khớp |
| WXDi-P03-081 | Reticulum, Natural Planet | OK | FAQ khớp |
| WXDi-P03-082 | Pa, Natural Element | OK | — |
| WXDi-P03-083 | U-Selessbo, Code: Art | OK | FAQ khớp |
| WXDi-P03-084 | Sabnock, Doomed Angel | OK | — |
| WXDi-P03-085 | Luca, Doomed Evil | OK | — |
| WXDi-P03-086 | Tyrfing, High Armed | OK | — |
| WXDi-P03-087 | Izo, Doomed General | OK | FAQ khớp |
| WXDi-P03-088 | Telescopium, Natural Planet | OK | FAQ khớp |
| WXDi-P03-089 | Reticle Digger | OK | — |
| WXDi-P03-090 | Procyon A, Natural Planet | OK | — |
| WXDi-P03-091 | Sirius, Natural Planet | OK | — |
| WXDi-P03-092 | Triomphe, Code: Maze | OK | — |
| WXDi-P03-093 | Babel, Code: Maze | OK | — |
| WXDi-P03-094 | Green Gas Type: Eins | OK | — |
| WXDi-P03-095 | Cobra Type: Zwei | OK | — |
| WXDi-P03-096 | Servant ♯ | OK | — |

### WXDi-P04 (94 lá) — hoàn tất

Đã đọc và đối chiếu đủ 94/94 lá với Card List và FAQ chính thức. Không có lỗi nội dung; 089 thiếu ảnh C(P) trên CDN như đã ghi chú.

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P04-001 | White Heaven | OK | FAQ khớp |
| WXDi-P04-002 | World Reverse | OK | 2 FAQ khớp |
| WXDi-P04-003 | Summer Live Blues | OK | 2 FAQ khớp |
| WXDi-P04-004 | DEATH DECK | OK | 2 FAQ khớp |
| WXDi-P04-005 | Innocent Battle | OK | FAQ khớp |
| WXDi-P04-006 | DEVIL'S CARNIVAL | OK | FAQ khớp |
| WXDi-P04-007 | Akino, Bound for Tomorrow | OK | FAQ khớp |
| WXDi-P04-008 | MC LION - 3rd Verse - ALT | OK | 2 FAQ khớp |
| WXDi-P04-009 | Nonstop! Dr. Tamago | OK | FAQ khớp |
| WXDi-P04-010 | Madoka, Vogue 3 - EX | OK | FAQ khớp |
| WXDi-P04-011 | Deus One | OK | FAQ khớp |
| WXDi-P04-012 | Deus Two | OK | FAQ khớp |
| WXDi-P04-013 | Deus Three | OK | FAQ khớp |
| WXDi-P04-014 | Machina One | OK | FAQ khớp |
| WXDi-P04-015 | Machina Two | OK | FAQ khớp |
| WXDi-P04-016 | Machina Three | OK | 2 FAQ khớp |
| WXDi-P04-017 | Ex Gazer | OK | — |
| WXDi-P04-018 | Ex Echo | OK | FAQ khớp |
| WXDi-P04-019 | Ex Crossbeam | OK | — |
| WXDi-P04-020 | Ex Crossfire | OK | FAQ khớp |
| WXDi-P04-021 | Ex Stepout | OK | — |
| WXDi-P04-022 | Deus Recovery | OK | 3 FAQ khớp |
| WXDi-P04-023 | Deus Limited | OK | — |
| WXDi-P04-024 | Deus Digger | OK | 2 FAQ khớp |
| WXDi-P04-025 | Machina Seeds | OK | FAQ khớp |
| WXDi-P04-026 | Machina Repair | OK | FAQ khớp |
| WXDi-P04-027 | Machina Bind | OK | — |
| WXDi-P04-028 | At =Tre=, the Opened Door | OK | FAQ khớp |
| WXDi-P04-029 | Tawil =Hangout= | OK | — |
| WXDi-P04-030 | Umr =Outsider= | OK | — |
| WXDi-P04-031 | At =Eject= | OK | 2 FAQ khớp |
| WXDi-P04-032 | Exia, Blessed Angel Queen | OK | 2 FAQ khớp |
| WXDi-P04-033 | Douman, Blessed Evil Queen | OK | — |
| WXDi-P04-034 | Kintoki, Crimson General Queen | OK | FAQ khớp |
| WXDi-P04-035 | Alexandrite, Natural Pyroxene | OK | FAQ khớp |
| WXDi-P04-036 | Columbus, Azure General Queen | OK | FAQ khớp |
| WXDi-P04-037 | Orion, Natural Planet Queen | OK | 2 FAQ khớp |
| WXDi-P04-038 | Notre Dame, Code: Labyrinth | OK | 2 FAQ khớp |
| WXDi-P04-039 | Newton, Jade Wisdom Queen | OK | — |
| WXDi-P04-040 | Ibaraki - Douji, Jade Evil Queen | OK | FAQ khớp |
| WXDi-P04-041 | Muramasa, Full Armed | OK | 2 FAQ khớp |
| WXDi-P04-042 | Steampunk, Code: Ancients | OK | FAQ khớp |
| WXDi-P04-043 | Dragon Maid, Phantom Dragon Queen | OK | — |
| WXDi-P04-044 | Lepus, Natural Planet | OK | — |
| WXDi-P04-045 | R - Inglight, Code: Art | OK | FAQ khớp |
| WXDi-P04-046 | Lemon Tetra, Phantom Aquatic Beast | OK | — |
| WXDi-P04-047 | Isis, Blessed Angel | OK | FAQ khớp |
| WXDi-P04-048 | Wei Yan, Blessed General | OK | FAQ khớp |
| WXDi-P04-049 | Antnest, Code: Maze | OK | — |
| WXDi-P04-050 | Huang Zhong, Blessed General | OK | FAQ khớp |
| WXDi-P04-051 | Rhongomyniad, Full Armed | OK | — |
| WXDi-P04-052 | Rebirth Return | OK | FAQ khớp |
| WXDi-P04-053 | Gracia, Crimson General | OK | FAQ khớp |
| WXDi-P04-054 | Iwatooshi, Lightly Armed | OK | — |
| WXDi-P04-055 | Cuelebre, Phantom Dragon | OK | — |
| WXDi-P04-056 | Corgi, Phantom Terra Beast | OK | — |
| WXDi-P04-057 | Bedivere, Crimson General | OK | — |
| WXDi-P04-058 | Morax, Crimson Evil | OK | FAQ khớp |
| WXDi-P04-059 | Y - Akitoriki, Code: Art | OK | 2 FAQ khớp |
| WXDi-P04-060 | Bathin, Crimson Evil | OK | — |
| WXDi-P04-061 | Cancer, Natural Planet | OK | — |
| WXDi-P04-062 | Roaring Sunshine | OK | — |
| WXDi-P04-063 | Norma, Natural Planet | OK | FAQ khớp |
| WXDi-P04-064 | Ga, Natural Element | OK | — |
| WXDi-P04-065 | Plankton, Natural Bacteria | OK | 2 FAQ khớp |
| WXDi-P04-066 | Bruno, Azure General | OK | — |
| WXDi-P04-067 | Team Palette, Azure Beauty | OK | — |
| WXDi-P04-068 | Halphas, Azure Evil | OK | FAQ khớp |
| WXDi-P04-069 | Glasya, Azure Evil | OK | — |
| WXDi-P04-070 | EXCHANGE | OK | FAQ khớp |
| WXDi-P04-071 | Sátyros, Jade Angel | OK | 2 FAQ khớp |
| WXDi-P04-072 | Takaoni, First Play | OK | FAQ khớp |
| WXDi-P04-073 | Tasmanian, Phantom Terra Beast | OK | — |
| WXDi-P04-074 | Mulu, Jade General | OK | — |
| WXDi-P04-075 | Leraje, Jade Evil | OK | FAQ khớp |
| WXDi-P04-076 | Bullfrog, Phantom Aquatic Beast | OK | FAQ khớp |
| WXDi-P04-077 | Zeruel, Jade Angel | OK | FAQ khớp |
| WXDi-P04-078 | Caesar, Code: Eat | OK | — |
| WXDi-P04-079 | Unbreakable Javelin | OK | FAQ khớp |
| WXDi-P04-080 | Ipetam, Lightly Armed | OK | — |
| WXDi-P04-081 | Longhorn Beetle, Phantom Insect | OK | FAQ khớp |
| WXDi-P04-082 | Brutus, Doomed General | OK | — |
| WXDi-P04-083 | Fire Ant Type: Zwei | OK | FAQ khớp |
| WXDi-P04-084 | Dogu, Code: Anti | OK | FAQ khớp |
| WXDi-P04-085 | W - Inecellar, Code: Art | OK | FAQ khớp |
| WXDi-P04-086 | Black Pack | OK | — |
| WXDi-P04-087 | Zagan, Blessed Crimson Evil | OK | — |
| WXDi-P04-088 | Orias, Blessed Crimson Evil | OK | — |
| WXDi-P04-089 | Eckesachs, Lightly Armed | OK | Không có ảnh C(P) trên CDN |
| WXDi-P04-090 | Sansetsukon, High Armed | OK | — |
| WXDi-P04-091 | Raphae, Jade Doomed Angel | OK | — |
| WXDi-P04-092 | Aizen, Jade Doomed Angel | OK | — |
| WXDi-P04-093 | Servant ♯ | OK | — |
| WXDi-P04-094 | Rapid Accumulation | OK | — |

### WXDi-P05 (95 lá) — hoàn tất

Đã đọc và đối chiếu đủ 95/95 lá (gồm 094S và token TK01A) với Card List và FAQ chính thức. Không có lỗi nội dung; 011 có hai entry rarity PR và L,L(P) trong Card List, doc đã gộp đủ.

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P05-001 | RED ZONE | OK | 2 FAQ khớp |
| WXDi-P05-002 | DANCE IN THE LANCE | OK | FAQ khớp |
| WXDi-P05-003 | Machina Guardian Dragon | OK | FAQ khớp |
| WXDi-P05-004 | Paradise Universe | OK | FAQ khớp |
| WXDi-P05-005 | Don't STOP! | OK | — |
| WXDi-P05-006 | Eternal♡Immortal Kyurukyurun☆ | OK | 2 FAQ khớp |
| WXDi-P05-007 | Hirana, a Step Towards the Glimmer | OK | FAQ khớp |
| WXDi-P05-008 | VJ WOLF - 3rd Verse - ALT | OK | FAQ khớp |
| WXDi-P05-009 | Nova, Destiny Imperial | OK | 3 FAQ khớp |
| WXDi-P05-010 | Muzica, Vogue 3 - EX | OK | 3 FAQ khớp |
| WXDi-P05-011 | Mikomiko☆Zero | OK* | Card List có 2 entry (PR và L,L(P)); doc gộp đủ |
| WXDi-P05-012 | Mikomiko☆One | OK | — |
| WXDi-P05-013 | Mikomiko☆Two | OK | — |
| WXDi-P05-014 | Mikomiko☆Threee | OK | 3 FAQ khớp |
| WXDi-P05-015 | Tawil =Tre=, Heralding One | OK | FAQ khớp |
| WXDi-P05-016 | Umr =Tre=, Key to Uproar | OK | 3 FAQ khớp |
| WXDi-P05-017 | Ex Trap | OK | FAQ khớp |
| WXDi-P05-018 | Deus Thunder | OK | FAQ khớp |
| WXDi-P05-019 | Machina Nebula | OK | FAQ khớp |
| WXDi-P05-020 | Yukayuka☆Zero | OK | — |
| WXDi-P05-021 | Yukayuka☆Pon | OK | — |
| WXDi-P05-022 | Yukayuka☆Zubaan | OK | — |
| WXDi-P05-023 | Yukayuka☆BooBoo | OK | 2 FAQ khớp |
| WXDi-P05-024 | Yukayuka☆Zubaba | OK | FAQ khớp |
| WXDi-P05-025 | Yukayuka☆Piihyara | OK | — |
| WXDi-P05-026 | Mahomaho☆Zero | OK | — |
| WXDi-P05-027 | Mahomaho☆Jajaan | OK | — |
| WXDi-P05-028 | Mahomaho☆Zugagaan | OK | — |
| WXDi-P05-029 | Mahomaho☆Dogaan | OK | 2 FAQ khớp |
| WXDi-P05-030 | Mahomaho☆Zudodon | OK | FAQ khớp |
| WXDi-P05-031 | Mahomaho☆Been | OK | 3 FAQ khớp |
| WXDi-P05-032 | Gae Bolg, Full Armed | OK | FAQ khớp |
| WXDi-P05-033 | Tamamozen, Phantom Spirit Queen | OK | FAQ khớp |
| WXDi-P05-034 | Hyahha, Code: Accel | OK | FAQ khớp |
| WXDi-P05-035 | Draco, Natural Planet Queen | OK | 4 FAQ khớp |
| WXDi-P05-036 | Diabride, Natural Engagement Crystal | OK | 2 FAQ khớp |
| WXDi-P05-037 | Hameln, Master Trickster | OK | 2 FAQ khớp |
| WXDi-P05-038 | H2O, Natural Element Queen | OK | FAQ khớp |
| WXDi-P05-039 | Honeyto Ice, Code: Order | OK | FAQ khớp |
| WXDi-P05-040 | Gaia, Jade Angel Queen | OK | FAQ khớp |
| WXDi-P05-041 | Tiger, Roaring Cannon | OK | 3 FAQ khớp |
| WXDi-P05-042 | Eclipse, Natural Planet Queen | OK | 2 FAQ khớp |
| WXDi-P05-043 | M - Odem, Code: Heart | OK | 2 FAQ khớp |
| WXDi-P05-044 | Tokiyuki, Blessed General | OK | — |
| WXDi-P05-045 | Yaekori, Lightly Armed | OK | FAQ khớp |
| WXDi-P05-046 | S - Unbed, Code: Art | OK | 2 FAQ khớp |
| WXDi-P05-047 | Crius, Blessed Angel | OK | FAQ khớp |
| WXDi-P05-048 | Lynx, Natural Planet | OK | — |
| WXDi-P05-049 | Luvdabi, Code: Maze | OK | — |
| WXDi-P05-050 | Bigfoot, Code: Anti | OK | FAQ khớp |
| WXDi-P05-051 | Mathdrill, Blessed Wisdom | OK | — |
| WXDi-P05-052 | Get Bolg | OK | FAQ khớp |
| WXDi-P05-053 | Hemera, Crimson Angel | OK | — |
| WXDi-P05-054 | Heihachiro, Crimson General | OK | FAQ khớp |
| WXDi-P05-055 | Buffa, Phantom Beast | OK | — |
| WXDi-P05-056 | Nabeno - Tsuna, Crimson General | OK | — |
| WXDi-P05-057 | Decarabia, Crimson Evil | OK | — |
| WXDi-P05-058 | Jasper, Natural Crystal | OK | — |
| WXDi-P05-059 | R - Unning, Code: Art | OK | 2 FAQ khớp |
| WXDi-P05-060 | Apocalypse Drift | OK | 2 FAQ khớp |
| WXDi-P05-061 | Manomin, Azure Evil | OK | — |
| WXDi-P05-062 | Benitoite, Natural Crystal | OK | FAQ khớp |
| WXDi-P05-063 | CZ, Natural Element | OK | FAQ khớp |
| WXDi-P05-064 | Hauynite, Natural Crystal | OK | FAQ khớp |
| WXDi-P05-065 | Muscari, Natural Plant | OK | — |
| WXDi-P05-066 | Anahaze, Phantom Aquatic Beast | OK | FAQ khớp |
| WXDi-P05-067 | H2, Natural Element | OK | — |
| WXDi-P05-068 | HAMELN STEP | OK | FAQ khớp |
| WXDi-P05-069 | Little John, Jade General | OK | 2 FAQ khớp |
| WXDi-P05-070 | William Tell, Jade General | OK | — |
| WXDi-P05-071 | Tocho, Code: Maze | OK | FAQ khớp |
| WXDi-P05-072 | Orthrus, Jade Evil | OK | FAQ khớp |
| WXDi-P05-073 | Nettle Type: Zwei | OK | FAQ khớp |
| WXDi-P05-074 | Passionflower, Natural Plant | OK | — |
| WXDi-P05-075 | Polypterus, Water Phantom | OK | — |
| WXDi-P05-076 | Chameleon, Phantom Beast | OK | — |
| WXDi-P05-077 | Edenify | OK | FAQ khớp |
| WXDi-P05-078 | Walkure, Doomed Angel | OK | FAQ khớp |
| WXDi-P05-079 | Malphas, Doomed Evil | OK | 2 FAQ khớp |
| WXDi-P05-080 | Timer Bomb, Natural Erupting Planet | OK | FAQ khớp |
| WXDi-P05-081 | Caesar, Wicked General | OK | 3 FAQ khớp |
| WXDi-P05-082 | Typhon, Doomed Evil | OK | FAQ khớp |
| WXDi-P05-083 | Buckler, High Armed | OK | — |
| WXDi-P05-084 | BP, Natural Element | OK | — |
| WXDi-P05-085 | Tartarus, Doomed Angel | OK | FAQ khớp |
| WXDi-P05-086 | Moon Bites | OK | FAQ khớp |
| WXDi-P05-087 | Mastema, Blessed Doomed Angel | OK | — |
| WXDi-P05-088 | Uriel, Blessed Doomed Angel | OK | — |
| WXDi-P05-089 | Yorishige, Blessed Azure General | OK | — |
| WXDi-P05-090 | Touta, Blessed Azure General | OK | — |
| WXDi-P05-091 | Se, Natural Element | OK | — |
| WXDi-P05-092 | I, Natural Element | OK | — |
| WXDi-P05-093 | Servant ♯ | OK | — |
| WXDi-P05-094S | Hirana, a Step Towards the Top | OK | Bản SCR, không có 094 thường |
| WXDi-P05-TK01A | 【Hastalyk】 | OK | Token, khớp nguồn |

### WXDi-P06 (96 lá) — hoàn tất

Đã đọc và đối chiếu đủ 96/96 lá (001–092 và 1st01–1st04) với Card List và FAQ chính thức. Sửa 1 lỗi màu do khoảng trắng toàn giác (004) và 13 lỗi tách dòng artist trong ghi chú minh họa (031, 037, 038, 040, 042, 044, 045, 057, 061, 062, 066, 075, 084); 079 giữ nguyên artist dính liền đúng như nguồn.

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P06-001 | Entwined Supremacy | OK | 2 FAQ khớp |
| WXDi-P06-002 | Peeping Future | OK | 2 FAQ khớp |
| WXDi-P06-003 | Miasma Labyrinth | OK | 3 FAQ khớp |
| WXDi-P06-004 | Innocent One - Piece | FIX | Màu "Trắng / 　" -> "Trắng" (do khoảng trắng toàn giác trong nguồn) |
| WXDi-P06-005 | Green Bigs | OK | — |
| WXDi-P06-006 | Garden of Singularity | OK | — |
| WXDi-P06-007 | Rei, On the Wings of Radiance | OK | 3 FAQ khớp |
| WXDi-P06-008 | DJ LOVIT - 3rd Verse - ALT | OK | — |
| WXDi-P06-009 | Bang, Making a Miracle | OK* | 2 FAQ khớp; nguồn có khoảng trắng cuối, đã trim |
| WXDi-P06-010 | Sanga, Vogue 3 - EX | OK | 2 FAQ khớp |
| WXDi-P06-011 | Yuzuki Three, Blazing Fire Chant | OK | 2 FAQ khớp |
| WXDi-P06-012 | Code Piruluk xi | OK | FAQ khớp |
| WXDi-P06-013 | Urith, Maniacal Enma | OK | FAQ khớp |
| WXDi-P06-014 | Yuzuki Zero | OK | — |
| WXDi-P06-015 | Yuzuki One, Blazing Chant | OK | — |
| WXDi-P06-016 | Yuzuki Two, Blazing Chant | OK | — |
| WXDi-P06-017 | Code Piruluk | OK | — |
| WXDi-P06-018 | Code Piruluk K | OK | — |
| WXDi-P06-019 | Code Piruluk M | OK | — |
| WXDi-P06-020 | Urith, Enma | OK | — |
| WXDi-P06-021 | Urith, Burning Enma | OK | — |
| WXDi-P06-022 | Urith, Fatal Enma | OK | — |
| WXDi-P06-023 | Yukayuka☆Dojaan | OK | 3 FAQ khớp |
| WXDi-P06-024 | Mahomaho☆Zuun | OK | FAQ khớp |
| WXDi-P06-025 | Hanayo, Sakura | OK | — |
| WXDi-P06-026 | Hanayo, Pomegranate | OK | — |
| WXDi-P06-027 | Hanayo, Gentian | OK | — |
| WXDi-P06-028 | Midoriko, Rainspear | OK | — |
| WXDi-P06-029 | Midoriko, Half - Moon | OK | FAQ khớp |
| WXDi-P06-030 | Midoriko, Repair | OK | — |
| WXDi-P06-031 | Remember//Memoria, Code: Heart | FIX | 5 FAQ khớp; ghi chú minh họa tách dòng sai, đã gộp `れん / はしもとなおや` |
| WXDi-P06-032 | Osiris, Code: Ancients | OK | 3 FAQ khớp |
| WXDi-P06-033 | Coela, Aquatic Phantom Queen | OK | 2 FAQ khớp |
| WXDi-P06-034 | Cu Chulainn, Crimson General Queen | OK | 4 FAQ khớp |
| WXDi-P06-035 | Shiva, Crimson Evil Queen | OK | 2 FAQ khớp |
| WXDi-P06-036 | Blue Adamas, Natural Pyroxene | OK | 2 FAQ khớp |
| WXDi-P06-037 | Eldora//Memoria, Aquatic Phantom Queen | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `れん / イチゼン` |
| WXDi-P06-038 | Ann//Memoria, Jade Beauty Queen | FIX | 3 FAQ khớp; ghi chú minh họa tách dòng, đã gộp `ハタパグ / 北熊` |
| WXDi-P06-039 | Lavender, Natural Plant Queen | OK | FAQ khớp |
| WXDi-P06-040 | Tama//Memoria, Doomed Angel Queen | FIX | 2 FAQ khớp; ghi chú minh họa tách dòng, đã gộp `夜ノみつき / アカバネ` |
| WXDi-P06-041 | Lucifer, Doomed Evil Queen | OK | 2 FAQ khớp |
| WXDi-P06-042 | Iona//Memoria, Code: Ancients | FIX | 3 FAQ khớp; ghi chú minh họa tách dòng, đã gộp `神澤葉 / はしもとなおや` |
| WXDi-P06-043 | Martiel, Blessed Angel | OK | FAQ khớp |
| WXDi-P06-044 | Sashe//Memoria, Natural Planet | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `志月 / BUZZ` |
| WXDi-P06-045 | Yuki//Memoria, Code: Maze | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `神澤葉 / はしもとなおや` |
| WXDi-P06-046 | Round, Blessed General | OK | FAQ khớp |
| WXDi-P06-047 | Succu, Blessed Evil | OK | — |
| WXDi-P06-048 | Ose, Blessed Evil | OK | FAQ khớp |
| WXDi-P06-049 | Mikagami, High Armed | OK | FAQ khớp |
| WXDi-P06-050 | Get Remember | OK | FAQ khớp |
| WXDi-P06-051 | Imoko, Crimson General | OK | FAQ khớp |
| WXDi-P06-052 | Ariton, Crimson Evil | OK | FAQ khớp |
| WXDi-P06-053 | Bonya, Lightly Armed | OK | FAQ khớp |
| WXDi-P06-054 | E - Lectro Bike, Code: Art | OK | — |
| WXDi-P06-055 | Aphrodite, Crimson Angel | OK | — |
| WXDi-P06-056 | Tristan, Crimson General | OK | FAQ khớp |
| WXDi-P06-057 | Lalaru//Memoria, Code: Art | FIX | 2 FAQ khớp; ghi chú minh họa tách dòng, đã gộp `コウサク / ぶんたん` |
| WXDi-P06-058 | Beiar, Phantom Burning Beast | OK | FAQ khớp |
| WXDi-P06-059 | E - Lectrobike Revealed | OK | — |
| WXDi-P06-060 | Saniel, Azure Angel | OK | 2 FAQ khớp |
| WXDi-P06-061 | Soui//Memoria, Azure General | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `狐ノ沢 / エイチ` |
| WXDi-P06-062 | Futase//Memoria, Azure Beauty | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `志月 / pepo` |
| WXDi-P06-063 | Jack Frost, Azure Evil | OK | — |
| WXDi-P06-064 | Delphinus, Natural Planet | OK | — |
| WXDi-P06-065 | Iolite, Natural Crystal | OK | FAQ khớp |
| WXDi-P06-066 | Milulun//Memoria, Natural Element | FIX | 3 FAQ khớp; ghi chú minh họa tách dòng, đã gộp `松本エイト / かにゃぴぃ` |
| WXDi-P06-067 | Okatotoki, Natural Plant | OK | FAQ khớp |
| WXDi-P06-068 | DISCOVERY | OK | 2 FAQ khớp |
| WXDi-P06-069 | Orobas, Jade Evil | OK | FAQ khớp |
| WXDi-P06-070 | Monkey Bars, First Playground | OK | — |
| WXDi-P06-071 | Capricorn, Natural Planet | OK | 2 FAQ khớp |
| WXDi-P06-072 | Pony, Phantom Terra Beast | OK | FAQ khớp |
| WXDi-P06-073 | Sukunabikona, Jade Angel | OK | FAQ khớp |
| WXDi-P06-074 | Hanuman, Jade Angel | OK | FAQ khớp |
| WXDi-P06-075 | Aiyai//Memoria, Second Play | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `狐ノ沢 / かにゃぴぃ` |
| WXDi-P06-076 | Chelydridae, Phantom Aquatic Beast | OK | — |
| WXDi-P06-077 | Encounter | OK | — |
| WXDi-P06-078 | Karasawa, Doomed General | OK | FAQ khớp |
| WXDi-P06-079 | Hanare//Memoria, Type: Eins | OK* | — ; nguồn ghi hai artist dính liền `はしもとなおや松本エイト`, giữ nguyên |
| WXDi-P06-080 | D - Humidifier, Code: Art | OK | — |
| WXDi-P06-081 | Vial, Type: Zwei | OK | FAQ khớp |
| WXDi-P06-082 | Microscopium, Natural Planet | OK | — |
| WXDi-P06-083 | Tyranno, Phantom Black Dragon | OK | FAQ khớp |
| WXDi-P06-084 | Myu//Memoria, Phantom Insect | FIX | FAQ khớp; ghi chú minh họa tách dòng, đã gộp `Tota / 匡吉` |
| WXDi-P06-085 | Once Salvage | OK | FAQ khớp |
| WXDi-P06-086 | Sea Star, Phantom Aquatic Beast | OK | — |
| WXDi-P06-087 | Bargibanti, Phantom Aquatic Beast | OK | — |
| WXDi-P06-088 | Canes Vena, Natural Planet | OK | — |
| WXDi-P06-089 | Serpens, Natural Planet | OK | — |
| WXDi-P06-090 | Tc, Natural Element | OK | — |
| WXDi-P06-091 | Te, Natural Element | OK | — |
| WXDi-P06-092 | Servant ♯ | OK | — |
| WXDi-P06-1st01 | Hirana | OK | — |
| WXDi-P06-1st02 | LION | OK | — |
| WXDi-P06-1st03 | Tamago | OK | — |
| WXDi-P06-1st04 | Muzica | OK | — |

### WXDi-P07 (109 lá) — hoàn tất

Đã đọc và đối chiếu đủ 109/109 lá (001–102, 1st01–1st04, CO-01, TK01-A, TK01-B) với Card List và FAQ chính thức. Sửa 8 lỗi `Use timing` chứa số coin của LRIG (008, 009, 010, 013, 016, 019, 027, 033) và 3 lỗi tách dòng artist (008, 009, 010); 050 giữ `power` 0 theo nguồn dù FAQ nói ∞.

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P07-001 | Sparkling☆Memories | OK | 5 FAQ khớp |
| WXDi-P07-002 | ENERGY DOOR | OK | 5 FAQ khớp |
| WXDi-P07-003 | True Honesty | OK | — |
| WXDi-P07-004 | Can't Stop Pretty! | OK | — |
| WXDi-P07-005 | Instantaneous Explosion | OK | 2 FAQ khớp |
| WXDi-P07-006 | Take Off! WIXOSS Robo! | OK | — |
| WXDi-P07-007 | Mahomaho☆Threee | OK | 3 FAQ khớp |
| WXDi-P07-008 | Ril, Memory of Martial Dancing | FIX | FAQ khớp; gộp artist `霜月友 / Hitoto*`; `Use timing` 4 -> — (trường gốc là Coin của LRIG) |
| WXDi-P07-009 | Dona SUN | FIX | gộp artist `霜月友 / mado*pen`; `Use timing` 2 -> — |
| WXDi-P07-010 | Digital Aya! III | FIX | 2 FAQ khớp; gộp artist `アリオ / アカバネ`; `Use timing` 1 -> — |
| WXDi-P07-011 | Mahomaho☆One | OK | — |
| WXDi-P07-012 | Mahomaho☆Two | OK | — |
| WXDi-P07-013 | Ril, Memory of Innocence | FIX | `Use timing` 1 -> — |
| WXDi-P07-014 | Ril, Memory of Seeking Change | OK | — |
| WXDi-P07-015 | Ril, Memory of Flickering | OK* | nguồn có khoảng trắng cuối trong tên, đã trim |
| WXDi-P07-016 | Dona START | FIX | `Use timing` 3 -> — |
| WXDi-P07-017 | Dona FIRST++ | OK | — |
| WXDi-P07-018 | Dona SECOND | OK | — |
| WXDi-P07-019 | Aya! 0 | FIX | `Use timing` 4 -> — |
| WXDi-P07-020 | Beep Boop Aya! I | OK | — |
| WXDi-P07-021 | Great Aya! II | OK | — |
| WXDi-P07-022 | Mikomiko☆Gacchan | OK | — |
| WXDi-P07-023 | Mikomiko☆Kirakkira | OK | FAQ khớp |
| WXDi-P07-024 | Mikomiko☆Bashiin | OK | — |
| WXDi-P07-025 | Mikomiko☆Zubashaan | OK | — |
| WXDi-P07-026 | Mikomiko☆Bye - Bye | OK | — |
| WXDi-P07-027 | Mel - Ready | FIX | `Use timing` 3 -> — |
| WXDi-P07-028 | Mel Burst | OK | — |
| WXDi-P07-029 | Mel Revise | OK | — |
| WXDi-P07-030 | Mel Invisible | OK | 3 FAQ khớp |
| WXDi-P07-031 | Mel Overrun | OK | FAQ khớp |
| WXDi-P07-032 | Mel Present | OK | FAQ khớp |
| WXDi-P07-033 | Nanashi, Part Zero | FIX | `Use timing` 2 -> — |
| WXDi-P07-034 | Nanashi Scattering | OK | FAQ khớp |
| WXDi-P07-035 | Nanashi Search | OK | FAQ khớp |
| WXDi-P07-036 | Nanashi Purification | OK | 2 FAQ khớp |
| WXDi-P07-037 | Nanashi Locking | OK | 2 FAQ khớp |
| WXDi-P07-038 | Nanashi Selection | OK | FAQ khớp |
| WXDi-P07-039 | Yukime//Memoria, Blessed Warlord | OK | 2 FAQ khớp |
| WXDi-P07-040 | Pegasus, Natural Planet Queen | OK | — |
| WXDi-P07-041 | Carnival//Memoria, Galactic Queen | OK | 3 FAQ khớp |
| WXDi-P07-042 | Thoroughbred, Phantom Beast Deity | OK | 2 FAQ khớp |
| WXDi-P07-043 | Brynhildr, Azure Angel Queen | OK | FAQ khớp |
| WXDi-P07-044 | Allos Piruluk//Memoria, Great Insect | OK | FAQ khớp |
| WXDi-P07-045 | Mama//Memoria, Jade Wisdom Queen | OK | 4 FAQ khớp |
| WXDi-P07-046 | Patra Type: Drei | OK | FAQ khớp |
| WXDi-P07-047 | Guzuko//Memoria, Tragic Party Queen | OK | 2 FAQ khớp |
| WXDi-P07-048 | A - To Massager, Code: Heart | OK | 2 FAQ khớp |
| WXDi-P07-049 | Liwat//Memoria, Lucent Angel Queen | OK | FAQ khớp |
| WXDi-P07-050 | Mugen//Memoria | OK* | 4 FAQ khớp; nguồn ghi `power` = 0 trong khi FAQ mô tả power ∞, giữ nguyên theo Card List |
| WXDi-P07-051 | Yagyu, Blessed General | OK | FAQ khớp |
| WXDi-P07-052 | Haity//Memoria, Blessed Evil | OK | FAQ khớp |
| WXDi-P07-053 | D - Spenser, Code: Art | OK | — |
| WXDi-P07-054 | Tawil//Memoria, Blessed Angel | OK | 2 FAQ khớp |
| WXDi-P07-055 | Mohayha, Blessed General | OK | — |
| WXDi-P07-056 | Picture Frame, Blessed Beauty | OK | — |
| WXDi-P07-057 | Eel, Phantom Aquatic White Beast | OK | FAQ khớp |
| WXDi-P07-058 | Karaten, Phantom Spirit | OK | 2 FAQ khớp |
| WXDi-P07-059 | Serve Color | OK | — |
| WXDi-P07-060 | Hyperion, Crimson Angel | OK | — |
| WXDi-P07-061 | Fornax, Natural Planet | OK | FAQ khớp |
| WXDi-P07-062 | Ruriru, Lonely Natural Crystal | OK | FAQ khớp |
| WXDi-P07-063 | Bardiche, High Armed | OK | 2 FAQ khớp |
| WXDi-P07-064 | Altar, Natural Planet | OK | 2 FAQ khớp |
| WXDi-P07-065 | Layla//Memoria, Code: Ride | OK | 2 FAQ khớp |
| WXDi-P07-066 | Buggy Car, Code: Ride | OK | — |
| WXDi-P07-067 | Gilgamej, Crimson General | OK | — |
| WXDi-P07-068 | Masked Legend | OK | — |
| WXDi-P07-069 | Scylla, Azure Evil | OK | FAQ khớp |
| WXDi-P07-070 | Kyanite, Natural Crystal | OK | FAQ khớp |
| WXDi-P07-071 | Hyacinth, Natural Plant | OK | FAQ khớp |
| WXDi-P07-072 | Caeneus, Azure Angel | OK | — |
| WXDi-P07-073 | In, Natural Element | OK | FAQ khớp |
| WXDi-P07-074 | Wisteria, Natural Plant | OK | — |
| WXDi-P07-075 | Ryuujou, Code: Palace | OK | — |
| WXDi-P07-076 | Honeytra, Master Trickster | OK | FAQ khớp |
| WXDi-P07-077 | RECOVERY | OK | FAQ khớp |
| WXDi-P07-078 | Geronimo, Jade General | OK | — |
| WXDi-P07-079 | Green Lucbor Type: Ein | OK | — |
| WXDi-P07-080 | Tuna Mayo, Code: Eat | OK | FAQ khớp |
| WXDi-P07-081 | Centurion, Explosive Gun | OK | — |
| WXDi-P07-082 | Colt, Natural Planet | OK | FAQ khớp |
| WXDi-P07-083 | Lacerta, Natural Planet | OK | — |
| WXDi-P07-084 | Race Course, Code: Maze | OK | FAQ khớp |
| WXDi-P07-085 | Nightile, Jade Wisdom | OK | FAQ khớp |
| WXDi-P07-086 | Calculation | OK | — |
| WXDi-P07-087 | Berenices, Natural Planet | OK | — |
| WXDi-P07-088 | Shoukokabi, Natural Oil Bacteria | OK | — |
| WXDi-P07-089 | Umr//Memoria, Code: Anti | OK | FAQ khớp |
| WXDi-P07-090 | Thanatos, Doomed Angel | OK | FAQ khớp |
| WXDi-P07-091 | Agravain, Doomed General | OK | FAQ khớp |
| WXDi-P07-092 | Alfou//Memoria, Doomed Evil | OK | 2 FAQ khớp |
| WXDi-P07-093 | Sayuragi, Doomed Evil | OK | FAQ khớp |
| WXDi-P07-094 | Lilith, Doomed Evil | OK | — |
| WXDi-P07-095 | Black Memory | OK | — |
| WXDi-P07-096 | Origami, Blessed Jade Beauty | OK | — |
| WXDi-P07-097 | Surrelis, Blessed Jade Beauty | OK | — |
| WXDi-P07-098 | C - Repuyaki, Code: Art | OK | — |
| WXDi-P07-099 | T - Koyakiki, Code: Art | OK | — |
| WXDi-P07-100 | Servant ♯ | OK | — |
| WXDi-P07-101 | Mikomiko☆Zero | OK | rarity Re, khớp nguồn |
| WXDi-P07-102 | Mahomaho☆Zero | OK | rarity Re, khớp nguồn |
| WXDi-P07-1st01 | Akino | OK | — |
| WXDi-P07-1st02 | LOVIT | OK | — |
| WXDi-P07-1st03 | Bang | OK | — |
| WXDi-P07-1st04 | Madoka | OK | — |
| WXDi-P07-CO-01 | COIN | OK | Token, khớp nguồn |
| WXDi-P07-TK01-A | Servant ZERO | OK | Token SIGNI, khớp nguồn |
| WXDi-P07-TK01-B | 【Virus】 | OK | Token, khớp nguồn |

### WXDi-P08 (90 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P08-001 | Aggressive Night | OK | 3 FAQ khớp |
| WXDi-P08-002 | Colorful Wish | OK | 3 FAQ khớp |
| WXDi-P08-003 | Ultra Super Heroes | OK | 5 FAQ khớp |
| WXDi-P08-004 | Colorful Ensemble | OK | 2 FAQ khớp |
| WXDi-P08-005 | Death Beam Diva | OK | 3 FAQ khớp |
| WXDi-P08-006 | Reset Memoria | OK | FAQ khớp |
| WXDi-P08-007 | Yukayuka☆Threee | OK | 2 FAQ khớp |
| WXDi-P08-008 | Eldora × Mark ν | FIX | 3 FAQ khớp; gộp artist `繭咲悠 / イチゼン` |
| WXDi-P08-009 | Ann III, Maiden of Mettle | FIX | FAQ khớp; gộp artist `単ル / かわすみ` |
| WXDi-P08-010 | Iona, Triangle/Maiden | OK | 4 FAQ khớp |
| WXDi-P08-011 | Yukayuka☆One | OK | — |
| WXDi-P08-012 | Yukayuka☆Two | OK | — |
| WXDi-P08-013 | Eldora × Mark ０ | OK | — |
| WXDi-P08-014 | Eldora × Mark Ⅰ | OK | — |
| WXDi-P08-015 | Eldora × Mark Ⅱ | OK | — |
| WXDi-P08-016 | Ann, Marvel of Miracles | OK | — |
| WXDi-P08-017 | Ann I, Icon of Innovation | OK | — |
| WXDi-P08-018 | Ann II, Boon of Brilliance | OK | — |
| WXDi-P08-019 | Iona, Zero/Maiden | OK | — |
| WXDi-P08-020 | Iona, Nepto/Maiden | OK | — |
| WXDi-P08-021 | Iona, Uranus/Maiden | OK | — |
| WXDi-P08-022 | Tama Loud Voice | OK | FAQ khớp |
| WXDi-P08-023 | Tama Bible | OK | FAQ khớp |
| WXDi-P08-024 | Tama Shield | OK | FAQ khớp |
| WXDi-P08-025 | Tama Boundary | OK | 2 FAQ khớp |
| WXDi-P08-026 | Tama Aura | OK | — |
| WXDi-P08-027 | Ril, Flash | OK | FAQ khớp |
| WXDi-P08-028 | Ril, Flame Dance | OK | 2 FAQ khớp |
| WXDi-P08-029 | Ril, Drawn Sword | OK | FAQ khớp |
| WXDi-P08-030 | Ril, in Prayer | OK | 4 FAQ khớp |
| WXDi-P08-031 | Ril, Inspiration | OK | 2 FAQ khớp |
| WXDi-P08-032 | Piruluk / Draw | OK | — |
| WXDi-P08-033 | Piruluk / Snipe | OK* | nguồn có khoảng trắng cuối, đã trim |
| WXDi-P08-034 | Piruluk / Don't Escape | OK | FAQ khớp |
| WXDi-P08-035 | Piruluk / Don't Move | OK | — |
| WXDi-P08-036 | Piruluk / Peeping Analyze | OK | — |
| WXDi-P08-037 | Tama//Memoria, Full Armed | OK | 2 FAQ khớp |
| WXDi-P08-038 | Lupanne, Thieving Master Trickster | OK | — |
| WXDi-P08-039 | Hanayo//Memoria, Natural Pyroxene | OK | FAQ khớp |
| WXDi-P08-040 | Hirana//Memoria, Crimson Angel Queen | OK | 2 FAQ khớp |
| WXDi-P08-041 | Halberd, Full Armed | OK | 2 FAQ khớp |
| WXDi-P08-042 | Tamago//Memoria, Galactic Queen | OK | — |
| WXDi-P08-043 | Daihouika, Aquatic Phantom Diva | OK | FAQ khớp |
| WXDi-P08-044 | Hideyoshi, Jade General Queen | OK | 5 FAQ khớp |
| WXDi-P08-045 | Einstein, Jade Wisdom Queen | OK | — |
| WXDi-P08-046 | At//Memoria, Code: Labyrinth | OK | 2 FAQ khớp |
| WXDi-P08-047 | Urith//Memoria, Doomed Evil Queen | OK | — |
| WXDi-P08-048 | Dark Quetzal, Phantom Dragon Queen | OK | 3 FAQ khớp |
| WXDi-P08-049 | Chisel, Blessed Beauty | OK | FAQ khớp |
| WXDi-P08-050 | Proto Energe, Lightly Armed | OK | — |
| WXDi-P08-051 | Akino//Memoria, Water Phantom | OK | FAQ khớp |
| WXDi-P08-052 | Flash Cards, Blessed Mind | OK | — |
| WXDi-P08-053 | Nova//Memoria, Natural Planet | OK | — |
| WXDi-P08-054 | Hestia, Blessed Angel | OK | FAQ khớp |
| WXDi-P08-055 | Over Pursuit | OK | FAQ khớp |
| WXDi-P08-056 | P-tato Fryer, Code: Art | OK | — |
| WXDi-P08-057 | Yuzuki//Memoria, Phantom Dragon | OK | — |
| WXDi-P08-058 | Tawil//Memoria, Crimson Evil | OK | FAQ khớp |
| WXDi-P08-059 | Garnet, Natural Dancing Stone | OK | FAQ khớp |
| WXDi-P08-060 | Launchan, Roaring Gun | OK | FAQ khớp |
| WXDi-P08-061 | Arcadian Resonance | OK | — |
| WXDi-P08-062 | Umr//Memoria, Code: Maze | OK | FAQ khớp |
| WXDi-P08-063 | Piruluk//Memoria, Code: Art | OK | — |
| WXDi-P08-064 | Kanaloa, Azure Angel | OK | — |
| WXDi-P08-065 | Rei//Memoria, Natural Crystal | OK | 2 FAQ khớp |
| WXDi-P08-066 | VO, Natural Element | OK | FAQ khớp |
| WXDi-P08-067 | Saprolegnia, Natural Pale Bacteria | OK | — |
| WXDi-P08-068 | FAILURE | OK | — |
| WXDi-P08-069 | Bang//Memoria, Jade Evil | OK | — |
| WXDi-P08-070 | Kebab, Code Eat | OK | — |
| WXDi-P08-071 | Hibiscus, Natural Dancing Plant | OK | 2 FAQ khớp |
| WXDi-P08-072 | Midoriko//Memoria, Phantom Beast | OK | — |
| WXDi-P08-073 | Mammo, Phantom Terra Beast | OK | FAQ khớp |
| WXDi-P08-074 | Fabricate | OK | — |
| WXDi-P08-075 | Wight, Doomed Evil | OK | FAQ khớp |
| WXDi-P08-076 | Dumbbell, Lightly Armed | OK | — |
| WXDi-P08-077 | S-Kycat, Code: Art | OK | — |
| WXDi-P08-078 | Senbero, Doomed Evil | OK | FAQ khớp |
| WXDi-P08-079 | Mamushi Type: Zwei | OK | — |
| WXDi-P08-080 | Habble, Natural Planet | OK | 2 FAQ khớp |
| WXDi-P08-081 | Inside Devils | OK | không có FAQ |
| WXDi-P08-082 | Servant ♯ | OK | không có FAQ |
| WXDi-P08-083 | Yukayuka☆Zero | OK | — |
| WXDi-P08-084 | Code Piruluk | OK | — |
| WXDi-P08-085 | Tamayorihime, New Moon Miko | OK | — |
| WXDi-P08-086 | Ril, Memory of Innocence | FIX | Use timing 1 -> — (coin của LRIG) |
| WXDi-P08-1st01 | Rei | OK | Team/Master `No Limit` |
| WXDi-P08-1st02 | WOLF | OK | Team/Master `Card Jockey` |
| WXDi-P08-1st03 | Nova | OK | Team/Master `UCHU NO HAJIMARI` |
| WXDi-P08-1st04 | Sanga | OK | Team/Master `DIAGRAM` |

Đã đọc và đối chiếu đủ 90/90 lá (001–086, 1st01–1st04) với Card List và FAQ tiếng Anh. Sửa 2 lỗi tách dòng artist (008, 009) và 1 lỗi `Use timing` chứa số coin của LRIG (086). Toàn bộ card text, Power text/Life Burst, rarity nhiều bản (R(P), C(P)), FAQ và Team/Master của 1st01–1st04 khớp nguồn.

### WXDi-P09 (103 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P09-001 | Bravery Heroines | OK | 2 FAQ khớp; cost 《C》×０ |
| WXDi-P09-002 | Space Mother | OK | không có FAQ |
| WXDi-P09-003 | Twinkling Eyes of Doom | OK | 5 FAQ khớp |
| WXDi-P09-004 | Countdown Heels | OK | không có FAQ |
| WXDi-P09-005 | Carnival -TI- | FIX | 2 FAQ khớp; gộp artist `村上ゆいち / Hitoto*`; Use timing 2 -> — (coin LRIG) |
| WXDi-P09-006 | Layla =Overtake= | FIX | 2 FAQ khớp; Use timing 2 -> — (coin LRIG) |
| WXDi-P09-007 | Mel - Cheers | FIX | 3 FAQ khớp; gộp artist `霜月友 / Hitoto*`; Use timing 2 -> — (coin LRIG) |
| WXDi-P09-008 | Mama ♥ 3 MODE Love | FIX | 2 FAQ khớp; gộp artist `bomi / よん`; Use timing 1 -> — (coin LRIG) |
| WXDi-P09-009 | Nanashi, Part Three Dance | FIX | 5 FAQ khớp; Use timing 3 -> — (coin LRIG) |
| WXDi-P09-010 | Guzuko, Worthless Queen of Triumph | FIX | 2 FAQ khớp; gộp artist `九十きゅうり / 村上ゆいち`; Use timing 2 -> — (coin LRIG) |
| WXDi-P09-011 | Carnival -0- | FIX | không có FAQ; Use timing 3 -> — (coin LRIG) |
| WXDi-P09-012 | Carnival -PN- | OK | — |
| WXDi-P09-013 | Carnival -S- | OK | — |
| WXDi-P09-014 | Layla =Neutral= | FIX | không có FAQ; Use timing 3 -> — (coin LRIG) |
| WXDi-P09-015 | Layla =Turbo= | OK | — |
| WXDi-P09-016 | Layla =Drag= | OK | — |
| WXDi-P09-017 | Mel - Balalaika | OK | — |
| WXDi-P09-018 | Mel - Campari | OK | — |
| WXDi-P09-019 | Mama ♥ 0 | FIX | Use timing 4 -> — (coin LRIG) |
| WXDi-P09-019-M01 | ARuFa's Mama | FIX | Use timing 4 -> — (coin LRIG) |
| WXDi-P09-019-M02 | Galaxy's Mama | FIX | Use timing 4 -> — (coin LRIG) |
| WXDi-P09-019-M03 | Mikunoshin's Mama | FIX | Use timing 4 -> — (coin LRIG) |
| WXDi-P09-020 | Mama ♥ 1 MODE3 | OK | — |
| WXDi-P09-021 | Mama ♥ 2 | OK | — |
| WXDi-P09-022 | Nanashi, Part One Another | OK | — |
| WXDi-P09-023 | Nanashi, Part Two | OK | — |
| WXDi-P09-024 | Guzuko, Worthless Queen | FIX | Use timing 3 -> — (coin LRIG) |
| WXDi-P09-025 | Guzuko, Worthless Queen of Dawn | OK | — |
| WXDi-P09-026 | Guzuko, Worthless Queen of Twilight | OK* | nguồn có khoảng trắng toàn giác cuối tên, đã trim |
| WXDi-P09-027 | Dona "Go For It!" | OK | FAQ khớp; ASSIST LRIG, Use timing Main Phase |
| WXDi-P09-028 | Dona "Cheer Me On!" | OK | FAQ khớp |
| WXDi-P09-029 | Dona "Go, Go!" | OK | FAQ khớp; Limit ＋１ |
| WXDi-P09-030 | Dona "Glittering!" | OK | 2 FAQ khớp; Use timing Main Phase / Attack Phase |
| WXDi-P09-031 | Dona "Escape!" | OK | không có FAQ; Grow cost 《C》×５ |
| WXDi-P09-032 | Aya's Turn! | OK | không có FAQ |
| WXDi-P09-033 | Aya's Dancing with the Stars! | OK | FAQ khớp |
| WXDi-P09-034 | Aya's Tatami Flip! | OK | 2 FAQ khớp |
| WXDi-P09-035 | Aya's Enchantment! | OK | FAQ khớp; Grow cost 《C》×３ |
| WXDi-P09-036 | Aya's Holograph! | OK | 2 FAQ khớp; Grow cost 《C》×２ |
| WXDi-P09-037 | Orochimaru, Blessed Evil Queen | OK | không có FAQ |
| WXDi-P09-038 | LION//Memoria, Code: Heart | OK | 2 FAQ khớp |
| WXDi-P09-039 | Ril//Memoria, Crimson Warlord | OK | 3 FAQ khớp |
| WXDi-P09-040 | Flathro Commander, Roaring Flame | OK | FAQ khớp |
| WXDi-P09-041 | Indigolite, Natural Pyroxene | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P09-042 | Mikomiko//Memoria, Bacteria Queen | OK | FAQ khớp |
| WXDi-P09-043 | Contempora, Jade Beauty Queen | OK | 8 FAQ khớp (giữ nguyên lỗi nguồn "ttrigger") |
| WXDi-P09-044 | Mel//Memoria, Code: Order | OK | FAQ khớp |
| WXDi-P09-045 | Werewolf, Wretched Play Queen | OK | 2 FAQ khớp |
| WXDi-P09-046 | Nanashi//Memoria, Bacteria Queen | OK | FAQ khớp |
| WXDi-P09-047 | True Yuzuki//Memoria, Dragon Queen | OK | FAQ khớp; Màu Đỏ / xanh lá |
| WXDi-P09-048 | Piruluk APEX//Memoria, Code: Heart | OK | 2 FAQ khớp; Màu Xanh dương / đen |
| WXDi-P09-049 | Driver's Ed, Code: Maze | OK | FAQ khớp |
| WXDi-P09-050 | G-Lab, Code: Art | OK | FAQ khớp |
| WXDi-P09-051 | Dona//Memoria, Phantom Spirit | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P09-052 | Yukayuka//Memoria, Medium Trickster | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-053 | Scutum, Natural Planet | OK | FAQ khớp (giữ nguyên lỗi nguồn "SIGNI)") |
| WXDi-P09-054 | Fionn mac Cumhaill, Blessed General | OK | không có FAQ |
| WXDi-P09-055 | Howling Shout | OK | không có FAQ; cost 《W》×０ |
| WXDi-P09-056 | Mata Hari, Crimson General | OK | không có FAQ |
| WXDi-P09-057 | Samidare, Lightly Armed | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-058 | LOVIT//Memoria, Phantom Beast | OK | FAQ khớp |
| WXDi-P09-059 | KikunoJoe, Natural Planet | OK | không có FAQ |
| WXDi-P09-060 | Meerkat, Phantom Terra Beast | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P09-061 | Diabolos, Crimson Evil | OK | FAQ khớp |
| WXDi-P09-062 | Divine Dance | OK | FAQ khớp; cost 《R》×０ |
| WXDi-P09-063 | Kimaris, Azure Evil | OK | không có FAQ |
| WXDi-P09-064 | Volans, Natural Planet | OK | FAQ khớp |
| WXDi-P09-065 | Cream Soda, Code: Eat | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-066 | Aya//Memoria, Medium Trickster | OK | 3 FAQ khớp; Life Burst Có |
| WXDi-P09-067 | Sazanami, Code: Ride | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-068 | Fuji Aoi, Natural Planet | OK | không có FAQ; rarity R,GR |
| WXDi-P09-069 | LIVELY LIVE | OK | FAQ khớp; cost 《U》×０ |
| WXDi-P09-070 | Kasuga no Kami, Jade Angel | OK | không có FAQ |
| WXDi-P09-071 | Marbling, Jade Beauty | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-072 | Fleming, Jade Wisdom | OK | không có FAQ |
| WXDi-P09-073 | WOLF//Memoria, Explosive Gun | OK | không có FAQ |
| WXDi-P09-074 | Moray, Phantom Aquatic Beast | OK | FAQ khớp; Life Burst Có |
| WXDi-P09-075 | Skunk Type: Drei | OK | FAQ khớp |
| WXDi-P09-076 | Nourishment | OK | không có FAQ; cost 《G》×１; Bet |
| WXDi-P09-077 | Gefjon, Doomed Angel | OK | không có FAQ; Life Burst Có |
| WXDi-P09-078 | Oigona, Natural Bacteria | OK | FAQ khớp |
| WXDi-P09-079 | Voyni, Code: Old | OK | không có FAQ |
| WXDi-P09-080 | Jacques de Molay, Doomed General | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P09-081 | Mahomaho//Memoria, Natural Element | OK | không có FAQ |
| WXDi-P09-082 | Fe, Natural Element | OK | FAQ khớp |
| WXDi-P09-083 | Prison Please | OK | không có FAQ; cost 《B》×１; Bet |
| WXDi-P09-084 | Servant ♯ | OK | không có FAQ; Guard, Multi Ener |
| WXDi-P09-085A | Blazing Monochrome | OK | không có FAQ; cost 《C》×２ |
| WXDi-P09-085B | Rebellion: Encore! | OK | không có FAQ; SIGNI sinh ra từ 085A |
| WXDi-P09-086 | Dona START | FIX | Use timing 3 -> — (coin LRIG) |
| WXDi-P09-087 | Aya! 0 | FIX | Use timing 4 -> — (coin LRIG) |
| WXDi-P09-088 | Mel - Ready | FIX | Use timing 3 -> — (coin LRIG) |
| WXDi-P09-089 | Nanashi, Part Zero | FIX | Use timing 2 -> — (coin LRIG) |
| WXDi-P09-1st01 | Deus | OK* | nguồn text/PTX là "-" (giữ nguyên); không có FAQ |
| WXDi-P09-1st02 | Ex | OK* | content rỗng -> —, PTX "-" (giữ nguyên); không có FAQ |
| WXDi-P09-1st03 | Machina | OK* | nguồn text/PTX là "-" (giữ nguyên); không có FAQ |
| WXDi-P09-CO-01 | COIN | OK | token; không có FAQ |
| WXDi-P09-TK01A | Ketchacha, Code: Eat | OK | FAQ CRAFT khớp |
| WXDi-P09-TK01B | Servant ZERO | OK | không có FAQ; SIGNI token |
| WXDi-P09-TK02A | Back Fat Mashimashi, Code: Eat | OK | FAQ CRAFT khớp |
| WXDi-P09-TK02B | 【Virus】 | OK | không có FAQ |
| WXDi-P09-TK03A | Soft-Boiled Egg, Code: Eat | OK | FAQ CRAFT khớp |
| WXDi-P09-TK03B | SIGNI KEEP OUT | OK | không có FAQ |

Đã đọc và đối chiếu đủ 103/103 lá (001–089 gồm 019-M01..M03 và 085A/085B, 1st01–1st03, CO-01, TK01A–TK03B) với Card List và FAQ tiếng Anh. Sửa 14 lỗi `Use timing` chứa số coin của LRIG (005, 006, 007, 008, 009, 010, 011, 014, 019, 019-M01..M03, 024, 086, 087, 088, 089) và 3 lỗi tách dòng artist (005, 007, 008, 010); các lá ASSIST LRIG giữ đúng `Use timing` Main Phase / Attack Phase. Toàn bộ card text, Power text/Life Burst, FAQ (kể cả lỗi chính tả nguồn) và token/craft khớp nguồn.

### WXDi-P10 (85 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P10-001 | March of the Toy Soldiers | OK | 3 FAQ khớp; cost 《C》×６ |
| WXDi-P10-002 | Afternoon Tea Show | OK | FAQ khớp; cost 《C》×０ |
| WXDi-P10-003 | Like Friends | OK | FAQ khớp; cost 《C》×２ |
| WXDi-P10-004 | Let's Begin Our Idol Life! | OK | FAQ khớp |
| WXDi-P10-005 | Remember Dinner, Miko of Feasting | OK | 2 FAQ khớp |
| WXDi-P10-006 | Hanayo Three, Blazing Banquet | OK* | 5 FAQ khớp; nguồn có khoảng trắng toàn giác cuối tên, đã trim |
| WXDi-P10-007 | Milulun Setsuna | OK | 3 FAQ khớp |
| WXDi-P10-008 | Midoriko, Third Entry | OK | 3 FAQ khớp |
| WXDi-P10-009 | Hanare, Mourner of Seizure | OK | 3 FAQ khớp |
| WXDi-P10-010 | Remember, Miko of Feasting | OK | không có FAQ; LC(P) |
| WXDi-P10-011 | Remember Break, Miko of Feasting | OK | — |
| WXDi-P10-012 | Remember Lunch, Miko of Feasting | OK | — |
| WXDi-P10-013 | Hanayo One | OK | — |
| WXDi-P10-014 | Hanayo Two | OK | — |
| WXDi-P10-015 | Milulun Nought | OK | LC(P) |
| WXDi-P10-016 | Milulun Nano | OK | — |
| WXDi-P10-017 | Milulun Pico | OK | — |
| WXDi-P10-018 | Midoriko, First Girl | OK | — |
| WXDi-P10-019 | Midoriko, Second Girl | OK | — |
| WXDi-P10-020 | Hanare, Mourner | OK | LC(P) |
| WXDi-P10-021 | Hanare, Mourner of Regrets | OK | — |
| WXDi-P10-022 | Hanare, Mourner of Dreams | OK | — |
| WXDi-P10-023 | Yuzuki Garnet | OK | 2 FAQ khớp; ASSIST, Main Phase |
| WXDi-P10-024 | Yuzuki Ruby | OK | FAQ khớp |
| WXDi-P10-025 | Yuzuki Red Beryl | OK | không có FAQ |
| WXDi-P10-026 | Yuzuki Andesine | OK | 2 FAQ khớp; Main Phase / Attack Phase |
| WXDi-P10-027 | Yuzuki Rubellite | OK | 3 FAQ khớp |
| WXDi-P10-028 | Urith Scare | OK | FAQ khớp |
| WXDi-P10-029 | Urith Mad | OK | không có FAQ |
| WXDi-P10-030 | Urith Aura | OK | 2 FAQ khớp |
| WXDi-P10-031 | Urith Bloody | OK | FAQ khớp |
| WXDi-P10-032 | Urith Afflict | OK | FAQ khớp |
| WXDi-P10-033 | Manaka Laala, Pripara Idol | OK | 2 FAQ khớp |
| WXDi-P10-034 | Yuki//Memoria, Natural Plant Queen | OK | 3 FAQ khớp; Life Burst Có |
| WXDi-P10-035 | Siren, Aquatic Phantom Queen | OK | không có FAQ |
| WXDi-P10-036 | Andromeda, Galactic Queen | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-037 | Orochi, Phantom Dragon Diva | OK | FAQ khớp |
| WXDi-P10-038 | Shikyoin Hibiki, Pripara Idol | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-039 | Rich Racer, Azure Evil Queen | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P10-040 | Eldora//Memoria, Code: Order | OK | 4 FAQ khớp |
| WXDi-P10-041 | Tanabata, Natural Plant Queen | OK | 4 FAQ khớp |
| WXDi-P10-042 | Piruluk W//Memoria, Code: Heart | OK | FAQ khớp |
| WXDi-P10-043 | Myu//Memoria, Galactic Queen | OK | 2 FAQ khớp |
| WXDi-P10-044 | Muzica//Memoria, Code: Labyrinth | OK | FAQ khớp |
| WXDi-P10-045 | Hojo Sophy, Pripara Idol | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-046 | Artemis, Blessed Angel | OK | không có FAQ |
| WXDi-P10-047 | Tama//Memoria, Great Knowledge Play | OK | 2 FAQ khớp |
| WXDi-P10-048 | Minami Mirei, Pripara Idol | OK | không có FAQ; Life Burst Có |
| WXDi-P10-049 | Kokkuri-san, Phantom Spirit | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P10-050 | Call Out | OK | FAQ khớp; cost 《W》×０; Exceed 7 |
| WXDi-P10-051 | Gaaruru, Pripara Idol | OK | FAQ khớp |
| WXDi-P10-052 | Ril//Memoria, Lightly Armed | OK | 2 FAQ khớp |
| WXDi-P10-053 | H-Ot Carpet, Code: Art | OK | không có FAQ; Life Burst Có |
| WXDi-P10-054 | Shiratama Mikan, Pripara Idol | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-055 | Promeus, Crimson Angel | OK | FAQ khớp |
| WXDi-P10-056 | Kurosu Aroma, Pripara Idol | OK | FAQ khớp |
| WXDi-P10-057 | Vulcanic Scythe | OK | không có FAQ; cost 《R》×０; Exceed 7 |
| WXDi-P10-058 | Midorikaze Fuwari, Pripara Idol | OK | FAQ khớp |
| WXDi-P10-059 | Saitou, Azure General | OK | không có FAQ |
| WXDi-P10-060 | Madoka//Memoria, Code: Anti | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-061 | Falulu, Pripara Idol | OK | FAQ khớp |
| WXDi-P10-062 | Allos Piruluk//Memoria, Azure Evil | OK | FAQ khớp |
| WXDi-P10-063 | INVESTIGATE | OK | không có FAQ; cost 《U》×１; Life Burst Có |
| WXDi-P10-064 | Taiyo Pepper, Pripara Idol | OK | không có FAQ |
| WXDi-P10-065 | Mandragora, Jade Evil | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-066 | Mel//Memoria, Natural Bacteria | OK | không có FAQ |
| WXDi-P10-067 | Tsukikawa Chili, Pripara Idol | OK | không có FAQ |
| WXDi-P10-068 | Sanga//Memoria Type: Zwei | OK | FAQ khớp; Life Burst Có |
| WXDi-P10-069 | Manaka Non, Pripara Idol | OK | không có FAQ; Life Burst Có |
| WXDi-P10-070 | Bookmark | OK | không có FAQ; cost 《G》×１ |
| WXDi-P10-071 | Reona West, Pripara Idol | OK | không có FAQ |
| WXDi-P10-072 | Alfou//Memoria, Doomed Beauty | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P10-073 | Guzuko//Memoria, Small Trickster | OK | không có FAQ |
| WXDi-P10-074 | Dorothy West, Pripara Idol | OK | không có FAQ; Life Burst Có |
| WXDi-P10-075 | Urith//Memoria, Phantom Dragon | OK | không có FAQ; Exceed 3 |
| WXDi-P10-076 | Todo Sion, Pripara Idol | OK | FAQ khớp |
| WXDi-P10-077 | Welcome Back | OK | không có FAQ; cost 《B》×１ |
| WXDi-P10-078 | Servant ♯ | OK | không có FAQ; Guard, Multi Ener |
| WXDi-P10-079 | Hanayo, Zero | OK | Re |
| WXDi-P10-080 | Yuzuki Zero | OK | Re |
| WXDi-P10-081 | Midoriko, Battle Girl | OK | Re |
| WXDi-P10-082 | Urith, Enma | OK | Re |
| WXDi-P10-1st01 | Yukayuka | OK | Team/Master `Kyurukyurun☆` |
| WXDi-P10-1st02 | Mikomiko | OK | Team/Master `Kyurukyurun☆` |
| WXDi-P10-1st03 | Mahomaho | OK | Team/Master `Kyurukyurun☆` |

Đã đọc và đối chiếu đủ 85/85 lá (001–082, 1st01–1st03) với Card List và FAQ tiếng Anh. Không phát hiện lỗi nội dung: toàn bộ card text, Power text/Life Burst, grow cost, rarity nhiều bản, ASSIST LRIG (Use timing Main Phase / Attack Phase), FAQ (kể cả lỗi chính tả nguồn như "loes", "proccese", "descritption") và Team/Master của 1st01–1st03 khớp nguồn; 006 chỉ trim khoảng trắng toàn giác cuối tên.

### WXDi-P11 (98 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P11-001 | Fly Me to the Future | OK | FAQ khớp; cost 《C》×１ |
| WXDi-P11-002 | Mysterious Choice | OK | 3 FAQ khớp |
| WXDi-P11-003 | Trickster Stardom! | OK | FAQ khớp |
| WXDi-P11-004 | Wish In... | OK | không có FAQ |
| WXDi-P11-005 | Sashe Motier, Midnight Sun Emissary | OK | 2 FAQ khớp |
| WXDi-P11-006 | Allos Piruluk Mira | OK* | 2 FAQ khớp; nguồn có khoảng trắng toàn giác cuối tên, đã trim |
| WXDi-P11-007 | Aiyai ★ Showdown | OK | FAQ khớp |
| WXDi-P11-008 | Alfou, Cheering Diva | OK | FAQ khớp |
| WXDi-P11-009 | Myu=Blossom | OK | 2 FAQ khớp; 【Charm】 |
| WXDi-P11-010A | Mugen -Q- | OK | 2 FAQ khớp; Limit 5 |
| WXDi-P11-010B | Mugen -A- | OK | không có FAQ; Limit 9, không grow cost |
| WXDi-P11-011 | Sashe Nouvelle, Eternal Emissary | OK | LC(P) |
| WXDi-P11-012 | Sashe Croix, Eternal Emissary | OK | — |
| WXDi-P11-013 | Sashe Craft, Eternal Emissary | OK | FAQ khớp |
| WXDi-P11-014 | Allos Piruluk | OK | LC(P) |
| WXDi-P11-015 | Allos Piruluk K | OK | — |
| WXDi-P11-016 | Allos Piruluk M | OK | — |
| WXDi-P11-017 | Aiyai ★ Bet | OK | LC(P) |
| WXDi-P11-018 | Aiyai ★ Club | OK | — |
| WXDi-P11-019 | Aiyai ★ Craft | OK | FAQ khớp |
| WXDi-P11-020 | Alfou, Ebony - Clad Diva | OK | LC(P) |
| WXDi-P11-021 | Alfou, Reflective Diva | OK | — |
| WXDi-P11-022 | Alfou, Investigating Diva | OK | — |
| WXDi-P11-023 | Myu=Hatch | OK | LC(P) |
| WXDi-P11-024 | Myu=Lava | OK | — |
| WXDi-P11-025 | Myu=Craft | OK | FAQ khớp |
| WXDi-P11-026 | Mugen | OK | LC(P) |
| WXDi-P11-027 | Mugen -J- | OK | — |
| WXDi-P11-028 | Mugen -H- | OK | — |
| WXDi-P11-029 | Carnival -Attack- | OK | ASSIST, Main Phase |
| WXDi-P11-030 | Carnival -Grudge- | OK | ASSIST, Main Phase |
| WXDi-P11-031 | Carnival -Finality- | OK | 2 FAQ khớp; Main Phase / Attack Phase |
| WXDi-P11-032 | Carnival -Sin- | OK | không có FAQ |
| WXDi-P11-033 | Carnival -Thievery- | OK | không có FAQ; Main Phase / Attack Phase |
| WXDi-P11-034 | Ann - Dance | OK | không có FAQ |
| WXDi-P11-035 | Ann - Enchant | OK | không có FAQ |
| WXDi-P11-036 | Ann - Repose | OK | FAQ khớp |
| WXDi-P11-037 | Ann - Disperse | OK | không có FAQ |
| WXDi-P11-038 | Ann - Colorize | OK | FAQ khớp |
| WXDi-P11-039 | Socrates, Blessed Mind Queen | OK | FAQ khớp |
| WXDi-P11-040 | Pantomime, Master Trickster | OK | 3 FAQ khớp; Life Burst Có |
| WXDi-P11-041 | Ajax, Great Shield | OK | FAQ khớp |
| WXDi-P11-042 | Ex//Memoria, Phantom Spirit Queen | OK | FAQ khớp |
| WXDi-P11-043 | Remember//Memoria, Azure Mind Queen | OK | FAQ khớp |
| WXDi-P11-044 | Otohime, Aquatic Phantom Queen | OK | không có FAQ |
| WXDi-P11-045 | Oberon, Jade Angel Queen | OK | FAQ khớp; Life Burst Có |
| WXDi-P11-046 | Midoriko//Memoria, Phantom Queen | OK | FAQ khớp |
| WXDi-P11-047 | Chimera, Phantom Beast Deity | OK | FAQ khớp |
| WXDi-P11-048 | Carnival//Memoria, Doomed Queen | OK | FAQ khớp |
| WXDi-P11-049 | Troublesome Queen Pandora: Drei | OK | không có FAQ |
| WXDi-P11-050 | Ut'ulls//Memoria, Fusion Ultra Gate | OK | FAQ khớp; Màu Trắng / đen; LB Có |
| WXDi-P11-051 | Tawil//Memoria, Fusion Ritual | OK | FAQ khớp |
| WXDi-P11-052 | Mikamune, Lightly Armed | OK | FAQ khớp |
| WXDi-P11-053 | Medjed, Code: Anti | OK | không có FAQ; LB Có |
| WXDi-P11-054 | Astolfo, Blessed General | OK | FAQ khớp |
| WXDi-P11-055 | Ipos, Blessed Evil | OK | FAQ khớp; LB Có |
| WXDi-P11-056 | Ut'ulls Territory | OK | FAQ khớp; cost 《W》×１ / 《B》×１ |
| WXDi-P11-057 | Kiraiza, Small Arms | OK | không có FAQ |
| WXDi-P11-058 | Hessonite, Natural Crystal | OK | không có FAQ |
| WXDi-P11-059 | Hanayo//Memoria, Natural Element | OK | không có FAQ; Life Burst Có |
| WXDi-P11-060 | Tama//Memoria, Erupting Cannon | OK | FAQ khớp |
| WXDi-P11-061 | C2H6, Natural Element | OK | không có FAQ; Rise |
| WXDi-P11-062 | J - Ukebox, Code: Art | OK | FAQ khớp; Life Burst Có |
| WXDi-P11-063 | Innocent Force | OK | không có FAQ; cost 《R》×１ / 《C》×１ |
| WXDi-P11-064 | Tama//Memoria, Azure Angel | OK | không có FAQ |
| WXDi-P11-065 | ThO2, Natural Element | OK | không có FAQ |
| WXDi-P11-066 | Amoeba, Natural Bacteria | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P11-067 | Needlefish, Phantom Aquatic Beast | OK | FAQ khớp |
| WXDi-P11-068 | Snowsec, Phantom Insect | OK | FAQ khớp; Life Burst Có |
| WXDi-P11-069 | Plumbago, Natural Plant | OK | không có FAQ; Life Burst Có |
| WXDi-P11-070 | Fever | OK | FAQ khớp; cost 《U》×０; Exceed 7 |
| WXDi-P11-071 | Barbarian, Jade General | OK | không có FAQ |
| WXDi-P11-072 | Menko, First Play | OK | không có FAQ |
| WXDi-P11-073 | Maritozzo, Code: Eat | OK | FAQ khớp; Life Burst Có |
| WXDi-P11-074 | Scratch Art, Jade Beauty | OK | không có FAQ; Life Burst Có |
| WXDi-P11-075 | Yuzuki//Memoria, Water Phantom | OK | không có FAQ |
| WXDi-P11-076 | Seven Lights | OK | FAQ khớp; cost 《G》×０; Exceed 7 |
| WXDi-P11-077 | Machina//Memoria, Code: Ride | OK | không có FAQ; Life Burst Có |
| WXDi-P11-078 | Umr//Memoria, Fusion Ritual | OK | FAQ khớp |
| WXDi-P11-079 | Heike Firefly, Phantom Light Insect | OK | FAQ khớp |
| WXDi-P11-080 | Deus//Memoria, High Armed | OK | không có FAQ |
| WXDi-P11-081 | Nanashi//Memoria, Erupting Tome | OK | FAQ khớp; Life Burst Có |
| WXDi-P11-082 | Furufuru, Doomed Evil | OK | không có FAQ; Life Burst Có |
| WXDi-P11-083 | Darkness Seven | OK | FAQ khớp; cost 《B》×０; Exceed 7 |
| WXDi-P11-084 | Servant ♯ | OK | không có FAQ; Guard + Multi Ener |
| WXDi-P11-085 | Carnival -0- | OK* | Use timing 3 -> — (giá trị coin của LRIG, không phải timing); không có FAQ; không có artist |
| WXDi-P11-086 | Ann, Marvel of Miracles | OK | không có FAQ; text và artist trống theo nguồn |
| WXDi-P11-1st01 | Umr | OK | grow cost `*再録IDあわせ`; không có FAQ |
| WXDi-P11-1st02 | At | OK | grow cost `*再録IDあわせ`; không có FAQ |
| WXDi-P11-1st03 | Tawil | OK | grow cost `*再録IDあわせ`; không có FAQ |
| WXDi-P11-TK01 | Saturn, White Planet Queen | OK | FAQ khớp; RESONA, emergent |
| WXDi-P11-TK02 | Full Moon, White Planet Queen | OK | 2 FAQ khớp |
| WXDi-P11-TK03 | Merigoran, Green Extreme Play | OK | FAQ khớp |
| WXDi-P11-TK04 | Asure [Hard], Green Extreme Play | OK | FAQ khớp |
| WXDi-P11-TK05 | Arachne Pider, Giant Phantom Insect | OK | 2 FAQ khớp |
| WXDi-P11-TK06 | King Clad [FA], Giant Phantom Insect | OK | FAQ khớp |
| WXDi-P11-TK07A | Token WXDi-P11-TK07A | OK | TOKEN; không có FAQ |
| WXDi-P11-TK07B | Servant ZERO | OK | SIGNI TK; không có FAQ |

Đã đọc và đối chiếu đủ 98/98 lá (001–009, 010A, 010B, 011–086, 1st01–1st03, TK01–TK06, TK07A, TK07B) với Card List và FAQ tiếng Anh. Sửa 2 lỗi: 006 trim khoảng trắng toàn giác cuối tên; 085 `Use timing` 3 -> — (Carnival -0- là LRIG, giá trị 3 là coin khởi đầu). Các lá còn lại khớp nguồn: card text, Power text/Life Burst, cost, Exceed, Emerge Conditions, Guard/Multi Ener, RESONA/TK, grow cost 1st (`*再録IDあわせ`), FAQ (kể cả lỗi chính tả nguồn như "undernearth").

### WXDi-P12 (96 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P12-001 | Sunspot Memory | OK | 5 FAQ khớp; cost 《W》×１ / 《C》×１; Barrier |
| WXDi-P12-002 | Unbalanced Dance | OK | 2 FAQ khớp; cost 《R》×１ / 《C》×１ |
| WXDi-P12-003 | Lancer in the Dark | OK | FAQ khớp; S Lancer |
| WXDi-P12-004 | Dissonance | OK | FAQ khớp |
| WXDi-P12-005 | Unknown Memory | OK | FAQ khớp; cost 《C》×０ |
| WXDi-P12-006 | Yuki, Savage Miko | OK | 7 FAQ khớp; Exceed 4 |
| WXDi-P12-007 | Hanayo Tragic, Flame Dance | OK | 2 FAQ khớp; Exceed 4 |
| WXDi-P12-008 | Mikomiko☆Three - Three Mix - Mix | OK* | 3 FAQ khớp; nguồn có khoảng trắng toàn giác cuối LRIG type, đã trim |
| WXDi-P12-009 | Mel - Lady of the Camellias | OK* | 3 FAQ khớp; Use timing 2 -> — (coin LRIG); trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-010 | Tamayorihime, Enduring Darkness Miko | OK | 2 FAQ khớp; Exceed 4 |
| WXDi-P12-011 | Yuki, Hundred Calamity Miko | OK | không có FAQ |
| WXDi-P12-012 | Yuki, Pure and Impure Miko | OK | không có FAQ |
| WXDi-P12-013 | Yuki, Authentic Miko | OK | không có FAQ |
| WXDi-P12-014 | Hanayo, Daybreak | OK | không có FAQ |
| WXDi-P12-015 | Hanayo, Strange Land Fairy | OK | không có FAQ |
| WXDi-P12-016 | Hanayo Mimic, Ominous Disaster | OK | không có FAQ |
| WXDi-P12-017 | Mikomiko☆Zero - Zero | OK* | không có FAQ; trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-018 | Mikomiko☆One - Mix | OK* | không có FAQ; trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-019 | Mikomiko☆Two Mix - Mix | OK* | không có FAQ; trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-020 | Mel - Cherry Blossom | OK* | Use timing 3 -> — (coin LRIG); trim khoảng trắng toàn giác cuối LRIG type; không có FAQ |
| WXDi-P12-021 | Mel - Evergreen | OK* | không có FAQ; trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-022 | Mel - Snow Country | OK* | không có FAQ; trim khoảng trắng toàn giác cuối LRIG type |
| WXDi-P12-023 | Tamayorihime, Discordant Miko | OK | không có FAQ |
| WXDi-P12-024 | Tamayorihime, Unequal Miko | OK | không có FAQ |
| WXDi-P12-025 | Tamayorihime, Displeased Miko | OK | không có FAQ |
| WXDi-P12-026 | Layla =Neutral= | OK* | Use timing 3 -> — (coin LRIG); không có FAQ |
| WXDi-P12-027 | Layla the Vanish | OK | ASSIST LRIG, Use timing Main Phase; không có FAQ |
| WXDi-P12-028 | Layla the Fang | OK | FAQ khớp; ASSIST LRIG |
| WXDi-P12-029 | Layla the Roaring Vigor | OK | ASSIST LRIG; không có FAQ |
| WXDi-P12-030 | Layla the Crack | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P12-031 | Layla the Ranbu | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P12-032 | Eldora × Mark ０ | OK | không có FAQ |
| WXDi-P12-033 | Eldora! Exclamation! | OK | ASSIST LRIG; không có FAQ |
| WXDi-P12-034 | Eldora! Searcher! | OK | ASSIST LRIG; không có FAQ |
| WXDi-P12-035 | Eldora! Burst Rush! | OK | 2 FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P12-036 | Eldora! On Stage! | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P12-037 | Eldora! Stone! | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P12-038 | Aiyai ★ Bet | OK | không có FAQ |
| WXDi-P12-039 | Aiyai, Miracle Rolling | OK | FAQ khớp; ASSIST LRIG |
| WXDi-P12-040 | Aiyai, Kinetic Card | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P12-041 | Aiyai, Nin - Nin | OK | FAQ khớp; ASSIST LRIG |
| WXDi-P12-042 | Aiyai, Hide and Attack | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P12-043 | Aiyai, Breaking | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P12-044 | Dona//Dissona, Phantom Spirit Queen | OK | không có FAQ |
| WXDi-P12-045 | Connect//Dissona, Code: Labyrinth | OK | không có FAQ; Life Burst Có |
| WXDi-P12-046 | Yuzuki//Dissona, Dragon Queen | OK | FAQ khớp |
| WXDi-P12-047 | SeekLove//Dissona, Crystal Brilliance | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P12-048 | Allos Piruluk//Dissona, Giant Insect | OK | không có FAQ |
| WXDi-P12-049 | Tamago//Dissona, Planet Queen | OK | không có FAQ |
| WXDi-P12-050 | Miko Fan//Dissona, Bacteria Queen | OK | 2 FAQ khớp; Life Burst Có |
| WXDi-P12-051 | Bang//Dissona, Jade Evil Queen | OK | 3 FAQ khớp; Shadow |
| WXDi-P12-052 | BFF//Dissona, Code: Order | OK | FAQ khớp; Life Burst Có; Coin cost |
| WXDi-P12-053 | Umr//Dissona, Code: Ancients | OK | không có FAQ |
| WXDi-P12-054 | Destro//Dissona, Full Armed | OK | không có FAQ; Life Burst Có |
| WXDi-P12-055 | Urith//Dissona, Lucent Evil Queen | OK | FAQ khớp; Harmony |
| WXDi-P12-056 | Tawil//Dissona, Blessed Angel | OK | không có FAQ |
| WXDi-P12-057 | Nova//Dissona, Natural Planet | OK | không có FAQ |
| WXDi-P12-058 | Pale Laby//Dissona, Code: Maze | OK | không có FAQ; Life Burst Có |
| WXDi-P12-059 | Yukayuka//Dissona, Medium Trickster | OK | không có FAQ; Life Burst Có |
| WXDi-P12-060 | Guillotine//Dissona, High Armed | OK | không có FAQ |
| WXDi-P12-061 | Yukime//Dissona, Blessed General | OK | không có FAQ |
| WXDi-P12-062 | New Problem | OK | không có FAQ; cost 《W》×１; Life Burst Có |
| WXDi-P12-063 | Ril//Dissona, Crimson General | OK | không có FAQ |
| WXDi-P12-064 | Ano Uzu//Dissona, Crimson Angel | OK | không có FAQ; Life Burst Có |
| WXDi-P12-065 | Firecracker//Dissona, Small Cannon | OK | không có FAQ |
| WXDi-P12-066 | Lala Ru//Dissona, Code: Art | OK | FAQ khớp; Life Burst Có |
| WXDi-P12-067 | Komainu//Dissona, Phantom Beast | OK | không có FAQ |
| WXDi-P12-068 | Rickshaw//Dissona, Code: Ride | OK | không có FAQ; Rise |
| WXDi-P12-069 | Opening Signal | OK | không có FAQ; cost 《R》×１; Life Burst Có |
| WXDi-P12-070 | Madoka//Dissona, Code: Anti | OK | không có FAQ |
| WXDi-P12-071 | Matcha Frappe//Dissona, Code: Eat | OK | không có FAQ; Life Burst Có |
| WXDi-P12-072 | Pond Turtle//Dissona, Phantom Beast | OK | không có FAQ |
| WXDi-P12-073 | Soui//Dissona, Azure General | OK | không có FAQ |
| WXDi-P12-074 | Hope Dia//Dissona, Natural Crystal | OK | FAQ khớp; Life Burst Có |
| WXDi-P12-075 | EXTRA | OK | không có FAQ; cost 《U》×１; Life Burst Có |
| WXDi-P12-076 | Sanga//Dissona Type: Eins | OK | không có FAQ |
| WXDi-P12-077 | Moving Picture//Dissona, Jade Beauty | OK | FAQ khớp; Shadow; Life Burst Có |
| WXDi-P12-078 | Wawolf//Dissona, Phantom Terra Beast | OK | không có FAQ; Lancer |
| WXDi-P12-079 | At//Dissona, Code: Maze | OK | không có FAQ; Life Burst Có |
| WXDi-P12-080 | Ivy//Dissona, Natural Plant | OK | không có FAQ |
| WXDi-P12-081 | Mad Dogma//Dissona, Jade Mind | OK | FAQ khớp |
| WXDi-P12-082 | Emergence | OK | không có FAQ; cost 《G》×０; Life Burst Có |
| WXDi-P12-083 | Muzica//Dissona, Code: Maze | OK | không có FAQ |
| WXDi-P12-084 | Mahomaho//Dissona, Natural Element | OK | không có FAQ |
| WXDi-P12-085 | Monkey's Paw//Dissona, Code: Anti | OK | không có FAQ; Life Burst Có |
| WXDi-P12-086 | Hanare//Dissona Type: Drei | OK | không có FAQ |
| WXDi-P12-087 | Kagomeka//Dissona, Mimicry Play | OK | không có FAQ; Life Burst Có |
| WXDi-P12-088 | Oryzill//Dissona, Natural Bacteria | OK | không có FAQ |
| WXDi-P12-089 | Black Aura | OK | không có FAQ; cost 《B》×０; Life Burst Có |
| WXDi-P12-090 | Servant ♯ | OK | không có FAQ; Guard + Multi Ener; Life Burst Có |
| WXDi-P12-CO-01 | COIN | OK | TOKEN; không có FAQ |
| WXDi-P12-SP | Tama | OK | LRIG SP; không có FAQ |
| WXDi-P12-TK01A | 【LRIG Barrier】 | OK | TOKEN; không có FAQ |
| WXDi-P12-TK01B | 【Mikomiko Defense Squad】 | OK | TOKEN; không có FAQ |
| WXDi-P12-TK02A | 【SIGNI Barrier】 | OK | TOKEN; không có FAQ |
| WXDi-P12-TK02B | 【Mikomiko Defense Squad】 | OK | TOKEN; không có FAQ |

Đã đọc và đối chiếu đủ 96/96 lá (001–090, CO-01, SP, TK01A/B, TK02A/B) với Card List và FAQ tiếng Anh. Sửa 4 lỗi `Use timing` của LRIG (009: 2, 020: 3, 026: 3 -> —; coin khởi đầu không phải timing) và trim khoảng trắng toàn giác cuối LRIG type ở 008, 009, 017–022. Các lá còn lại khớp nguồn: card text, Power text/Life Burst, cost, Exceed 4, Barrier/Mikomiko Defense Squad, ASSIST timing (`Main Phase` hoặc `Main Phase / Attack Phase`), Rise, Harmony, Shadow, FAQ (kể cả lỗi chính tả nguồn như "tirggered", "undernearth").

### WXDi-P13 (96 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P13-001 | Unrest☆UN☆REST! | OK | 2 FAQ khớp; cost 《U》×１ |
| WXDi-P13-002 | Instigate | OK | 3 FAQ khớp; cost 《B》×１ |
| WXDi-P13-003A | Mysterious Rendezvous | OK | 2 FAQ khớp; PIECE A-side mặt trước |
| WXDi-P13-003B | Mayu, Unknown Miko | OK | 3 FAQ khớp; LRIG 2 màu Trắng / đen; Tama/Iona |
| WXDi-P13-004A | Unknown | OK | 2 FAQ khớp; PIECE A-side |
| WXDi-P13-004B | UNKNOWN - CODE - RU - | OK | 2 FAQ khớp; SIGNI Primal Tone |
| WXDi-P13-005 | Brain Hearts | OK | FAQ khớp; cost 《C》×２ |
| WXDi-P13-006 | Remember Tempest, Miko of Fantasia | OK | FAQ khớp; Exceed 4 |
| WXDi-P13-007 | Hirana, a Step Towards the Check | OK | FAQ khớp; Exceed 4; Team/Master `No Limit` theo nguồn |
| WXDi-P13-008 | Code Piruluk Ultimate | OK | FAQ khớp; Exceed 4 |
| WXDi-P13-009 | Midoriko, Dispersal Three | OK | không có FAQ; Exceed 4 |
| WXDi-P13-010 | Nanashi, Part Three Calamity | OK* | 2 FAQ khớp; Use timing 3 -> — (coin LRIG); Virus |
| WXDi-P13-011 | Remember Fine, Miko of Fantasia | OK | không có FAQ |
| WXDi-P13-012 | Remember Cloud, Miko of Fantasia | OK | không có FAQ |
| WXDi-P13-013 | Remember Rain, Miko of Fantasia | OK | không có FAQ |
| WXDi-P13-014 | Hirana, a Step Towards the Battle | OK | không có FAQ; Team/Master `No Limit` theo nguồn |
| WXDi-P13-015 | Hirana, a Step Towards the Initiative | OK | không có FAQ; Team/Master `No Limit` theo nguồn |
| WXDi-P13-016 | Hirana, a Step Towards the Slash | OK | không có FAQ; Team/Master `No Limit` theo nguồn |
| WXDi-P13-017 | Code Piruluk Initiate | OK | không có FAQ |
| WXDi-P13-018 | Code Piruluk Advance | OK | không có FAQ |
| WXDi-P13-019 | Code Piruluk Decide | OK | không có FAQ |
| WXDi-P13-020 | Midoriko, Spirit Zero | OK | không có FAQ |
| WXDi-P13-021 | Midoriko, One - By - One | OK | không có FAQ |
| WXDi-P13-022 | Midoriko, Two - By - Two | OK | không có FAQ |
| WXDi-P13-023 | Nanashi, Part Zero Calamity | OK* | Use timing 2 -> — (coin LRIG); không có FAQ |
| WXDi-P13-024 | Nanashi, Part One Calamity | OK | không có FAQ |
| WXDi-P13-025 | Nanashi, Part Two Calamity | OK | không có FAQ |
| WXDi-P13-026 | Sashe Nouvelle, Eternal Emissary | OK | không có FAQ |
| WXDi-P13-027 | Sashe Undulation | OK | ASSIST LRIG; không có FAQ |
| WXDi-P13-028 | Sashe Jiggle | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P13-029 | Sashe Baladi | OK | FAQ khớp; ASSIST LRIG |
| WXDi-P13-030 | Sashe Isolate | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P13-031 | Sashe Snake | OK | 2 FAQ khớp; ASSIST timing Main Phase / Attack Phase; grow cost 《C》×５ |
| WXDi-P13-032 | Iona, Zero/Maiden | OK | không có FAQ |
| WXDi-P13-033 | Iona Shouty | OK | ASSIST LRIG; không có FAQ |
| WXDi-P13-034 | Iona Eibon | OK | ASSIST LRIG; không có FAQ |
| WXDi-P13-035 | Iona Full Moon | OK | 2 FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P13-036 | Iona the Beam | OK | FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P13-037 | Iona Dark Matter | OK | 2 FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P13-038 | Myu=Hatch | OK | không có FAQ |
| WXDi-P13-039 | Myu - Musk | OK | ASSIST LRIG; không có FAQ |
| WXDi-P13-040 | Myu - Black Swallowtail | OK | FAQ khớp; ASSIST LRIG |
| WXDi-P13-041 | Myu - Purple Emperor | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P13-042 | Myu - Large Map | OK | 3 FAQ khớp; ASSIST timing Main Phase / Attack Phase |
| WXDi-P13-043 | Myu - Blue Admiral | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P13-044 | Highty//Dissona, Blessed Evil Queen | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-045 | Akino//Dissona, Aquatic Phantom Queen | OK | FAQ khớp |
| WXDi-P13-046 | Sadistal//Dissona, Planet Queen | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-047 | LOVIT//Dissona, Phantom Beast Deity | OK | 2 FAQ khớp |
| WXDi-P13-048 | Apex//Dissona, Crimson Angel Queen | OK | không có FAQ; Life Burst Có |
| WXDi-P13-049 | Aya//Dissona, Master Trickster | OK | 2 FAQ khớp |
| WXDi-P13-050 | Save//Dissona, Code: Heart | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-051 | Ann//Dissona, Jade Beauty Queen | OK | 2 FAQ khớp; Shadow, 2/Turn |
| WXDi-P13-052 | Lupal//Dissona, Phantom Beast Deity | OK | không có FAQ; Life Burst Có |
| WXDi-P13-053 | Alfou//Dissona, Doomed Evil Queen | OK | không có FAQ |
| WXDi-P13-054 | Guzuko//Dissona, Tragic Party Queen | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-055 | Hedonym//Dissona, Bacteria Queen | OK | không có FAQ; Life Burst Có |
| WXDi-P13-056 | LION//Dissona, Code: Art | OK | FAQ khớp |
| WXDi-P13-057 | Broom//Dissona, Code: Anti | OK | không có FAQ; Life Burst Có |
| WXDi-P13-058 | Mokumoren//Dissona, Phantom Spirit | OK | không có FAQ; Shadow |
| WXDi-P13-059 | Raguel//Dissona, Blessed Angel | OK | không có FAQ |
| WXDi-P13-060 | Cometty//Dissona, Natural Planet | OK | không có FAQ |
| WXDi-P13-061 | Rhythmic Fortune | OK | không có FAQ; cost 《W》×０; Life Burst Có |
| WXDi-P13-062 | Carnival//Dissona, Natural Planet | OK | 2 FAQ khớp; Craft; Life Burst Có |
| WXDi-P13-063 | Chupasaburo//Dissona, Phantom Spirit | OK | FAQ khớp |
| WXDi-P13-064 | Qilin//Dissona, Phantom Dragon | OK | FAQ khớp |
| WXDi-P13-065 | Ex//Dissona, Phantom Spirit | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-066 | Rb//Dissona, Natural Element | OK | không có FAQ |
| WXDi-P13-067 | Atlas//Dissona, Phantom Insect | OK | không có FAQ |
| WXDi-P13-068 | Flamboyant Tactics | OK | không có FAQ; cost 《R》×１ / 《C》×１; Life Burst Có |
| WXDi-P13-069 | Futase//Dissona, Azure Beauty | OK | không có FAQ; Assassin |
| WXDi-P13-070 | Rei//Dissona, Natural Crystal | OK | không có FAQ |
| WXDi-P13-071 | Ohkaso//Dissona, Code: Maze | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-072 | Milulun//Dissona, Natural Element | OK | FAQ khớp; Life Burst Có |
| WXDi-P13-073 | Yubanda//Dissona, Azure Angel | OK | không có FAQ |
| WXDi-P13-074 | Coffee//Dissona, Code: Eat | OK | không có FAQ |
| WXDi-P13-075 | DEEP FREEZE | OK | 2 FAQ khớp; cost 《U》×１; Life Burst Có |
| WXDi-P13-076 | Mama//Dissona, Jade Mind | OK | không có FAQ |
| WXDi-P13-077 | Paching//Dissona, Small Cannon | OK | không có FAQ; Life Burst Có |
| WXDi-P13-078 | Konotoxin//Dissona Type: Eins | OK | không có FAQ |
| WXDi-P13-079 | WOLF//Dissona, Erupting Cannon | OK | không có FAQ; Lancer |
| WXDi-P13-080 | Shingen//Dissona, Jade General | OK | không có FAQ; Life Burst Có |
| WXDi-P13-081 | Hellsgate//Dissona, Jade Evil | OK | không có FAQ |
| WXDi-P13-082 | Soulspear | OK | không có FAQ; cost 《G》×１ / 《C》×１; Life Burst Có |
| WXDi-P13-083 | Deus//Dissona, Lightly Armed | OK | FAQ khớp |
| WXDi-P13-084 | Mikazuki//Dissona, Natural Planet | OK | không có FAQ; Life Burst Có |
| WXDi-P13-085 | Miyama//Dissona, Phantom Insect | OK | không có FAQ |
| WXDi-P13-086 | Machina//Dissona, Code: Ride | OK | FAQ khớp |
| WXDi-P13-087 | Carcharo//Dissona, Phantom Dragon | OK | FAQ khớp |
| WXDi-P13-088 | Dig - Dig | OK | FAQ khớp; cost 《B》×１; Life Burst Có |
| WXDi-P13-089 | Mugen//Dissona | OK | FAQ khớp; Multi Ener |
| WXDi-P13-090 | Servant ♯ | OK | không có FAQ; Guard + Multi Ener; Life Burst Có |
| WXDi-P13-091 | Deneblog | OK | không có FAQ |
| WXDi-P13-CO-01 | COIN | OK | TOKEN; không có FAQ |
| WXDi-P13-TK01A | Servant ZERO | OK | SIGNI CRAFT; không có FAQ |
| WXDi-P13-TK01B | 【Virus】 | OK | TOKEN; không có FAQ |

Đã đọc và đối chiếu đủ 96/96 lá (001, 002, 003A/B, 004A/B, 005–091, CO-01, TK01A/B) với Card List và FAQ tiếng Anh. Sửa 2 lỗi `Use timing` của LRIG (010: 3, 023: 2 -> —; coin khởi đầu không phải timing). Các lá còn lại khớp nguồn: card text, Power text/Life Burst, cost, PIECE hai mặt A/B, ASSIST timing (`Main Phase` hoặc `Main Phase / Attack Phase`), Exceed 4, Virus/Barrier/Mikomiko Defense Squad, Craft, FAQ (kể cả lỗi chính tả nguồn như "varnished", "growl", "tirggered").

### WXDi-P14 (101 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P14-001 | Splash Field | OK | không có FAQ; cost 《W》×１; Barrier |
| WXDi-P14-002 | Connect Spinning | OK | không có FAQ; cost 《R》×１ / 《C》×２ |
| WXDi-P14-003 | Blue Night Show | OK | không có FAQ; cost 《U》×１ / 《C》×２ |
| WXDi-P14-004 | Happiness Float | OK | không có FAQ; cost 《G》×１ / 《C》×１ |
| WXDi-P14-005 | Chaos! Chaos! Chaos! | OK | không có FAQ; cost 《B》×１ / 《C》×１ |
| WXDi-P14-006 | Yuzuki Brilliant, Surflame Beauty | FIX | gộp artist nhiều dòng `夕子 / Niθ`; Exceed 4 |
| WXDi-P14-007 | Allos Piruluk kℓ | FIX | gộp artist nhiều dòng `ぺろん / マツモトミツアキ`; Exceed 4 |
| WXDi-P14-008 | Ann III, Summer Success | FIX | gộp artist nhiều dòng `山吹色 / 斎木こまり`; Exceed 4 |
| WXDi-P14-009 | Urith, Fanatical Enma | FIX | gộp artist nhiều dòng `コウサク / pupps`; Exceed 4 |
| WXDi-P14-010 | Yuzuki Water Play, Surflame | OK | không có FAQ |
| WXDi-P14-011 | Yuzuki Wet, Surflame | OK | không có FAQ |
| WXDi-P14-012 | Yuzuki Soaker, Surflame | OK | không có FAQ |
| WXDi-P14-013 | Allos Piruluk mℓ | OK | không có FAQ |
| WXDi-P14-014 | Allos Piruluk dℓ | OK | không có FAQ |
| WXDi-P14-015 | Allos Piruluk ℓ | OK | không có FAQ |
| WXDi-P14-016 | Ann, Witless Wonderland | OK | không có FAQ |
| WXDi-P14-017 | Ann I, Longing Likeness | OK | không có FAQ |
| WXDi-P14-018 | Ann II, Principled Practice | OK* | nguồn có khoảng trắng toàn giác cuối tên, đã trim; không có FAQ |
| WXDi-P14-019 | Urith, Scorching Enma | OK | không có FAQ |
| WXDi-P14-020 | Urith, Abyssal Enma | OK | không có FAQ |
| WXDi-P14-021 | Urith, Splashing Enma | OK | không có FAQ |
| WXDi-P14-022 | Milulun Nought | OK | không có FAQ |
| WXDi-P14-023 | Milulun ☆ Welcome | OK | ASSIST LRIG; không có FAQ |
| WXDi-P14-024 | Milulun ☆ Slash | OK | ASSIST LRIG; không có FAQ |
| WXDi-P14-025 | Milulun ☆ Threaten | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-026 | Milulun ☆ Catch | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-027 | Milulun ☆ Flash | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-028 | Mama ♥ 0 | OK* | Use timing 4 -> — (coin LRIG); không có FAQ |
| WXDi-P14-029 | Mama ♥ Happy | OK | ASSIST LRIG; Coin |
| WXDi-P14-030 | Mama ♥ Attack | OK | ASSIST LRIG; không có FAQ |
| WXDi-P14-031 | Mama ♥ Cheat | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-032 | Mama ♥ Defense | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-033 | Mama ♥ Tidying Up | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-034 | Guzuko, Worthless Queen | OK* | Use timing 3 -> — (coin LRIG); không có FAQ; ghi chú ảnh LC(P) thiếu trên CDN |
| WXDi-P14-035 | Guzuko ~Incident~ | OK | ASSIST LRIG; Coin |
| WXDi-P14-036 | Guzuko ~Cry~ | OK | ASSIST LRIG; không có FAQ |
| WXDi-P14-037 | Guzuko ~Appeal~ | OK | ASSIST LRIG; không có FAQ |
| WXDi-P14-038 | Guzuko ~Peace!~ | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-039 | Guzuko ~Punishment~ | OK | ASSIST timing Main Phase / Attack Phase; không có FAQ |
| WXDi-P14-040 | Remember//Fesonne, Galactic Queen | OK | không có FAQ; Assassin |
| WXDi-P14-041 | Dona//Fesonne, Phantom Spirit Queen | OK | không có FAQ; awaken, Coin |
| WXDi-P14-042 | Hirana//Fesonne, Crimson Angel Queen | OK | không có FAQ |
| WXDi-P14-043 | Hanayo//Fesonne, Natural Pyroxene | OK | không có FAQ; awaken |
| WXDi-P14-044 | Rei//Fesonne, Natural Pyroxene | OK | không có FAQ; Life Burst Có |
| WXDi-P14-045 | Piruluk//Fesonne, Code: Heart | OK | không có FAQ; awaken |
| WXDi-P14-046 | WOLF//Fesonne, Roaring Gun | OK | không có FAQ; S Lancer; Life Burst Có |
| WXDi-P14-047 | Mel//Fesonne, Code: Order | OK | không có FAQ; awaken, Coin |
| WXDi-P14-048 | Hanare//Fesonne, Type: Drei | OK | không có FAQ |
| WXDi-P14-049 | Nanashi//Fesonne, Bacteria Queen | OK | không có FAQ; awaken |
| WXDi-P14-050 | Yukayuka//Fesonne, Small Trickster | OK | không có FAQ; Life Burst Có |
| WXDi-P14-051 | LION//Fesonne, Code: Art | OK | không có FAQ |
| WXDi-P14-052 | Alto//Fesonne, Erupting Cannon | OK | không có FAQ |
| WXDi-P14-053 | Festival Awake | OK | không có FAQ; cost 《W》×０; Life Burst Có |
| WXDi-P14-054 | LOVIT//Fesonne, Phantom Beast | OK | không có FAQ; Life Burst Có |
| WXDi-P14-055 | Lalaru//Fesonne, Code: Art | OK | không có FAQ |
| WXDi-P14-056 | Carnival//Fesonne, Natural Planet | OK | không có FAQ |
| WXDi-P14-057 | Awakening Fervor | OK | không có FAQ; cost 《R》×０; Life Burst Có |
| WXDi-P14-058 | Aya//Fesonne, Small Trickster | OK | không có FAQ; Life Burst Có |
| WXDi-P14-059 | Madoka//Fesonne, Code: Anti | OK | không có FAQ |
| WXDi-P14-060 | Mikomiko//Fesonne, Natural Bacteria | OK | không có FAQ |
| WXDi-P14-061 | TEMPO UP | OK | không có FAQ; cost 《U》×１; Life Burst Có |
| WXDi-P14-062 | Sanga//Fesonne, Type: Eins | OK | không có FAQ; Life Burst Có |
| WXDi-P14-063 | Midoriko//Fesonne, Phantom Beast | OK | không có FAQ |
| WXDi-P14-064 | Aiyai//Fesonne, Second Play | OK | không có FAQ |
| WXDi-P14-065 | Reverb | OK | không có FAQ; cost 《G》×１; Life Burst Có |
| WXDi-P14-066 | Mahomaho//Fesonne, Natural Element | OK | không có FAQ; Life Burst Có |
| WXDi-P14-067 | Muzica//Fesonne, Code: Maze | OK | không có FAQ |
| WXDi-P14-068 | Myu//Fesonne, Phantom Insect | OK | không có FAQ |
| WXDi-P14-069 | Grave Up | OK | không có FAQ; cost 《B》×１; Life Burst Có |
| WXDi-P14-070 | Tuning Up! | OK | không có FAQ; cost 《C》×３; Shadow |
| WXDi-P14-071 | Akino, Bound for Adoration | FIX | gộp artist nhiều dòng `かにゃぴぃ / Niθ`; Exceed 4; Team/Master `No Limit` |
| WXDi-P14-072 | Akino, Bound for Hope | OK | không có FAQ; Team/Master `No Limit` |
| WXDi-P14-073 | Akino, Bound for Resolve | OK | không có FAQ; Team/Master `No Limit` |
| WXDi-P14-074 | Akino, Bound for Brilliance | OK | không có FAQ; Team/Master `No Limit` |
| WXDi-P14-075 | DEN-ON-BU Kazune Shinonome | FIX | gộp artist nhiều dòng `Mika Pikazo / sola` |
| WXDi-P14-076 | DEN-ON-BU Reina Hidaka | OK | không có FAQ; Life Burst Có |
| WXDi-P14-077 | DEN-ON-BU Futaba Kayano | FIX | gộp artist nhiều dòng `通常版：Mika Pikazo / パラ版：アカバネ`; Life Burst Có |
| WXDi-P14-078 | DEN-ON-BU Aki Shirokane | OK | không có FAQ |
| WXDi-P14-079 | DEN-ON-BU Tama Kurogane | FIX | gộp artist nhiều dòng `Mika Pikazo / Nardack` |
| WXDi-P14-080 | DEN-ON-BU Ginka Haijima | OK | không có FAQ; Life Burst Có |
| WXDi-P14-081 | DEN-ON-BU Hina Minakami | OK | không có FAQ; Life Burst Có |
| WXDi-P14-082 | DEN-ON-BU Mimito Sakurano | OK* | gộp artist nhiều dòng; không có FAQ |
| WXDi-P14-083 | DEN-ON-BU Shian Inubousaki | OK | không có FAQ |
| WXDi-P14-084 | DEN-ON-BU Mitsuki Seto | OK | không có FAQ |
| WXDi-P14-085 | DEN-ON-BU Karin Houou | OK* | gộp artist nhiều dòng; không có FAQ |
| WXDi-P14-086 | DEN-ON-BU Lucia Taiga | OK | không có FAQ; Life Burst Có |
| WXDi-P14-087 | DEN-ON-BU Maya-Shakuji-Abeno | OK | không có FAQ |
| WXDi-P14-088 | DEN-ON-BU Matoi Ogami | OK | không có FAQ; Life Burst Có |
| WXDi-P14-089 | DEN-ON-BU Reml | OK | không có FAQ |
| WXDi-P14-090 | Servant ♯ | OK | không có FAQ; Use timing Guard khớp nguồn |
| WXDi-P14-091 | The Name's Casual | OK | LRIG level 0; không có FAQ; thiếu ảnh CDN (đã ghi chú) |
| WXDi-P14-CO-01 | Coin Card WXDi-P14-CO-01 | OK | token/coin; không có FAQ |
| WXDi-P14-CO-02 | Coin Card WXDi-P14-CO-02 | OK | token/coin; không có FAQ |
| WXDi-P14-SP | Akino | OK | LRIG level 0; Team/Master No Limit khớp nguồn |
| WXDi-P14-TK01 | Fesonne Magic: White | OK | SPELL CRAFT; không có FAQ |
| WXDi-P14-TK02 | Fesonne Magic: Blazing Red | OK | SPELL CRAFT; không có FAQ |
| WXDi-P14-TK03 | Fesonne Magic: BLUE | OK | SPELL CRAFT; không có FAQ |
| WXDi-P14-TK04 | Fesonne Magic: Jade | OK | SPELL CRAFT; không có FAQ |
| WXDi-P14-TK05 | Fesonne Magic: Black | OK | SPELL CRAFT; không có FAQ |
| WXDi-P14-TK06 | 【SIGNI Barrier】 | OK | token/special; không có FAQ |
| WXDi-P14-TK07 | 【LRIG Barrier】 | OK | token/special; không có FAQ |

P14 hoàn tất: đã đọc đối chiếu toàn bộ 101 lá (001–091, CO-01, CO-02, SP, TK01–TK07) với Card List và FAQ chính thức; đã sửa các lỗi gộp artist nhiều dòng (006–009, 071, 075, 077, 079, 082, 085), Use timing coin trên LRIG (028, 034) và trim tên 018. Không lá nào có FAQ riêng; ảnh 091 thiếu trên CDN đã ghi chú.

### WXDi-P15 (109 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P15-001 | Liberators' Force | OK | PIECE LRIG Deck; 3 FAQ khớp |
| WXDi-P15-002 | Power of Struggle | OK | PIECE; 4 FAQ khớp |
| WXDi-P15-003 | Unlock! Gate! | OK | PIECE; 6 FAQ khớp |
| WXDi-P15-004 | All - Out Battle | OK | PIECE; 1 FAQ khớp |
| WXDi-P15-005 | Revelation from the Overseers | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P15-006 | Liberator Ril, Memory of Freedom | OK* | Use timing 4 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-007 | Liberator Eldora × Mark ν | OK | 3 FAQ khớp |
| WXDi-P15-008 | Warrior Carnival #T# | OK* | Use timing 2 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-009 | Warrior Guzuko, Queen of Greed | OK* | Use timing 2 -> — (LRIG, coin khởi đầu); 3 FAQ khớp |
| WXDi-P15-010 | Defender MC LION - 3rd | OK | Team/Master Card Jockey; 2 FAQ khớp |
| WXDi-P15-011 | Professor! Defender Dr. Tamago | OK* | trim khoảng trắng toàn giác cuối tên; 2 FAQ khớp |
| WXDi-P15-012 | Liberator Ril, Memory of Inspiration | OK* | Use timing 1 -> — (LRIG, coin khởi đầu); không có FAQ |
| WXDi-P15-013 | Liberator Ril, Memory of Uncertainty | OK | không có FAQ |
| WXDi-P15-014 | Liberator Ril, Memory of Resolve | OK | không có FAQ |
| WXDi-P15-015 | Liberator Eldora × Mark 0 | OK | không có FAQ |
| WXDi-P15-016 | Liberator Eldora × Mark Ⅰ | OK | không có FAQ |
| WXDi-P15-017 | Liberator Eldora × Mark Ⅱ | OK | không có FAQ |
| WXDi-P15-018 | Warrior Carnival #0# | OK* | Use timing 3 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-019 | Warrior Carnival #P# | OK | không có FAQ |
| WXDi-P15-020 | Warrior Carnival #S# | OK | không có FAQ |
| WXDi-P15-021 | Warrior Guzuko, Queen of Change | OK* | Use timing 3 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-022 | Warrior Guzuko, Queen of Destruction | OK | không có FAQ |
| WXDi-P15-023 | Warrior Guzuko, Queen of Pyro | OK | không có FAQ |
| WXDi-P15-024 | Defender MC LION | OK | Team/Master Card Jockey |
| WXDi-P15-025 | Defender MC LION - 1st | OK | Team/Master Card Jockey |
| WXDi-P15-026 | Defender MC LION - 2nd | OK | Team/Master Card Jockey |
| WXDi-P15-027 | Defender Dr. Tamago | OK | Team/Master UCHU NO HAJIMARI |
| WXDi-P15-028 | Assistant! Defender Dr. Tamago | OK | không có FAQ |
| WXDi-P15-029 | Associate! Defender Dr. Tamago | OK | không có FAQ |
| WXDi-P15-030 | Remember Dinner, Miko of Feasting | OK | không có FAQ |
| WXDi-P15-031 | Remember Scrying | OK | ASSIST LRIG, Use timing Main Phase khớp; 1 FAQ |
| WXDi-P15-032 | Remember Ominous | OK | ASSIST LRIG, Use timing Main Phase khớp |
| WXDi-P15-033 | Remember Restraint | OK | ASSIST LRIG, Use timing Main Phase khớp |
| WXDi-P15-034 | Remember Astrology | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P15-035 | Remember Prophecy | OK | Use timing Main Phase / Attack Phase khớp; 1 FAQ |
| WXDi-P15-036 | Alfou, Ebony - Clad Diva | OK | không có FAQ |
| WXDi-P15-037 | Alfou Sword | OK | không có FAQ |
| WXDi-P15-038 | Alfou Iceberg | OK | 1 FAQ khớp |
| WXDi-P15-039 | Alfou Jealousy | OK | 2 FAQ khớp |
| WXDi-P15-040 | Alfou Splash | OK | Use timing Main Phase / Attack Phase khớp; 1 FAQ |
| WXDi-P15-041 | Alfou Thorn Ivy | OK | Use timing Main Phase / Attack Phase khớp; 2 FAQ |
| WXDi-P15-042 | Hanare, Mourner | OK | không có FAQ |
| WXDi-P15-043 | Hanare//Spikes | OK | 5 FAQ khớp |
| WXDi-P15-044 | Hanare//Dark Sphere | OK | 1 FAQ khớp |
| WXDi-P15-045 | Hanare//Million Daggers | OK | Use timing Main Phase / Attack Phase khớp; 2 FAQ |
| WXDi-P15-046 | Hanare//Forbidden Fangs | OK | Use timing Main Phase / Attack Phase khớp; 1 FAQ |
| WXDi-P15-047 | Hanare//Venom Splash | OK | Use timing Main Phase / Attack Phase khớp; 1 FAQ |
| WXDi-P15-048 | Simon Bol//THE DOOR, Crimson Warlord | OK | 1 FAQ khớp; Life Burst Có |
| WXDi-P15-049 | Mel//THE DOOR, Code: Order | OK | 2 FAQ khớp |
| WXDi-P15-050 | Eel//THE DOOR, Phantom Aquatic Beast | OK | 3 FAQ khớp |
| WXDi-P15-051 | Hanayo//THE DOOR, Natural Pyroxene | OK | 2 FAQ; Life Burst Có |
| WXDi-P15-052 | Flatwoods//THE DOOR, Galactic Queen | OK | 2 FAQ; Life Burst Có |
| WXDi-P15-053 | Nanashi//THE DOOR, Bacteria Queen | OK | 2 FAQ khớp |
| WXDi-P15-054 | Coin Toss//THE DOOR, Tragic Party | OK | 2 FAQ khớp |
| WXDi-P15-055 | Aya//THE DOOR, Master Trickster | OK | 2 FAQ; Life Burst Có |
| WXDi-P15-056 | L Speaker//THE DOOR, Code: Heart | OK | 2 FAQ khớp |
| WXDi-P15-057 | LOVIT//THE DOOR, Phantom Beast Deity | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-058 | Costume//THE DOOR, Galactic Queen | OK | 2 FAQ; Life Burst Có |
| WXDi-P15-059 | Nova//THE DOOR, Galactic Queen | OK | 1 FAQ khớp |
| WXDi-P15-060 | Yuzuki//THE DOOR, Phantom Dragon | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-061 | Sashe//THE DOOR, Natural Planet | OK | 1 FAQ khớp |
| WXDi-P15-062 | Dona//THE DOOR, Phantom Spirit | OK | 1 FAQ khớp |
| WXDi-P15-063 | Liberating Shot | OK | Cost nhiều dòng gộp đúng; 2 FAQ; Life Burst Có |
| WXDi-P15-064 | Allos Piruluk//THE DOOR, Phantom Insect | OK | 2 FAQ; Life Burst Có |
| WXDi-P15-065 | Midoriko//THE DOOR, Phantom Beast | OK | 1 FAQ khớp (giữ nguyên typo nguồn 《Yuzuki》) |
| WXDi-P15-066 | Myu//THE DOOR, Phantom Insect | OK | 1 FAQ khớp |
| WXDi-P15-067 | INSPIRATION | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-068 | Milulun//THE DOOR, Natural Element | OK | không có FAQ |
| WXDi-P15-069 | Layla//THE DOOR, Code: Ride | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-070 | Mama//THE DOOR, Jade Mind | OK | không có FAQ |
| WXDi-P15-071 | Battlespear | OK | Bet khớp; 2 FAQ; Life Burst Có |
| WXDi-P15-072 | Yukayuka//THE DOOR, Small Trickster | OK | 1 FAQ khớp |
| WXDi-P15-073 | Mahomaho//THE DOOR, Natural Element | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-074 | Mikomiko//THE DOOR, Natural Bacteria | OK | 2 FAQ khớp |
| WXDi-P15-075 | Death Destroy | OK | Bet khớp; không có FAQ; Life Burst Có |
| WXDi-P15-076 | Muzica//THE DOOR, Code: Maze | OK | 1 FAQ khớp |
| WXDi-P15-077 | Ex//THE DOOR, Phantom Spirit | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-078 | WOLF//THE DOOR, Erupting Cannon | OK | 2 FAQ khớp |
| WXDi-P15-079 | Open Gate | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-080 | Hirana//THE DOOR, Azure Angel | OK | 1 FAQ khớp |
| WXDi-P15-081 | Rei//THE DOOR, Natural Crystal | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-082 | Bang//THE DOOR, Azure Evil | OK | 2 FAQ khớp |
| WXDi-P15-083 | GATE DRIVE | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-084 | Long Spear, Lightly Armed | OK | 1 FAQ khớp |
| WXDi-P15-085 | Digi - Lock, Medium Trickster | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-086 | A - To Door, Code: Art | OK | không có FAQ |
| WXDi-P15-087 | Molotov Cocktail, Small Cannon | OK | không có FAQ |
| WXDi-P15-088 | Ares, Crimson Angel | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-089 | Hawking, Natural Planet | OK | không có FAQ; Life Burst Có |
| WXDi-P15-090 | Kr, Natural Element | OK | 1 FAQ khớp |
| WXDi-P15-091 | Labradorite, Natural Crystal | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-092 | Mangrove, Natural Plant | OK | không có FAQ; Life Burst Có |
| WXDi-P15-093 | Greek Tortoise, Phantom Terra Beast | OK | 1 FAQ; Life Burst Có |
| WXDi-P15-094 | Kissing Loach, Phantom Aquatic Beast | OK | không có FAQ |
| WXDi-P15-095 | Makitomi, Jade Mind | OK | không có FAQ |
| WXDi-P15-096 | Tsukiyotake, Type: Eins | OK | không có FAQ; Life Burst Có |
| WXDi-P15-097 | Demogorn, Doomed Evil | OK | không có FAQ |
| WXDi-P15-098 | Aotora, Doomed General | OK | không có FAQ; Life Burst Có |
| WXDi-P15-099 | Servant ♯ | OK | Use timing Guard khớp; không có FAQ |
| WXDi-P15-CO-01 | COIN | OK | TOKEN; không có FAQ |
| WXDi-P15-CO-02 | COIN | OK | TOKEN; không có FAQ |
| WXDi-P15-SP01 | Ril | OK* | Use timing 1 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-SP02 | Eldora | OK | không có FAQ |
| WXDi-P15-SP03 | Carnival | OK* | Use timing 3 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-SP04 | Guzuko | OK* | Use timing 3 -> — (LRIG, coin khởi đầu) |
| WXDi-P15-SP05 | LION | OK | Team/Master Card Jockey |
| WXDi-P15-SP06 | Tamago | OK | Team/Master UCHU NO HAJIMARI |
| WXDi-P15-TK01A | 【Gate】 | OK | TOKEN; không có FAQ |
| WXDi-P15-TK01B | 【SIGNI Barrier】 | OK | TOKEN; không có FAQ |

P15 hoàn tất: đã đọc đối chiếu toàn bộ 109 lá (001–099, CO-01, CO-02, SP01–SP06, TK01A, TK01B) với Card List và FAQ chính thức; đã sửa Use timing coin trên các LRIG (006, 008, 009, 012, 018, 021, SP01, SP03, SP04) và trim khoảng trắng toàn giác cuối tên 011. FAQ dài được đối chiếu nguyên văn, giữ nguyên typo của nguồn.

### WXDi-P16 (97 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-P16-001A | NEXT GATE | OK | PIECE; không có FAQ |
| WXDi-P16-001B | Ut'ulls, Gate Overseer | OK | LRIG level 4; không có FAQ |
| WXDi-P16-002 | D - (A)LIVE!! | OK | PIECE; không có FAQ |
| WXDi-P16-003 | Pure White Barrier | OK | Cost nhiều dòng gộp đúng |
| WXDi-P16-004 | Crimson Heat Ray | OK | Cost nhiều dòng gộp đúng |
| WXDi-P16-005 | Sparkling Blue | OK | Cost nhiều dòng gộp đúng |
| WXDi-P16-006 | Jade Cooking | OK | Cost nhiều dòng gộp đúng |
| WXDi-P16-007 | Black Surprise | OK | không có FAQ |
| WXDi-P16-008 | Tawil =Tre=, Gate Overseer | OK | không có FAQ |
| WXDi-P16-009 | Gabriela, Guidance Gatherer | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-010 | Azaela, Shining Beyond | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-011 | Michaela, Beginning and End of Hope | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-012 | At =Tre=, the Converged Gate | OK | Team/Master Ancient Surprise |
| WXDi-P16-013 | Umr =Tre=, Gate Overseer | OK | không có FAQ |
| WXDi-P16-014 | Tawil =Noll=, Ancient One | OK | không có FAQ |
| WXDi-P16-015 | Tawil =Ett=, Ancient One | OK | không có FAQ |
| WXDi-P16-016 | Tawil =Två=, Ancient One | OK | không có FAQ |
| WXDi-P16-017 | Gabriela, Weaver of Will | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-018 | Gabriela, Brimming with Ingenuity | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-019 | Gabriela, Collector of Truth | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-020 | Azaela, Towards the Future | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-021 | Azaela, Lighting Up the Board | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-022 | Azaela, Soaring Towards the Ideal | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-023 | Michaela, Reality's Whereabouts | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-024 | Michaela, Rekindled Strength | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-025 | Michaela, Forefront Resolve | OK | Team/Master MUGEN SHOJO |
| WXDi-P16-026 | At =Noll=, the Opened Gate | OK | Team/Master Ancient Surprise |
| WXDi-P16-027 | At =Ett=, the Opened Gate | OK | Team/Master Ancient Surprise |
| WXDi-P16-028 | At =Två=, the Opened Gate | OK | Team/Master Ancient Surprise |
| WXDi-P16-029 | Umr =Noll=, Key to Creation | OK | không có FAQ |
| WXDi-P16-030 | Umr =Ett=, Key to Chaos | OK | không có FAQ |
| WXDi-P16-031 | Umr =Två=, Key to Chaos | OK | không có FAQ |
| WXDi-P16-032 | Gabriela, Majestic!! | OK | ASSIST LRIG, Use timing Main Phase khớp |
| WXDi-P16-033 | Gabriela, Dazzling!! | OK | ASSIST LRIG, Use timing Main Phase khớp |
| WXDi-P16-034 | Gabriela, Brilliant!! | OK | Limit ＋１ khớp |
| WXDi-P16-035 | Gabriela, Graceful!! | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P16-036 | Gabriela, Bye - Bye!! | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P16-037 | Azaela "Arrow of Courage" | OK | không có FAQ |
| WXDi-P16-038 | Azaela "Smiling Wings" | OK | không có FAQ |
| WXDi-P16-039 | Azaela "Flames of Reversal" | OK | Limit ＋１ khớp |
| WXDi-P16-040 | Azaela "Fists of Victory" | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P16-041 | Azaela "Invincible Shield" | OK | Limit ＋１ khớp |
| WXDi-P16-042 | Michaela, Pierce | OK | không có FAQ |
| WXDi-P16-043 | Michaela, Dance | OK | không có FAQ |
| WXDi-P16-044 | Michaela, Fangs | OK | Limit ＋１ khớp |
| WXDi-P16-045 | Michaela, Kick | OK | Use timing Main Phase / Attack Phase khớp |
| WXDi-P16-046 | Michaela, Blade | OK | Limit ＋１ khớp |
| WXDi-P16-047 | Sashe//Dissona, Galactic Queen | OK | Life Burst Có |
| WXDi-P16-048 | Zeusias, Mugen Crimson Angel Queen | OK | [Team] <MUGEN SHOJO> khớp |
| WXDi-P16-049 | Heavy Machine Gun, Roaring Cannon | OK | không có FAQ |
| WXDi-P16-050 | Milulun//Fesonne, Element Queen | OK | Life Burst Có |
| WXDi-P16-051 | Tobira, Code: Labyrinth | OK | Life Burst Có |
| WXDi-P16-052 | Grizzly, Phantom Beast Deity | OK* | trim khoảng trắng toàn giác cuối tên |
| WXDi-P16-053 | Cao Cao, Doomed General Queen | OK | Life Burst Có |
| WXDi-P16-054 | Akino//THE DOOR, Aquatic Queen | OK | không có FAQ |
| WXDi-P16-055 | Yog - Niggura, Ultra Gate Angel Queen | OK | LRIG type nhiều phần khớp |
| WXDi-P16-056 | Piruluk//THE DOOR, Code: Heart | OK | không có FAQ |
| WXDi-P16-057 | Urith//THE DOOR, Doomed Jade Queen | OK | không có FAQ |
| WXDi-P16-058 | Spinner of Stories//Memoria | OK | màu Không màu khớp |
| WXDi-P16-059 | Deus//THE DOOR, Lightly Armed | OK | không có FAQ |
| WXDi-P16-060 | Nova//Fesonne, Natural Planet | OK | không có FAQ |
| WXDi-P16-061 | Kamakama, Lightly Armed | OK | Life Burst Có |
| WXDi-P16-062 | Machina//THE DOOR, Code: Ride | OK | Life Burst Có |
| WXDi-P16-063 | Alto//Disonna, Erupting Cannon | OK | Life Burst Có |
| WXDi-P16-064 | Iona//THE DOOR, Code: Anti | OK | không có FAQ |
| WXDi-P16-065 | Ril//Fesonne, Crimson General | OK | Life Burst Có |
| WXDi-P16-066 | Mule Hare, Phantom Terra Beast | OK | Life Burst Có |
| WXDi-P16-067 | Tama//THE DOOR, High Armed | OK | Life Burst Có |
| WXDi-P16-068 | Layla//Dissona, Code: Ride | OK | không có FAQ |
| WXDi-P16-069 | Futase//THE DOOR, Azure Beauty | OK | không có FAQ |
| WXDi-P16-070 | Sanga//THE DOOR, Type: Eins | OK | không có FAQ |
| WXDi-P16-071 | Tamago//Fesonne, Natural Planet | OK | Life Burst Có |
| WXDi-P16-072 | Murmurn, Azure Evil | OK | không có FAQ |
| WXDi-P16-073 | Ann//THE DOOR, Azure Beauty | OK | Life Burst Có |
| WXDi-P16-074 | Madoka//THE DOOR, Code: Anti | OK | Life Burst Có |
| WXDi-P16-075 | Eldora//Dissona, Aquatic Beast | OK | không có FAQ |
| WXDi-P16-076 | Hanare//THE DOOR, Type: Eins | OK | không có FAQ |
| WXDi-P16-077 | Bang//Fesonne, Jade Evil | OK | không có FAQ |
| WXDi-P16-078 | Vidar, Jade Angel | OK | Life Burst Có |
| WXDi-P16-079 | Remember//THE DOOR, Natural Planet | OK | Life Burst Có |
| WXDi-P16-080 | Aiyai//Dissona, Second Play | OK | không có FAQ |
| WXDi-P16-081 | Haity//THE DOOR, Doomed Evil | OK | không có FAQ |
| WXDi-P16-082 | Guzuko//Fesonne, Strange Blood Play | OK | không có FAQ |
| WXDi-P16-083 | Alfou//THE DOOR, Doomed Evil | OK | Life Burst Có |
| WXDi-P16-084 | Myu//Dissona, Phantom Insect | OK | Life Burst Có |
| WXDi-P16-085 | Pb, Natural Element | OK | Life Burst Có |
| WXDi-P16-086 | L - Mic, Code: Art | OK | [Team] <Card Jockey> khớp |
| WXDi-P16-087 | H - Mic, Natural Crystal | OK | [Team] <No Limit> khớp |
| WXDi-P16-088 | A - Arrow, Chaos Angel | OK | [Team] <MUGEN SHOJO> khớp |
| WXDi-P16-089 | E - Cutter, Code: Ride | OK | [Team] <Deus Ex Machina> khớp |
| WXDi-P16-090 | T - Cymbal, Natural Planet | OK | [Team] <UCHU NO HAJIMARI> khớp |
| WXDi-P16-091 | M - Ruler, Natural Bacteria | OK | [Team] <Kyurukyurun☆> khớp |
| WXDi-P16-092 | Tru'nembra, Code: Maze | OK | [Team] <Ancient Surprise> khớp |
| WXDi-P16-093 | M - Ball, Type: Eins | OK | [Team] <DIAGRAM> khớp |
| WXDi-P16-094 | Beacon to the Future | OK | Life Burst Có |
| WXDi-P16-095 | Servant ♯ | OK | Use timing Guard khớp; Life Burst Có |
| WXDi-P16-TK01 | Invincible Story | OK | PIECE CRAFT; không có FAQ |

P16 hoàn tất: đã đọc đối chiếu toàn bộ 97 lá (001A, 001B, 002–095, TK01) với Card List và FAQ chính thức; đã trim khoảng trắng toàn giác cuối tên 052. Không phát hiện lệch Use timing hay cost; các lá [Team] và Limit ＋１ khớp nguồn.

### WXDi-CP01 (90 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-CP01-001 | SELENE Girls' Academy, After School | OK* | trim khoảng trắng toàn giác cuối tên; 2 FAQ |
| WXDi-CP01-002 | SELENE Girls' Academy, Moon Night | OK | 2 FAQ khớp |
| WXDi-CP01-003 | OBSYDIA SALVAGE | OK | không có artist; 2 FAQ |
| WXDi-CP01-004 | LazuLight FLASH | OK | 2 FAQ khớp |
| WXDi-CP01-005 | [Center] Lize, Level 3' | OK | Team/Master Sanbaka; 4 FAQ |
| WXDi-CP01-006 | [Center] Ange, Level 3' | OK | Team/Master Sanbaka; 2 FAQ |
| WXDi-CP01-007 | [Center] Toko, Level 3' | OK | 2 FAQ (giữ nguyên typo nguồn -500[EN]0) |
| WXDi-CP01-008 | [Center] Mito, Level 3 | OK | 2 FAQ khớp |
| WXDi-CP01-009 | Mito, Level 0 | OK | không có FAQ |
| WXDi-CP01-010 | [Center] Mito, Level 1 | OK | không có FAQ |
| WXDi-CP01-011 | [Center] Mito, Level 2 | OK | không có FAQ |
| WXDi-CP01-012 | [Assist] Lize, Level 1 [Sword] | OK | ASSIST LRIG, Use timing Main Phase khớp |
| WXDi-CP01-013 | [Assist] Lize, Level 2 [Ice Wall] | OK | Limit ＋１ khớp |
| WXDi-CP01-014 | [Assist] Ange, Level 1 [Love] | OK | 1 FAQ khớp |
| WXDi-CP01-015 | [Assist] Ange, Level 2 [Alchemy] | OK | 3 FAQ khớp |
| WXDi-CP01-016 | [Assist] Toko, Level 1 [Cudgel] | OK | không có FAQ |
| WXDi-CP01-017 | [Assist] Toko, Level 2 [Ranbu] | OK | Limit ＋１ khớp; 1 FAQ |
| WXDi-CP01-018 | [Assist] Mito, Level 1 [Hatchet] | OK | không có FAQ |
| WXDi-CP01-019 | [Assist] Mito, Level 1 [Mallet] | OK | không có FAQ |
| WXDi-CP01-020 | [Assist] Mito, Level 1 [Sin] | OK | 1 FAQ khớp |
| WXDi-CP01-021 | [Assist] Mito, Level 2 [Eternity] | OK | không có FAQ |
| WXDi-CP01-022 | [Assist] Mito, Level 2 [Strike] | OK | không có FAQ |
| WXDi-CP01-023 | [Assist] Mito, Level 2 [Concealment] | OK | 2 FAQ khớp |
| WXDi-CP01-024 | [Assist] Mito, Level 2 [Diagnosis] | OK | 1 FAQ khớp |
| WXDi-CP01-025 | Shiina Yuika, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-026 | Amamiya Kokoro, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-027 | Furen E Lustario, Code 2434 | OK | 1 FAQ khớp |
| WXDi-CP01-028 | Nishizono Chigusa, Code 2434 | OK | 1 FAQ khớp |
| WXDi-CP01-029 | Sasaki Saku, Code 2434 | OK | 2 FAQ khớp |
| WXDi-CP01-030 | Takamiya Rion, Code 2434 | OK | không có FAQ |
| WXDi-CP01-031 | Suo Sango, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-032 | Lain Paterson, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-033 | Machita Chima, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-034 | Sorahoshi Kirame, Code 2434 | OK | không có FAQ |
| WXDi-CP01-035 | Asahina Akane, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-036 | Elira Pendora, Code 2434 | OK | rarity có ENR; 1 FAQ |
| WXDi-CP01-037 | Suzuka Utako, Code 2434 | OK | Life Burst Có |
| WXDi-CP01-038 | Sukoya Kana, Code 2434 | OK | Life Burst Có |
| WXDi-CP01-039 | Todo Kohaku, Code 2434 | OK | không có FAQ |
| WXDi-CP01-040 | Pomu Rainpuff, Code 2434 | OK | rarity có ENR |
| WXDi-CP01-041 | Finana Ryugu, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-042 | Hanabatake Chaika, Code 2434 | OK | Life Burst Có |
| WXDi-CP01-043 | Debidebi Debiru, Code 2434 | OK | không có FAQ |
| WXDi-CP01-044 | Kitakoji Hisui, Code 2434 | OK | 1 FAQ khớp |
| WXDi-CP01-045 | Amagase Muyu, Code 2434 | OK | không có FAQ |
| WXDi-CP01-046 | Umise Yotsuha, Code 2434 | OK | Life Burst Có |
| WXDi-CP01-047 | Ponto Nei, Code 2434 | OK | không có FAQ |
| WXDi-CP01-048 | Ruco, Code 2434 | OK | không có FAQ |
| WXDi-CP01-049 | Petra Gurin, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-050 | Rosemi Lovelock, Code 2434 | OK | 1 FAQ; Life Burst Có |
| WXDi-CP01-051 | Selen Tatsuki, Code 2434 | OK | 1 FAQ khớp |
| WXDi-CP01-052 | Super Helesta Saber | OK | rarity Re; không có FAQ |
| WXDi-CP01-053 | White Heaven | OK | Cost nhiều dòng gộp đúng |
| WXDi-CP01-054 | DEATH DECK | OK | không có artist |
| WXDi-CP01-055 | Zeno Cluster | OK | Use timing Attack Phase khớp |
| WXDi-CP01-056 | Lize, Level 0 | OK | Team/Master Sanbaka |
| WXDi-CP01-057 | [Center] Lize, Level 1 | OK | LRIG Trắng L1 Limit 2, grow 《W》×０; Use timing —; Team Sanbaka; Re,Re(P). |
| WXDi-CP01-058 | [Center] Lize, Level 2 | OK | LRIG Trắng L2 Limit 5, grow 《W》×１; Re,Re(P). |
| WXDi-CP01-059 | Ange, Level 0 | OK | LRIG Trắng L0 Limit 0, grow 《W》×０; Re,Re(P). |
| WXDi-CP01-060 | [Center] Ange, Level 1 | OK | LRIG Trắng L1 Limit 2, grow 《W》×０; Re,Re(P). |
| WXDi-CP01-061 | [Center] Ange, Level 2 | OK | LRIG Trắng L2 Limit 5, grow 《W》×１; Re,Re(P). |
| WXDi-CP01-062 | Toko, Level 0 | OK | LRIG Đen L0 Limit 0, grow 《B》×０; Re,Re(P). |
| WXDi-CP01-063 | [Center] Toko, Level 1 | OK | LRIG Đen L1 Limit 2, grow 《B》×０; Re,Re(P). |
| WXDi-CP01-064 | [Center] Toko, Level 2 | OK | LRIG Đen L2 Limit 5, grow 《B》×１; Re,Re(P). |
| WXDi-CP01-065 | Ars Almal, Code 2434 | OK | SIGNI Trắng L3 12000, Mech Tone：Virtual; 3 dòng text [Team]/[Team Auto]/[Action] khớp. |
| WXDi-CP01-066 | Himawari Honma, Code 2434 | OK | SIGNI Trắng L3 12000; [Auto] Shadow + [Action] top 3 khớp. |
| WXDi-CP01-067 | Nui Sociere, Code 2434 | OK | SIGNI Đen L3 12000; 2 [Auto] khớp. |
| WXDi-CP01-068 | Furen Slash | OK | SPELL Trắng cost 《W》×２ / 《C》×３; Life Burst Có trùng text; Re,Re(P). |
| WXDi-CP01-069 | Ratna Petit, Code 2434 | OK | SIGNI Đen L1 2000; [Action] {Down} -1000/-2000 khớp. |
| WXDi-CP01-070 | Fuyuki Hakase, Code 2434 | OK | SIGNI Đen L1 1000; [Enter] -1000 + dòng rule-based khớp. |
| WXDi-CP01-071 | Mirei Gundo, Code 2434 | OK | SIGNI Đen L2 5000; [Enter] {Black} mill 3 + hồi L1 Virtual khớp. |
| WXDi-CP01-072 | Rena Yorumi, Code 2434 | OK | SIGNI Đen L3 10000; Life Burst Có, power text hồi 2 Virtual khớp. |
| WXDi-CP01-073 | Darkness Eater | OK | SPELL Đen cost 《B》×２ / 《C》×２; Life Burst Có -12000 trùng text; Re,Re(P). |
| WXDi-CP01-074 | Sara Hoshikawa, Code 2434 | OK | SIGNI WB (Trắng / đen) L1 5000; text đa màu khớp; Re,Re(P). |
| WXDi-CP01-075 | Mao Matsukai, Code 2434 | OK | SIGNI WB L2 10000; text đa màu khớp; Re,Re(P). |
| WXDi-CP01-076 | Servant ♯ | OK | SIGNI Không màu L1 1000 Primal Tone; Guard timing + Multi Ener; Life Burst Có; artist クロサワテツ. |
| WXDi-CP01-077 | Servant ♯ | OK | Bản sao text; artist ぶんたん. |
| WXDi-CP01-078 | Servant ♯ | OK | Bản sao text; artist 大熊まい. |
| WXDi-CP01-1st01 | Ange | OK | LRIG Trắng L0 Limit 0, grow 《W》×０; artist 再録 (official); độ hiếm 1st. |
| WXDi-CP01-1st02 | Toko | OK | LRIG Đen L0, grow 《B》×０; artist 再録; 1st. |
| WXDi-CP01-1st03 | Mito | OK | LRIG Đen L0, grow 《B》×０; Team/Master —; 1st. |
| WXDi-CP01-SP01 | Ange | OK | LRIG Trắng L0; artist —; SP; có ảnh biến thể SP. |
| WXDi-CP01-SP02 | Toko | OK | LRIG Đen L0; SP; có ảnh biến thể SP. |
| WXDi-CP01-SP03 | Mito | OK | LRIG Đen L0; Team/Master —; SP; có ảnh biến thể SP. |
| WXDi-CP01-TK01 | Collab Liver | OK | TOKEN, Màu —, TK,TK(P); vị trí ngoài deck; ảnh biến thể TK. |
| WXDi-CP01-TK02 | Collab Liver | OK | TOKEN TK,TK(P); ảnh biến thể TK. |
| WXDi-CP01-TK03 | Collab Liver | OK | TOKEN TK,TK(P); ảnh biến thể TK. |
| WXDi-CP01-TK04 | Collab Liver | OK | TOKEN TK,TK(P); ảnh biến thể TK. |
| WXDi-CP01-TK05 | Collab Liver | OK | TOKEN TK,TK(P); ảnh biến thể TK. |
| WXDi-CP01-TK06 | Collab Liver | OK | TOKEN TK,TK(P); ảnh biến thể TK. |

CP01 hoàn tất: đã đọc đối chiếu toàn bộ 90 lá (001–078, 1st01–1st03, SP01–SP03, TK01–TK06) với Card List và FAQ chính thức. Không phát hiện lệch dữ liệu; không lá nào có FAQ riêng. Ghi nhận P14 artist đa dòng không áp dụng ở đây.

### WXDi-CP02 (114 lá) — hoàn tất

| Mã | Tên | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| WXDi-CP02-001 | Tea Party | OK | PIECE Trắng cost 《C》×０; 6 FAQ khớp verbatim; ảnh biến thể LRP. |
| WXDi-CP02-002 | Seminar | OK | PIECE Xanh dương 《C》×１; text Freeze/draw 4 khớp; 2 FAQ. |
| WXDi-CP02-003 | Masked Swimsuit Gang | OK | PIECE Xanh lá 《C》×２; shuffle trash + top 5 khớp. |
| WXDi-CP02-004 | Gehenna Prefect Team | OK | PIECE Đen 《C》×２; 3 FAQ giữ nguyên typo "thier". |
| WXDi-CP02-005 | General Student Council | OK | PIECE Không màu 《C》×０; FAQ "start a relationship" khớp. |
| WXDi-CP02-006 | Kronos School of Journalism | OK | PIECE Không màu; draw 2/discard 2 + relationship; FAQ khớp typo "have start". |
| WXDi-CP02-007 | Shirasu Azusa [intulit mortem] | OK | LRIG Trắng L3 Limit 6 grow 《W》×２; 3 ability + 2 FAQ; biến thể LRP/LR/UR. |
| WXDi-CP02-008 | Mikamo Neru [You Got a Death Wish or Somethin'?] | OK | LRIG Xanh dương L3 Limit 6 grow 《U》×２; 2 FAQ khớp. |
| WXDi-CP02-009 | Sunaookami Shiroko [Drone Support] | OK | LRIG Xanh lá L3 L6 grow 《G》×２; 2 FAQ khớp verbatim; biến thể LRP/LR/UR. |
| WXDi-CP02-010 | Sorasaki Hina [Denouement: Ishbosheth] | OK | LRIG Đen L3 L6 grow 《B》×２; 5 FAQ khớp verbatim. |
| WXDi-CP02-011 | Shirasu Azusa | OK | LRIG Trắng L0 L0 grow 《W》×０; không text/FAQ; biến thể LC(P). |
| WXDi-CP02-012 | Shirasu Azusa [Kick 'em While They're Down] | OK | LRIG Trắng L1 L2 grow 《W》×０; biến thể LR. |
| WXDi-CP02-013 | Shirasu Azusa [sagitta mortis] | OK | LRIG Trắng L2 L5 grow 《W》×１; biến thể LR. |
| WXDi-CP02-014 | Mikamo Neru | OK | LRIG Xanh dương L0 L0 grow 《U》×０; biến thể LC(P). |
| WXDi-CP02-015 | Mikamo Neru [Enhanced Rage] | OK | LRIG Xanh dương L1 L2 grow 《U》×０; biến thể LR. |
| WXDi-CP02-016 | Mikamo Neru [Cruisin' for a Bruisin'!] | OK | LRIG Xanh dương L2 L5 grow 《U》×１; biến thể LR. |
| WXDi-CP02-017 | Sunaookami Shiroko | OK | LRIG Xanh lá L0 L0 grow 《G》×０; biến thể LC(P). |
| WXDi-CP02-018 | Sunaookami Shiroko [Very Rapid Fire] | OK | LRIG Xanh lá L1 L2 grow 《G》×０; biến thể LR. |
| WXDi-CP02-019 | Sunaookami Shiroko [Grenade Lob] | OK | LRIG Xanh lá L2 L5 grow 《G》×１; biến thể LR. |
| WXDi-CP02-020 | Sorasaki Hina | OK | LRIG Đen L0 L0 grow 《B》×０; biến thể LC(P). |
| WXDi-CP02-021 | Sorasaki Hina [Out-and-Out] | OK | LRIG Đen L1 L2 grow 《B》×０; biến thể LR. |
| WXDi-CP02-022 | Sorasaki Hina [Lock & Load] | OK | LRIG Đen L2 L5 grow 《B》×１; biến thể LR. |
| WXDi-CP02-023 | Make-Up Work Club | OK | LRIG Trắng L0 L0 grow 《W》×０; class Make-Up Work Club; biến thể LC(P). |
| WXDi-CP02-024 | Urawa Hanako | OK | ASSIST LRIG Trắng L1 L0 grow 《C》×０; Use timing Main Phase đúng; [Enter] return L2 trở xuống. |
| WXDi-CP02-025 | Ajitani Hifumi | OK | ASSIST LRIG Trắng L1 L0 grow 《C》×０; Use timing Main Phase; 1 FAQ; biến thể LC(P). |
| WXDi-CP02-026 | Urawa Hanako [Want to Break the Rules?] | OK | ASSIST LRIG Trắng L2 Limit ＋１ (giữ verbatim) grow 《C》×０; 2 FAQ khớp. |
| WXDi-CP02-027 | Urawa Hanako (Swimsuit) | OK | ASSIST LRIG Trắng L2 ＋１ grow 《C》×２; Use timing Main Phase / Attack Phase; 1 FAQ. |
| WXDi-CP02-028 | Ajitani Hifumi [Help Me, Peroro!] | OK | ASSIST LRIG L2 ＋１ grow 《C》×３; timing Main/Attack; FAQ giữ mục Relationship Enter lặp đôi. |
| WXDi-CP02-029 | Ajitani Hifumi (Swimsuit) | OK | ASSIST LRIG L2 ＋１ grow 《C》×０; timing Main Phase; 2 FAQ. |
| WXDi-CP02-030 | C＆C | OK | LRIG Xanh dương L0 L0 grow 《U》×０; class C＆C; biến thể LC(P). |
| WXDi-CP02-031 | Ichinose Asuna | OK | ASSIST LRIG Xanh dương L1 L0 《C》×０; [Enter] draw 2; timing Main Phase. |
| WXDi-CP02-032 | Kakudate Karin | OK | ASSIST LRIG Xanh dương L1 L0 《C》×０; [Enter] bottom-deck L1 SIGNI. |
| WXDi-CP02-033 | Ichinose Asuna [On My Way!] | OK | ASSIST LRIG Xanh dương L2 ＋１ grow 《C》×１; timing Main/Attack; 2 FAQ. |
| WXDi-CP02-034 | Ichinose Asuna (Bunny) | OK | ASSIST LRIG L2 ＋１ 《C》×０; timing Main Phase; 2 FAQ khớp typo nguồn. |
| WXDi-CP02-035 | Kakudate Karin [Target Removal] | OK | ASSIST LRIG L2 ＋１ 《C》×３; timing Main/Attack; 1 FAQ. |
| WXDi-CP02-036 | Kakudate Karin (Bunny) | OK | ASSIST LRIG L2 ＋１ 《C》×０; 6 cost colorless; 2 FAQ. |
| WXDi-CP02-037 | Foreclosure Task Force | OK | LRIG Xanh lá L0 L0 《G》×０; class Foreclosure Task Force; biến thể LC(P). |
| WXDi-CP02-038 | Okusora Ayane | OK | ASSIST LRIG Xanh lá L1 L0 《C》×０; [Enter] Ener Charge 2. |
| WXDi-CP02-039 | Izayoi Nonomi | OK | ASSIST LRIG Xanh lá L1 L0 《C》×０; [Enter] vanish power ≥7000. |
| WXDi-CP02-040 | Okusora Ayane [Special Delivery: Combat Supplies] | OK | ASSIST LRIG L2 ＋１ 《C》×２; timing Main/Attack; 1 FAQ. |
| WXDi-CP02-041 | Okusora Ayane (Swimsuit) | OK | ASSIST LRIG Xanh lá L2 ＋１ 《C》×０; Water Cloud Craft; 2 FAQ. |
| WXDi-CP02-042 | Izayoi Nonomi [Punishment Time!] | OK | ASSIST LRIG L2 ＋１ 《C》×０; [Enter] {Colorless} vanish L3+; 1 FAQ. |
| WXDi-CP02-043 | Izayoi Nonomi (Swimsuit) | OK | ASSIST LRIG L2 ＋１ 《C》×２; timing Main/Attack; 2 FAQ. |
| WXDi-CP02-044 | Prefect Team | OK | LRIG Đen L0 L0 《B》×０; class Prefect Team; biến thể LC(P). |
| WXDi-CP02-045 | Shiromi Iori | OK | ASSIST LRIG Đen L1 L0 《C》×０; [Enter] -8000. |
| WXDi-CP02-046 | Hinomiya Chinatsu | OK | ASSIST LRIG Đen L1 L0 《C》×０; mill 2 + hồi 2 cùng class; 1 FAQ. |
| WXDi-CP02-047 | Shiromi Iori [Major Roundup] | OK | ASSIST LRIG L2 ＋１ 《C》×０; lặp 3 lần; 2 FAQ. |
| WXDi-CP02-048 | Shiromi Iori (Swimsuit) | OK | ASSIST LRIG L2 ＋１ 《C》×０; timing Main/Attack; -8000 + auto -5000. |
| WXDi-CP02-049 | Hinomiya Chinatsu [Tactical First Aid] | OK | ASSIST LRIG Đen L2 ＋１ 《C》×１; timing Main/Attack; 1 FAQ. |
| WXDi-CP02-050 | Hinomiya Chinatsu (Hot Spring) | OK | ASSIST LRIG L2 ＋１ 《C》×０; 2 FAQ. |
| WXDi-CP02-051 | Utazumi Sakurako | OK | SIGNI Trắng L3 10000 War Tone：Blue Archive; Life Burst Không; 2 FAQ. |
| WXDi-CP02-052 | Misono Mika | OK | SIGNI Trắng L3 10000; [Auto] ①② khớp; 3 FAQ. |
| WXDi-CP02-053 | Aomori Mine | OK | SIGNI Trắng L3 12000; Life Burst Có; 4 FAQ giữ nguyên câu hỏi ghi "Relationship Auto". |
| WXDi-CP02-054 | Tendou Aris | OK | SIGNI Xanh dương L3 10000; 3 FAQ. |
| WXDi-CP02-055 | Nekozuka Hibiki | OK | SIGNI Xanh dương L3 12000; 2 FAQ. |
| WXDi-CP02-056 | Hayase Yuuka | OK | SIGNI Xanh dương L3 12000; Life Burst Có; 4 FAQ (câu cuối ghi "Relationship Auto" theo nguồn). |
| WXDi-CP02-057 | Kuda Izuna | OK | SIGNI Xanh lá L3 10000; Life Burst Không; 1 FAQ (nguồn ghi Relationship Auto). |
| WXDi-CP02-058 | Takanashi Hoshino | OK | SIGNI Xanh lá L3 12000; Life Burst Không; 2 FAQ. |
| WXDi-CP02-059 | Kosaka Wakamo | OK | SIGNI Xanh lá L3 10000; Life Burst Có chọn ①②; 1 FAQ. |
| WXDi-CP02-060 | Rikuhachima Aru | OK | SIGNI Đen L3 12000; [Relationship Constant] Shadow L2-; 4 FAQ. |
| WXDi-CP02-061 | Natsume Iroha | OK | SIGNI Đen L3 10000; Life Burst Có; 4 FAQ. |
| WXDi-CP02-062 | Kurodate Haruna | OK | SIGNI Đen L3 10000; Life Burst Không; 1 FAQ. |
| WXDi-CP02-063 | Shimoe Koharu | OK | SIGNI Trắng L1 3000 R,R(P); 2 FAQ; biến thể R(P). |
| WXDi-CP02-064 | Morizuki Suzumi | OK | SIGNI Trắng L1 2000 C,C(P); Life Burst Có; 2 FAQ; biến thể C(P). |
| WXDi-CP02-065 | Sumi Serina | OK | SIGNI Trắng L1 3000 R,R(P); Life Burst Có; 2 FAQ; biến thể R(P). |
| WXDi-CP02-066 | Shizuyama Mashiro | OK | SIGNI Trắng L1 3000 C,C(P); Life Burst Không; 1 FAQ. |
| WXDi-CP02-067 | Iochi Mari | OK | SIGNI Trắng L1 3000; Shadow Level one; 2 FAQ. |
| WXDi-CP02-068 | Kozeki Ui | OK | SIGNI Trắng L2 5000; 4 FAQ dài khớp verbatim. |
| WXDi-CP02-069 | Kyoyama Kazusa | OK | SIGNI Trắng L2 8000 R,R(P); 1 FAQ. |
| WXDi-CP02-070 | Kirifuji Nagisa | OK | SIGNI Trắng L2 8000; Life Burst Có; 2 FAQ. |
| WXDi-CP02-071 | Hanekawa Hasumi | OK | SIGNI Trắng L2 8000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-072 | Kenzaki Tsurugi | OK | SIGNI Trắng L3 12000; Life Burst Có chọn ①②; 2 FAQ. |
| WXDi-CP02-073 | Murokasa Akane | OK | SIGNI Xanh dương L1 3000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-074 | Otose Kotama | OK | SIGNI Xanh dương L1 2000; 2 FAQ. |
| WXDi-CP02-075 | Kurosaki Koyuki | OK | SIGNI Xanh dương L1 2000; 2 FAQ. |
| WXDi-CP02-076 | Kagami Chihiro | OK | SIGNI Xanh dương L1 2000 R,R(P); rule-based line khớp; 2 FAQ. |
| WXDi-CP02-077 | Hanaoka Yuzu | OK | SIGNI Xanh dương L1 3000 R,R(P); Life Burst Có; 2 FAQ. |
| WXDi-CP02-078 | Asuma Toki | OK | SIGNI Xanh dương L2 5000; 2 FAQ. |
| WXDi-CP02-079 | Akeboshi Himari | OK | SIGNI Xanh dương L2 8000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-080 | Saiba Momoi | OK | SIGNI Xanh dương L2 8000; Life Burst Có chọn ①②; 2 FAQ. |
| WXDi-CP02-081 | Saiba Midori | OK | SIGNI Xanh dương L2 5000 R,R(P); chọn ①②; 1 FAQ. |
| WXDi-CP02-082 | Ushio Noa | OK | SIGNI Xanh dương L3 10000; Life Burst Có; 2 FAQ. |
| WXDi-CP02-083 | Isami Kaede | OK | SIGNI Xanh lá L1 3000; Life Burst Có; Shadow power ≤8000; 2 FAQ. |
| WXDi-CP02-084 | Ono Tsukuyo | OK | SIGNI Xanh lá L1 3000 R,R(P); 1 FAQ. |
| WXDi-CP02-085 | Asahina Pina | OK | SIGNI Xanh lá L1 2000; 2 FAQ. |
| WXDi-CP02-086 | Chidori Michiru | OK | SIGNI Xanh lá L1 2000; 2 FAQ. |
| WXDi-CP02-087 | Mizuha Mimori | OK | SIGNI Xanh lá L1 2000; Life Burst Có; 2 FAQ. |
| WXDi-CP02-088 | Kawawa Shizuko | OK | SIGNI Xanh lá L2 8000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-089 | Kuromi Serika | OK | SIGNI Xanh lá L2 5000 R,R(P); 2 FAQ. |
| WXDi-CP02-090 | Waraku Chise | OK | SIGNI Xanh lá L2 5000; 1 FAQ. |
| WXDi-CP02-091 | Kasuga Tsubaki | OK | SIGNI Xanh lá L2 8000; Life Burst Có; Shadow power ≤8000; 2 FAQ. |
| WXDi-CP02-092 | Kuwakami Kaho | OK | SIGNI Xanh lá L3 12000; Life Burst Có; [Relationship Enter] S Lancer; 2 FAQ. |
| WXDi-CP02-093 | Shishidou Izumi | OK | SIGNI Đen L1 2000; 2 FAQ. |
| WXDi-CP02-094 | Onikata Kayoko | OK | SIGNI Đen L1 2000; rule-based line khớp; 1 FAQ. |
| WXDi-CP02-095 | Ushimaki Juri | OK | SIGNI Đen L1 3000; 2 FAQ. |
| WXDi-CP02-096 | Himuro Sena | OK | SIGNI Đen L1 3000 R,R(P); Life Burst Có; 2 FAQ. |
| WXDi-CP02-097 | Igusa Haruka | OK | SIGNI Đen L1 2000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-098 | Wanibuchi Akari | OK | SIGNI Đen L2 5000; rule-based line khớp; 1 FAQ. |
| WXDi-CP02-099 | Akashi Junko | OK | SIGNI Đen L2 8000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-100 | Aikiyo Fuuka | OK | SIGNI Đen L2 8000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-101 | Asagi Mutsuki | OK | SIGNI Đen L2 5000 R,R(P); 2 FAQ. |
| WXDi-CP02-102 | Amau Ako | OK | SIGNI Đen L3 10000; Life Burst Có; 1 FAQ. |
| WXDi-CP02-103 | Activating the Story | OK | SPELL Không màu 《C》×１; Life Burst Có; [Constant] Blue Archive; 2 FAQ. |
| WXDi-CP02-104 | Servant ♯ | OK | SIGNI Không màu L1 1000 Primal Tone; Guard timing; Multi Ener; Life Burst Có; không FAQ. |
| WXDi-CP02-SP01 | Shirasu Azusa | OK | LRIG Trắng L0 L0 grow 《W》×０; SP; ảnh biến thể SP. |
| WXDi-CP02-SP02 | Mikamo Neru | OK | LRIG Xanh dương L0 grow 《U》×０; SP; ảnh biến thể SP. |
| WXDi-CP02-SP03 | Sunaookami Shiroko | OK | LRIG Xanh lá L0 grow 《G》×０; SP; ảnh biến thể SP. |
| WXDi-CP02-SP04 | Sorasaki Hina | OK | LRIG Đen L0 grow 《B》×０; SP; ảnh biến thể SP. |
| WXDi-CP02-TK01A | Peroro plush | OK | SIGNI CRAFT Trắng L2 10000; 3 FAQ dài khớp verbatim; ảnh biến thể TK. |
| WXDi-CP02-TK01B | 【SIGNI Barrier】 | OK | Loại thẻ —, ngoài deck; text barrier khớp; không FAQ. |
| WXDi-CP02-TK02A | Water Cloud | OK | SIGNI CRAFT Xanh lá L2 10000; 3 FAQ (giữ typo "Claft", ký tự ﬁ) khớp. |
| WXDi-CP02-TK02B | {1/Game} Already Used | OK | Loại thẻ —, ngoài deck; không text/FAQ; ảnh biến thể TK. |
| WXDi-CP02-TK03A | Toramaru | OK | SIGNI CRAFT Đen L3 15000; 1 FAQ; ảnh biến thể TK. |
| WXDi-CP02-TK03B | Crusadie | OK | SIGNI CRAFT Trắng L3 15000; 2 FAQ (nguồn nhắc 《Water Cloud》) khớp. |

CP02 hoàn tất: đã đọc đối chiếu toàn bộ 114 lá (001–104, SP01–SP04, TK01A/B, TK02A/B, TK03A/B) với Card List và FAQ chính thức. Không phát hiện lệch dữ liệu; FAQ dài được giữ nguyên văn cả các lỗi chính tả nguồn (thier, have start, Claft, Releationship). Đối soát sổ sách: bộ đếm tổng đã sửa về đúng 1.863 lá đã đọc.
