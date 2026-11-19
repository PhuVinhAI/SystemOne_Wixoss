import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { z } from "zod";
import { cardType, type Card, type Deck } from "../domain/types.js";

const docs = fileURLToPath(new URL("../../docs/wixoss/", import.meta.url));
const indexSchema = z.array(z.object({
  id: z.string().regex(/^[\w-]+$/),
  name: z.string().min(1),
  type: cardType,
  count: z.number().int().positive(),
}));
const chapters = {
  setup: "01-match-and-decks.md",
  zones: "02-board-and-zones.md",
  turns: "03-turn-and-resources.md",
  combat: "04-combat.md",
  effects: "05-cards-and-effects.md",
};

function section(markdown: string, name: string) {
  return markdown.split(/^## /m).find((value) => value.startsWith(name + "\n"))
    ?.slice(name.length).trim().replace(/^—$/, "") ?? "";
}

function definition(entry: z.infer<typeof indexSchema>[number], source: string): Card {
  const markdown = source.replace(/\r\n/g, "\n");
  const fields = new Map(
    [...markdown.matchAll(/^\| ([^|]+?) \| (.*?) \|$/gm)].map((row) => [row[1], row[2]?.normalize("NFKC") ?? ""]),
  );
  if (!fields.get("Mã in")?.startsWith(entry.id + "[") || fields.get("Loại thẻ") !== entry.type) {
    throw new Error(`Dữ liệu lá không khớp chỉ mục: ${entry.id}`);
  }
  const name = markdown.match(/^# (.+)$/m)?.[1] ?? entry.name;
  const text = section(markdown, "Card text chính thức");
  const burst = section(markdown, "Power text / Life Burst");
  if (fields.get("Life Burst") === "Có" && !burst) throw new Error(`Thiếu Life Burst: ${entry.id}`);
  return {
    ...entry, name, text, burst, faq: section(markdown, "FAQ chính thức"),
    level: Number(fields.get("Level")) || 0, power: Number(fields.get("Power")) || 0,
    limit: Number(fields.get("Limit")) || 0, color: fields.get("Màu") ?? "",
    group: fields.get("LRIG type / Class") ?? "", team: fields.get("Team / Master") ?? "",
    cost: fields.get("Cost") ?? "", growCost: fields.get("Grow cost") ?? "",
    timing: fields.get("Use timing") ?? "",
  };
}

export async function loadD01(): Promise<Deck> {
  const id = "WXDi-D01-EN";
  const directory = join(docs, "decks", id);
  const index = indexSchema.parse(JSON.parse(await readFile(join(directory, "cards.json"), "utf8")));
  const [definitions, sourceRules] = await Promise.all([
    Promise.all(index.map(async (entry) => definition(entry, await readFile(join(directory, "cards", entry.id + ".md"), "utf8")))),
    Promise.all(Object.entries(chapters).map(async ([topic, file]) => [topic, await readFile(join(docs, file), "utf8")] as const)),
  ]);
  const cards = Object.fromEntries(definitions.map((card) => [card.id, card]));
  const opening = { center: "WXDi-D01-001", left: "WXDi-D01-005", right: "WXDi-D01-008" };
  if (Object.keys(cards).length !== index.length || Object.values(opening).some((key) => cards[key]?.type !== "LRIG" || cards[key].level !== 0)) {
    throw new Error("Catalog D01 có mã trùng hoặc thiếu LRIG mở trận.");
  }
  return { id, cards, opening, rules: Object.fromEntries(sourceRules) };
}
