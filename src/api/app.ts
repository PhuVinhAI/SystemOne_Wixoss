import Fastify from "fastify";
import cors from "@fastify/cors";
import { loadD01 } from "../catalog/d01.js";
import { submitSchema } from "../domain/types.js";
import { DrexClient, model } from "../drex/client.js";
import { MatchInputError } from "../game/options.js";
import { GameSession } from "../game/session.js";

export async function buildApp() {
  const app = Fastify({ logger: true, bodyLimit: 8192 });
  const deck = await loadD01();
  const drex = DrexClient.fromEnvironment();
  const origin = process.env["WIXOSS_UI_ORIGIN"];
  if (origin) await app.register(cors, { origin });
  const sessions = new Map<string, GameSession>();

  app.get("/health", async () => ({ ok: true, model }));
  app.get("/catalog/d01", async () => ({ deckId: deck.id, cards: deck.cards }));
  app.post("/matches", async (_request, reply) => {
    const session = new GameSession(deck, drex);
    sessions.set(session.id, session);
    const result = await session.advance();
    return reply.code(result.board.status === "halted" ? 503 : 201).send(result);
  });
  app.get<{ Params: { id: string } }>("/matches/:id", async (request, reply) => {
    const session = sessions.get(request.params.id);
    return session?.present() ?? reply.code(404).send({ error: "match_not_found" });
  });
  app.post<{ Params: { id: string } }>("/matches/:id/actions", async (request, reply) => {
    const session = sessions.get(request.params.id);
    if (!session) return reply.code(404).send({ error: "match_not_found" });
    const parsed = submitSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: "invalid_action", issues: parsed.error.issues });
    try {
      const result = await session.advance(parsed.data);
      return reply.code(result.board.status === "halted" ? 503 : 200).send(result);
    } catch (error) {
      if (error instanceof MatchInputError) return reply.code(409).send({ error: error.message });
      throw error;
    }
  });
  return app;
}
