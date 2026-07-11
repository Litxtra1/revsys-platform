import type { Engine, EngineContext, EngineResult, EngineStatus } from "../contracts/engine";
import {
  calculateRevenueOpportunity,
  type RevenueCalculatorInput,
  type RevenueCalculatorOutput,
} from "./calculate-revenue-opportunity";

/** Sprint 1: real deterministic benchmark math, no AI involved (per Brief). */
export class RevenueCalculatorEngine implements Engine<
  RevenueCalculatorInput,
  RevenueCalculatorOutput
> {
  readonly name = "RevenueCalculatorEngine";

  async execute(
    input: RevenueCalculatorInput,
    _context: EngineContext
  ): Promise<EngineResult<RevenueCalculatorOutput>> {
    return {
      status: "success",
      output: calculateRevenueOpportunity(input),
    };
  }

  getStatus(): EngineStatus {
    return "idle";
  }
}
