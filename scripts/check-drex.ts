import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { choice, NaceClient, noul, score } from "nace-sdk";

const model = "drex-max-v1.1";

async function main() {
  if (existsSync(".env")) {
    loadEnvFile(".env");
  }

  const apiKey = process.env.NACE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Thiếu NACE_API_KEY. Điền key vào .env hoặc đặt biến môi trường trước khi chạy.");
  }

  const client = new NaceClient({
    apiKey,
    baseURL: "https://console.nace.ai",
    logLevel: "off",
    retry: { maxRetries: 0 },
  });

  const result = await client.systemOne({
    model,
    state: {
      message: "Tôi bấm tải biên lai thì ứng dụng báo lỗi. Tôi chỉ cần tải được biên lai.",
    },
    questions: {
      requests_refund: noul("Tin nhắn có nêu rõ yêu cầu hoàn tiền không?", {
        true: "Người gửi yêu cầu trả lại số tiền đã thanh toán.",
        false: "Người gửi không yêu cầu trả lại tiền.",
      }),
      category: choice("Vấn đề chính được mô tả trong tin nhắn là gì?", {
        technical: "Lỗi ứng dụng hoặc chức năng không hoạt động.",
        billing: "Tranh chấp về số tiền, khoản thu hoặc hoàn tiền.",
        other: "Vấn đề khác hoặc thông tin chưa đủ để chọn nhãn.",
      }),
      urgency: score("Tin nhắn nêu mức độ khẩn cấp nào?", [
        "Không nêu thời hạn hay hậu quả cần xử lý gấp.",
        "Nêu thời hạn gần hoặc việc quan trọng đang bị chặn.",
        "Nêu hậu quả nghiêm trọng đang xảy ra và cần xử lý ngay.",
      ]),
    },
  });

  console.log(JSON.stringify({
    model: result.model,
    request_id: result.request_id,
    evaluation_time_ms: result.evaluation_time_ms,
    usage: result.usage,
    answers: result.answers,
  }, null, 2));

  assert.equal(result.model, model, "Nace đã trả kết quả từ một model khác");
  assert.ok(result.answers.requests_refund.noul < 0.5, "Drex đã nhận nhầm yêu cầu hoàn tiền");
  assert.equal(result.answers.category.choice, "technical", "Drex đã chọn sai nhóm");
  const urgency = result.answers.urgency.probabilities;
  assert.ok(urgency["0"] > Math.max(urgency["1"], urgency["2"]), "Drex đã chọn sai mức độ khẩn cấp");
  console.log("Drex MAX 1.1 đã vượt qua bài kiểm tra với API thật.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Không chạy được bài kiểm tra Drex.");
  process.exitCode = 1;
});
