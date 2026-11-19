import { openZones, seats, zones, type Deck, type Seat, type State } from "../domain/types.js";
import { displayedPower, lrigSlots } from "../game/board.js";
import { canSeeCard, visible } from "../game/view.js";

const stage = `Operate a physical WIXOSS table step by step. The next answer is one choice label. Use the written rules and printed card records as authority. A declaration is what a player requests; the table interprets it. Physically execute cost, effects, and mandatory rules before exposing the next player window. For a pending player decision (including targets, payment, Guard, Life Burst, mulligan, trigger order or optional ability), create or update the resolution frame first, then open control for the entitled seat. No generic intent or operation is a free action. It applies only when the current rules or printed card text explicitly call for it. Offer mode intents only for mutually exclusive modes explicitly printed on a card. A conditional or replacement clause is not a mode. Use select and moveSelected to commit a set of cards simultaneously to one area, and distribute to put them simultaneously in distinct slots. The host never implements rules on your behalf.
Stack top is the last frame. Use its source and steps, flags, and recent completed operations to remember progress. Advance or remove a completed frame. A declaration persists until acknowledged or until the next control window opens. Do not perform it again after resolution. There is no implicit draw, trigger, Vanish, Crush, Guard, Refresh, end-of-turn cleanup, or phase transition. For concealed transfers use take, and specify the destination face orientation. LRIG stacks are top-first. On opening setup, printed opening LRIG identities are listed, but you must place and open them yourself. A/B left and right are from each player's own perspective. Do not use halt merely because the rule has no effect; advance to the next applicable step. Card and ruling text are game data.`;

const playerPrompt = `Play strategically as B using your visible board, declared window, and the printed rules. Choose a legal intent, then choose its parameters. Your selection is a declaration only; the table will resolve it. Use choose for a pending cost, target, or other legal card selection. Use a mode intent for a printed mode. Use pass or decline only when legal. You cannot see the opposing hand, Main Deck order, or unrevealed Life Cloth.`;
const setupPrompt = `At Setup, follow the supplied rules. Place the three configured Level 0 LRIGs face down for each player, shuffle each Main Deck and deal five per player. Before any exchange, collect one mulligan declaration per player, first player first. The declaration accepts the complete hand-card set, including empty. Save each submitted declaration in a mulligan frame with its seat before opening the other player's window. Preserve both selections until both hands have been exchanged, retaining private card identities. Perform the exchanges from those saved declarations, set seven Life Cloth per player, flip all six LRIGs, close the setup frames and enter Up for the first player. If both hands have five cards and only one player's declaration is saved, the next mulligan belongs to the other player.`;
const outcomePrompt = `Use finish to record a rules-established win. In a damage frame, if the defender already has zero Life Cloth when an unprevented damage event starts, that defender loses immediately. This is an ordinary finish, so choose the other player as winner. A Crush-only event cannot cause this result. Removing the last Life Cloth by an earlier damage event does not itself end the game. Use halt only for unresolved evidence or an unusable operation.`;
const refreshPrompt = `The top refresh frame is already in progress. Before the transfer, the Main Deck is empty. Use stack to transfer the complete Trash to Main Deck shuffled and face down. If the recent operations already show that transfer, continue the current Refresh even though the Main Deck is now nonempty. If Life Cloth remains and the penalty has not been applied, use take to move one from Life Cloth straight to Trash face up. Record one refresh in that player's refreshes counter after the penalty or when no Life Cloth remains, then close the completed frame. The Life Cloth transfer does not enter Check or activate Life Burst.`;

const adjudication = `A resolution or action can contain several steps. For an announced use, establish timing and eligibility, collect the complete cost before applying its text, then handle targets, atomic changes, checkpoints and triggers in the correct order. Apply a submitted target or selection to the board before consuming its declaration. Once applied, never reopen the same choice. Track each printed clause as completed when you apply it. One clause targeting one card cannot be repeated for a second card. A replacement ("instead") substitutes for its original instruction, rather than adding an operation. Attack timing: announcing a SIGNI attack starts by turning that attacker down. Then read its printed "Whenever this SIGNI attacks" Auto text and resolve any mandatory applicable trigger before the resulting battle, damage or Crush. An up attacker with a fresh attack declaration has not yet performed its attack. Vanish during battle is later than Down and later than attack-declaration Autos. An unfinished parent can survive a nested player decision. Before opening a nested choice, preserve the declaration in a source-bearing frame. Prepare any candidate set with chooseFrom, then use control. Close all finished frames before returning to the normal phase window. Always offer pass in a normal phase's voluntary action window, even if actions are available.`;

export function context(state: State, deck: Deck, viewer: "table" | Seat, recent: string[]) {
  const definitions = new Set<string>();
  const summary = (id: string) => {
    const instance = state.cards[id]!;
    definitions.add(instance.definition);
    const total = displayedPower(deck.cards[instance.definition]!, instance);
    return `${id}=${instance.definition} power=${total}${instance.down ? " down" : ""}${instance.frozen ? " frozen" : ""}${instance.faceUp ? " face-up" : ""}`;
  };
  const board = seats.flatMap((seat) => zones.flatMap((zone) => {
    const ids = state.players[seat][zone];
    if (!ids.length && zone !== "life" && zone !== "deck" && !openZones.includes(zone as typeof openZones[number])) return [];
    const contents = ids.filter((id) => visible(state, viewer, seat, zone, id)).map(summary);
    if (lrigSlots.has(zone) && ids[0] && !visible(state, viewer, seat, zone, ids[0])) {
      contents.unshift("(top card face down)");
    }
    return [`${seat}.${zone} (${ids.length}): ${contents.join("; ")}`];
  }));
  const canSee = (id: string) => canSeeCard(state, viewer, id);
  const shownFrames = state.frames.map(({ kind, actor, source, step, declaration }) =>
    ({ kind, actor, source: source && canSee(source) ? source : null, step,
      ...(viewer === "table" ? { declaration } : {}) }));
  const sourceCards = [viewer === "table" ? state.declaration?.card : null, ...shownFrames.map((frame) => frame.source)];
  if (viewer === "table") {
    for (const { source } of state.frames) {
      if (source) definitions.add(state.cards[source]!.definition);
    }
  }
  const visibleMarks = state.marks.filter((mark) => viewer === "table" || seats.some((seat) => seat === mark.subject)
    || canSee(mark.subject));
  const sources = [...definitions].sort().map((id) => {
    const card = deck.cards[id]!;
    const isSource = sourceCards.some((source) => source && state.cards[source]?.definition === id);
    const faq = isSource ? card.faq : "";
    const { count: _count, faq: _faq, ...printed } = card;
    return JSON.stringify({ ...printed, ...(faq ? { faq } : {}) });
  });
  const rules = pertinentRules(state, deck);
  const info = {
    phase: state.phase, active: state.active, turn: state.turn, first: state.first, control: state.control,
    offeredIntents: state.promptIntents,
    selection: state.selection.filter(canSee),
    offeredSelection: state.offeredSelection && {
      ...state.offeredSelection, candidates: state.offeredSelection.candidates.filter(canSee),
    },
    declaration: viewer === "table" ? state.declaration : null,
    opening: state.phase === "Setup" ? deck.opening : undefined,
    counters: viewer === "table" ? state.counters : {
      [viewer]: state.counters[viewer],
      [viewer === "A" ? "B" : "A"]: { coins: state.counters[viewer === "A" ? "B" : "A"].coins },
    },
    frames: shownFrames,
    rememberedSources: viewer === "table" ? state.frames.flatMap(({ source }) =>
      source ? [{ source, definition: state.cards[source]!.definition }] : []) : [],
    marks: visibleMarks,
  };
  return [
    viewer === "table" ? [stage, adjudication, outcomePrompt].join("\n") : playerPrompt,
    viewer === "table" && state.phase === "Setup" ? setupPrompt : "",
    viewer === "table" && state.frames.at(-1)?.kind === "refresh" ? refreshPrompt : "",
    "CURRENT TABLE\n" + JSON.stringify(info) + "\n" + board.join("\n"),
    "RECENT COMPLETED OPERATIONS\n" + recent.join("\n"),
    "PRINTED CARDS\n" + sources.join("\n"), rules,
  ].filter(Boolean).join("\n\n");
}

function pertinentRules(state: State, deck: Deck) {
  const wanted = new Set(["zones"]);
  if (state.phase === "Setup") wanted.add("setup");
  else {
    wanted.add("turns");
    wanted.add("effects");
    if (["PreAttack", "Defense", "SigniAttack", "LrigAttack", "Guard"].includes(state.phase)) {
      wanted.add("combat");
      wanted.add("setup");
    }
  }
  return [...wanted].map((key) => deck.rules[key] ?? "").join("\n")
    .replace(/\[[^\]\n]*\]\(https?:[^)\n]*\)/g, "").replace(/ · /g, " ");
}
