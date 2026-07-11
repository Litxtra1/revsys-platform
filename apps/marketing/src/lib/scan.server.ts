import { createServerFn } from "@tanstack/react-start";
import { storeUrlSchema } from "@revsys/shared";
import { revenueIntelligenceCore } from "./engines";

/**
 * Validation + dispatch gate, mirroring apps/web's /api/scan route: confirms
 * the store URL is scannable and kicks the RevenueScannerEngine, but doesn't
 * return the report body — the scanner route re-dispatches (deterministic,
 * same engine) once it has the validated storeUrl in its search params.
 */
export const scanStoreFn = createServerFn({ method: "POST" })
  .validator((data: { storeUrl: string }) => data)
  .handler(async ({ data }) => {
    const validation = storeUrlSchema.safeParse(data.storeUrl);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message ?? "Invalid store URL." };
    }

    const result = await revenueIntelligenceCore.dispatch(
      "RevenueScannerEngine",
      { storeUrl: validation.data },
      {}
    );

    if (result.status !== "success") {
      return { error: result.message ?? "We couldn't scan that store." };
    }

    return { storeUrl: validation.data };
  });
