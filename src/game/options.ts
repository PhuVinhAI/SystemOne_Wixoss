export type Choices = Record<string, string>;
export class MatchInputError extends Error {}
export class MatchHalt extends Error {
  constructor(message: string, readonly requestId?: string) { super(message); }
}
