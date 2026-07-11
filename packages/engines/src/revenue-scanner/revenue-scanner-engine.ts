import type { Engine, EngineContext, EngineResult, EngineStatus } from "../contracts/engine";
import { generateMockRevenueReport, type MockRevenueReport } from "./mock-report";

export interface RevenueScannerInput {
  storeUrl: string;
}

/**
 * Sprint 1: returns a deterministic mock Revenue Report for any given store
 * URL — no real store analysis is performed. Real Revenue Scanner logic
 * (fetching and analyzing the actual store) is implemented in a future
 * sprint.
 */
export class RevenueScannerEngine implements Engine<RevenueScannerInput, MockRevenueReport> {
  readonly name = "RevenueScannerEngine";

  async execute(
    input: RevenueScannerInput,
    _context: EngineContext
  ): Promise<EngineResult<MockRevenueReport>> {
    if (!input.storeUrl || input.storeUrl.trim().length === 0) {
      return { status: "error", message: "storeUrl is required." };
    }

    return {
      status: "success",
      output: generateMockRevenueReport(input.storeUrl),
    };
  }

  getStatus(): EngineStatus {
    return "idle";
  }
}
