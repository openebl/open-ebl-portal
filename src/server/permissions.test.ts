import { type UserRoleType } from "@/types/user";
import { describe, it } from "vitest";
import { permissions } from "./permissions";

describe.concurrent("permissions", () => {
  const minimalPermissions = [
    "read:settings/user-info",
    "write:settings/user-info",
  ];
  const defaultPlatform = {
    id: 168n,
    platformId: "",
    name: "",
    admin: false,
    businessInfo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("session platform is admin platform", () => {
    const platform = { ...defaultPlatform, admin: true };
    ["viewonly", "operator"].forEach((role) => {
      describe(`user has ${role} role`, () => {
        const roles = [role] as UserRoleType[];
        it("should returns Read 'admin/platforms' permissions", async ({
          expect,
        }) => {
          expect(permissions({ platform, roles }).sort()).toEqual(
            [
              ...minimalPermissions,
              "read:settings/business-info",
              "read:admin/platforms",
            ].sort(),
          );
        });
      });
    });

    describe("user has admin role", () => {
      const roles = ["admin"] as UserRoleType[];
      it("should returns R/W 'admin/platforms' permissions", async ({
        expect,
      }) => {
        expect(permissions({ platform, roles }).sort()).toEqual(
          [
            ...minimalPermissions,
            "read:settings/business-info",
            "read:settings/users",
            "write:settings/users",
            "read:admin/platforms",
            "write:admin/platforms",
          ].sort(),
        );
      });
    });
  });
});
