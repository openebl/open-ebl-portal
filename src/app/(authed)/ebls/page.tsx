
import MainSection from "@/app/components/ebl-list/main-section";
import OuterFrame from "@/app/components/outer-frame";
import { api } from "@/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  const eBls = await api.ebl.all.query();

  return (
    <OuterFrame>
      <MainSection list={eBls} />
    </OuterFrame>
  );
}
