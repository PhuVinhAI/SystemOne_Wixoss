import { seats, zones, type Deck, type Seat, type State } from "../domain/types.js";
import { displayedPower, lrigSlots } from "../game/board.js";
import { canSeeCard, visible } from "../game/view.js";
import { attackFocus, phaseWindows, playerRole, refreshFocus, setupFocus, setupProgress, tableRole } from "./prompts.js";

export function context(state: State, deck: Deck, viewer: "table" | Seat, recent: string[]) {
  const definitions = new Set<string>();
  const summary = (id: string) => {
    const instance = state.cards[id]!;
    const card = deck.cards[instance.definition]!;
    definitions.add(instance.definition);
    const power = card.type === "SIGNI" ? ` printedPower=${card.power} recordedPower=${displayedPower(card, instance)}` : "";
    const adjustments = instance.adjustments.map(({ amount, expires }) => `${amount}@${expires}`).join(",");
    return `${id}=${instance.definition} type=${card.type} level=${card.level} group=${card.group}${power}${adjustments ? " timedPower=" + adjustments : ""}${instance.down ? " down" : " up"}${instance.frozen ? " frozen" : ""}${instance.faceUp ? " face-up" : " face-down"}`;
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
  const attack = [state.declaration, ...state.frames.map(({ declaration }) => declaration).reverse()]
    .find((declaration) => declaration?.intent === "attack");
  const lanes = [
    ["A.signiLeft", "B.signiRight", state.players.A.signiLeft, state.players.B.signiRight],
    ["A.signiCenter", "B.signiCenter", state.players.A.signiCenter, state.players.B.signiCenter],
    ["A.signiRight", "B.signiLeft", state.players.A.signiRight, state.players.B.signiLeft],
  ] as const;
  const combat = viewer === "table" && attack?.card ? [
    attackFocus,
    `Declared attacker: ${attack.card} of seat ${attack.actor}. Opposing lane pairs (empty arrays are empty lanes):\n`
      + lanes.map(([a, b, left, right]) => `${a} [${left.join(",")}] faces ${b} [${right.join(",")}]`).join("\n"),
  ].join("\n") : "";
  const sourceDefinitions = new Set(sourceCards.flatMap((id) => id && state.cards[id] ? [state.cards[id].definition] : []));
  const sources = [...definitions].sort().map((id) => {
    const card = deck.cards[id]!;
    const isSource = sourceDefinitions.has(id);
    const faq = isSource ? card.faq : "";
    const { count: _count, faq: _faq, id: _id, ...printed } = card;
    const fields = Object.entries(printed).filter(([, value]) => value !== "" && value !== "—");
    return { isSource, text: `${id} ${JSON.stringify(Object.fromEntries(faq ? [...fields, ["faq", faq]] : fields))}` };
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
  const focus = state.phase === "Setup" && viewer === "table" ? setupFocus + "\n" + setupProgress
    : viewer === "table" && state.frames.at(-1)?.kind === "refresh" ? refreshFocus
    : viewer === "table" ? phaseWindows : "";
  return [
    viewer === "table" ? tableRole : playerRole,
    focus,
    combat,
    "<CURRENT_TABLE>\n" + JSON.stringify(info) + "\n" + board.join("\n") + "\n</CURRENT_TABLE>",
    viewer === "table" && sourceDefinitions.size ? "ACTIVE SOURCE RECORDS\n" + sources.filter(({ isSource }) => isSource).map(({ text }) => text).join("\n") : "",
    recent.length ? "COMMITTED OPERATIONS (oldest first)\n" + recent.join("\n") : "",
    sources.length ? "PRINTED CARDS\n" + sources.filter(({ isSource }) => viewer !== "table" || !isSource).map(({ text }) => text).join("\n") : "",
    "<RULES>\n" + rules + "\n</RULES>",
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
