"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, getCurrentUser } from "@revsys/services";
import { getPublicConfig } from "@revsys/shared";
import { getMerchantStore, runNewScan, updateLeakStatus, type DashboardLeak } from "./dashboard-data";

async function getSessionUser() {
  const config = getPublicConfig();
  const client = await createServerSupabaseClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    config.AUTH_COOKIE_DOMAIN
  );
  return getCurrentUser(client);
}

export async function runNewScanAction(): Promise<{ error?: string }> {
  const user = await getSessionUser();
  if (!user) return { error: "Not signed in." };

  const store = await getMerchantStore(user.id);
  if (!store) return { error: "Connect a Shopify store first." };

  try {
    await runNewScan(store, user.id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Scan failed. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/fixes");
  revalidatePath("/dashboard/health");
  return {};
}

/**
 * Re-derives the user from the session rather than trusting a client-passed
 * ID — belt-and-suspenders alongside the RLS policies on revenue_leaks,
 * which already block cross-tenant writes at the DB layer regardless.
 */
export async function updateLeakStatusAction(
  leakId: string,
  status: DashboardLeak["recoveryStatus"]
): Promise<void> {
  const user = await getSessionUser();
  if (!user) return;
  await updateLeakStatus(leakId, status);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/fixes");
}
