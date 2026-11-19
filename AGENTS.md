# Agent instructions for SystemOne Wixoss

## Core model

This project uses Drex MAX 1.1 as the continuous game decision hand. Drex reads the Wixoss rules, current snapshot and card text, then decides the next generic game operation. The API is called repeatedly after every operation so Drex can manage a complete chain of game state, card effects, triggers and phases like a human player.

The host is deliberately thin. It stores snapshots, sends context to Drex, records request IDs, applies generic primitives selected by Drex and exposes the resulting snapshot to the client. If Drex fails, times out, returns an unknown primitive or cannot continue, the game stops.

Treat the host as a physical table. The host enumerates mechanically available objects and values, validates its operation protocol, enforces card identity and visibility, and applies explicit mutations. Drex decides what the rules and card text require, including resolution order, phase changes, player windows, and victory. Keep the table's decision context separate from Player B's hidden-information view. Player A submits their own decisions.

## Card extensibility

Cards are data. Add a card's printed metadata and text to the catalog. Never add card-name branches, per-card handlers, card-specific resolver functions, effect-text pattern matching, or prompts that manually restate a card's effect. The fixed game instruction tells Drex to read the supplied card text and apply the generic operation vocabulary.

## API protocol

The current Nace API provides typed `noul`, `choice` and `score` answers. Use repeated `choice` calls as the next-operation protocol. Use `noul` for optional choices and `score` only for AI preference or priority. Do not pretend the API returns an unsupported arbitrary state object. The state snapshot is carried in the next request and the loop is the source of continuity.

When writing or reviewing prompts, read the [prompt authoring skill](.agents/skills/prompt-authoring/SKILL.md). Keep its provider-independent design guidance separate from Wixoss rules and individual card data.

## Wixoss source of truth

Read `docs/wixoss/01-match-and-decks.md` through `07-acceptance-cases.md`, `docs/wixoss/06-engine-spec.md`, and the relevant files under `docs/wixoss/decks/` before changing the loop. Preserve timing, zones, hidden information, cost order, targets, triggers, rule-based actions, combat, damage, Crush, Life Burst and Refresh as described there.

## Commands

```text
npm run check
npm run test:wixoss
```

`npm run play` and `npm run test:wixoss` use the same live runner in `scripts/play-human-vs-drex.ts`. It waits for the human-controlled seat. Keep one canonical match runner.

## Change boundaries

Other agents may be importing additional decks. Do not rewrite or delete their uncommitted deck files. Keep changes focused on the loop, project instructions, README and package scripts unless the task explicitly expands the scope.
