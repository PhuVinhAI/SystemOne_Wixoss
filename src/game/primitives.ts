import { z } from "zod";
import { flags, frames, intents, phases, seats, zones, type State, type Seat, type Zone } from "../domain/types.js";
import { assertBoard, lrigSlots, slots, boxName } from "./board.js";
import { shuffle } from "./setup.js";
import { canSeeCard } from "./view.js";

export const operations = {
  move: "Move one identified card between zones and set or preserve its face orientation. Add to the bottom, or to the top of an LRIG stack.",
  take: "Move the top N cards from one pile to another, preserving order. Set or preserve face orientation. Top is index zero.",
  select: "Add or remove a card from the table's working selection without moving it. A staged player selection belongs to that player.",
  moveSelected: "Transfer a complete working, submitted or frame-saved card group to one destination in one operation.",
  distribute: "Move all cards in the working selection from one zone into distinct empty slots simultaneously. Match destinations to the order of the selection.",
  chooseFrom: "Put the exact legal candidate set on the table for the next declaration. Use the working selection or a complete zone, and set minimum and maximum count.",
  clearSelection: "Remove working and staged candidate selections without moving any cards.",
  shuffle: "Shuffle a zone without revealing any cards.",
  stack: "Transfer the entire contents of one zone to another as one batch, with optional shuffling and face orientation before the transfer.",
  orient: "Set Down or Up on one card or every card in a zone.",
  freeze: "Set or clear Frozen on one card or every card in a zone.",
  face: "Set a card or zone face up or face down.",
  power: "Set the total nonprinted Power delta for one card. Use set, never add implicitly.",
  addPower: "Record a temporary Power adjustment on one card; expiry is explicit and must later be cleared.",
  resetCard: "Remove all nonprinted Power values and card-specific flags from a card, and set it Up and unfrozen. Its zone and visibility do not change.",
  control: "Give A or B a decision window. Specify whether it belongs to the top frame or to the match with no open frames. This consumes the current declaration.",
  phase: "Set the exact phase, without performing any other operation.",
  turn: "Hand off to a different active player and advance the turn counter by one. Phase is independent.",
  random: "Move N cards selected uniformly at random from one zone to another without examining their faces.",
  counter: "Set a named counter explicitly.",
  push: "Push a named resolution frame with a controller and optional source card. The new frame starts at step zero.",
  step: "Set the step number on the top resolution frame.",
  consume: "Acknowledge and clear the current declaration once its requested action has been performed or rejected. Keep the current resolution frames.",
  pop: "Close the top resolution frame. It may acknowledge the current declaration if that declaration has been fully handled.",
  closeFrames: "Close two or more already completed frames starting at the top of the stack. Keep every unfinished parent frame.",
  mark: "Add or replace a flag on a player or card with the specified expiry.",
  unmark: "Remove a flag from its subject.",
  clearTurn: "Remove all marks and timed Power adjustments expiring this turn, leaving permanent entries.",
  finish: "Record a winner when the rules end the match, including unprevented damage against a player already at zero Life Cloth.",
} as const;

export const counterNames = ["coins", "refreshes", "mulligan", "selected"] as const;
export const areas = seats.flatMap((seat) => zones.map((zone) => boxName(seat, zone)));

const box = z.string().refine((value) => areas.includes(value), "Unknown zone");
const id = z.string().regex(/^[AB]\d+$/);
const ref = z.union([box, id]);
const bool = z.enum(["true", "false"]).transform((value) => value === "true");
const number = z.coerce.number().int().min(-100000).max(100000);
const count = z.coerce.number().int().min(1).max(51);
const subject = z.union([z.enum(seats), id]);
const expiry = z.union([z.literal("permanent").transform(() => null), z.coerce.number().int().nonnegative()]);
const targetBool = z.strictObject({ target: ref, value: bool });
const faceMode = z.enum(["keep", "up", "down"]);
export const primitiveSchemas = {
  move: z.strictObject({ from: box, to: box, card: id, face: faceMode.default("keep") }),
  select: z.strictObject({ card: id, value: bool }),
  moveSelected: z.strictObject({
    from: z.union([box, z.enum(["selected", "declared"]), z.string().regex(/^frame\d+$/)]), to: box, face: faceMode.default("keep"),
  }),
  distribute: z.strictObject({
    from: box, destinations: z.string().transform((value) => value.split(",")).pipe(z.array(box).min(1).max(6)), face: faceMode,
  }),
  chooseFrom: z.strictObject({ source: z.union([z.literal("selection"), box]),
    eligible: z.string().transform((value) => value ? value.split(",") : []).pipe(z.array(id)).optional(),
    min: z.coerce.number().int().nonnegative(), max: z.coerce.number().int().nonnegative(),
  }),
  clearSelection: z.strictObject({}),
  take: z.strictObject({ from: box, to: box, count, face: faceMode.default("keep") }),
  random: z.strictObject({ from: box, to: box, count, face: faceMode.default("keep") }),
  shuffle: z.strictObject({ target: box }),
  stack: z.strictObject({ from: box, to: box, order: z.enum(["keep", "random"]), face: faceMode }),
  orient: targetBool,
  freeze: targetBool,
  face: targetBool,
  power: z.strictObject({ card: id, amount: number }),
  addPower: z.strictObject({ card: id, amount: number, expires: z.coerce.number().int().nonnegative() }),
  resetCard: z.strictObject({ card: id }),
  control: z.strictObject({ actor: z.enum(seats),
    scope: z.enum(["match", "frame"]),
    intents: z.string().transform((value) => value.split(",")).pipe(z.array(z.enum(intents)).min(1)),
  }),
  phase: z.strictObject({ value: z.enum(phases) }),
  turn: z.strictObject({ actor: z.enum(seats) }),
  counter: z.strictObject({ actor: z.enum(seats), name: z.enum(counterNames), value: z.coerce.number().int().min(0).max(51) }),
  push: z.strictObject({ frame: z.enum(frames), actor: z.enum(seats), source: z.union([id, z.literal("none").transform(() => null)]) }),
  step: z.strictObject({ value: z.coerce.number().int().min(0).max(64) }),
  consume: z.strictObject({}),
  pop: z.strictObject({ acknowledge: bool }),
  closeFrames: z.strictObject({ count: z.coerce.number().int().min(2).max(48), acknowledge: bool }),
  mark: z.strictObject({ subject, flag: z.enum(flags), expires: expiry }),
  unmark: z.strictObject({ subject, flag: z.enum(flags) }),
  clearTurn: z.strictObject({}),
  finish: z.strictObject({ winner: z.enum(seats) }),
} as const;

export type Operation = keyof typeof operations;

export function declarationIsSaved(state: State) {
  const declaration = state.declaration;
  return declaration === null || state.frames.some((frame) => frame.declaration !== null
    && JSON.stringify(frame.declaration) === JSON.stringify(declaration));
}

function pile(board: State, area: string) {
  const [seat, zone] = area.split(".") as [Seat, Zone];
  return board.players[seat][zone];
}

export function selectedGroup(board: State, source: string) {
  if (source === "declared") return board.declaration?.cards ?? [];
  if (source.startsWith("frame")) return board.frames[Number(source.slice(5))]?.declaration?.cards ?? [];
  return board.selection;
}

function requireCard(board: State, id: string) {
  const result = board.cards[id];
  if (!result) throw new Error(`Unknown card ${id}`);
  return result;
}

function transfer(board: State, from: string, to: string, selected: string[], face: z.infer<typeof faceMode> = "keep") {
  const sources = selected.map((id) => {
    const area = from === "selected" ? areas.find((candidate) => pile(board, candidate).includes(id)) : from;
    if (!area || area === to || !pile(board, area).includes(id)) throw new Error("Invalid transfer.");
    return pile(board, area);
  });
  const destination = pile(board, to);
  const [, zone] = to.split(".") as [Seat, Zone];
  if (!selected.length || new Set(selected).size !== selected.length) throw new Error("Invalid transfer selection.");
  if (slots.has(zone) && destination.length + selected.length > 1) throw new Error("Destination slot is occupied.");
  for (const [index, id] of selected.entries()) {
    const source = sources[index]!;
    source.splice(source.indexOf(id), 1);
  }
  if (lrigSlots.has(zone)) destination.unshift(...selected);
  else destination.push(...selected);
  if (face !== "keep") for (const id of selected) requireCard(board, id).faceUp = face === "up";
}

export function applyPrimitive(board: State, operation: Operation, raw: Record<string, string>) {
  if (!Object.hasOwn(operations, operation)) throw new Error("Unknown table operation.");
  const draft = structuredClone(board);
  switch (operation) {
    case "move": {
      const { from, to, card, face } = primitiveSchemas.move.parse(raw);
      transfer(draft, from, to, [card], face);
      break;
    }
    case "select": {
      const { card, value } = primitiveSchemas.select.parse(raw);
      if (draft.offeredSelection) throw new Error("A staged player selection must be submitted by its player or explicitly cleared.");
      requireCard(draft, card);
      draft.selection = draft.selection.filter((id) => id !== card);
      if (value) draft.selection.push(card);
      break;
    }
    case "moveSelected": {
      const { from, to, face } = primitiveSchemas.moveSelected.parse(raw);
      transfer(draft, areas.includes(from) ? from : "selected", to, selectedGroup(draft, from), face);
      if (from === "selected" || areas.includes(from)) draft.selection = [];
      break;
    }
    case "distribute": {
      const { from, destinations, face } = primitiveSchemas.distribute.parse(raw);
      if (destinations.length !== draft.selection.length || new Set(destinations).size !== destinations.length
        || destinations.some((target) => !slots.has(target.split(".")[1] as Zone) || pile(draft, target).length)) {
        throw new Error("Distribution requires one distinct empty slot per selected card.");
      }
      for (const [index, target] of destinations.entries()) transfer(draft, from, target, [draft.selection[index]!], face);
      draft.selection = [];
      break;
    }
    case "chooseFrom": {
      const { source, eligible, min, max } = primitiveSchemas.chooseFrom.parse(raw);
      const pool = source === "selection" ? draft.selection : pile(draft, source);
      const candidates = eligible ?? pool;
      if (min > max || max > candidates.length || new Set(candidates).size !== candidates.length
        || candidates.some((candidate) => !pool.includes(candidate))) {
        throw new Error("Invalid selection candidates or limits.");
      }
      draft.offeredSelection = { candidates: [...candidates], min, max };
      draft.selection = [];
      break;
    }
    case "clearSelection": {
      primitiveSchemas.clearSelection.parse(raw);
      draft.selection = [];
      draft.offeredSelection = null;
      break;
    }
    case "take":
    case "random": {
      const { from, to, count, face } = primitiveSchemas[operation].parse(raw);
      const source = pile(draft, from);
      const selected = (operation === "take" ? source : shuffle(source)).slice(0, count);
      if (selected.length !== count) throw new Error("Not enough cards in source pile.");
      transfer(draft, from, to, selected, face);
      break;
    }
    case "shuffle": {
      const { target } = primitiveSchemas.shuffle.parse(raw);
      const selected = pile(draft, target);
      selected.splice(0, selected.length, ...shuffle(selected));
      break;
    }
    case "stack": {
      const { from, to, order, face } = primitiveSchemas.stack.parse(raw);
      const source = pile(draft, from);
      const selected = order === "random" ? shuffle(source) : [...source];
      transfer(draft, from, to, selected, face);
      break;
    }
    case "orient":
    case "face":
    case "freeze": {
      const { target, value } = primitiveSchemas[operation].parse(raw);
      const field = operation === "orient" ? "down" : operation === "face" ? "faceUp" : "frozen";
      const selected = areas.includes(target) ? pile(draft, target) : [target];
      for (const id of selected) requireCard(draft, id)[field] = value;
      break;
    }
    case "power": {
      const { card, amount } = primitiveSchemas.power.parse(raw);
      requireCard(draft, card).powerDelta = amount;
      break;
    }
    case "addPower": {
      const { card, amount, expires } = primitiveSchemas.addPower.parse(raw);
      requireCard(draft, card).adjustments.push({ amount, expires });
      break;
    }
    case "resetCard": {
      const { card } = primitiveSchemas.resetCard.parse(raw);
      const item = requireCard(draft, card);
      item.powerDelta = 0;
      item.adjustments = [];
      item.down = false;
      item.frozen = false;
      draft.marks = draft.marks.filter((mark) => mark.subject !== card);
      break;
    }
    case "control": {
      const { actor, scope, intents: offered } = primitiveSchemas.control.parse(raw);
      if ((scope === "frame") !== Boolean(draft.frames.length)) throw new Error("Decision window does not match the current stack.");
      if (!declarationIsSaved(draft)) throw new Error("Save or consume the current declaration before opening a window.");
      if (offered.includes("choose") && !draft.offeredSelection) {
        throw new Error("Prepare a candidate set before opening a card-selection window.");
      }
      if (draft.offeredSelection?.candidates.some((id) => !canSeeCard(draft, actor, id))) {
        throw new Error("The decision window includes inaccessible cards.");
      }
      draft.control = actor;
      draft.promptIntents = [...new Set(offered)];
      draft.declaration = null;
      break;
    }
    case "phase": {
      draft.phase = primitiveSchemas.phase.parse(raw).value;
      break;
    }
    case "turn": {
      const { actor } = primitiveSchemas.turn.parse(raw);
      if (actor === draft.active) throw new Error("Turn handoff requires a different active player.");
      draft.active = actor;
      draft.turn += 1;
      break;
    }
    case "counter": {
      const { actor, name, value } = primitiveSchemas.counter.parse(raw);
      draft.counters[actor][name] = value;
      break;
    }
    case "push": {
      const { frame, actor, source } = primitiveSchemas.push.parse(raw);
      if (source) requireCard(draft, source);
      if (draft.frames.length >= 48) throw new Error("Resolution stack reached its capacity.");
      draft.frames.push({ kind: frame, actor, source, step: 0, declaration: draft.declaration, openedAt: draft.revision });
      break;
    }
    case "step": {
      const frame = draft.frames.at(-1);
      if (!frame) throw new Error("No frame to update.");
      frame.step = primitiveSchemas.step.parse(raw).value;
      break;
    }
    case "pop": {
      const { acknowledge } = primitiveSchemas.pop.parse(raw);
      if (!draft.frames.pop()) throw new Error("No frame to close.");
      if (acknowledge) draft.declaration = null;
      break;
    }
    case "closeFrames": {
      const { count, acknowledge } = primitiveSchemas.closeFrames.parse(raw);
      if (draft.frames.length < count) throw new Error("Not enough resolution frames to close.");
      draft.frames.splice(-count);
      if (acknowledge) draft.declaration = null;
      break;
    }
    case "consume": {
      primitiveSchemas.consume.parse(raw);
      if (!draft.declaration) throw new Error("No declaration to consume.");
      draft.declaration = null;
      break;
    }
    case "mark":
    case "unmark": {
      const { subject, flag } = primitiveSchemas[operation].parse(raw);
      if (!seats.some((seat) => subject === seat)) requireCard(draft, subject);
      draft.marks = draft.marks.filter((mark) => mark.subject !== subject || mark.flag !== flag);
      if (operation === "mark") draft.marks.push({ subject, flag, ends: primitiveSchemas.mark.parse(raw).expires });
      break;
    }
    case "clearTurn": {
      primitiveSchemas.clearTurn.parse(raw);
      draft.marks = draft.marks.filter((mark) => mark.ends === null || mark.ends > draft.turn);
      for (const card of Object.values(draft.cards)) card.adjustments = card.adjustments.filter((effect) => effect.expires > draft.turn);
      break;
    }
    case "finish": {
      draft.winner = primitiveSchemas.finish.parse(raw).winner;
      draft.status = "finished";
      draft.declaration = null;
      break;
    }
  }
  assertBoard(draft);
  return draft;
}
