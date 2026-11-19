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
| `src/drex` | Drex chọn thao tác, đối tượng và giá trị bằng các lần gọi `choice` nối tiếp. Drex kiểm tra cả tổ hợp lá người chơi chọn và thao tác bàn đề xuất trước khi ghi. Drex chơi B bằng góc nhìn riêng. |
| `src/api` và `scripts` | Fastify và terminal dùng cùng phiên đấu. Sau quyết định của A, phiên đấu chạy tiếp đến cửa sổ nhập kế tiếp, kết quả thắng hoặc trạng thái dừng. |

Khi Drex báo dừng, lỗi hoặc không xác nhận thao tác, phiên giữ nguyên bàn tại thao tác đã ghi cuối cùng và chuyển sang `halted`. Chi tiết quyết định và request ID nằm trong log cục bộ. Thêm lá bằng hồ sơ in trong catalog. Những cơ chế đòi hỏi thao tác vật lý mới cần được thêm vào giao thức dùng chung.

### API cho UI

- `GET /health` trả trạng thái tiến trình và model được cấu hình.
- `GET /catalog/d01` trả định nghĩa lá.
- `POST /matches` mở phiên và chạy Drex đến cửa sổ nhập của A hoặc điểm dừng.
- `GET /matches/:id` trả bàn theo góc nhìn A, lựa chọn hiện tại và thông báo công khai gần nhất.
- `POST /matches/:id/actions` nhận `revision`, `intent` và tùy thao tác có `card`, `cards` hoặc `zone`. Dùng revision sau cùng từ API. Gửi thao tác quá hạn hoặc đồng thời trả `409`.

API lưu phiên trong bộ nhớ của tiến trình. Runner terminal lưu log JSONL trong `logs/`, gồm dữ liệu ẩn để chẩn đoán cục bộ. Chỉ snapshot đã che bài được trả qua HTTP.

### Phạm vi kiểm chứng

Đã kiểm tra TypeScript, route health/catalog và việc che bài. Các ca riêng qua API thật đã xác nhận setup tới cửa sổ mulligan, Polygenesis trả đúng một lá, Tobiel mở lựa chọn mục tiêu trước battle, Life Burst của Sen no Rikyu, chuyển lá khi Guard, Refresh, kết quả damage tại 0 Life Cloth và lựa chọn SIGNI cho Harmonic Call. D01 chưa qua kiểm chứng tích hợp từ setup đến thắng/thua. Ca mulligan đổi 2 lá gặp lỗi đóng frame trước khi hoàn tất setup. [Ca nghiệm thu](docs/wixoss/07-acceptance-cases.md)
