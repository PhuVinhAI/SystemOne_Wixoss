import { appendFile, mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { loadD01 } from "../src/catalog/d01.js";
import { DrexClient, model } from "../src/drex/client.js";
import { promptVersion } from "../src/drex/prompts.js";
import { GameSession, type MatchUpdate } from "../src/game/session.js";
import { submitSchema } from "../src/domain/types.js";

const deck = await loadD01();
const [mode, matchId, ...extraArgs] = process.argv.slice(2);
if (mode !== undefined && (mode !== "--resume" || !matchId || !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(matchId) || extraArgs.length)) {
  throw new Error("Cách tiếp tục: npm run play -- --resume <ID trận>.");
}
const saved = matchId ? await readSavedMatch(matchId) : undefined;
const session = new GameSession(deck, DrexClient.fromEnvironment(), saved);
await mkdir("logs", { recursive: true });
const log = resolve("logs", session.id + ".jsonl");
let written = saved?.log.length ?? 0;

async function readSavedMatch(id: string) {
  type Replay = ReturnType<GameSession["replay"]>;
  const lines = await readFile(resolve("logs", id + ".jsonl"), "utf8");
  const records = lines.trim().split(/\r?\n/).map((line) => JSON.parse(line)) as Array<
    Partial<Pick<Replay, "matchId" | "deckId" | "model" | "initial">> & { snapshot?: Replay["state"] } & Partial<Replay["log"][number]>
  >;
  const header = records[0];
  const state = records.at(-1)?.snapshot;
  const entries = records.filter((entry) => typeof entry.action === "string") as Replay["log"];
  if (!header?.initial || header.matchId !== id || header.initial.id !== id || header.deckId !== deck.id
    || header.model !== model || !state || state.id !== id || state.control !== "A" || state.status !== "active"
    || entries.at(-1)?.revision !== state.revision) {
    throw new Error("Chỉ tiếp tục ván của đúng deck và model ở snapshot đã lưu đang chờ A.");
  }
  return { initial: header.initial, state, log: entries };
}
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
if (saved) await appendFile(log, JSON.stringify({ resumedAt: saved.state.revision, promptVersion, snapshot: saved.state }) + "\n", "utf8");
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
