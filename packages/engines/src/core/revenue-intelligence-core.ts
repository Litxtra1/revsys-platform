import type { Engine, EngineContext, EngineResult } from "../contracts/engine";
import { EngineRegistry } from "./engine-registry";

/**
 * Central orchestrator per Manual I Part IV/XI.
 *
 * Sprint 0 scope is intentionally limited to engine registration and
 * dispatch — resolving an engine by name and invoking it. No workflow
 * orchestration, business rule enforcement, or cross-engine sequencing is
 * implemented here; that coordination logic belongs to a future sprint.
 */
export class RevenueIntelligenceCore {
  private readonly registry = new EngineRegistry();

  register(engine: Engine): void {
    this.registry.register(engine);
  }

  async dispatch<TInput = unknown, TOutput = unknown>(
    engineName: string,
    input: TInput,
    context: EngineContext
  ): Promise<EngineResult<TOutput>> {
    const engine = this.registry.resolve(engineName) as Engine<TInput, TOutput>;
    return engine.execute(input, context);
  }

  listEngines(): string[] {
    return this.registry.list();
  }
}
