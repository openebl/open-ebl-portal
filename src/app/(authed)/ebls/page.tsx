
import MainSection from "@/app/_components/ebl-list/main-section";
import { api } from "@/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();
  const eBls = await api.ebl.all.query();

  return (
    <MainSection list={eBls} />
  );
}
