import { openZones, seats, zones, type Deck, type Seat, type State, type Zone } from "../domain/types.js";
import { displayedPower } from "./board.js";

const open = new Set<Zone>(openZones);
const owned = new Set<Zone>(["hand", "lrigDeck", "look"]);
const stacked = new Set<Zone>(["centerLrig", "leftLrig", "rightLrig"]);

export function visible(state: State, viewer: Seat | "table", seat: Seat, zone: Zone, id: string) {
  return (open.has(zone) && state.cards[id]?.faceUp) || (owned.has(zone) && viewer === seat)
    || (viewer === "table" && zone !== "deck" && zone !== "life");
}

export function canSeeCard(state: State, viewer: Seat | "table", id: string) {
  return seats.some((seat) => zones.some((zone) =>
    state.players[seat][zone].includes(id) && visible(state, viewer, seat, zone, id)));
}

export function view(state: State, deck: Deck, viewer: Seat | "table") {
  const describe = (id: string) => {
    const instance = state.cards[id]!;
    const card = deck.cards[instance.definition]!;
    return { id, definition: card.id, name: card.name, owner: instance.owner, power: displayedPower(card, instance),
      adjustments: instance.adjustments.map((effect) => ({ ...effect })),
      powerDelta: instance.powerDelta, down: instance.down, frozen: instance.frozen, faceUp: instance.faceUp };
  };
  const players = Object.fromEntries(seats.map((seat) => [seat, Object.fromEntries(zones.map((zone) => {
    const pile = state.players[seat][zone];
    return [zone, {
      count: pile.length,
      cards: pile.filter((id) => visible(state, viewer, seat, zone, id)).map(describe),
      topHidden: stacked.has(zone) && Boolean(pile[0]) && !visible(state, viewer, seat, zone, pile[0]!),
    }];
  }))]));
  const visibleIds = new Set(Object.values(players).flatMap((side) => Object.values(side).flatMap((pile) => pile.cards.map((card) => card.id))));
  return {
    id: state.id, revision: state.revision, first: state.first, active: state.active, turn: state.turn,
    phase: state.phase, control: state.control, status: state.status, winner: state.winner,
    failure: state.failure ? "drex_resolution_halted" : null, players,
    counters: Object.fromEntries(seats.map((seat) => [seat,
      viewer === "table" || seat === viewer ? state.counters[seat] : {
        coins: state.counters[seat].coins, refreshes: state.counters[seat].refreshes, mulligan: state.counters[seat].mulligan,
      }])),
    marks: state.marks.filter((mark) => seats.some((seat) => seat === mark.subject) || visibleIds.has(mark.subject)),
  };
}
