import type { Engine, EngineContext, EngineResult, EngineStatus } from "./engine";

/**
 * Base for Sprint 0 engine stubs. Concrete engines set `name` and, in a
 * future sprint, override `execute()` with real business logic.
 */
export abstract class PlaceholderEngine implements Engine {
  abstract readonly name: string;

  async execute(_input: unknown, _context: EngineContext): Promise<EngineResult> {
    return {
      status: "not_implemented",
      message: `${this.name} business logic is implemented in a future sprint.`,
    };
  }

  getStatus(): EngineStatus {
    return "not_implemented";
  }
}
