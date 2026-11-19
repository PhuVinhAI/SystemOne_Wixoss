import { z } from "zod";

export const seats = ["A", "B"] as const;
export type Seat = typeof seats[number];
export const roles = ["center", "left", "right"] as const;

export const openZones = ["ener", "trash", "check", "lrigTrash", "removed", "signiLeft", "signiCenter", "signiRight", "centerLrig", "leftLrig", "rightLrig"] as const;
export const zones = ["deck", "hand", "life", "lrigDeck", "look", ...openZones] as const;
export type Zone = typeof zones[number];
export const phases = ["Setup", "Up", "Draw", "Ener", "Grow", "Main", "PreAttack", "Defense", "SigniAttack", "LrigAttack", "Guard", "End"] as const;
export type Phase = typeof phases[number];
export const intents = ["pass", "mulligan", "charge", "grow", "play", "cast", "ability", "retire", "attack", "guard", "burst", "choose", "decline", "mode1", "mode2", "mode3"] as const;
export type Intent = typeof intents[number];
export const frames = ["setup", "mulligan", "up", "draw", "ener", "grow", "play", "cast", "cost", "effect", "target", "mode", "enter", "auto", "constant", "check", "attack", "battle", "guard", "damage", "crush", "burst", "refresh", "retire", "end"] as const;
export type FrameKind = typeof frames[number];
export const flags = ["open", "mulligan", "retire", "grow", "charge", "used1", "used2", "used3", "assassin", "doubleCrush", "lancer", "sLancer", "paid", "mode1", "mode2", "mode3", "done", "revealed", "selected"] as const;
export type Flag = typeof flags[number];

export const cardType = z.enum(["LRIG", "ASSIST LRIG", "PIECE", "SIGNI", "SPELL"]);
export type Card = {
  id: string;
  name: string;
  type: z.infer<typeof cardType>;
  count: number;
  level: number;
  limit: number;
  power: number;
  color: string;
  group: string;
  team: string;
  cost: string;
  growCost: string;
  timing: string;
  text: string;
  burst: string;
  faq: string;
};
export type Deck = { id: string; opening: Record<typeof roles[number], string>; cards: Record<string, Card>; rules: Record<string, string> };
export type Instance = {
  id: string; definition: string; owner: Seat; down: boolean; frozen: boolean;
  faceUp: boolean; powerDelta: number; adjustments: { amount: number; expires: number }[];
};
export type Frame = {
  kind: FrameKind; actor: Seat; source: string | null; step: number;
  declaration: Declaration | null; openedAt: number;
};
export type Declaration = { actor: Seat; intent: Intent; card: string | null; cards: string[]; zone: Zone | null };
export type Marker = { flag: Flag; subject: Seat | string; ends: number | null };
export type OfferedSelection = { candidates: string[]; min: number; max: number };
export type State = {
  id: string;
  revision: number;
  first: Seat;
  turn: number;
  active: Seat;
  phase: Phase;
  control: "table" | Seat;
  promptIntents: Intent[];
  players: Record<Seat, Record<Zone, string[]>>;
  cards: Record<string, Instance>;
  counters: Record<Seat, Record<"coins" | "refreshes" | "mulligan" | "selected", number>>;
  frames: Frame[];
  marks: Marker[];
  selection: string[];
  offeredSelection: OfferedSelection | null;
  declaration: Declaration | null;
  status: "active" | "finished" | "halted";
  winner: Seat | null;
  failure: string | null;
};

export const submitSchema = z.strictObject({
  revision: z.number().int().nonnegative(),
  intent: z.enum(intents),
  card: z.string().regex(/^[AB]\d+$/).optional(),
  cards: z.array(z.string().regex(/^[AB]\d+$/)).max(51).optional(),
  zone: z.enum(zones).optional(),
  note: z.string().max(500).optional(),
});
export type Submission = z.infer<typeof submitSchema>;
