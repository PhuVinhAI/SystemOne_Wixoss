import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { NaceClient, choice, noul } from "nace-sdk";

const model = "drex-max-v1.1";
type Zone = "hand" | "signi_left" | "signi_center" | "signi_right" | "ener" | "trash";
type PlayerId = "A" | "B";
type CardRecord = { id: string; name: string; type: "SIGNI" | "SPELL"; level?: number; power?: number; class?: string; text: string; lifeBurst?: string };
type CardInstance = CardRecord & { instanceId: string; owner: PlayerId; zone: Zone; up: boolean; powerModifier: number; temporaryText: string[] };
type PlayerState = { hand: string[]; signi: Record<"left" | "center" | "right", string | null>; ener: string[]; trash: string[]; lifeCloth: number; mainDeckCount: number };
type GameState = {
  turnPlayer: PlayerId;
  phase: "Main" | "Attack" | "End";
  effectStatus: "resolving" | "complete";
  pendingAction: { type: "play_card"; player: PlayerId; cardInstanceId: string; requestedZone: "left" | "center" | "right" } | null;
  pendingEffect: string;
  players: Record<PlayerId, PlayerState>;
  cards: Record<string, CardInstance>;
  events: string[];
  lastDrexDecision?: string;
};

const cardCatalog: CardRecord[] = [
  { id: "WXDi-D01-014", name: "Zwei =Slow Loris=", type: "SIGNI", level: 2, power: 3000, class: "War Tone: Venom", text: "[Constant]: As long as there are three or more different classes among SIGNI in your Ener Zone, this SIGNI gets +5000 power. [Action] {1/Turn} {Green} {Green} {Colorless}: Another target SIGNI on your field with power 15000 or more gains Lancer until end of turn." },
  { id: "WXDi-D01-012", name: "Camelopar, Natural Planet", type: "SIGNI", level: 1, power: 3000, class: "Nature Tone: Cosmos", text: "[Constant]: As long as there are three or more different classes among SIGNI in your Ener Zone, this SIGNI gets +4000 power." },
  { id: "WXDi-D01-013", name: "Sen no Rikyu, Jade General", type: "SIGNI", level: 2, power: 10000, class: "Idol Tone: Brave", text: "[Life Burst] Ener Charge 3.", lifeBurst: "Ener Charge 3." },
];

const rules = {
  phase: "The turn is Up, Draw, Ener, Grow, Main, Attack, End. The current phase is authoritative for timing.",
  placement: "A SIGNI can be played only into an empty SIGNI zone, with level no greater than Center LRIG level and total levels no greater than effective Limit.",
  effects: "Read each card's supplied text literally. Resolve costs before targets. Resolve all parts of an effect in order. Continuous effects are active while their source is on the field. Do not invent text.",
  primitiveOperations: "The host can apply only the generic operations listed in the current question. Select the next operation, then select its arguments in later calls. The host does not know card-specific rules.",
  failure: "If an operation is not legal in the current state, do not select it. If no operation can continue the game, select halt_game.",
};

const operationDescriptions = {
  place_pending_card: "Move the pending card from its owner's hand into the requested empty SIGNI zone and begin resolving its card text.",
  apply_constant: "Apply a currently active Constant effect described by a card on the field.",
  resolve_enter: "Resolve an Enter effect on a card that just entered the field.",
  choose_target: "Choose a target required by the currently resolving card effect.",
  modify_power: "Apply a power change chosen by the current effect to a legal target.",
  draw_cards: "Draw the number of cards required by the current effect.",
  finish_effect: "Finish the current effect after every required part has resolved.",
  pass_priority: "No card effect or game operation is pending. Pass priority to the next player or step.",
  halt_game: "Stop because Drex cannot determine a legal continuation from the supplied rules and state.",
} as const;
type Operation = keyof typeof operationDescriptions;

function initialState(): GameState {
  const zweiRecord = cardCatalog[0];
  const cameloparRecord = cardCatalog[1];
  const rikyuRecord = cardCatalog[2];
  if (!zweiRecord || !cameloparRecord || !rikyuRecord) throw new Error("Card fixture thiếu dữ liệu");
  const zwei: CardInstance = { ...zweiRecord, instanceId: "A-hand-zwei-1", owner: "A", zone: "hand", up: true, powerModifier: 0, temporaryText: [] };
  const camelopar: CardInstance = { ...cameloparRecord, instanceId: "A-ener-camelopar-1", owner: "A", zone: "ener", up: true, powerModifier: 0, temporaryText: [] };
  const rikyu: CardInstance = { ...rikyuRecord, instanceId: "A-ener-rikyu-1", owner: "A", zone: "ener", up: true, powerModifier: 0, temporaryText: [] };
  return {
    turnPlayer: "A", phase: "Main", effectStatus: "resolving",
    pendingAction: { type: "play_card", player: "A", cardInstanceId: zwei.instanceId, requestedZone: "right" },
    pendingEffect: "The player has declared playing A-hand-zwei-1 from hand into the right SIGNI zone. Resolve the action and every effect caused by it.",
    players: {
      A: { hand: [zwei.instanceId], signi: { left: null, center: null, right: null }, ener: [camelopar.instanceId, rikyu.instanceId], trash: [], lifeCloth: 7, mainDeckCount: 20 },
      B: { hand: [], signi: { left: null, center: null, right: null }, ener: [], trash: [], lifeCloth: 7, mainDeckCount: 20 },
    },
    cards: { [zwei.instanceId]: zwei, [camelopar.instanceId]: camelopar, [rikyu.instanceId]: rikyu }, events: [],
  };
}

function publicState(state: GameState) { return { ...state, availablePrimitiveOperations: operationDescriptions, cardCatalog }; }
function cardAt(state: GameState, id: string) { const card = state.cards[id]; if (!card) throw new Error(`Không tìm thấy card instance ${id}`); return card; }

function applyOperation(state: GameState, operation: Operation): GameState {
  const next = structuredClone(state); next.lastDrexDecision = operation; const action = next.pendingAction;
  if (operation === "halt_game") { next.effectStatus = "complete"; next.events.push("halt_game"); return next; }
  if (operation === "place_pending_card") {
    if (!action) throw new Error("Drex chọn place_pending_card khi không có pending action");
    const card = cardAt(next, action.cardInstanceId); const player = next.players[action.player];
    if (!player.hand.includes(card.instanceId)) throw new Error("Card không còn trong hand");
    if (player.signi[action.requestedZone] !== null) throw new Error("SIGNI zone đã có card");
    player.hand = player.hand.filter((id) => id !== card.instanceId); player.signi[action.requestedZone] = card.instanceId; card.zone = `signi_${action.requestedZone}`; next.pendingAction = null;
    next.pendingEffect = `The card ${card.name} is on the field. Continue reading its supplied text and resolve any Constant, Enter, or other effect that applies now.`; next.events.push(`place_card:${card.instanceId}:${action.requestedZone}`); return next;
  }
  if (operation === "apply_constant") { next.pendingEffect = "A Constant effect has been identified. Continue resolving its generic state changes."; next.events.push("constant_effect_pending"); return next; }
  if (operation === "resolve_enter") { next.pendingEffect = "An Enter effect has been identified. Resolve its generic parts in order, asking for targets and costs as needed."; next.events.push("enter_effect_pending"); return next; }
  if (operation === "choose_target" || operation === "modify_power" || operation === "draw_cards") { next.pendingEffect = `Drex selected ${operation}. The next call must select concrete generic arguments and return to effect resolution.`; next.events.push(`${operation}_pending`); return next; }
  if (operation === "finish_effect") { next.effectStatus = "complete"; next.pendingEffect = "The current effect is complete. Return to the Main Phase priority window."; next.events.push("finish_effect"); return next; }
  if (operation === "pass_priority") { next.effectStatus = "complete"; next.phase = "End"; next.pendingEffect = "The current priority window is complete."; next.events.push("pass_priority"); return next; }
  throw new Error(`Operation chưa được hỗ trợ: ${operation}`);
}

async function askNextOperation(client: NaceClient, state: GameState) {
  const result = await client.systemOne({ model, state: publicState(state), questions: {
    operation: choice("Read the Wixoss rules, complete card text, pendingEffect, and current state. Select exactly one next generic operation that continues the game. Do not explain.", operationDescriptions),
    optional: noul("At this exact point, is there an optional card effect or choice that must be offered before the game can continue?", { true: "A legal optional effect or choice is available now.", false: "No optional effect or choice is available now." }),
  } });
  const operation = result.answers.operation.choice as string;
  if (!(operation in operationDescriptions)) throw new Error(`Drex trả operation không nằm trong primitive vocabulary: ${operation}`);
  return { result, operation: operation as Operation };
}

async function main() {
  if (existsSync(".env")) loadEnvFile(".env"); const apiKey = process.env.NACE_API_KEY?.trim() || process.env.DREX_API_KEY?.trim();
  if (!apiKey) throw new Error("Thiếu NACE_API_KEY hoặc DREX_API_KEY trong .env.");
  const client = new NaceClient({ apiKey, baseURL: "https://console.nace.ai", defaultModel: model, logLevel: "off", retry: { maxRetries: 0 } });
  let state = initialState(); const trace: Array<{ step: number; operation: Operation; requestId: string; confidence: number }> = [];
  for (let step = 1; step <= 6 && state.effectStatus !== "complete"; step += 1) { const answer = await askNextOperation(client, state); trace.push({ step, operation: answer.operation, requestId: answer.result.request_id, confidence: answer.result.answers.operation.confidence }); state = applyOperation(state, answer.operation); }
  console.log(JSON.stringify({ model, trace, finalState: state }, null, 2));
  assert.ok(trace.length >= 1, "Drex không trả quyết định nào"); assert.equal(trace[0]?.operation, "place_pending_card", "Bước đầu phải là đặt card pending vào SIGNI zone"); assert.equal(state.cards["A-hand-zwei-1"]?.zone, "signi_right", "Card phải được chuyển vào right SIGNI zone"); assert.equal(state.players.A.hand.length, 0, "Hand phải giảm sau khi đặt card"); assert.ok(state.events.includes("place_card:A-hand-zwei-1:right"), "Trace phải ghi event đặt card");
  console.log("Drex hand loop đã chạy qua API thật và state được cập nhật qua primitive generic.");
}
main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : "Không chạy được Drex hand loop."); process.exitCode = 1; });
