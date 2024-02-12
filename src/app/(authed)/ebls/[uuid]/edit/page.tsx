
import MainSection from "@/app/_components/edit-ebl/main-section";
import { api } from "@/trpc/server";
import { defaultEBl } from "@/types/ebl";

export default async function Page({ params }: { params: { uuid: string } }) {
  const uuid = params.uuid;
  const ebl = (uuid === "new") ? defaultEBl : await api.ebl.find.query(uuid);
  if (!ebl) {
    return <div>Not found</div>;
  }

  return (
    <MainSection ebl={ebl} />
  );
}
