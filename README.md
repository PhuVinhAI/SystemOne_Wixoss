# SystemOne WIXOSS

Bàn chơi WIXOSS bằng TypeScript dùng Drex MAX 1.1 để điều khiển thao tác của bàn và chơi phía B. Người chơi điều khiển phía A. D01 Ancient Surprise lấy số lượng, thuộc tính, text và FAQ từ catalog có sẵn. [Luật và dữ liệu WIXOSS](docs/wixoss/README.md)

## Chạy dự án

Cần Node.js 22 trở lên. Chạy `npm ci` rồi khai báo `NACE_API_KEY` trong biến môi trường hoặc trong file `.env`. API tính phí theo input của mỗi lần gọi thành công. [Nace Console](https://console.nace.ai/dashboard/api-keys) · [Giá](https://console.nace.ai/docs/drex/reference/pricing)

- `npm run check` kiểm tra TypeScript.
- `npm run start` chạy Fastify tại `127.0.0.1:3000`. Có thể đặt `PORT` và `WIXOSS_UI_ORIGIN` nếu frontend chạy ở origin riêng.
- `npm run play` mở bàn D01, sau đó chờ người chơi nhập từng quyết định của A. Ví dụ: `mulligan A12 A19`, `play A12 signiLeft`, `choose A9 A23`, `pass`. Dùng các ID và lựa chọn từ bàn hiện tại. `npm run test:wixoss` gọi cùng runner live.

### Ranh giới vận hành

| Phần | Trách nhiệm |
| --- | --- |
| `src/catalog` | Đọc danh sách deck, thuộc tính in, card text, FAQ và các chương luật. Nội dung hiệu ứng được chuyển nguyên văn cho Drex. |
| `src/game` | Giữ bản thể lá, chồng bài, quyền xem, lượt, giá trị và các frame đang xử lý. Thực hiện thao tác vật lý đã chọn, kiểm tra tham số và tính toàn vẹn của bàn. |
| `src/drex` | Drex đọc bàn, luật và text lá để chọn thao tác, đối tượng và giá trị bằng các lần gọi `choice` nối tiếp. Drex xét tổ hợp lá người chơi đã chọn và kiểm tra lại chính thao tác Drex chọn trước khi bàn áp dụng. Drex chơi B bằng góc nhìn riêng. |
| `src/api` và `scripts` | Fastify và terminal dùng cùng phiên đấu. Sau quyết định của A, phiên đấu chạy tiếp đến cửa sổ nhập kế tiếp, kết quả thắng hoặc trạng thái dừng. |

Khi Drex báo dừng, lỗi hoặc không xác nhận thao tác, phiên giữ nguyên bàn tại thao tác đã ghi cuối cùng và chuyển sang `halted`. Chi tiết quyết định và request ID nằm trong log cục bộ. Thêm lá bằng hồ sơ in trong catalog. Những cơ chế đòi hỏi thao tác vật lý mới cần được thêm vào giao thức dùng chung.

Prompt vai vận hành bàn và vai chơi B nằm trong [`src/drex/prompts.ts`](src/drex/prompts.ts). Yêu cầu gửi sang Drex đặt snapshot và tiến độ xử lý trước text lá và các đoạn luật liên quan. Các câu hỏi độc lập về từng ứng viên dùng chung một lần gọi. Các lựa chọn phụ thuộc kết quả trước vẫn gọi nối tiếp. Log ghi phiên bản prompt để đối chiếu từng lần chạy. [Nace Questions](https://console.nace.ai/docs/drex/guides/questions) · [Nace State](https://console.nace.ai/docs/drex/guides/state) · [Drex Max](https://console.nace.ai/docs/drex/guides/drex-max)

Khi sửa prompt, dùng [hướng dẫn viết prompt](.agents/skills/prompt-authoring/SKILL.md) để xác định dữ kiện, tiêu chí và ca kiểm chứng. Với `wixoss-table-v4`, Drex xác định Power hiệu lực từ dữ liệu bàn và text đang áp dụng. Khi dọn lá nguồn khỏi Check hoặc đóng frame, Drex kiểm tra riêng công việc còn lại trước khi xét thao tác vật lý.

### API cho UI

- `GET /health` trả trạng thái tiến trình và model được cấu hình.
- `GET /catalog/d01` trả định nghĩa lá.
- `POST /matches` mở phiên và chạy Drex đến cửa sổ nhập của A hoặc điểm dừng.
- `GET /matches/:id` trả bàn theo góc nhìn A, lựa chọn hiện tại và thông báo công khai gần nhất.
- `POST /matches/:id/actions` nhận `revision`, `intent` và tùy thao tác có `card`, `cards` hoặc `zone`. Dùng revision sau cùng từ API. Gửi thao tác quá hạn hoặc đồng thời trả `409`.

API lưu phiên trong bộ nhớ của tiến trình. Runner terminal lưu log JSONL trong `logs/`, gồm dữ liệu ẩn để chẩn đoán cục bộ. Chỉ snapshot đã che bài được trả qua HTTP.

### Phạm vi kiểm chứng

Với `wixoss-table-v2`, ca qua API thật bắt đầu sau khi A chọn đổi hai lá và B chọn giữ tay. Drex thực hiện trao đổi, đặt Life Cloth, mở cả sáu LRIG và vào Up. Mỗi bên có 5 lá trên tay, 28 lá Main Deck và 7 Life Cloth úp. Hai phiên bản đều hoàn tất ca này trong 63 lần gọi. Token đầu vào giảm từ 342.388 xuống 266.331.

Các ca riêng với `wixoss-table-v2` xác nhận Tobiel phải Down trước khi xử lý Auto và battle, damage đến người có 0 Life Cloth kết thúc trận, và Harmonic Call đề nghị đủ ứng viên SIGNI hợp lệ rồi xét giới hạn một lá mỗi level.

Các ca với `wixoss-table-v4` đã kiểm tra mở bàn tới mulligan, Retire hai SIGNI trong một thao tác, và battle trước Camelopar với hai hoặc ba Class trong Ener. Ca Harmonic Call bắt đầu sau bước xem bài trên sân đầy đã trả bài xuống đáy, cấp đủ ba khả năng, đưa PIECE ra khỏi trận và đóng frame. Phép thử đối chứng chặn dọn Harmonic Call khi còn một kết quả chưa áp dụng và cho dọn Polygenesis đã xử lý xong. Các ca này chưa bao phủ toàn bộ cách dùng D01 hay một ván từ setup đến thắng/thua. [Ca nghiệm thu](docs/wixoss/07-acceptance-cases.md)
