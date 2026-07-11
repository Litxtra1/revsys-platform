import { AuthorizationError } from "../error-handler/index";

/** Structurally compatible with @revsys/database's MerchantRole — kept independent to avoid a cross-package dependency. */
export type Role = "owner" | "admin" | "member";

export type Permission =
  "organization:manage" | "organization:invite_members" | "store:manage" | "store:view";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ["organization:manage", "organization:invite_members", "store:manage", "store:view"],
  admin: ["organization:invite_members", "store:manage", "store:view"],
  member: ["store:view"],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function assertPermission(role: Role, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new AuthorizationError(`Role "${role}" does not have permission "${permission}".`);
  }
}
