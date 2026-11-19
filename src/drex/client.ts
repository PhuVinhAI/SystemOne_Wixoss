import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { APIError, choice, NaceClient, type Usage } from "nace-sdk";
import type { Choices } from "../game/options.js";

export const model = "drex-max-v1.1";

export type Decision = {
  question: string;
  requestId: string;
  label: string;
  confidence: number;
  probabilities: Record<string, number>;
  timeMs: number;
  usage: Usage;
};

export class DrexFailure extends Error {
  constructor(message: string, readonly requestId?: string) {
    super(message);
  }
}

export class DrexClient {
  constructor(private readonly client: NaceClient) {}

  static fromEnvironment() {
    if (existsSync(".env")) loadEnvFile(".env");
    const apiKey = process.env["NACE_API_KEY"]?.trim() || process.env["DREX_API_KEY"]?.trim();
    if (!apiKey) throw new Error("Thiếu NACE_API_KEY.");
    return new DrexClient(new NaceClient({
      apiKey, baseURL: "https://console.nace.ai", logLevel: "off",
      retry: { maxRetries: 0 }, timeout: 70_000,
    }));
  }

  async decide(context: string, question: string, options: Choices): Promise<Decision> {
    return (await this.decideBatch(context, { next: { question, choices: options } }))["next"]!;
  }

  async decideBatch(context: string, batch: Record<string, { question: string; choices: Choices }>): Promise<Record<string, Decision>> {
    const questions = Object.fromEntries(Object.entries(batch).map(([id, { question, choices }]) => {
      if (!Object.keys(choices).length) throw new DrexFailure("Operation has no usable choices.");
      return [id, choice(question, { ...choices, halt: "The requested step cannot be resolved using these choices and the evidence." })] as const;
    }));
    try {
      const result = await this.client.systemOne({ model, state: context, questions });
      return Object.fromEntries(Object.entries(questions).map(([id, question]) => {
        const answer = result.answers[id];
        if (result.model !== model || answer?.type !== "choice" || !Object.hasOwn(question.criteria, answer.choice)) {
          throw new DrexFailure("Drex returned an unusable decision.", result.request_id);
        }
        return [id, {
          question: batch[id]!.question, requestId: result.request_id, label: answer.choice, confidence: answer.confidence,
          probabilities: answer.probabilities, timeMs: result.evaluation_time_ms, usage: result.usage,
        }];
      }));
    } catch (error) {
      if (error instanceof APIError) throw new DrexFailure(`Drex API HTTP ${error.status}`, error.requestId ?? undefined);
      throw error;
    }
  }
}
