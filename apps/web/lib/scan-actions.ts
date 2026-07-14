"use server";

import { redirect } from "next/navigation";
import { storeUrlSchema } from "@revsys/shared";
import { revenueIntelligenceCore } from "./engines";

/**
 * Validation + dispatch gate: confirms the store URL is scannable and kicks
 * the RevenueScannerEngine, but doesn't return the report body — the scanner
 * page re-dispatches (deterministic, same engine) once it has the validated
 * storeUrl in its search params.
 */
export async function scanStoreAction(storeUrl: string): Promise<{ error?: string }> {
  const validation = storeUrlSchema.safeParse(storeUrl);
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message ?? "Invalid store URL." };
  }

  const result = await revenueIntelligenceCore.dispatch("RevenueScannerEngine", { storeUrl: validation.data }, {});
  if (result.status !== "success") {
    return { error: result.message ?? "We couldn't scan that store." };
  }

  redirect(`/scanner?url=${encodeURIComponent(validation.data)}`);
}
