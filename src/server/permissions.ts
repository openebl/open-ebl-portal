import { type UserRoleType } from "@/types/user";
import { type Session } from "next-auth";
// import { type getServerAuthSession } from "./auth";

type ResourceType =
  | "ebl/list"
  | "ebl/new"
  | "ebl/item"
  | "settings/user-info"
  | "settings/business-info"
  | "settings/users"
  | "admin/platforms";
type ActionType = "read" | "write";
type PermissionType = `${ActionType}:${ResourceType}`;

type PermissionSourceType = {
  roles: UserRoleType[];
  platform: {
    admin: boolean;
  };
};

type PermissionFilterType = (source: PermissionSourceType) => PermissionType[];

//
// Determine permissions based on the session
//
const permissions: (
  source?: PermissionSourceType | null,
) => PermissionType[] = (source) => {
  if (!source) return [];

  const minimalPermissions: PermissionType[] = [
    "read:settings/user-info",
    "write:settings/user-info",
  ];

  return permissionFilters.reduce(
    (perms, filter) => [...perms, ...filter(source)],
    minimalPermissions,
  );
};

//
// Check if the user has the required permission
//
const hasPermission = (
  required: PermissionType,
  permissions?: PermissionType[],
) => permissions?.includes(required);

const concatePermissions: (
  ...conditions: Array<[cond: boolean, PermissionType[]]>
) => PermissionType[] = (...conditions) => {
  return conditions.reduce(
    (perms, condition) => [...perms, ...(condition[0] ? condition[1] : [])],
    [] as PermissionType[],
  );
};

const adminPlatformPermissions: PermissionFilterType = (source) => {
  if (!source?.platform.admin) return [];

  return concatePermissions(
    [true, ["read:admin/platforms"]],
    [source.roles?.includes("admin"), ["write:admin/platforms"]],
  );
};

const eblPermissions: PermissionFilterType = (source) => {
  if (source?.platform.admin) return [];

  return concatePermissions(
    [true, ["read:ebl/list", "read:ebl/item"]],
    [
      source.roles?.includes("operator"),
      ["read:ebl/new", "write:ebl/new", "write:ebl/item", "write:ebl/list"],
    ],
  );
};

const settingsPermissions: PermissionFilterType = (source) => {
  return concatePermissions(
    [true, ["read:settings/business-info"]],
    [
      source.roles?.includes("admin"),
      ["read:settings/users", "write:settings/users"],
    ],
  );
};

const permissionFilters: PermissionFilterType[] = [
  eblPermissions,
  settingsPermissions,
  adminPlatformPermissions,
];

export { permissions, hasPermission };
export type { ResourceType, ActionType, PermissionType };
