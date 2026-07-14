import { z } from "zod";

const publicConfigSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional().or(z.literal("")),
  /**
   * Parent domain (e.g. ".revsys.ai") the Supabase auth cookie is scoped to.
   * Left unset in dev — an explicit Domain attribute isn't valid on
   * localhost, so cookies stay host-only there, which is already correct
   * for local development.
   */
  AUTH_COOKIE_DOMAIN: z.string().optional(),
});

const serverConfigSchema = publicConfigSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type PublicConfig = z.infer<typeof publicConfigSchema>;
export type ServerConfig = z.infer<typeof serverConfigSchema>;

let cachedPublicConfig: PublicConfig | undefined;
let cachedServerConfig: ServerConfig | undefined;

/** Safe to call from both browser and server code. */
export function getPublicConfig(): PublicConfig {
  if (!cachedPublicConfig) {
    cachedPublicConfig = publicConfigSchema.parse(process.env);
  }
  return cachedPublicConfig;
}

/** Includes server-only secrets — must never be called from browser code. */
export function getServerConfig(): ServerConfig {
  if (typeof window !== "undefined") {
    throw new Error("getServerConfig() must not be called in the browser.");
  }
  if (!cachedServerConfig) {
    cachedServerConfig = serverConfigSchema.parse(process.env);
  }
  return cachedServerConfig;
}
