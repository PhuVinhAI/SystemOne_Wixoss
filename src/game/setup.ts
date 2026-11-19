import { randomInt, randomUUID } from "node:crypto";
import { seats, zones, type Deck, type Seat, type State, type Zone } from "../domain/types.js";

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

export function createState(deck: Deck, first: Seat = seats[randomInt(seats.length)]!): State {
  const boxes = () => Object.fromEntries(zones.map((zone) => [zone, [] as string[]])) as Record<Zone, string[]>;
  const counters = () => ({ coins: 0, refreshes: 0, mulligan: 0, selected: 0 });
  const state: State = {
    id: randomUUID(), revision: 0, first, turn: 1, active: first, phase: "Setup",
    control: "table", promptIntents: [], players: { A: boxes(), B: boxes() }, cards: {}, counters: { A: counters(), B: counters() },
    frames: [], marks: [], selection: [], offeredSelection: null, declaration: null, status: "active", winner: null, failure: null,
  };
  for (const seat of seats) {
    const entries = Object.values(deck.cards).flatMap((card) => Array<string>(card.count).fill(card.id));
    // Opaque identities are randomized independently of the stack order.
    for (const [index, definition] of shuffle(entries).entries()) {
      const id = seat + (index + 1);
      state.cards[id] = { id, definition, owner: seat, down: false, frozen: false, faceUp: false, powerDelta: 0, adjustments: [] };
      const type = deck.cards[definition]!.type;
      state.players[seat][type === "SIGNI" || type === "SPELL" ? "deck" : "lrigDeck"].push(id);
    }
    const { deck: main, lrigDeck } = state.players[seat];
    if (main.length !== 40 || lrigDeck.length !== 11) throw new Error("D01 must contain 40 Main Deck and 11 LRIG Deck cards.");
  }
  return state;
}
