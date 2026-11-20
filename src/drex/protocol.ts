import { flags, frames, intents, phases, seats, zones, type Declaration, type Intent, type Seat, type State, type Zone } from "../domain/types.js";
import { boxName, displayedPower, lrigSlots, slots } from "../game/board.js";
import { MatchHalt, type Choices } from "../game/options.js";
import { areas, counterNames, declarationIsSaved, operations, selectedGroup, type Operation } from "../game/primitives.js";
import { canSeeCard, visible } from "../game/view.js";
import type { Deck } from "../domain/types.js";
import type { Decision, DrexClient } from "./client.js";
import { auditCompletionPrompt, auditFieldResultPrompt, auditOperationPrompt, auditTransferPrompt, chooserFocus, combatWindowFocus, frameFocus, growEligibility, growFocus, mulliganOrder, selectOperationPrompt, selectionFocus, targetFocus, transferFocus, windowFocus } from "./prompts.js";

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

function growEvidence(state: State, deck: Deck, actor: Seat, id: string) {
  const input = deck.cards[state.cards[id]!.definition]!;
  const stacks = Array.from(lrigSlots, (zone) => {
    const top = state.players[actor][zone][0];
    const card = top && visible(state, actor, actor, zone, top) ? deck.cards[state.cards[top]!.definition] : undefined;
    return `${zone}: ${card ? `${card.name}, Level ${card.level}, type ${card.group}` : "no visible top card"}`;
  });
  const ener = state.players[actor].ener.filter((cardId) => visible(state, actor, actor, "ener", cardId)).map((cardId) => {
    const card = deck.cards[state.cards[cardId]!.definition]!;
    return `${cardId} ${card.color}${card.text ? ` (${card.text})` : ""}`;
  });
  return `Current LRIG tops: ${stacks.join("; ")}. Incoming card: ${input.name}, ${input.type}, Level ${input.level}, type ${input.group}, printed timing ${input.timing}, Grow cost ${input.growCost}. Available Ener (${ener.length}): ${ener.join("; ") || "none"}. ${growEligibility}`;
}

const range = (min: number, max: number) => Array.from({ length: Math.max(0, max - min + 1) }, (_, i) => String(i + min));
const boolean = list(["true", "false"]);
const faceOptions = { keep: "Preserve face orientation.", up: "Face up.", down: "Face down." };
const groupIntents: Intent[] = ["mulligan", "retire", "choose"];
const emptySelectionQuestion = "what to do when zero candidates qualify";
function cardRequired(intent: Intent) {
  return ["charge", "grow", "play", "cast", "ability", "attack", "guard"].includes(intent);
}

export async function chooseDeclaration(state: State, deck: Deck, actor: Seat, ask: Ask): Promise<Declaration> {
  const locations = sources(state);
  const visibleCards = cardOptions(state, deck, locations, actor);
  const selection = state.offeredSelection;
  const available = selection ? Object.fromEntries(selection.candidates.flatMap((id) =>
    Object.hasOwn(visibleCards, id) ? [[id, visibleCards[id]!]] : [])) : visibleCards;
  const candidateMenus: Partial<Record<Intent, Choices>> = {};
  const questions: Parameters<Ask["each"]>[0] = {};
  const levelQuestions: Parameters<Ask["each"]>[0] = {};
  const centerId = state.players[actor].centerLrig[0];
  const center = centerId && visible(state, actor, actor, "centerLrig", centerId)
    ? deck.cards[state.cards[centerId]!.definition] : undefined;
  for (const action of state.promptIntents.filter(cardRequired)) {
    const sourcesForAction = locations.filter(({ seat, zone }) => {
      if (action === "grow") return seat === actor && zone === "lrigDeck";
      if (action === "cast") return seat === actor && (zone === "hand" || zone === "lrigDeck");
      if (action === "attack" || action === "ability") return slots.has(zone) || lrigSlots.has(zone);
      if (action === "charge") return seat === actor && (zone === "hand" || slots.has(zone));
      return seat === actor && zone === "hand";
    });
    const menu = Object.fromEntries(Object.entries(cardOptions(state, deck, sourcesForAction, actor))
      .filter(([id]) => Object.hasOwn(available, id)));
    candidateMenus[action] = menu;
    const preparedCharge = action === "charge" && selection && state.phase === "Ener";
    if (preparedCharge) continue;
    for (const [id, description] of Object.entries(menu)) {
      const card = deck.cards[state.cards[id]!.definition]!;
      if (action === "grow" && card.type === "ASSIST LRIG" && center) {
        levelQuestions[id] = {
          question: `Compare only these values. Current Center Level: ${center.level}. Incoming Assist Level: ${card.level}. Is the incoming Assist Level higher than the Center Level?`,
          choices: { above: "Incoming Assist Level is greater than current Center Level.", within: "Incoming Assist Level is equal to or lower than current Center Level." },
        };
      }
      const eligibilityFocus: Partial<Record<Intent, string>> = {
        charge: `In the open Ener Phase window of the turn player, one card from that player's hand or one SIGNI from that player's field can be charged, with no payment. Turn player: ${state.active}. Candidate location and type: ${description}. Check this exact card for the named charge option.`,
        cast: "Use cast for a Spell or PIECE. An Assist LRIG enters by Grow. Check printed timing and the full payable cost.",
        attack: "In SigniAttack choose an upped SIGNI of the turn player. In LrigAttack choose their upped Center LRIG. Check any printed restriction.",
        guard: "Check that this hand card has Guard and the open window resolves an opposing Center LRIG attack.",
      };
      questions[`${action}_${id}`] = {
        question: `Can seat ${actor} legally declare ${action} with ${description} in this ${state.phase} window? ${action === "grow" ? `Turn player: ${state.active}. ${card.type === "ASSIST LRIG" ? "Evaluate the printed Assist timing for this window. A Colorless Grow cost can use any Ener. The Enter effect and any separate Enter payment happen after Grow." : "Center LRIG Grow is available only in the Grow phase."} ${growEvidence(state, deck, actor, id)}` : eligibilityFocus[action] ?? "Check timing, controller, card type, costs and any other prerequisite. A legal placement needs at least one legal destination."} Judge legality only using visible evidence.`,
        choices: { legal: "At least one legal declaration of this action names this card.", illegal: "No legal declaration of this action can name this card now." },
      };
    }
  }
  const levels = await ask.each(levelQuestions);
  for (const [id, level] of Object.entries(levels)) {
    if (level === "above") delete questions[`grow_${id}`];
  }
  const eligibility = await ask.each(questions);
  const menu = selectIntent(state);
  for (const [action, cards] of Object.entries(candidateMenus)) {
    const preparedCharge = action === "charge" && selection && state.phase === "Ener";
    const legal = preparedCharge ? cards : Object.fromEntries(Object.entries(cards).filter(([id]) => eligibility[`${action}_${id}`] === "legal"));
    candidateMenus[action as Intent] = legal;
    if (Object.keys(legal).length) menu[action] += ` Candidates: ${Object.values(legal).join("; ")}.`;
    else delete menu[action];
  }
  const options = Object.keys(menu);
  if (!options.length) throw new MatchHalt("Drex không tìm được khai báo hợp lệ trong cửa sổ đã mở.");
  const intent = (options.length === 1 ? options[0] :
    await ask("Choose a strategic action among the legal declarations for this player window.", menu)) as Intent;
  const card = cardRequired(intent) ? await ask(`Choose a card for ${intent}.`, candidateMenus[intent]!) : null;
  const cards: string[] = [];
  if (groupIntents.includes(intent)) {
    const min = selection?.min ?? 0;
    const max = Math.min(selection?.max ?? 51, Object.keys(available).length);
    if (max < min) throw new MatchHalt("Không đủ lá có thể xem trong cửa sổ chọn bài.");
    const frame = state.frames.at(-1);
    const source = frame?.source && canSeeCard(state, actor, frame.source) ? deck.cards[state.cards[frame.source]!.definition] : undefined;
    const instruction = source ? `Visible source: ${source.name}. ${frame?.kind === "burst" ? source.burst : source.text}` : "";
    while (cards.length < max) {
      const remaining = Object.fromEntries(Object.entries(available).filter(([id]) => !cards.includes(id)));
      if (cards.length >= min) remaining["done"] = "Submit the complete set of selected cards now.";
      const selected = await ask(`Seat ${actor}, ${state.phase}, ${frame?.kind ?? "phase"} window. The table has asked you to ${intent}. ${instruction} Choose one card label among the prepared candidates for the outstanding choice. ${selection ? "The table has already checked individual eligibility. Select by strategy and check any constraints on the combined set." : "Check that the choice is legal in this window."} Choose a set of ${min}–${max} cards. Already picked: ${cards.join(", ") || "none"}. Choose done only when offered and you want to submit the set.`,
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
    `Judge the declaration now. Priority evidence: ${detail}. ${declaration.intent === "grow" && declaration.card ? growEvidence(state, deck, declaration.actor, declaration.card) : declaration.intent === "cast" ? "Use cast for a Spell or PIECE. An Assist LRIG enters by Grow." : ""} Check the card type and the exact set together. If two cards share a group with a printed one-per-group cap, the set is illegal although each is individually eligible. An empty submitted set counts as zero and is a fully declared choice where zero is permitted. Check the acting seat, timing and destination. Do not perform a different choice.`,
    {
      legal: "This exact player declaration is legal now, including the combination of all selected cards.",
      illegal: "The declaration contradicts an identifiable rule or the printed instruction.",
    },
  );
  trace.push(answer);
  if (answer.label === "halt") throw new MatchHalt("Drex không xác định được tính hợp lệ của lựa chọn.", answer.requestId);
  return answer.label === "legal";
}

export async function chooseOperation(state: State, deck: Deck, ask: Ask, excluded?: Operation) {
  const all = sources(state);
  const nonempty = all.filter(({ ids }) => ids.length > 0);
  const known = cardOptions(state, deck, all, "table");
  const choices: Choices = { ...operations };
  if (excluded) delete choices[excluded];
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
  const pending = state.declaration ? ` Current declaration: ${JSON.stringify(state.declaration)}. ${state.declaration.intent === "charge" ? "Charge is the voluntary Ener move. Apply the named card's transfer to the declaring seat's Ener if it is still outstanding. Printed effects of that card do not resolve merely because it is charged." : ""} ${declarationIsSaved(state)
    ? "The current declaration has a copy in a frame. When the active work requires a new player decision, control can hand off to that player while the saved copy remains. Unresolved work stays in that frame."
    : "If the current declaration has completed its purpose, use consume. If it still has work and needs a nested player decision, save it in a frame before handing off."}`
    : "";
  const setup = state.phase === "Setup"
    ? ` Current counts: A.hand ${state.players.A.hand.length}, B.hand ${state.players.B.hand.length}, A.life ${state.players.A.life.length}, B.life ${state.players.B.life.length}. Saved mulligan submissions: ${state.frames.filter(({ declaration }) => declaration?.intent === "mulligan").map(({ declaration }) => `${declaration!.actor} (${declaration!.cards.length} cards)`).join(", ") || "none"}. Check the current declaration and COMMITTED IN THIS PHASE for any other submission. ${mulliganOrder}`
    : "";
  const combatWindow = ["PreAttack", "Defense", "SigniAttack", "LrigAttack"].includes(state.phase)
    ? ` Current combat step: ${state.phase}. Turn player: ${state.active}. ${combatWindowFocus}` : "";
  const signiAttack = state.phase === "SigniAttack" ? ` Turn player's SIGNI: ${Object.values(cardOptions(state, deck,
    all.filter(({ seat, zone }) => seat === state.active && slots.has(zone)), "table")).join("; ") || "none"}. Each eligible upped SIGNI can attack. Power, color and the presence of an opposing SIGNI affect the result of the attack, not its basic eligibility. Continue the SIGNI window after one attack while another legal attacker remains and the player has not passed.` : "";
  const operation = await ask(selectOperationPrompt + setup + pending + combatWindow + signiAttack
    + " Before opening a phase window, check committed actions in this phase. If its closing pass or once-only phase action already resolved, advance phase after its pending work. " + frameFocus, choices) as Operation;
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
      if (operation === "move") args["card"] = await parameter("card", cardOptions(state, deck, [source], "table"),
        `From ${source.label}. Identify the exact card affected by the outstanding step.`);
      const destinationQuestion = state.phase === "Setup" && operation === "take"
        ? "Which pile receives cards at this Setup step: an opening or replacement hand below five, or a Life Cloth pile after both mulligans are complete? Check whether that pile has already been filled."
        : "destination zone";
      args["to"] = await parameter(destinationQuestion, list(destinations.map(({ label }) => label)),
        `From ${source.label}.${operation === "move" ? ` Card: ${known[args["card"]!]}. ${transferFocus}` : setup}`);
      const destination = all.find((entry) => entry.label === args["to"])!;
      if (operation !== "move") args["count"] = await parameter("exact number of cards", list(range(1, slots.has(destination.zone) ? 1 : source.ids.length)),
        `From ${source.label} to ${destination.label}. Select the rules-correct count for this step.`);
      args["face"] = await parameter("face orientation on arrival", faceOptions, `From ${source.label} to ${destination.label}. Check the destination's visibility and the event's rules. A card entering a public zone such as Trash is face up unless a rule or effect explicitly puts it face down. Choose keep only if its current face already matches.`);
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
        .map(({ label }) => label)), `Submitted group: ${group.map((id) => known[id] ?? id).join("; ")}. ${transferFocus}`);
      args["face"] = await parameter("face orientation on arrival", faceOptions, `Move all selected cards to ${args["to"]} together. A card entering a public zone such as Trash is face up unless a rule or effect explicitly puts it face down. Choose keep only if every selected card already has the required face.`);
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
      const frame = state.frames.at(-1);
      const sourceCard = frame?.source ?? state.declaration?.card;
      const resolving = sourceCard ? deck.cards[state.cards[sourceCard]!.definition] : undefined;
      const effect = resolving ? JSON.stringify({
        name: resolving.name,
        cost: resolving.cost,
        growCost: resolving.growCost,
        text: frame?.kind === "burst" ? resolving.burst : resolving.text,
      }) : "Use the current frame, declaration and rules.";
      args["source"] = await parameter("candidate source", {
        ...list(nonempty.map((entry) => entry.label)),
        ...(state.selection.length ? { selection: "Use the current working selection." } : {}),
        visible: "Consider cards across all zones, including separate field lanes. Judge each card for eligibility.",
      }, `Source text: ${effect}. Offer the full eligible set. ${targetFocus} Choose visible for multiple lanes or zones.`);
      const pool = args["source"] === "selection" ? state.selection : args["source"] === "visible"
        ? Object.keys(known) : all.find((entry) => entry.label === args["source"])!.ids;
      const candidates = Object.fromEntries(pool.flatMap((id) => Object.hasOwn(known, id) ? [[id, known[id]!]] : []));
      const restrictions = args["source"] === "visible" || args["source"] === "selection" ? "filtered" : await parameter("whether this named zone needs individual filtering", {
        unrestricted: "Every card in this pool qualifies individually for the outstanding choice. Any quotas constrain the submitted group only.",
        filtered: "At least one card in this pool is individually excluded by a rule or the outstanding clause, or the whole pool needs inspection.",
      }, `Source text: ${effect}. Staging from ${args["source"]}. ${targetFocus} When the instruction asks the player to discard a card without further restrictions, each card in that player's hand is individually eligible.`);
      const matches = restrictions === "filtered" ? await ask.each(Object.fromEntries(Object.entries(candidates).map(([id, description]) => [id, {
        question: `Source: ${effect}. Effect controller: ${frame?.actor ?? state.declaration?.actor ?? state.active}. Selected pool: ${args["source"]}. Candidate: ${description}. ${targetFocus} ${selectionFocus}${!frame && !state.declaration ? signiAttack : ""} Judge individual eligibility for this exact clause.`,
        choices: { eligible: "This card satisfies the individual requirements and can appear in at least one legal selection.",
          excluded: "A rule or printed restriction excludes this card from every legal selection." },
      }]))) : {};
      const eligible = Object.keys(candidates).filter((id) => restrictions === "unrestricted" || matches[id] === "eligible");
      if (eligible.length === 0) {
        const disposition = await parameter(emptySelectionQuestion, {
          skip: "The required target does not exist. Skip just that clause and continue the effect or clean up the source.",
          empty: "This clause explicitly requires the player to submit the empty set as a valid decision.",
          reconsider: "The clause's valid targets may be in another zone. Select an operation using the correct source.",
        }, `Source text: ${effect}. Candidate source ${args["source"]} had zero eligible cards. A mandatory target with no eligible card is skipped under the resolution rules.`);
        if (disposition === "skip") return chooseOperation(state, deck, ask, "chooseFrom");
        if (disposition === "reconsider") throw new MatchHalt("Drex chưa xác định đúng nguồn ứng viên.");
      }
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
      const frame = state.frames.at(-1);
      const source = frame?.source ? deck.cards[state.cards[frame.source]!.definition] : undefined;
      args["actor"] = await parameter("seat that makes the next decision", list(seats),
        `Turn player: ${state.active}. Phase: ${state.phase}. Top frame: ${frame?.kind ?? "none"}. Frame actor: ${frame?.actor ?? "none"}. Source: ${source?.name ?? "none"}. Printed instruction: ${(frame?.kind === "burst" ? source?.burst : source?.text) ?? "none"}. ${chooserFocus}`);
      args["scope"] = state.frames.length ? "frame" : "match";
      const window = `Seat ${args["actor"]}, phase ${state.phase}, scope ${args["scope"]}. Top frame: ${frame?.kind ?? "none"}, actor ${frame?.actor ?? "none"}. Staged selection: ${JSON.stringify(state.offeredSelection)}. ${windowFocus} Judge this action type independently of strategy.`;
      const side = state.players[args["actor"] as Seat];
      const checkEvidence = side.check.map((id) => {
        const card = deck.cards[state.cards[id]!.definition]!;
        return `${id} ${card.name}, printed Life Burst: ${card.burst || "none"}`;
      }).join("\n") || "empty";
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
      const assists = [side.leftLrig[0], side.rightLrig[0]].filter((id): id is string => Boolean(id))
        .map((id) => deck.cards[state.cards[id]!.definition]!);
      const openSigniSlots = [...slots].filter((zone) => state.players[args["actor"] as Seat][zone].length === 0);
      const mulliganWindow = state.phase === "Setup" && state.offeredSelection !== null
        && state.offeredSelection.candidates.length > 0
        && state.offeredSelection.candidates.every((id) => state.players[args["actor"] as Seat].hand.includes(id));
      const evidence: Partial<Record<Intent, string>> = {
        ...(mulliganWindow ? { mulligan: `Setup has staged this seat's opening hand. Mulligan is the required declaration for this hand window, including an empty selection to keep. Do not omit mulligan or replace it with pass.` } : {}),
        pass: "Check whether the player can end this window without taking the optional action. A staged candidate set does not remove a legal pass when the action itself is optional. An unresolved mandatory card choice is different.",
        charge: `Ener Phase offers a named charge declaration when the turn player can move one card from their hand or a SIGNI from their field to Ener. Passing is independent of that option. Cards in hand: ${Object.keys(handEvidence).length}. Field: ${signiEvidence}. If candidates are staged, those cards are the input to charge, and staging alone has not paid or used the phase action. Staged candidates: ${state.offeredSelection?.candidates.map((id) => known[id]).join("; ") || "none"}.`,
        burst: `This seat's Check Zone: ${checkEvidence}. Offer burst only to ask whether to activate an unanswered Life Burst. Read recent declarations for the exact source. If activation was answered and cards are staged for a clause of that Burst, omit burst.`,
        decline: `This seat's Check Zone: ${checkEvidence}. Offer decline only when the pending choice itself permits declining, such as unanswered Burst activation or optional payment. After the player activates the Burst, use the current clause to decide whether its target choice is optional.`,
        grow: `${state.phase === "Grow" ? "Center Grow is available to the active Center LRIG when its next LRIG and cost are legal." : "Center Grow is illegal outside the Grow Phase. In this window offer grow only for a legal Assist Grow whose printed timing includes the current phase."} Check Assist Grow separately by comparing printed timing, cost, current top LRIG of the matching type and Center level. Current top LRIGs followed by LRIG Deck records: ${lrigEvidence}.`,
        retire: `This seat's SIGNI on the field: ${signiEvidence}. Use committed operations, saved declarations and marks to check whether Retire has already been used this turn. Consider the effect of Retire even when field Level equals Limit.`,
        play: `Center Level ${activeLrig?.level ?? 0}, printed Limit ${activeLrig?.limit ?? 0}; top Assist printed Limit modifiers ${assists.map(({ limit }) => limit).join(", ") || "none"}. Field: ${signiEvidence}. Empty slots: ${openSigniSlots.join(", ") || "none"}. Hand: ${Object.values(handEvidence).join("; ") || "none"}. Offer play in a match-scoped Main window if at least one SIGNI in this hand fits. A SIGNI at or below the Center Level fits when its Level plus the Levels of current field SIGNI is at or below effective Limit and there is an empty slot. Ignore cards that do not fit when deciding whether at least one does.`,
        cast: "Offer cast for a payable Spell from hand or an unused payable PIECE from LRIG Deck in its printed window. Check both permitted source zones. An Assist LRIG enters via grow. Check payment separately from whether the player would get a useful result.",
        attack: `An attack declaration names one attacker, even when a list is staged. Current SIGNI: ${signiEvidence}. A match-scoped SigniAttack window should offer attack if it has at least one eligible upped SIGNI. A match-scoped LrigAttack window uses the active Center LRIG. Staged candidates restrict which card can be named.`,
        choose: `Staged candidates: ${JSON.stringify(state.offeredSelection)}. Omit generic choose when this staged list supplies parameters for a named action available in the phase, such as attack. Offer choose for a pending card-selection decision where no named action expresses the declaration.`,
      };
      const options = await ask.each(Object.fromEntries(intents
        .filter((intent) => intent !== "choose" || state.offeredSelection)
        .map((intent) => [intent, {
          question: intent === "play" ? `${window} ${evidence.play} Should this window offer play?`
            : `${window} Should this exact window offer ${intent}? ${actionText[intent]} To offer it, identify at least one legal declaration from the rules, printed use timing, and live table. Use specific intents for phase actions, even if candidate cards were staged. Use choose for card selections inside a resolution. Only offer a printed mode in its mode decision window. ${evidence[intent] ?? ""}`,
          choices: {
            offer: "There is at least one rules-legal declaration of this type in this window, with any required inputs available.",
            omit: "This declaration type has no legal instance in this window.",
          },
        }])));
      const picked = intents.filter((intent) => options[intent] === "offer");
      if (options.pass === "omit" && !picked.includes("mulligan") && !picked.includes("decline") && !mulliganWindow) {
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
    case "turn":
      args["actor"] = await parameter("incoming active seat", list(seats.filter((seat) => seat !== state.active)));
      args["phase"] = await parameter("first phase of the incoming seat's new turn", list(phases),
        `Outgoing seat ${state.active} is in ${state.phase}. Choose the phase that starts the new turn for ${args["actor"]}.`);
      break;
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
    : operation === "turn" ? `Finish the outgoing turn for ${work.state.active} and start seat ${args["actor"]}'s turn in ${args["phase"]}`
    : operation === "push" ? `Open a ${args["frame"]} frame for seat ${args["actor"]} with source ${args["source"]}, save the current declaration, and preserve staged candidates and all committed effects`
    : operation === "move" ? `Move ${args["card"]} from ${args["from"]} to ${args["to"]}`
    : operation === "pop" || operation === "closeFrames" ? `Close ${operation === "pop" ? "one frame" : args["count"] + " frames"}; acknowledge current declaration: ${args["acknowledge"]}. Closing frames removes declarations those frames store.`
    : operation === "chooseFrom" ? `Offer exactly these cards from ${args["source"]}: ${args["eligible"] || "none"}. Can select from ${args["min"]} to ${args["max"]} cards. Confirm each eligible card and every legal selection size; 'up to' permits zero.`
    : operation === "orient" ? `${args["value"] === "true" ? "Down" : "Up"} ${args["target"]}`
    : operation === "face" ? (args["value"] === "true" ? "Face up" : "Face down")
    : operation === "freeze" ? (args["value"] === "true" ? "Set Frozen" : "Clear Frozen")
    : operations[operation];
  const evidence = trace.filter(({ question }) => question.startsWith(`For chooseFrom only, choose ${emptySelectionQuestion}`))
    .map(({ question, label }) => `${question}\nDrex classification: ${label}`).join("\n");
  const facts = `OPERATION TO AUDIT\n${JSON.stringify(selected)}\nPhysical meaning: ${meaning}.\n${evidence}\n\n${snapshot}`;
  const { state, deck } = work;
  const top = state.frames.at(-1);
  if (args["to"] && ["move", "take", "stack", "random", "moveSelected"].includes(operation) && state.phase !== "Setup") {
    const transferred = operation === "move" ? [args["card"]!]
      : operation === "moveSelected" ? selectedGroup(state, args["from"]!) : [];
    const locations = sources(state);
    const known = cardOptions(state, deck, locations, "table");
    const declaration = state.declaration;
    const declaredCard = declaration?.card ? known[declaration.card] : undefined;
    const frameCard = top?.source ? deck.cards[state.cards[top.source]!.definition] : undefined;
    const frameEvidence = top && JSON.stringify({
      ...top, sourceCard: frameCard && { name: frameCard.name, type: frameCard.type, cost: frameCard.cost,
        growCost: frameCard.growCost, text: top.kind === "burst" ? frameCard.burst : frameCard.text },
    });
    const none = "The current instruction does not require this transfer.";
    const transferEvidence = `ACTIVE FRAME\n${frameEvidence ?? "none"}\nCURRENT DECLARATION\n${JSON.stringify(declaration)}\n${declaredCard ?? ""}\nCARDS OR PILE POSITIONS UNDER REVIEW\n${transferred.length ? transferred.map((id) => known[id] ?? id).join("\n") : `${operation} from ${args["from"]}, count ${args["count"] ?? "all"}`}\n${evidence}\n\n${snapshot}`;
    const purpose = operation === "moveSelected" ? await drex.decide(transferEvidence,
      `What is the immediate purpose of moving this exact group now? ${transferFocus}`, {
        payment: "The cards were selected to pay a still-unpaid cost for the outstanding action or ability.",
        result: "The cards are ready to move as an effect result or rule action other than a cost payment.",
        none,
      }) : undefined;
    if (purpose) {
      trace.push(purpose);
      if (purpose.label === "none" || purpose.label === "halt") {
        throw new MatchHalt("Drex chưa xác định mục đích chuyển nhóm bài.", purpose.requestId);
      }
    }
    const routes = await drex.decideBatch(
      (purpose ? `DREX CLASSIFIED IMMEDIATE TRANSFER PURPOSE: ${purpose.label}\n` : "") + transferEvidence,
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
  const closesFrame = operation === "pop" || operation === "closeFrames";
  const sourceFrame = operation === "move" && args["from"]?.endsWith(".check")
    ? state.frames.findLast(({ source }) => source === args["card"]) : undefined;
  if (sourceFrame || (top && closesFrame)) {
    const affected = sourceFrame ? [sourceFrame] : state.frames.slice(-(operation === "closeFrames" ? Number(args["count"]) : 1));
    const records = affected.map(({ kind, actor, source, step, declaration }) => {
      const printed = source && deck.cards[state.cards[source]!.definition];
      return { kind, actor, step, source, declaration, ...(printed ? { name: printed.name, text: kind === "burst" ? printed.burst : printed.text } : {}) };
    });
    const cleanupState = `FRAMES TO CHECK\n${JSON.stringify(records)}\n\nPROPOSED CLEANUP\n${meaning}\n${evidence}\n\n${snapshot}`;
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
  const growing = operation === "move" && args["from"]?.endsWith(".lrigDeck")
    && [...lrigSlots].some((zone) => args["to"]?.endsWith(`.${zone}`)) && state.phase !== "Setup";
  const guardAttack = operation === "control" && state.phase === "LrigAttack" && !state.players.A.check.length
    && !state.players.B.check.length && [state.declaration, top?.declaration].find((item) =>
      item?.intent === "attack" && state.players[item.actor].centerLrig[0] === item.card);
  const guardEvidence = guardAttack ? `Center attack: ${JSON.stringify(guardAttack)}. Defender's hand records: ${state.players[guardAttack.actor === "A" ? "B" : "A"].hand.map((id) => {
    const card = deck.cards[state.cards[id]!.definition]!;
    return `${id} ${card.name} (${card.type}): ${card.text || "no printed ability"}`;
  }).join("; ") || "empty"}.` : "";
  const selectionOrigin = operation === "chooseFrom" ? (top?.source ?? state.declaration?.card) : undefined;
  const selectionCard = selectionOrigin ? deck.cards[state.cards[selectionOrigin]!.definition] : undefined;
  const selectionEvidence = selectionCard ? JSON.stringify({ name: selectionCard.name, cost: selectionCard.cost,
    growCost: selectionCard.growCost, text: top?.kind === "burst" ? selectionCard.burst : selectionCard.text }) : "Use the current rule and declaration.";
  const phaseTransition = operation === "phase" && state.phase === "SigniAttack" && args["value"] === "LrigAttack"
    ? `Turn player's SIGNI: ${Object.values(cardOptions(state, deck, sources(state).filter(({ seat, zone }) => seat === state.active && slots.has(zone)), "table")).join("; ") || "none"}. Moving to LRIG Attack is legal after a closing pass or when no legal SIGNI attacker remains, once the current attack and its consequences are complete.` : "";
  const question = growing
    ? `Audit the proposed LRIG placement. ${growFocus} Confirm the printed Grow cost and the committed payment for this specific placement before approving it.`
    : operation === "turn" ? `Can ${meaning} now? Confirm the outgoing End obligations are complete, the incoming seat is correct, and the supplied phase is the first phase of the incoming turn.`
    : operation === "push" ? `Proposed: ${meaning}. ${frameFocus} Check whether this frame records real outstanding work or a required rules check. Confirm frame kind, controller and source against the current declaration and history.${state.phase === "Setup" ? " An empty mulligan submission is a keep and can be saved. A previous frame with no saved declaration did not record that keep. Verify that this push saves the actual submission and preserves the other seat's opportunity to decide." : ""}`
    : closesFrame && top?.kind === "enter" ? `Proposed: ${meaning}. ${auditCompletionPrompt} Check the exact controller and source of the frame. Use the last committed selection and recorded state to distinguish an already-satisfied result from a missing result. If the frame has a separate payment, confirm that it was fulfilled, declined, or unavailable.`
    : operation === "chooseFrom" ? `Audit a staged selection. ${meaning} Active source: ${selectionEvidence}. Current declaration: ${JSON.stringify(state.declaration)}. ${selectionFocus} Confirm the source, full candidate set, and allowed count for this single pending requirement. Staging does not submit a choice or move any cards.`
    : operation === "phase"
      ? `Can the table leave ${state.phase} for ${args["value"]} now? ${phaseTransition} Check the current turn's committed operations, phase-ending actions, and the resolution stack. Confirm that the required window and effects are complete and that the proposed phase follows under the rules.`
    : operation === "control"
    ? guardAttack && args["scope"] === "frame"
      ? `Audit Guard for seat ${args["actor"]}. Offered actions: ${args["intents"]}. ${guardEvidence} Confirm the attacker is Down and the defender has not answered for this exact attack. An earlier pass in a different phase does not answer Guard. A pass or decline is sufficient when the defender has no card with Guard. Offer guard when the defender can legally use one.`
      : state.phase === "Main" && args["scope"] === "match"
        ? `Is seat ${args["actor"]} entitled to receive the next Main Phase decision? Turn player: ${state.active}. Offered intent types: ${args["intents"]}. Read COMMITTED IN THIS PHASE first. A pass by this turn player in a match-scoped Main window closes Main, even after consume. Stop any later match-scoped Main handoff this turn if that pass exists. A pass belonging to a nested effect only ends that effect's choice. If Main is still open, check that the preceding effect is complete and the menu includes the ability to pass.`
        : `Audit the proposed ${args["scope"]}-scoped window for seat ${args["actor"]} on turn ${state.turn} in ${state.phase}. Offered actions: ${args["intents"]}. ${state.phase === "Setup" ? `${mulliganOrder} If neither seat has submitted, collect from the first player. Check declarations rather than previous windows to determine who has submitted. ` : ""}${chooserFocus} ${windowFocus} Confirm the chooser, timing and options for this exact decision. If this is a phase window, inspect COMMITTED IN THIS PHASE for a closing pass or completed once-only phase action. An unanswered Life Burst activation requires burst and decline. An accepted Burst with a pending mandatory target selection requires choose. The next API call handles the player's selection.${args["scope"] === "match" && ["PreAttack", "Defense"].includes(state.phase) ? ` ${combatWindowFocus}` : ""}${state.phase === "Ener" && args["scope"] === "match" ? " Staging a card set does not use the Ener Charge. If the turn player has an eligible card and has not yet charged or passed, offer charge and pass." : ""}`
    : operation === "consume"
      ? "Has the exact CURRENT TABLE declaration already completed its own job? Compare it with committed operations in order. A pass is complete once it closed its decision window. A committed phase transition after the pass proves that declaration is complete, even when the incoming phase belongs to another seat. The next player action, staged candidate set and parent frame can still be pending. Acknowledge the completed declaration and preserve that later work."
    : `Proposed: ${meaning}. ${state.phase === "Setup" && closesFrame
      ? "Review each saved mulligan separately. Empty selections count as keeps. Multiple completed frames may close together when the current declaration is preserved or its own work is also complete."
      : ""} ${auditOperationPrompt} A staged candidate list is evidence of a pending player choice. Check whether this operation applies a recorded declaration or instead makes the player's decision on their behalf.`;
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
