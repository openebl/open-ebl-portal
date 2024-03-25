"use server";

import RevalidateRedirect from "@/app/_components/common/revalidate-redirect";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session) return null;

  // check if target platform is associated with the user
  const targetPlatformId = BigInt(params.id)
  const platform = session.platformRoles.find((role) => role.platform.id === targetPlatformId);
  if (platform) {
    // update user's active platform
    await api.user.updateActivePlatform.mutate({ platformId: targetPlatformId });
  }

  return <RevalidateRedirect />
}
