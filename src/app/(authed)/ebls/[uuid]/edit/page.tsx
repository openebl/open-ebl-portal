"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/edit-ebl/main-section";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";

export default async function Page({ params }: { params: { uuid: string } }) {
  const execution = async () => {
    const ebl = await api.ebl.new.query(params.uuid);

    if (!ebl) {
      throw new TRPCClientError("NOT_FOUND");
    }
    return <MainSection ebl={ebl.ebl} images={ebl.images} />;
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
