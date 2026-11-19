# System One với Nace Drex MAX 1.1

[Tài liệu game WIXOSS](docs/wixoss/README.md) mô tả luật, cấu trúc trận, hướng triển khai và các ca nghiệm thu.

## Chạy thử qua API thật

Cần Node.js 22 trở lên. Từ thư mục dự án, chạy các lệnh sau trong CMD.

```text
npm ci
if not exist .env copy .env.example .env
```

Nếu `.env` đã có, mở file hiện tại. Lấy key từ [Nace Console](https://console.nace.ai/dashboard/api-keys), rồi điền vào dòng `NACE_API_KEY=` trong `.env`. Git bỏ qua file này.

```text
npm run check
npm run test:drex
```

`check` kiểm tra kiểu TypeScript. `test:drex` dùng [SDK TypeScript chính thức của Nace](https://console.nace.ai/docs/developer-tools/typescript) để gửi một request thật lên `https://console.nace.ai/v1/systemone` với model `drex-max-v1.1`. Dữ liệu đầu vào là một tin nhắn tiếng Việt mẫu về lỗi tải biên lai. Lệnh in model thực tế, request ID, thời gian, token và câu trả lời trước khi kiểm tra kết quả mong đợi. Thiếu key hoặc thất bại thì lệnh thoát với mã lỗi. Nace tính phí input cho request thành công. [Pricing](https://console.nace.ai/docs/drex/reference/pricing)

## Các model trong API của Nace

| Model | API ID | Khi nào dùng |
| --- | --- | --- |
| Drex MAX 1.1 | `drex-max-v1.1` | Model chính của dự án. Nhận văn bản, JSON và ảnh. Ngân sách 262.144 token cho cả request. |
| Drex 2.0 | `drex-v2.0` | Lựa chọn cho dữ liệu chỉ có văn bản hoặc JSON. Giới hạn 131.072 token cho state và 262.144 token cho state cộng câu hỏi dài nhất. |
| Drex Max Finance | `drex-max-finance` | Biến thể văn bản và ảnh chuyên tài chính. |

`drex-latest` hiện trỏ tới `drex-max-v1.1`. Ví dụ và bài test dùng ID cố định để giữ nguyên phiên bản khi so sánh prompt. Danh sách khả dụng theo tài khoản xem qua `client.models.list()`. [Danh mục model của Nace](https://console.nace.ai/docs/drex/reference/models)

## Viết prompt System One

Gửi dữ liệu cần xem trong `state`. Đặt từng phán đoán vào một phần tử của `questions`, rồi định nghĩa tiêu chí bằng `instructions` và `criteria`. Dùng khóa có ý nghĩa vì kết quả trả về theo đúng khóa câu hỏi.

| Kiểu | Cách viết | Cách đọc |
| --- | --- | --- |
| `noul` | Một câu hỏi có/không với điều kiện quan sát được. | `noul` là xác suất câu trả lời có. |
| `choice` | Các nhãn có ranh giới rõ. Thêm nhãn thiếu dữ liệu nếu phù hợp. | Đọc nhãn được chọn và phân bố xác suất. Hai nhãn gần nhau có thể cần xem lại. |
| `score` | Mô tả các mức của một tiêu chí, theo thứ tự từ thấp đến cao. | `score` là điểm kỳ vọng. Cộng xác suất các mức phù hợp nếu cần đo xác suất vượt ngưỡng. |

Giữ nguyên cấu trúc `state` và model khi so sánh các bản prompt. Dùng bộ ví dụ có nhãn đúng, gồm ca thông thường, thiếu bằng chứng và sát ranh giới. Với MAX 1.1, gửi ảnh ở trường `images` và gọi theo thứ tự “Image 1”, “Image 2”. Khi cần model xem toàn bộ văn bản, tài liệu khuyến nghị state khoảng 8.000 token trở xuống vì state dài sẽ được chọn đoạn theo câu hỏi. [Questions](https://console.nace.ai/docs/drex/guides/questions) · [Reading answers](https://console.nace.ai/docs/drex/guides/reading-answers) · [Drex Max](https://console.nace.ai/docs/drex/guides/drex-max)

## Skill đã cài cho Codex

- `$ndi-console` dùng để thiết kế, đọc và gọi Drex. Bản dự án cập nhật ID model, API key, ảnh và cách viết câu hỏi. [Skill gốc của Nace](https://github.com/nace-ai/ndi-agent-skill/tree/89e0d76c9b4ff7c39d647606f1fb5d586fa61ab9/skills/ndi-console)
- `$promptfoo-evals` dùng để xây bộ kiểm thử prompt theo kỳ vọng đã gắn nhãn. Bản dự án bổ sung cách cấu hình Drex làm bộ chấm văn bản theo tài liệu Nace. [Skill gốc của Promptfoo](https://github.com/promptfoo/promptfoo/tree/0d4978bace531463ebf200800f396fab9db4c21a/plugins/promptfoo/skills/promptfoo-evals) · [Tích hợp Nace](https://console.nace.ai/docs/integrations/promptfoo)

Mở phiên Codex mới trong thư mục dự án để gọi các skill đã cài. Ví dụ gọi `$ndi-console` để rà câu hỏi và tiêu chí cho Drex MAX 1.1, rồi gọi `$promptfoo-evals` khi cần bộ ca đánh giá lặp lại.
