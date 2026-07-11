import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Generic, framework-agnostic Supabase client factory typed against the
 * Revsys AI schema. Next.js-aware browser/server clients (cookie-based
 * session handling) are built on top of this in packages/services.
 */
export function createSupabaseClient(url: string, key: string): SupabaseClient<Database> {
  return createClient<Database>(url, key);
}
