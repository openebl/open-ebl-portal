import Link from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import OuterFrame from "@/app/components/outer-frame";
import PlatformList from "@/app/components/platform-list";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return (
    <OuterFrame>
      <PlatformList />
      <Button className="text-sm font-semibold ring-offset-white"> Hello </Button>
    </OuterFrame>
  );
}
