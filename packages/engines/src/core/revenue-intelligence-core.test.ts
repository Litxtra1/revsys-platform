import { describe, expect, it } from "vitest";
import type { Engine, EngineContext } from "../contracts/engine";
import { RevenueIntelligenceCore } from "./revenue-intelligence-core";

const context: EngineContext = { merchantId: "11111111-1111-1111-1111-111111111111" };

function createFakeEngine(name: string): Engine {
  return {
    name,
    async execute() {
      return { status: "success" as const, output: { ran: true } };
    },
    getStatus() {
      return "idle" as const;
    },
  };
}

describe("RevenueIntelligenceCore", () => {
  it("registers and dispatches to an engine by name", async () => {
    const core = new RevenueIntelligenceCore();
    core.register(createFakeEngine("FakeEngine"));

    const result = await core.dispatch("FakeEngine", {}, context);

    expect(result).toEqual({ status: "success", output: { ran: true } });
  });

  it("lists registered engine names", () => {
    const core = new RevenueIntelligenceCore();
    core.register(createFakeEngine("A"));
    core.register(createFakeEngine("B"));

    expect(core.listEngines()).toEqual(["A", "B"]);
  });

  it("throws when dispatching to an unregistered engine", async () => {
    const core = new RevenueIntelligenceCore();
    await expect(core.dispatch("Missing", {}, context)).rejects.toThrow(
      'Engine "Missing" is not registered.'
    );
  });

  it("throws when registering the same engine name twice", () => {
    const core = new RevenueIntelligenceCore();
    core.register(createFakeEngine("Dup"));
    expect(() => core.register(createFakeEngine("Dup"))).toThrow(
      'Engine "Dup" is already registered.'
    );
  });

  it("does not orchestrate — dispatch invokes exactly the named engine, nothing else", async () => {
    const core = new RevenueIntelligenceCore();
    let callCount = 0;
    core.register({
      name: "Solo",
      async execute() {
        callCount += 1;
        return { status: "not_implemented" as const };
      },
      getStatus: () => "not_implemented" as const,
    });
    core.register(createFakeEngine("Other"));

    await core.dispatch("Solo", {}, context);

    expect(callCount).toBe(1);
  });
});
