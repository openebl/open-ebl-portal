import { Platforms, Users } from "@/drizzle/schema";
import type { Session } from "next-auth";

export const buildTestSession = ({
  user,
  platform,
}: {
  user: typeof Users.$inferSelect;
  platform: typeof Platforms.$inferSelect;
}) =>
  ({
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
    },
    platform,
    businessUnitId: platform.platformId,
    authenticationId: '',
    expires: "1",
    permissions: [],
    platformRoles: [],
  }) as Session;
