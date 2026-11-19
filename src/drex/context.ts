import { seats, zones, type Deck, type Seat, type State } from "../domain/types.js";
import { displayedPower, lrigSlots } from "../game/board.js";
import { canSeeCard, visible } from "../game/view.js";
import { playerRole, refreshFocus, setupFocus, tableRole } from "./prompts.js";

export function context(state: State, deck: Deck, viewer: "table" | Seat, recent: string[]) {
  const definitions = new Set<string>();
  const summary = (id: string) => {
    const instance = state.cards[id]!;
    definitions.add(instance.definition);
    const total = displayedPower(deck.cards[instance.definition]!, instance);
    return `${id}=${instance.definition} power=${total}${instance.down ? " down" : ""}${instance.frozen ? " frozen" : ""}${instance.faceUp ? " face-up" : ""}`;
  };
  const board = seats.flatMap((seat) => zones.map((zone) => {
    const ids = state.players[seat][zone];
    const contents = ids.filter((id) => visible(state, viewer, seat, zone, id)).map(summary);
    if (lrigSlots.has(zone) && ids[0] && !visible(state, viewer, seat, zone, ids[0])) {
      contents.unshift("(top card face down)");
    }
    return `${seat}.${zone} [${ids.length}]${contents.length ? " " + contents.join("; ") : ""}`;
  }));
  const canSee = (id: string) => canSeeCard(state, viewer, id);
  const shownFrames = state.frames.map(({ kind, actor, source, step, declaration }) => ({
    kind, actor, step,
    ...(source && (viewer === "table" || canSee(source)) ? { source } : {}),
    ...(viewer === "table" && declaration ? { savedDeclaration: declaration } : {}),
  }));
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
    const { count: _count, faq: _faq, id: _id, ...printed } = card;
    const fields = Object.entries(printed).filter(([, value]) => value !== "" && value !== "—");
    return `${id} ${JSON.stringify(Object.fromEntries(faq ? [...fields, ["faq", faq]] : fields))}`;
  });
  const rules = pertinentRules(state, deck);
  const info = {
    phase: state.phase, active: state.active, turn: state.turn, first: state.first, control: state.control,
    offeredIntents: state.control === "table" ? undefined : state.promptIntents,
    selection: state.selection.length ? state.selection.filter(canSee) : undefined,
    offeredSelection: state.offeredSelection ? {
      ...state.offeredSelection, candidates: state.offeredSelection.candidates.filter(canSee),
    } : undefined,
    declaration: viewer === "table" && state.declaration ? state.declaration : undefined,
    opening: state.phase === "Setup" ? deck.opening : undefined,
    counters: viewer === "table" ? state.counters : {
      [viewer]: state.counters[viewer],
      [viewer === "A" ? "B" : "A"]: { coins: state.counters[viewer === "A" ? "B" : "A"].coins },
    },
    frames: shownFrames,
    rememberedSources: viewer === "table" && state.frames.some(({ source }) => source && !canSee(source))
      ? Object.fromEntries(state.frames.flatMap(({ source }) => source && !canSee(source)
        ? [[source, state.cards[source]!.definition]] : []))
      : undefined,
    marks: visibleMarks.length ? visibleMarks : undefined,
  };
  const focus = viewer === "table" && state.phase === "Setup" ? setupFocus
    : viewer === "table" && state.frames.at(-1)?.kind === "refresh" ? refreshFocus : "";
  return [
    viewer === "table" ? tableRole : playerRole,
    focus,
    "CURRENT TABLE\n" + JSON.stringify(info) + "\n" + board.join("\n"),
    recent.length ? "COMMITTED OPERATIONS (oldest first)\n" + recent.join("\n") : "",
    sources.length ? "PRINTED CARDS\n" + sources.join("\n") : "",
    "RULES\n" + rules,
  ].filter(Boolean).join("\n\n");
}

function pertinentRules(state: State, deck: Deck) {
  const clean = (chapter: string) => (deck.rules[chapter] ?? "").replace(/\r\n/g, "\n");
  const section = (chapter: string, heading: string) => clean(chapter).split(/^## /m)
    .find((block) => block.startsWith(heading + "\n")) ?? clean(chapter);
  const visibilityRules = section("zones", "Zone và quyền xem");
  const rules = state.phase === "Setup"
    ? [section("setup", "Chuẩn bị"), visibilityRules]
    : [clean("turns"), clean("effects"), visibilityRules];
  if (["PreAttack", "Defense", "SigniAttack", "LrigAttack", "Guard"].includes(state.phase)
    || state.frames.some(({ kind }) => ["attack", "battle", "guard", "damage", "crush", "burst"].includes(kind))) {
    rules.push(clean("combat"));
  }
  return rules.join("\n\n").replace(/\[[^\]\n]*\]\(https?:[^)\n]*\)/g, "")
    .replace(/(?:^| )·(?= |$)/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}
