import type { Engine } from "../contracts/engine";

export class EngineRegistry {
  private readonly engines = new Map<string, Engine>();

  register(engine: Engine): void {
    if (this.engines.has(engine.name)) {
      throw new Error(`Engine "${engine.name}" is already registered.`);
    }
    this.engines.set(engine.name, engine);
  }

  resolve(name: string): Engine {
    const engine = this.engines.get(name);
    if (!engine) {
      throw new Error(`Engine "${name}" is not registered.`);
    }
    return engine;
  }

  has(name: string): boolean {
    return this.engines.has(name);
  }

  list(): string[] {
    return [...this.engines.keys()];
  }
}
