import type { Platform, User } from "@prisma/client";
import type { Session } from "next-auth";

export const buildTestSession = ({
  user,
  platform,
}: {
  user: User;
  platform: Platform;
}) =>
  ({
    user: {
      id: user.id,
      name: user.name ?? "",
      email: user.email ?? "",
    },
    platform,
    authenticationId: '',
    expires: "1",
    permissions: [],
    platformRoles: [],
  }) as Session;
