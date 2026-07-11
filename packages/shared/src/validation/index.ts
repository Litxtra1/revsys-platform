import { z, type ZodSchema } from "zod";
import { ValidationError } from "../error-handler/index";

export const emailSchema = z.string().email();
export const urlSchema = z.string().url();
export const uuidSchema = z.string().uuid();
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase, hyphen-separated slug.");

export const storeUrlSchema = z
  .string()
  .trim()
  .min(4, "Enter your store's web address.")
  .max(253, "That web address looks too long.")
  .refine((value) => {
    const hostname = value.replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
    return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(hostname);
  }, "Enter a valid store URL, e.g. your-store.myshopify.com");

/** Parses `data` against `schema`, throwing a ValidationError with structured issues on failure. */
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError("Validation failed.", { issues: result.error.flatten() });
  }
  return result.data;
}
