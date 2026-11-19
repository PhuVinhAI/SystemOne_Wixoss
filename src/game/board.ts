import { seats, zones, type Card, type Instance, type State, type Zone } from "../domain/types.js";

export const slots = new Set<Zone>(["signiLeft", "signiCenter", "signiRight"]);
export const lrigSlots = new Set<Zone>(["centerLrig", "leftLrig", "rightLrig"]);
export const boxName = (seat: typeof seats[number], zone: Zone) => `${seat}.${zone}`;

export function displayedPower(card: Card, instance: Instance) {
  return card.power + instance.powerDelta + instance.adjustments.reduce((sum, effect) => sum + effect.amount, 0);
}

export function assertBoard(state: State) {
  const locations = new Set<string>();
  for (const seat of seats) {
    for (const zone of zones) {
      const ids = state.players[seat][zone];
      if (slots.has(zone) && ids.length > 1) throw new Error(`Occupied slot ${boxName(seat, zone)}`);
      for (const id of ids) {
        if (locations.has(id) || !Object.hasOwn(state.cards, id)) throw new Error(`Invalid or duplicated card instance ${id}`);
        locations.add(id);
      }
    }
  }
  if (locations.size !== Object.keys(state.cards).length) throw new Error("A card disappeared from the board.");
}
