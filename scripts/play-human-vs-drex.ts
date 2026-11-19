import { appendFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { loadD01 } from "../src/catalog/d01.js";
import { DrexClient } from "../src/drex/client.js";
import { GameSession, type MatchUpdate } from "../src/game/session.js";
import { submitSchema } from "../src/domain/types.js";

const session = new GameSession(await loadD01(), DrexClient.fromEnvironment());
await mkdir("logs", { recursive: true });
const log = resolve("logs", session.id + ".jsonl");
let written = 0;
async function save() {
  const replay = session.replay(written);
  const entries = replay.log;
  const header = replay.initial ? JSON.stringify({
    matchId: replay.matchId, deckId: replay.deckId, model: replay.model,
    promptVersion: replay.promptVersion, initial: replay.initial,
  }) + "\n" : "";
  await appendFile(log, header + entries.map((entry) => JSON.stringify(entry) + "\n").join("")
    + JSON.stringify({ snapshot: replay.state }) + "\n", "utf8");
  written += entries.length;
}
function report(update: MatchUpdate) {
  for (const event of update.last) console.log(event);
}
function display(update: MatchUpdate) {
  console.log(JSON.stringify({ board: update.board, prompt: update.prompt }, null, 2));
}

console.log(`Trận ${session.id} | A do người chơi điều khiển, B do Drex điều khiển. Log: ${log}`);
let update = await session.advance(undefined, report);
await save();
display(update);
const terminal = createInterface({ input: process.stdin, output: process.stdout, terminal: false });
for await (const line of terminal) {
  if (update.board.status !== "active") break;
  const [command, ...args] = line.trim().split(/\s+/);
  if (!command) continue;
  try {
    const [card, zone] = args;
    const group = ["mulligan", "retire", "choose"].includes(command);
    const input = submitSchema.parse({ revision: update.board.revision, intent: command,
      ...(group ? { cards: args } : { card: card === "-" ? undefined : card, zone }),
    });
    update = await session.advance(input, report);
    await save();
    display(update);
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Lựa chọn không hợp lệ.");
    await save();
  }
  if (update.board.status !== "active") break;
}
terminal.close();
if (update.board.status === "halted") process.exitCode = 1;
