import { seats, submitSchema, zones, type Deck, type State, type Submission } from "../domain/types.js";
import { DrexFailure, model, type Decision, type DrexClient } from "../drex/client.js";
import { context } from "../drex/context.js";
import { promptVersion } from "../drex/prompts.js";
import { askWith, auditDeclaration, chooseDeclaration, chooseOperation, selectIntent, validateDeclaration, verifyOperation } from "../drex/protocol.js";
import { assertBoard } from "./board.js";
import { MatchHalt, MatchInputError } from "./options.js";
import { applyPrimitive } from "./primitives.js";
import { createState } from "./setup.js";
import { canSeeCard, view, visible } from "./view.js";

type Entry = {
  revision: number;
  time: string;
  role: "table" | "A" | "B";
  action: string;
  failure?: string;
  turn: number;
  phase: State["phase"];
  trace: Decision[];
  note?: string;
  changedZones: Record<string, readonly string[]>;
  publicEvent?: string;
};

export type MatchUpdate = ReturnType<GameSession["present"]>;

export class GameSession {
  #state: State;
  #initial: State;
  #busy = false;
  #log: Entry[] = [];
  #last: string[] = [];
  #publicHistory: string[] = [];

  constructor(private readonly deck: Deck, private readonly drex: DrexClient, saved?: { initial: State; state: State; log: Entry[] }) {
    this.#state = saved?.state ?? createState(deck);
    assertBoard(this.#state);
    this.#initial = saved?.initial ?? this.#state;
    this.#log = saved?.log ?? [];
    this.#publicHistory = this.#log.slice(-20).flatMap(({ publicEvent }) => publicEvent ? [publicEvent] : []);
  }

  get id() { return this.#state.id; }

  present() {
    const state = this.#state;
    const frame = state.frames.at(-1);
    const source = frame?.source && canSeeCard(state, "A", frame.source)
      ? this.deck.cards[state.cards[frame.source]!.definition]! : null;
    return {
      board: view(state, this.deck, "A"),
      prompt: state.status === "active" && state.control === "A" ? {
        frame: frame?.kind ?? null,
        source: source && { name: source.name, text: source.text, burst: source.burst },
        options: selectIntent(state),
        selection: state.offeredSelection && {
          ...state.offeredSelection,
          candidates: state.offeredSelection.candidates.filter((id) => canSeeCard(state, "A", id)),
        },
      } : null,
      running: this.#busy,
      last: [...this.#last],
    };
  }

  replay(from = 0) {
    return { matchId: this.id, model, promptVersion, deckId: this.deck.id,
      initial: from === 0 ? structuredClone(this.#initial) : null,
      log: structuredClone(this.#log.slice(from)), state: structuredClone(this.#state) };
  }

  async advance(input?: Submission, onEvent?: (update: MatchUpdate) => void) {
    if (this.#busy) throw new MatchInputError("Match đang xử lý một yêu cầu khác.");
    if (this.#state.status !== "active") {
      if (input) throw new MatchInputError("Trận đã kết thúc hoặc đã dừng.");
      return this.present();
    }
    let submitted: { declaration: NonNullable<State["declaration"]>; note: string | undefined } | undefined;
    if (input) {
      const submission = submitSchema.parse(input);
      if (submission.revision !== this.#state.revision) throw new MatchInputError("Bàn đấu đã thay đổi.");
      const declaration = {
        actor: "A" as const, intent: submission.intent, card: submission.card ?? null,
        cards: submission.cards ?? [], zone: submission.zone ?? null,
      };
      try { validateDeclaration(this.#state, declaration); }
      catch (error) { throw new MatchInputError(error instanceof Error ? error.message : "Khai báo không dùng được."); }
      submitted = { declaration, note: submission.note };
    }
    this.#busy = true;
    let trace: Decision[] = [];
    try {
      if (submitted) {
        const { declaration, note } = submitted;
        const snapshot = context(this.#state, this.deck, "table", this.tableHistory());
        if (!await auditDeclaration(this.drex, snapshot, this.#state, this.deck, declaration, trace)) {
          this.#log.push({ revision: this.#state.revision, time: new Date().toISOString(), role: "A", action: "rejected",
            turn: this.#state.turn, phase: this.#state.phase, trace, changedZones: {} });
          throw new MatchInputError("Drex xác định lựa chọn không hợp lệ trong cửa sổ hiện tại.");
        }
        this.commit({ ...this.#state, control: "table", offeredSelection: null, declaration }, "A", JSON.stringify(declaration), trace, note);
        onEvent?.(this.present());
      }
      for (let steps = 0; this.#state.status === "active" && this.#state.control !== "A"; steps += 1) {
        if (steps >= 160) throw new MatchHalt("Drex vượt giới hạn thao tác trước cửa sổ tiếp theo.");
        trace = [];
        const state = this.#state;
        const role = state.control;
        const recent = role === "table" ? this.tableHistory() : this.#publicHistory;
        const snapshot = context(state, this.deck, role, recent);
        const ask = askWith(this.drex, snapshot, trace);
        if (role === "B") {
          const declaration = await chooseDeclaration(state, this.deck, role, ask);
          validateDeclaration(state, declaration);
          if (!await auditDeclaration(this.drex, context(state, this.deck, "table", this.tableHistory()), state, this.deck, declaration, trace)) {
            throw new MatchHalt("Drex chọn nước đi không hợp lệ cho B.", trace.at(-1)?.requestId);
          }
          this.commit({ ...state, control: "table", offeredSelection: null, declaration }, role, JSON.stringify(declaration), trace);
        } else {
          const selected = await chooseOperation(state, this.deck, ask);
          const { operation, args } = selected;
          const draft = applyPrimitive(state, operation, args);
          if (operation !== "shuffle" && JSON.stringify(draft) === JSON.stringify(state)) {
            throw new MatchHalt("Drex chọn thao tác không làm thay đổi bàn đấu.", trace.at(-1)?.requestId);
          }
          await verifyOperation(this.drex, snapshot, selected, trace, { state, deck: this.deck });
          this.commit(draft, role, JSON.stringify({ operation, ...args }), trace);
        }
        onEvent?.(this.present());
      }
    } catch (error) {
      if (error instanceof MatchInputError) throw error;
      const reason = error instanceof Error ? error.message : "Lỗi xử lý trận đấu.";
      const requestId = (error instanceof MatchHalt || error instanceof DrexFailure ? error.requestId : undefined)
        ?? trace.at(-1)?.requestId;
      this.commit({ ...this.#state, status: "halted", failure: requestId ? `${reason} (${requestId})` : reason },
        this.#state.control, "halt", trace);
      onEvent?.(this.present());
    } finally {
      this.#busy = false;
    }
    return this.present();
  }

  private tableHistory() {
    const oldestFrame = this.#state.frames[0]?.openedAt ?? this.#state.revision;
    const cutoff = Math.min(this.#state.revision - 20, oldestFrame - 1);
    return this.#log.filter((entry) => entry.revision > cutoff && entry.action !== "rejected").map((entry) => entry.action);
  }

  private commit(draft: State, role: Entry["role"], action: string, trace: Decision[], note?: string) {
    const revision = this.#state.revision + 1;
    const previous = this.#state;
    this.#state = { ...draft, revision };
    this.#last = [this.publicEvent(previous, action, role)];
    this.#publicHistory = [...this.#publicHistory.slice(-19), ...this.#last];
    const changedZones = Object.fromEntries(seats.flatMap((seat) => zones.flatMap((zone) => {
      const before = previous.players[seat][zone];
      const after = draft.players[seat][zone];
      return before.length !== after.length || after.some((id, index) => id !== before[index])
        ? [[`${seat}.${zone}`, [...after]] as const] : [];
    })));
    this.#log.push({ revision, time: new Date().toISOString(), role, action, trace, publicEvent: this.#last[0]!,
      ...(draft.failure ? { failure: draft.failure } : {}),
      turn: draft.turn, phase: draft.phase, changedZones, ...(note ? { note } : {}) });
  }

  private publicEvent(previous: State, action: string, role: Entry["role"]) {
    if (action === "halt") return "Trận dừng tại bước xử lý của Drex.";
    const known = new Map<string, string>();
    for (const board of [previous, this.#state]) for (const seat of seats) for (const zone of zones) {
      for (const id of board.players[seat][zone]) {
        if (visible(board, "A", seat, zone, id) && visible(board, "B", seat, zone, id)) {
          known.set(id, this.deck.cards[board.cards[id]!.definition]!.name);
        }
      }
    }
    const safe = JSON.parse(action, (_key, value: unknown) => {
      if (typeof value !== "string" || !/^[AB]\d+(?:,[AB]\d+)*$/.test(value)) return value;
      return value.split(",").map((id) => {
        const name = known.get(id);
        return name ? `${name} (${id})` : "(lá ẩn)";
      }).join(",");
    }) as unknown;
    return `${role}: ${JSON.stringify(safe)}`;
  }
}
