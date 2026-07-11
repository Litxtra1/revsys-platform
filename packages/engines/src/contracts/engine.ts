export interface EngineContext {
  // Optional: public/anonymous requests (e.g. the unauthenticated Revenue
  // Scanner) have no merchant yet.
  merchantId?: string;
  storeId?: string;
  correlationId?: string;
}

export type EngineExecutionStatus = "success" | "error" | "not_implemented";

export interface EngineResult<TOutput = unknown> {
  status: EngineExecutionStatus;
  message?: string;
  output?: TOutput;
}

export type EngineStatus = "idle" | "not_implemented";

export interface Engine<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  execute(input: TInput, context: EngineContext): Promise<EngineResult<TOutput>>;
  getStatus(): EngineStatus;
}
