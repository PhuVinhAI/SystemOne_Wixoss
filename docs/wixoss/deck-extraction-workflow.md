# Quy trình trích xuất và tài liệu hóa một deck WIXOSS

Tài liệu này là quy trình lặp lại cho các deck khác trong English Edition. Mục tiêu là tạo một thư mục deck có danh sách chính xác, hồ sơ riêng cho từng mã lá, ảnh thẻ tải về và dữ liệu máy đọc được.

## 1. Xác định sản phẩm

1. Mở trang sản phẩm tiếng Anh của deck, ví dụ [D01](https://www.takaratomy.co.jp/products/en.wixoss/product/d01/).
2. Ghi tên deck, mã sản phẩm, ngày phát hành, số lá trong hộp, team và vai trò Center/Assist nếu trang sản phẩm nêu.
3. Lưu các ảnh giới thiệu deck nếu chúng giải thích đội hình hoặc chiến lược. Không dùng ảnh quảng cáo làm nguồn duy nhất cho text lá.
4. Xác nhận mã tiếng Anh theo format `WXDi-D01[EN]`, rồi dùng mã này xuyên suốt thư mục.

## 2. Lấy danh sách lá từ Card List chính thức

Trang Card List hiển thị bằng Vue nhưng dữ liệu đến từ endpoint JSON.

```text
GET https://www.takaratomy.co.jp/products/en.wixoss/card/itemsearch.php?p=0&ord=asc&sor=card_no&pt=D01
```

Thay `D01` bằng mã `product_type` của deck. Endpoint trả `items` và `count`. Kiểm tra các điều kiện sau.

- `count` bằng số item đã nhận.
- Mã lá liên tục và thuộc đúng prefix sản phẩm.
- Mỗi item có `card_no`, `name`, `color`, `card_type`, `rarity`, `level`, `limits`, `cost`, `grow_cost`, `power`, `content`, `power_text`, `artist`.
- Không tự dịch hoặc tự sửa `content` và `power_text`. Đây là text nguồn để đưa vào hồ sơ.
- Nếu tên trên Card List khác ảnh in, giữ mã làm định danh, ghi tên ảnh in trong ghi chú đối chiếu.

Ví dụ kiểm tra nhanh bằng Python.

```python
import requests

url = "https://www.takaratomy.co.jp/products/en.wixoss/card/itemsearch.php"
payload = requests.get(url, params={"p": 0, "ord": "asc", "sor": "card_no", "pt": "D01"}, timeout=20).json()
assert len(payload["items"]) == int(payload["count"])
assert all(item["card_no"].startswith("WXDi-D01-") for item in payload["items"])
```

## 3. Xác định số bản trong deck

Danh sách Card List cung cấp mã và thông tin lá, nhưng cần nguồn deck list để biết số bản. Ưu tiên theo thứ tự sau.

1. Card List hoặc trang sản phẩm chính thức có cột `Qty`.
2. Card List tiếng Nhật của cùng mã sản phẩm nếu English Edition không hiện Qty.
3. Một nguồn cộng đồng chỉ dùng để đối chiếu, không thay thế nguồn chính thức.

Với D01, deck list được đối chiếu từ danh sách deck cộng đồng có mã sản phẩm. Kết quả phải là 11 lá LRIG Deck một bản mỗi lá và 10 tên Main Deck bốn bản mỗi tên, tổng 51 lá. Ghi nguồn đối chiếu ở `README.md` của deck.

## 4. Lấy FAQ riêng cho từng lá

Với mỗi mã, gọi endpoint FAQ.

```text
GET https://www.takaratomy.co.jp/products/en.wixoss/card/faq.php?card_no=WXDi-D01-011%5BEN%5D
```

Lưu các cặp `que` và `ans` vào hồ sơ lá. FAQ không phải card text mới. Đặt chúng trong mục `FAQ chính thức` và dùng để mô tả cách xử lý engine ở các ca biên.

Các FAQ cần đánh dấu riêng khi mâu thuẫn với Glossary tổng quát hoặc dùng cách diễn đạt cũ. Ví dụ D01 Servant ♯ có FAQ hỏi ngưỡng số bản khác giới hạn Main Deck chung. Ghi cả câu hỏi lẫn cách dự án chọn áp dụng, không âm thầm sửa nguồn.

## 5. Tải ảnh thẻ

Trước khi tải ảnh, lấy bảng rarity để biết hậu tố ảnh.

```text
GET https://www.takaratomy.co.jp/products/en.wixoss/card/master.php?m=rarity
```

Các hậu tố thường gặp gồm `ST`, `ST(P)`, `SCR` và `DiR`. Với `card_no = WXDi-D01-004[EN]`, tạo các URL tương ứng.

```text
https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/WXDi-D01-004[EN].jpg
https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/WXDi-D01-004S[EN].jpg
https://www.takaratomy.co.jp/products/en.wixoss/card/thumb/WXDi-D01-004D[EN].jpg
```

Lưu ảnh trong `images/` với tên ổn định như `WXDi-D01-004-EN.jpg`, `WXDi-D01-004S-EN.jpg` và `WXDi-D01-004D-EN.jpg`. Kiểm tra HTTP 200, MIME ảnh, định dạng JPEG và kích thước hợp lý. Ảnh biến thể không làm tăng số bản deck.

## 6. Tạo cấu trúc thư mục

```text
docs/wixoss/decks/<SET>-EN/
  README.md
  cards.json
  cards/
    <SET>-001.md
    <SET>-002.md
    ...
  images/
    <SET>-001-EN.jpg
    <SET>-001P-EN.jpg
```

`README.md` chứa identity, số lượng, team, cách vận hành và các ghi chú đối chiếu. `cards.json` chứa chỉ mục tối thiểu để import. Mỗi file trong `cards/` là hồ sơ độc lập.

## 7. Mẫu hồ sơ từng lá

Mỗi hồ sơ cần có các mục sau.

```markdown
# <Tên lá>

![<Tên lá>](../images/<Mã>-EN.jpg)

## Thông tin lá

| Trường | Giá trị |
| --- | --- |
| Mã in | <mã đầy đủ có [EN]> |
| Set | <mã set> |
| Loại thẻ | <LRIG / ASSIST LRIG / PIECE / SIGNI / SPELL> |
| Vị trí | <LRIG Deck / Main Deck> |
| Số bản | <số lượng> |
| Màu | <màu> |
| Level / Limit / Power | <giá trị theo loại> |
| LRIG type / Class | <giá trị> |
| Team / Master | <giá trị> |
| Cost / Grow cost | <giá trị> |
| Life Burst | <Có / Không> |

## Card text chính thức

<content và power_text, giữ nguyên tiếng Anh>

## FAQ chính thức

<câu hỏi và trả lời từ faq.php>

## Ghi chú đối chiếu

<khác biệt tên, ruling hoặc cách engine áp dụng>

## Ảnh biến thể

<các hậu tố rarity khác nếu có>

## Nguồn

<URL Card List, FAQ và ảnh>
```

## 8. Kiểm tra bắt buộc trước khi commit

```python
from pathlib import Path
import json

root = Path("docs/wixoss/decks/WXDi-D01-EN")
cards = json.loads((root / "cards.json").read_text(encoding="utf-8"))
assert len(cards) == expected_unique_cards
assert sum(card["count"] for card in cards) == expected_total_cards

for card in cards:
    assert (root / "cards" / f"{card['id']}.md").is_file()
    assert (root / "images" / f"{card['id']}-EN.jpg").is_file()
```

Sau đó kiểm tra bổ sung.

- `git diff --check` không có trailing whitespace.
- Không còn chuỗi `?` do lỗi decode. Dấu `?` trong câu hỏi tiếng Anh chính thức vẫn được giữ.
- Không có ký tự thay thế `�` trong Markdown.
- Mỗi ảnh trong Markdown tồn tại đúng đường dẫn tương đối.
- Mỗi hồ sơ có URL Card List/FAQ và ảnh nguồn.
- Tổng số bản trong `cards.json` khớp số lá trên trang sản phẩm.
- Các file dùng UTF-8. Không dùng pipeline PowerShell làm mất dấu tiếng Việt.

## 9. Quy tắc không được suy đoán

- Không dùng tên hoặc text từ ảnh làm dữ liệu duy nhất nếu Card List đã có API.
- Không tự suy ra số bản từ rarity hoặc số ảnh.
- Không biến FAQ thành card text.
- Không sửa lỗi chính tả trên ảnh vào mã định danh.
- Không thay một giá trị nguồn bị thiếu bằng số 0. Dùng `—` và ghi rõ không áp dụng.
- Nếu nguồn chính thức và nguồn cộng đồng khác nhau, giữ cả hai, chỉ ra nguồn được chọn và lý do.
