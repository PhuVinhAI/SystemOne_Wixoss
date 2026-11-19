import { flags, frames, intents, phases, seats, zones, type Declaration, type Intent, type Seat, type State, type Zone } from "../domain/types.js";
import { boxName, displayedPower, slots } from "../game/board.js";
import { MatchHalt, type Choices } from "../game/options.js";
import { areas, counterNames, declarationIsSaved, operations, type Operation } from "../game/primitives.js";
import { canSeeCard, visible } from "../game/view.js";
import type { Deck } from "../domain/types.js";
import type { Decision, DrexClient } from "./client.js";

type Source = { seat: Seat; zone: Zone; ids: string[]; label: string };
type Ask = ((question: string, choices: Choices) => Promise<string>) & {
  each: (questions: Record<string, { question: string; choices: Choices }>) => Promise<Record<string, string>>;
};

const actionText: Record<Intent, string> = {
  pass: "Pass or finish this decision window.",
  mulligan: "Finalize the mulligan, optionally naming all hand cards to exchange together. An empty selection keeps the hand.",
  charge: "Choose a card to put into Ener in the Ener Phase.",
  grow: "Choose an LRIG from your LRIG Deck to Grow.",
  play: "Place a SIGNI from your hand in an indicated field zone.",
  cast: "Declare use of a Spell or PIECE.",
  ability: "Declare an Action ability of a card on the board.",
  retire: "Declare a simultaneous Retire and name the full set of SIGNI to retire.",
  attack: "Declare an attack with one of your field cards.",
  guard: "Choose a card from hand to Guard.",
  burst: "Use the revealed card's Life Burst.",
  choose: "Choose a card in a pending selection, such as paying cost or choosing a target.",
  decline: "Decline the pending optional decision.",
  mode1: "Choose the first printed mode.",
  mode2: "Choose the second printed mode.",
  mode3: "Choose the third printed mode.",
};

export function selectIntent(state: State) {
  return Object.fromEntries(state.promptIntents.map((intent) => [intent, actionText[intent]]));
}

function list<T extends string>(values: readonly T[]): Choices {
  return Object.fromEntries(values.map((value) => [value, value]));
}
function sources(state: State): Source[] {
  return seats.flatMap((seat) => zones.map((zone) => ({
    seat, zone, ids: state.players[seat][zone], label: boxName(seat, zone),
  })));
}

function cardOptions(state: State, deck: Deck, input: Source[], viewer: "table" | Seat): Choices {
  return Object.fromEntries(input.flatMap(({ seat, zone, ids, label }) => ids
    .filter((id) => visible(state, viewer, seat, zone, id))
    .map((id) => {
      const instance = state.cards[id]!;
      const card = deck.cards[instance.definition]!;
      const power = displayedPower(card, instance);
      return [id, `${id}: ${card.name}, ${card.type}, level ${card.level}, ${card.color}, ${card.group}, Power ${power}, ${instance.down ? "Down" : "Up"}, ${label}`];
    })));
}

const range = (min: number, max: number) => Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => String(i + min));
const boolean = list(["true", "false"]);
const faceOptions = { keep: "Preserve face orientation.", up: "Face up.", down: "Face down." };
const groupIntents: Intent[] = ["mulligan", "retire", "choose"];
function cardRequired(intent: Intent) {
  return ["charge", "grow", "play", "cast", "ability", "attack", "guard"].includes(intent);
}

export async function chooseDeclaration(state: State, deck: Deck, actor: Seat, ask: Ask): Promise<Declaration> {
  const intent = await ask("What do you choose to do in this window?", selectIntent(state)) as Intent;
  const visibleCards = cardOptions(state, deck, sources(state), actor);
  const selection = state.offeredSelection;
  const available = selection ? Object.fromEntries(selection.candidates.flatMap((id) =>
    Object.hasOwn(visibleCards, id) ? [[id, visibleCards[id]!]] : [])) : visibleCards;
  const card = cardRequired(intent) ? await ask(`Choose a visible card for ${intent}.`, available) : null;
  const cards: string[] = [];
  if (groupIntents.includes(intent)) {
    for (;;) {
      const remaining = cards.length < (selection?.max ?? 51)
        ? Object.fromEntries(Object.entries(available).filter(([id]) => !cards.includes(id))) : {};
      if (cards.length >= (selection?.min ?? 0)) remaining["done"] = "Submit the complete set of selected cards now.";
      const selected = await ask(`Choose another card or finalize the complete selection for ${intent}. Current selection: ${cards.join(", ") || "empty"}.`,
        remaining);
      if (selected === "done") break;
      cards.push(selected);
    }
  }
  const zone = intent === "play"
    ? (await ask("Choose your destination SIGNI zone.", list(zones.filter((zone) => slots.has(zone) && !state.players[actor][zone].length)))) as Zone
    : null;
  return { actor, intent, card, cards, zone };
}

export function validateDeclaration(state: State, declaration: Declaration) {
  const { actor, intent, card, cards, zone } = declaration;
  if (state.control !== actor) throw new Error("This player does not currently have control.");
  if (!state.promptIntents.includes(intent)) throw new Error("Intent not offered in this window.");
  if (Boolean(card) !== cardRequired(intent) || (cards.length > 0 && !groupIntents.includes(intent))
    || (intent === "play" ? !zone || !slots.has(zone) || state.players[actor][zone].length > 0 : zone !== null)) {
    throw new Error("The supplied arguments do not match the declaration.");
  }
  const ids = [...(card ? [card] : []), ...cards];
  if (new Set(ids).size !== ids.length || ids.some((id) => !canSeeCard(state, actor, id))) {
    throw new Error("Choose distinct, accessible cards.");
  }
  const selection = state.offeredSelection;
  if (selection && !["pass", "decline", "mode1", "mode2", "mode3", "burst"].includes(intent)
    && (ids.length < selection.min || ids.length > selection.max || ids.some((id) => !selection.candidates.includes(id)))) {
    throw new Error("The selection does not match the window Drex opened.");
  }
}

export async function auditDeclaration(drex: DrexClient, snapshot: string, state: State, deck: Deck, declaration: Declaration, trace: Decision[]) {
  const source = state.frames.findLast((frame) => frame.source)?.source;
  const sourceCard = source ? deck.cards[state.cards[source]!.definition] : undefined;
  const candidates = cardOptions(state, deck, sources(state), "table");
  const selected = [...(declaration.card ? [declaration.card] : []), ...declaration.cards];
  const detail = JSON.stringify({
    selectionCount: selected.length,
    allowedCount: state.offeredSelection ? { min: state.offeredSelection.min, max: state.offeredSelection.max } : null,
    selectedCards: selected.map((id) => candidates[id]),
    source: sourceCard && { name: sourceCard.name, text: sourceCard.text, burst: sourceCard.burst },
  });
  const answer = await drex.decide(
    `PLAYER DECLARATION\n${JSON.stringify(declaration)}\n${detail}\n\n${snapshot}`,
    `Judge the declaration now. Priority evidence: ${detail}. Check the exact set together. If two cards share a group with a printed one-per-group cap, the set is illegal although each is individually eligible. An empty submitted set counts as zero and is a fully declared choice where zero is permitted. Check the acting seat, timing and destination. Do not perform a different choice.`,
    {
      legal: "This exact player declaration is legal now, including the combination of all selected cards.",
      illegal: "The declaration contradicts an identifiable rule or the printed instruction.",
    },
  );
  trace.push(answer);
  if (answer.label === "halt") throw new MatchHalt("Drex không xác định được tính hợp lệ của lựa chọn.", answer.requestId);
  return answer.label === "legal";
}

export async function chooseOperation(state: State, deck: Deck, ask: Ask) {
  const all = sources(state);
  const nonempty = all.filter(({ ids }) => ids.length > 0);
  const known = cardOptions(state, deck, all, "table");
  const choices: Choices = { ...operations };
  if (!state.frames.length) {
    delete choices["step"];
    delete choices["pop"];
  }
  if (state.frames.length < 2) delete choices["closeFrames"];
  if (!state.declaration) delete choices["consume"];
  const selectionSources = nonempty.filter(({ ids }) => state.selection.length && state.selection.every((id) => ids.includes(id)));
  const emptySlots = all.filter((entry) => slots.has(entry.zone) && !entry.ids.length);
  if (!state.selection.length) {
    delete choices["clearSelection"];
  }
  if (!declarationIsSaved(state)) delete choices["control"];
  if (!selectionSources.length) delete choices["moveSelected"];
  if (!selectionSources.length || state.selection.length < 2 || state.selection.length > emptySlots.length) {
    delete choices["distribute"];
  }
  const operation = await ask("Select the next single physical operation. Consider the pending declaration, stack, recent operations and rules.", choices) as Operation;
  const parameter = (name: string, options: Choices, detail = "") =>
    ask(`You already selected ${operation}. Select ${name}. ${detail}`, options);
  const actor = () => parameter("actor", list(seats));
  const target = () => parameter("target", { ...list(nonempty.map((entry) => entry.label)), ...known });
  const subject = () => parameter("subject", { ...list(seats), ...known });
  const expires = () => parameter("expiry", { permanent: "Permanent until removed", [state.turn]: "End of current turn", [state.turn + 1]: "End of next turn" });
  const args: Record<string, string> = {};
  switch (operation) {
    case "move":
    case "take":
    case "moveSelected":
    case "random": {
      args["from"] = await parameter("source zone", list((operation === "moveSelected" ? selectionSources : nonempty).filter((entry) =>
        operation !== "move" || entry.ids.some((id) => Object.hasOwn(known, id))).map((entry) => entry.label)));
      const source = all.find((entry) => entry.label === args["from"])!;
      args["to"] = await parameter("destination zone", list(all.filter((entry) =>
        entry.label !== source.label && (!slots.has(entry.zone) || (!entry.ids.length && (operation !== "moveSelected" || state.selection.length === 1)))).map((entry) => entry.label)), `From ${source.label}.`);
      const destination = all.find((entry) => entry.label === args["to"])!;
      if (operation === "move") args["card"] = await parameter("card", cardOptions(state, deck, [source], "table"), `From ${source.label} to ${destination.label}.`);
      else if (operation !== "moveSelected") args["count"] = await parameter("exact number of cards", list(range(1, slots.has(destination.zone) ? 1 : source.ids.length)),
        `From ${source.label} to ${destination.label}. Select the rules-correct count for this step.`);
      args["face"] = await parameter("face orientation on arrival", faceOptions, `From ${source.label} to ${destination.label}.`);
      break;
    }
    case "distribute": {
      args["from"] = await parameter("source zone", list(selectionSources.map((entry) => entry.label)));
      const destinations: string[] = [];
      for (const id of state.selection) {
        destinations.push(await parameter(`destination for ${known[id] ?? id}`,
          list(emptySlots.map((entry) => entry.label).filter((zone) => !destinations.includes(zone)))));
      }
      args["destinations"] = destinations.join(",");
      args["face"] = await parameter("face orientation on arrival", faceOptions);
      break;
    }
    case "select":
      args["card"] = await parameter("card to add to or remove from the selection", known);
      args["value"] = await parameter("selection value", boolean, "True adds the card; false removes it.");
      break;
    case "resetCard":
      args["card"] = await parameter("card to reset", known);
      break;
    case "chooseFrom": {
      args["source"] = await parameter("candidate source", {
        ...list(nonempty.map((entry) => entry.label)),
        ...(state.selection.length ? { selection: "Use the current working selection." } : {}),
      });
      const pool = args["source"] === "selection" ? state.selection : all.find((entry) => entry.label === args["source"])!.ids;
      const candidates = Object.fromEntries(pool.flatMap((id) => Object.hasOwn(known, id) ? [[id, known[id]!]] : []));
      const sourceCard = state.frames.findLast((frame) => frame.source)?.source ?? state.declaration?.card;
      const resolving = sourceCard ? deck.cards[state.cards[sourceCard]!.definition] : undefined;
      const matches = await ask.each(Object.fromEntries(Object.entries(candidates).map(([id, description]) => [id, {
        question: `Pending resolution: ${resolving ? JSON.stringify({ name: resolving.name, text: resolving.text, burst: resolving.burst }) : "See the current frame, declaration and rules."} Candidate: ${description}. Can the chooser lawfully use this card by itself as one member of a complete selection? Assume all other members are still unchosen. A per-group quota limits the final chosen set, not the number of alternatives offered from that group. Decide only this candidate's eligibility.`,
        choices: { eligible: `Include ${description} as an individually valid candidate, even when other candidates share its group.`,
          excluded: `Exclude ${description} because an identified printed condition, limit, or restriction prevents including it in any legal choice.` },
      }])));
      const eligible = Object.keys(candidates).filter((id) => matches[id] === "eligible");
      args["eligible"] = eligible.join(",");
      args["min"] = await parameter("smallest legally permitted selection size", list(range(0, eligible.length)),
        "This is the lower bound of the offered choice, independent of preferred strategy. An 'up to' or 'any number' instruction allows zero unless a separate clause explicitly requires a minimum.");
      args["max"] = await parameter("largest legally permitted selection size", list(range(Number(args["min"]), eligible.length)),
        `The selected minimum is ${args["min"]}. Apply any printed cap, individually eligible groups, and physically available slots.`);
      break;
    }
    case "shuffle": args["target"] = await parameter("pile", list(areas)); break;
    case "stack": {
      args["from"] = await parameter("source pile to transfer in full", list(nonempty.map((entry) => entry.label)));
      args["to"] = await parameter("destination for the full pile", list(all.filter((entry) =>
        entry.label !== args["from"] && !slots.has(entry.zone)).map((entry) => entry.label)));
      args["order"] = await parameter("order of the pile", { keep: "Preserve current order.", random: "Shuffle the transferred cards." });
      args["face"] = await parameter("face orientation of the transferred pile", faceOptions);
      break;
    }
    case "orient":
    case "freeze":
    case "face":
      args["target"] = await target();
      args["value"] = await parameter("value", boolean, `Target ${args["target"]}. For orient true means Down, for freeze true means Frozen, and for face true means face up.`);
      break;
    case "power":
    case "addPower":
      args["card"] = await parameter("card", known);
      args["amount"] = await choosePower((name, options, detail) =>
        parameter(name, options, `${detail ?? ""} Target ${args["card"]}. Use the printed effect and current state.`));
      if (operation === "addPower") args["expires"] = await parameter("turn when this expires", list([String(state.turn), String(state.turn + 1)]));
      break;
    case "control": {
      args["actor"] = await actor();
      args["scope"] = state.frames.length ? "frame" : "match";
      const picked: Intent[] = [];
      for (let i = 0; i < intents.length; i += 1) {
        const available = Object.fromEntries(intents.filter((intent) => !picked.includes(intent))
          .map((intent) => [intent, actionText[intent]]));
        if (picked.length) available["done"] = "Offer exactly the selected intents and no others.";
        const next = await parameter("one additional legally required or allowed intent, or done", available,
          `Seat ${args["actor"]}, scope ${args["scope"]}. In frame scope only offer decisions for the unresolved top frame. Never offer normal phase actions as part of a resolution frame. Already selected: ${picked.join(", ") || "none"}. If the selected set is complete, answer done immediately. A generic choose is for a mandatory choice of a card; already-offered more specific intents take precedence. Choose a mode only when printed as an explicit choice of mutually exclusive modes.`);
        if (next === "done") break;
        picked.push(next as Intent);
      }
      args["intents"] = picked.join(",");
      break;
    }
    case "turn": args["actor"] = await actor(); break;
    case "counter":
      args["actor"] = await actor();
      args["name"] = await parameter("counter name", list(counterNames));
      args["value"] = await parameter("new counter value", list(range(0, 51)), `Counter ${args["actor"]}.${args["name"]}.`);
      break;
    case "phase": args["value"] = await parameter("next phase", list(phases)); break;
    case "push":
      args["frame"] = await parameter("resolution frame kind", list(frames));
      args["actor"] = await parameter("controller", list(seats), `Opening ${args["frame"]} frame.`);
      args["source"] = await parameter("source card or none", { none: "No source card", ...known }, `Opening ${args["frame"]} frame for ${args["actor"]}.`);
      break;
    case "step": args["value"] = await parameter("new frame step", list(range(0, 16))); break;
    case "mark":
    case "unmark":
      args["subject"] = await subject();
      args["flag"] = await parameter("flag", list(flags), `Subject ${args["subject"]}.`);
      if (operation === "mark") args["expires"] = await expires();
      break;
    case "finish": args["winner"] = await parameter("winner", list(seats)); break;
    case "pop":
    case "closeFrames":
      if (operation === "closeFrames") args["count"] = await parameter("number of completed frames", list(range(2, state.frames.length)));
      args["acknowledge"] = state.declaration
        ? await parameter("whether this also acknowledges the current declaration", boolean,
          "True only if the current player's request has been physically completed or was intentionally declined. A declaration for a different seat than the closing frame usually still needs resolution. False preserves the current declaration.")
        : "false";
      break;
    case "consume":
    case "clearSelection":
    case "clearTurn": break;
  }
  return { operation, args };
}

async function choosePower(ask: (name: string, choices: Choices, detail?: string) => Promise<string>) {
  const sign = await ask("sign of the Power value", { plus: "Positive", minus: "Negative", zero: "Exactly zero" });
  if (sign === "zero") return "0";
  const magnitude = await ask("absolute Power amount", { ...list(range(1, 30).map((n) => String(Number(n) * 1000))), precise: "Use digits to give another exact value." });
  if (magnitude !== "precise") return (sign === "minus" ? "-" : "") + magnitude;
  let value = "";
  for (let i = 0; i < 5; i += 1) {
    const digit = await ask("next digit of the absolute amount", { ...list(range(0, 9)), done: "The amount is complete." }, `Digits already selected: ${value}.`);
    if (digit === "done") break;
    value += digit;
  }
  if (!value || Number(value) === 0) throw new MatchHalt("Invalid numeric decision.");
  return (sign === "minus" ? "-" : "") + value;
}

export function askWith(drex: DrexClient, initial: string, trace: Decision[]): Ask {
  const steps: string[] = [];
  const record = (answer: Decision) => {
    trace.push(answer);
    if (answer.label === "halt") throw new MatchHalt("Drex yêu cầu dừng khi đang xác định thao tác.", answer.requestId);
    steps.push(`${answer.question} => ${answer.label}`);
    return answer.label;
  };
  const ask = async (question: string, choices: Choices) => {
    const answer = await drex.decide(initial + "\n" + steps.join("\n"), question, choices);
    return record(answer);
  };
  return Object.assign(ask, {
    async each(questions: Parameters<Ask["each"]>[0]) {
      if (!Object.keys(questions).length) return {};
      const answers = await drex.decideBatch(initial + "\n" + steps.join("\n"), questions);
      return Object.fromEntries(Object.entries(answers).map(([id, answer]) => [id, record(answer)]));
    },
  });
}

export async function verifyOperation(drex: DrexClient, snapshot: string, selected: Awaited<ReturnType<typeof chooseOperation>>, trace: Decision[]) {
  const { operation, args } = selected;
  const meaning = operation === "move" ? `Move ${args["card"]} from ${args["from"]} to ${args["to"]}`
    : operation === "pop" || operation === "closeFrames" ? `Close ${operation === "pop" ? "one frame" : args["count"] + " frames"}; acknowledge current declaration: ${args["acknowledge"]}. Closing frames removes declarations those frames store.`
    : operation === "chooseFrom" ? `Offer exactly these cards from ${args["source"]}: ${args["eligible"] || "none"}. Can select from ${args["min"]} to ${args["max"]} cards. Confirm each eligible card and every legal selection size; 'up to' permits zero.`
    : operation === "orient" ? `${args["value"] === "true" ? "Down" : "Up"} ${args["target"]}`
    : operation === "face" ? (args["value"] === "true" ? "Face up" : "Face down")
    : operation === "freeze" ? (args["value"] === "true" ? "Set Frozen" : "Clear Frozen")
    : operations[operation];
  const answer = await drex.decide(
    `OPERATION TO AUDIT\n${JSON.stringify(selected)}\nPhysical meaning: ${meaning}.\n\n${snapshot}`,
    `Is the proposed ${operation} operation, with exactly the supplied arguments, a legal single step on this board? The question concerns only that operation. Accept required physical parts of a declaration before outstanding effects, and closure of a completed frame before a separate rules check. Stop for a concrete timing, target, count, visibility, or rules violation, including a skipped required step or a repeated effect. A selection window must preserve opt-out, eligibility, and all allowed counts. A frame-scoped window must address an outstanding decision belonging to that frame. Normal phase actions require closing completed frames first.`,
    {
      stop: `Do not apply ${operation}: the board, rules, or printed text show that this individual step or at least one argument is wrong, or omit a prerequisite needed to judge it.`,
      execute: `Apply only ${operation}: ${meaning}. Its supplied arguments and timing satisfy the rules for this individual step. Check what must already have happened first.`,
    },
  );
  trace.push(answer);
  if (answer.label !== "execute") {
    throw new MatchHalt(`Drex không xác nhận thao tác ${selected.operation}.`, answer.requestId);
  }
}
