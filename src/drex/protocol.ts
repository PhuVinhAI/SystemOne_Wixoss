import { flags, frames, intents, phases, seats, zones, type Declaration, type Intent, type Seat, type State, type Zone } from "../domain/types.js";
import { boxName, displayedPower, lrigSlots, slots } from "../game/board.js";
import { MatchHalt, type Choices } from "../game/options.js";
import { areas, counterNames, declarationIsSaved, operations, selectedGroup, type Operation } from "../game/primitives.js";
import { canSeeCard, visible } from "../game/view.js";
import type { Deck } from "../domain/types.js";
import type { Decision, DrexClient } from "./client.js";
import { auditCompletionPrompt, auditFieldResultPrompt, auditOperationPrompt, auditTransferPrompt, combatWindowFocus, selectOperationPrompt } from "./prompts.js";

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
  retire: "In the player's own Main Phase, declare their once-per-turn simultaneous Retire of one to three SIGNI currently on their field.",
  attack: "Name one eligible upped attacker in the current SigniAttack or LrigAttack step.",
  guard: "Choose a card from hand to Guard.",
  burst: "Use the revealed card's Life Burst.",
  choose: "Submit a set of cards from the prepared candidates for the pending decision, such as discard, cost or targets.",
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
  const intent = state.promptIntents.length === 1 ? state.promptIntents[0]!
    : await ask("Which offered action do you choose for this player window?", selectIntent(state)) as Intent;
  const visibleCards = cardOptions(state, deck, sources(state), actor);
  const selection = state.offeredSelection;
  const available = selection ? Object.fromEntries(selection.candidates.flatMap((id) =>
    Object.hasOwn(visibleCards, id) ? [[id, visibleCards[id]!]] : [])) : visibleCards;
  const card = cardRequired(intent) ? await ask(`Choose a visible card for ${intent}.`, available) : null;
  const cards: string[] = [];
  if (groupIntents.includes(intent)) {
    const min = selection?.min ?? 0;
    const max = Math.min(selection?.max ?? 51, Object.keys(available).length);
    if (max < min) throw new MatchHalt("Không đủ lá có thể xem trong cửa sổ chọn bài.");
    while (cards.length < max) {
      const remaining = Object.fromEntries(Object.entries(available).filter(([id]) => !cards.includes(id)));
      if (cards.length >= min) remaining["done"] = "Submit the complete set of selected cards now.";
      const selected = await ask(`Seat ${actor}: make the player's selection. The table has opened ${intent} and supplied the candidates below. Choose the card you prefer to submit among these candidates. A set requires ${min}–${max} cards. Already picked: ${cards.join(", ") || "none"}. Select done only if offered and you want to stop adding cards.`,
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
  if (!state.selection.length && !state.offeredSelection) {
    delete choices["clearSelection"];
  }
  const hasExpiringState = state.marks.some(({ ends }) => ends !== null && ends <= state.turn)
    || Object.values(state.cards).some(({ adjustments }) => adjustments.some(({ expires }) => expires <= state.turn));
  if (!hasExpiringState) delete choices["clearTurn"];
  if (!declarationIsSaved(state)) delete choices["control"];
  const groups = [
    { key: "selected", actor: "table", text: "Working selection" },
    { key: "declared", actor: state.declaration?.actor, text: "Current declaration" },
    ...state.frames.map((frame, index) => ({ key: `frame${index}`, actor: frame.actor, text: `Saved declaration in ${frame.kind} frame` })),
  ].filter(({ key }) => selectedGroup(state, key).length);
  if (!groups.length || state.offeredSelection) delete choices["moveSelected"];
  else choices["moveSelected"] = `${operations.moveSelected} Available complete groups: ${groups.map(({ key, actor, text }) =>
    `${text} for ${actor} (${key}, ${selectedGroup(state, key).length} cards)`).join("; ")}.`;
  choices["select"] = `${operations.select} Use it to build a new working group only. A submitted or saved declaration already supplies its whole group.`;
  if (state.offeredSelection) {
    for (const option of Object.keys(choices)) {
      if (!["control", "clearSelection", "consume", "push"].includes(option)) delete choices[option];
    }
  }
  if (!selectionSources.length || state.selection.length < 2 || state.selection.length > emptySlots.length) {
    delete choices["distribute"];
  }
  const pending = state.declaration ? declarationIsSaved(state)
    ? " The current declaration has a copy in a frame. When the active work requires a new player decision, control can hand off to that player while the saved copy remains. Unresolved work stays in that frame."
    : " If the current declaration has completed its purpose, use consume. If it still has work and needs a nested player decision, save it in a frame before handing off."
    : "";
  const setup = state.phase === "Setup"
    ? ` Current counts: A.hand ${state.players.A.hand.length}, B.hand ${state.players.B.hand.length}, A.life ${state.players.A.life.length}, B.life ${state.players.B.life.length}. Compare with recorded mulligans and actual transfers before dealing more cards.`
    : "";
  const combatWindow = ["PreAttack", "Defense", "SigniAttack", "LrigAttack"].includes(state.phase)
    ? ` ${combatWindowFocus}` : "";
  const operation = await ask(selectOperationPrompt + pending + setup + combatWindow, choices) as Operation;
  const parameter = (name: string, options: Choices, detail = "") =>
    ask(`For ${operation} only, choose ${name} consistent with the current step and arguments already selected. ${detail}`, options);
  const actor = () => parameter("actor", list(seats));
  const subject = () => parameter("subject", { ...list(seats), ...known });
  const expires = () => parameter("expiry", { permanent: "Permanent until removed", [state.turn]: "End of current turn", [state.turn + 1]: "End of next turn" });
  const args: Record<string, string> = {};
  switch (operation) {
    case "move":
    case "take":
    case "random": {
      args["from"] = await parameter("source zone", list(nonempty.filter((entry) =>
        operation !== "move" || entry.ids.some((id) => Object.hasOwn(known, id))).map((entry) => entry.label)), setup);
      const source = all.find((entry) => entry.label === args["from"])!;
      const destinations = all.filter((entry) =>
        entry.label !== source.label && (!slots.has(entry.zone) || !entry.ids.length));
      const destinationQuestion = state.phase === "Setup" && operation === "take"
        ? "Which pile receives cards at this Setup step: an opening or replacement hand below five, or a Life Cloth pile after both mulligans are complete? Check whether that pile has already been filled."
        : "destination zone";
      args["to"] = await parameter(destinationQuestion, list(destinations.map(({ label }) => label)),
        `From ${source.label}.${setup}`);
      const destination = all.find((entry) => entry.label === args["to"])!;
      if (operation === "move") args["card"] = await parameter("card", cardOptions(state, deck, [source], "table"), `From ${source.label} to ${destination.label}.`);
      else args["count"] = await parameter("exact number of cards", list(range(1, slots.has(destination.zone) ? 1 : source.ids.length)),
        `From ${source.label} to ${destination.label}. Select the rules-correct count for this step.`);
      args["face"] = await parameter("face orientation on arrival", faceOptions, `From ${source.label} to ${destination.label}.`);
      break;
    }
    case "moveSelected": {
      args["from"] = groups.length > 1
        ? await parameter("group to move simultaneously", Object.fromEntries(groups.map(({ key, actor, text }) =>
          [key, `${text} for ${actor}: ${selectedGroup(state, key).join(", ")}.`])))
        : groups[0]!.key;
      const group = selectedGroup(state, args["from"]);
      args["to"] = await parameter("common destination for this group", list(all.filter(({ ids, zone }) =>
        !group.some((id) => ids.includes(id)) && (!slots.has(zone) || (!ids.length && group.length === 1)))
        .map(({ label }) => label)));
      args["face"] = await parameter("face orientation on arrival", faceOptions, `Move all selected cards to ${args["to"]} together.`);
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
        visible: "Consider cards across all zones, including separate field lanes. Judge each card for eligibility.",
      }, "Offer the full eligible set. If the rule refers to a field or to multiple zones, choose visible so every qualifying lane and zone is considered.");
      const pool = args["source"] === "selection" ? state.selection : args["source"] === "visible"
        ? Object.keys(known) : all.find((entry) => entry.label === args["source"])!.ids;
      const candidates = Object.fromEntries(pool.flatMap((id) => Object.hasOwn(known, id) ? [[id, known[id]!]] : []));
      const sourceCard = state.frames.findLast((frame) => frame.source)?.source ?? state.declaration?.card;
      const resolving = sourceCard ? deck.cards[state.cards[sourceCard]!.definition] : undefined;
      const effect = resolving ? JSON.stringify({
        name: resolving.name,
        text: state.frames.at(-1)?.kind === "burst" ? resolving.burst : resolving.text,
      }) : "Use the current frame, declaration and rules.";
      const matches = await ask.each(Object.fromEntries(Object.entries(candidates).map(([id, description]) => [id, {
        question: `Pending requirement: ${effect} Candidate: ${description}. Can this card belong to any legal selection for the current step? A group quota limits the final selection, not the alternatives included in the candidate list.`,
        choices: { eligible: "This card satisfies the individual requirements and can appear in at least one legal selection.",
          excluded: "A rule or printed restriction excludes this card from every legal selection." },
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
    case "face": {
      const field = operation === "orient" ? "down" : operation === "freeze" ? "frozen" : "faceUp";
      const declaredCard = state.declaration?.card;
      const inputs = operation === "face" ? nonempty : nonempty.filter(({ zone }) => slots.has(zone) || lrigSlots.has(zone));
      const cards = cardOptions(state, deck, inputs, "table");
      args["target"] = await parameter("affected card or zone", { ...list(inputs.map(({ label }) => label)), ...cards },
        declaredCard ? `Current declaration named this card: ${known[declaredCard] ?? declaredCard}.` : "");
      const ids = all.find(({ label }) => label === args["target"])?.ids ?? [args["target"]!];
      const values = operation === "orient" ? { true: "Down", false: "Up" }
        : operation === "freeze" ? { true: "Frozen", false: "Unfrozen" } : { true: "Face up", false: "Face down" };
      const changes = Object.fromEntries(Object.entries(values).filter(([value]) =>
        ids.some((id) => state.cards[id]![field] !== (value === "true"))));
      args["value"] = await parameter("new state of this target", changes, `Target: ${cards[args["target"]] ?? args["target"]}.`);
      break;
    }
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
      const window = `Seat ${args["actor"]}, phase ${state.phase}, scope ${args["scope"]}. A frame window covers only the unresolved decision of the top frame. A match window covers actions available in the current phase. Judge this action type independently of all other choices and of strategy.`;
      const side = state.players[args["actor"] as Seat];
      const lrigEvidence = [...side.centerLrig.slice(0, 1), ...side.leftLrig.slice(0, 1), ...side.rightLrig.slice(0, 1), ...side.lrigDeck]
        .map((id) => {
          const { name, level, timing, growCost, group } = deck.cards[state.cards[id]!.definition]!;
          return `${id} ${name} | Level ${level} | type ${group} | timing ${timing || "—"} | Grow cost ${growCost || "—"}`;
        }).join("; ");
      const signiEvidence = Object.entries(cardOptions(state, deck, all.filter(({ seat, zone }) =>
        seat === args["actor"] && slots.has(zone)), "table")).map(([, card]) => card).join("; ") || "none";
      const handEvidence = cardOptions(state, deck, all.filter(({ seat, zone }) =>
        seat === args["actor"] && zone === "hand"), "table");
      const activeCenter = state.players[args["actor"] as Seat].centerLrig[0];
      const activeLrig = activeCenter ? deck.cards[state.cards[activeCenter]!.definition] : undefined;
      const openSigniSlots = [...slots].filter((zone) => state.players[args["actor"] as Seat][zone].length === 0);
      const mulliganWindow = state.phase === "Setup" && state.offeredSelection !== null
        && state.offeredSelection.candidates.length > 0
        && state.offeredSelection.candidates.every((id) => state.players[args["actor"] as Seat].hand.includes(id));
      const evidence: Partial<Record<Intent, string>> = {
        ...(mulliganWindow ? { mulligan: `Setup has staged this seat's opening hand. Mulligan is the required declaration for this hand window, including an empty selection to keep. Do not omit mulligan or replace it with pass.` } : {}),
        pass: "Check whether the player can end this window without taking the optional action. A staged candidate set does not remove a legal pass when the action itself is optional. An unresolved mandatory card choice is different.",
        grow: `${state.phase === "Grow" ? "Center Grow is available to the active Center LRIG when its next LRIG and cost are legal." : "Center Grow is illegal outside the Grow Phase. In this window offer grow only for a legal Assist Grow whose printed timing includes the current phase."} Check Assist Grow separately by comparing printed timing, cost, current top LRIG of the matching type and Center level. Current top LRIGs followed by LRIG Deck records: ${lrigEvidence}.`,
        retire: `This seat's SIGNI on the field: ${signiEvidence}. Use committed operations, saved declarations and marks to check whether Retire has already been used this turn. Consider the effect of Retire even when field Level equals Limit.`,
        play: `This seat's hand: ${Object.values(handEvidence).join("; ") || "none"}. Center is ${activeLrig?.name ?? "none"}, Level ${activeLrig?.level ?? 0}, printed Limit ${activeLrig?.limit ?? 0}. Field: ${signiEvidence}. Empty slots: ${openSigniSlots.join(", ") || "none"}. Offer play in Main if an empty slot and at least one hand SIGNI meet both the Center Level restriction and effective Limit after placement.`,
        attack: `An attack declaration names one attacker, even when a list is staged. Current SIGNI: ${signiEvidence}. A match-scoped SigniAttack window should offer attack if it has at least one eligible upped SIGNI. A match-scoped LrigAttack window uses the active Center LRIG. Staged candidates restrict which card can be named.`,
        choose: `Staged candidates: ${JSON.stringify(state.offeredSelection)}. Omit generic choose when this staged list supplies parameters for a named action available in the phase, such as attack. Offer choose for a pending card-selection decision where no named action expresses the declaration.`,
      };
      const options = await ask.each(Object.fromEntries(intents
        .filter((intent) => intent !== "choose" || state.offeredSelection)
        .map((intent) => [intent, {
          question: `${window} Should this exact window offer ${intent}? ${actionText[intent]} To offer it, identify at least one legal declaration from the rules, printed use timing, and live table. Use specific intents for phase actions, even if candidate cards were staged. Use choose for card selections inside a resolution. Only offer a printed mode in its mode decision window. ${evidence[intent] ?? ""}`,
          choices: {
            offer: "There is at least one rules-legal declaration of this type in this window, with any required inputs available.",
            omit: "This declaration type has no legal instance in this window.",
          },
        }])));
      const picked = intents.filter((intent) => options[intent] === "offer");
      if (options.pass === "omit" && !picked.includes("mulligan") && !mulliganWindow) {
        const ending = await parameter("permission to end this player window", {
          mayPass: "The player is allowed to close this exact window without submitting another action or card.",
          mustDecide: "The player must supply a decision in this window before it can close.",
        }, `Seat ${args["actor"]}, phase ${state.phase}, scope ${args["scope"]}. Review the rules and outstanding choice for this window. Ignore the previous pass classification. Staged cards describe inputs for an action; they do not make an optional phase action mandatory.`);
        if (ending === "mayPass") picked.unshift("pass");
      }
      if (!picked.length) throw new MatchHalt("Drex không tìm được lựa chọn hợp lệ cho cửa sổ.");
      args["intents"] = picked.join(",");
      break;
    }
    case "turn": args["actor"] = await parameter("incoming active seat", list(seats.filter((seat) => seat !== state.active))); break;
    case "counter":
      args["actor"] = await actor();
      args["name"] = await parameter("counter name", list(counterNames));
      args["value"] = await parameter("new counter value", list(range(0, 51)), `Counter ${args["actor"]}.${args["name"]}.`);
      break;
    case "phase": args["value"] = await parameter("next phase", list(phases)); break;
    case "push": {
      args["frame"] = await parameter("resolution frame kind", list(frames));
      const frameActorChoices = state.phase === "Setup" && state.declaration?.intent === "mulligan"
        ? { [state.declaration.actor]: `The current mulligan declaration belongs to ${state.declaration.actor}; save it in this frame.` }
        : list(seats);
      args["actor"] = await parameter("controller", frameActorChoices,
        `Opening ${args["frame"]} frame.${state.declaration ? ` Current declaration actor: ${state.declaration.actor}.` : ""}`);
      args["source"] = await parameter("source card or none", { none: "No source card", ...known }, `Opening ${args["frame"]} frame for ${args["actor"]}.`);
      break;
    }
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
        ? await parameter("whether to clear the current declaration as part of closing these frames", {
          false: "Preserve the current declaration so it can be resolved or acknowledged separately.",
          true: "Clear the current declaration now. Its own work is completed and no subsequent step needs it.",
        }, `Current declaration: ${JSON.stringify(state.declaration)}. Top frame's saved declaration: ${JSON.stringify(state.frames.at(-1)?.declaration ?? null)}. Prefer false when the declarations differ and the current one can be acknowledged separately.`)
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
  const record = (answer: Decision, key: string) => {
    trace.push(answer);
    if (answer.label === "halt") throw new MatchHalt("Drex yêu cầu dừng khi đang xác định thao tác.", answer.requestId);
    steps.push(`${key} => ${answer.label}`);
    return answer.label;
  };
  const snapshot = () => steps.length ? `${initial}\n\nCURRENT REQUEST: PREVIOUS ANSWERS\n${steps.join("\n")}` : initial;
  const ask = async (question: string, choices: Choices) => {
    const answer = await drex.decide(snapshot(), question, choices);
    return record(answer, question);
  };
  return Object.assign(ask, {
    async each(questions: Parameters<Ask["each"]>[0]) {
      if (!Object.keys(questions).length) return {};
      const answers = await drex.decideBatch(snapshot(), questions);
      trace.push(...Object.values(answers));
      const stopped = Object.values(answers).find((answer) => answer.label === "halt");
      if (stopped) throw new MatchHalt("Drex không xác định được ứng viên.", stopped.requestId);
      return Object.fromEntries(Object.entries(answers).map(([id, answer]) => {
        steps.push(`${id} => ${answer.label}`);
        return [id, answer.label];
      }));
    },
  });
}

export async function verifyOperation(
  drex: DrexClient, snapshot: string, selected: Awaited<ReturnType<typeof chooseOperation>>, trace: Decision[],
  work: { state: State; deck: Deck },
) {
  const { operation, args } = selected;
  const meaning = operation === "control" ? `Open the ${args["scope"]} decision window for seat ${args["actor"]} with these intents: ${args["intents"]}. Preserve any staged selection and declarations saved in frames.`
    : operation === "consume" ? "Acknowledge the current declaration only. Keep every resolution frame and the staged candidates for the next decision."
    : operation === "move" ? `Move ${args["card"]} from ${args["from"]} to ${args["to"]}`
    : operation === "pop" || operation === "closeFrames" ? `Close ${operation === "pop" ? "one frame" : args["count"] + " frames"}; acknowledge current declaration: ${args["acknowledge"]}. Closing frames removes declarations those frames store.`
    : operation === "chooseFrom" ? `Offer exactly these cards from ${args["source"]}: ${args["eligible"] || "none"}. Can select from ${args["min"]} to ${args["max"]} cards. Confirm each eligible card and every legal selection size; 'up to' permits zero.`
    : operation === "orient" ? `${args["value"] === "true" ? "Down" : "Up"} ${args["target"]}`
    : operation === "face" ? (args["value"] === "true" ? "Face up" : "Face down")
    : operation === "freeze" ? (args["value"] === "true" ? "Set Frozen" : "Clear Frozen")
    : operations[operation];
  const facts = `OPERATION TO AUDIT\n${JSON.stringify(selected)}\nPhysical meaning: ${meaning}.\n\n${snapshot}`;
  const { state, deck } = work;
  if (args["to"] && ["move", "take", "stack", "random", "moveSelected"].includes(operation) && state.phase !== "Setup") {
    const transferred = operation === "move" ? [args["card"]!]
      : operation === "moveSelected" ? selectedGroup(state, args["from"]!) : [];
    const locations = sources(state);
    const known = cardOptions(state, deck, locations, "table");
    const declaration = state.declaration;
    const declaredCard = declaration?.card ? known[declaration.card] : undefined;
    const none = "The current instruction does not require this transfer.";
    const routes = await drex.decideBatch(
      `CURRENT DECLARATION\n${JSON.stringify(declaration)}\n${declaredCard ?? ""}\nCARDS OR PILE POSITIONS UNDER REVIEW\n${transferred.length ? transferred.map((id) => known[id] ?? id).join("\n") : `${operation} from ${args["from"]}, count ${args["count"] ?? "all"}`}\n\n${snapshot}`,
      {
        destination: {
          question: `Source is ${args["from"]}. ${auditTransferPrompt} For a SIGNI attack, use the actual opposing lane and determine battle or damage before answering. For a draw, the source is the applicable Main Deck and the destination is the drawing seat's hand.`,
          choices: { none, ...list(areas) },
        },
        ...(transferred.length ? {} : { source: {
          question: `To move cards into ${args["to"]} at this exact step, which source zone does the rule or printed effect require? Resolve the latest declaration before assuming an effect is active. If this is a declared movement of a named card, answer the named card's current zone. If no transfer is required, choose none.`,
          choices: { none, ...list(locations.filter(({ ids }) => ids.length).map(({ label }) => label)) },
        } }),
      },
    );
    trace.push(...Object.values(routes));
    const mismatch = routes["source"] && routes["source"].label !== args["from"] ? routes["source"]
      : routes["destination"]?.label !== args["to"] ? routes["destination"] : undefined;
    if (mismatch) throw new MatchHalt("Drex không xác nhận nguồn hoặc đích của thao tác chuyển bài.", mismatch.requestId);
  }
  const top = state.frames.at(-1);
  const closesFrame = operation === "pop" || operation === "closeFrames";
  const sourceFrame = operation === "move" && args["from"]?.endsWith(".check")
    ? state.frames.findLast(({ source }) => source === args["card"]) : undefined;
  if (sourceFrame || (top && closesFrame)) {
    const affected = sourceFrame ? [sourceFrame] : state.frames.slice(-(operation === "closeFrames" ? Number(args["count"]) : 1));
    const records = affected.map(({ kind, actor, source, step, declaration }) => {
      const printed = source && deck.cards[state.cards[source]!.definition];
      return { kind, actor, step, source, declaration, ...(printed ? { name: printed.name, text: kind === "burst" ? printed.burst : printed.text } : {}) };
    });
    const cleanupState = `FRAMES TO CHECK\n${JSON.stringify(records)}\n\nPROPOSED CLEANUP\n${meaning}\n\n${snapshot}`;
    const questions: Parameters<DrexClient["decideBatch"]>[1] = {
      progress: { question: auditCompletionPrompt, choices: {
        decision: "A required player decision has yet to be recorded or applied.",
        result: "A required physical outcome of the instruction has yet to be applied.",
        followup: "An outstanding rule check, trigger or cleanup must occur before this operation.",
        complete: "Each obligation preceding this operation is accounted for by its own committed result or by evidence that it does not apply.",
      } },
    };
    if (sourceFrame) {
      const field = sources(state).filter(({ zone }) => slots.has(zone));
      for (const [id, description] of Object.entries(cardOptions(state, deck, field, "table"))) {
        questions[id] = { question: `${auditFieldResultPrompt} Field card: ${description}.`, choices: {
          pending: "The source requires a still-unapplied result involving this card.",
          complete: "No outstanding result involving this card is required before cleanup.",
        } };
      }
    }
    const progress = Object.values(await drex.decideBatch(cleanupState, questions));
    trace.push(...progress);
    const incomplete = progress.find(({ label }) => label !== "complete");
    if (incomplete) throw new MatchHalt("Drex chưa xác nhận hiệu ứng đã hoàn tất.", incomplete.requestId);
  }
  const question = operation === "control"
    ? `Audit the proposed window for seat ${args["actor"]} on turn ${state.turn} in ${state.phase}. Offered actions: ${args["intents"]}. Check the window against this phase and any pending resolution. Earlier phases and turns cannot close this window. Prior offered actions describe an old menu and do not establish that a player submitted a choice. Check only proposed actions. The next API call handles the player's selection.${args["scope"] === "match" && ["PreAttack", "Defense"].includes(state.phase) ? ` ${combatWindowFocus}` : ""}`
    : operation === "consume"
      ? "Has the exact CURRENT TABLE declaration already completed its own job? Compare it with committed operations in order. A pass is complete once it closed its decision window. A committed transition to the next step after the pass is evidence of that closure. The next player action, staged candidate set and parent frame can still be pending. Acknowledge the completed declaration and preserve that later work."
    : `Proposed: ${meaning}. ${auditOperationPrompt} A staged candidate list is evidence of a pending player choice. Check whether this operation applies a recorded declaration or instead makes the player's decision on their behalf.`;
  const answer = await drex.decide(
    facts,
    question,
    {
      stop: "There is a concrete conflict in legality, timing, arguments or preservation of pending work.",
      execute: "This exact step is legal now and preserves any work that still needs to be resolved.",
    },
  );
  trace.push(answer);
  if (answer.label !== "execute") {
    throw new MatchHalt(`Drex không xác nhận thao tác ${selected.operation}.`, answer.requestId);
  }
}
