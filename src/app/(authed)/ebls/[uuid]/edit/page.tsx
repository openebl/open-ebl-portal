"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";

export default async function Page({ params }: { params: { uuid: string } }) {
  const execution = async () => {
    const ebl = await api.ebl.getByID.query(params.uuid);
    getLogger().info(`Got eBL from Server: ${JSON.stringify(ebl)}`);

    // TODO: kevinj: translate DCSA eBL scheme to eBL
    // return <MainSection ebl={ebl.ebl} images={ebl.images} />;

    return <ErrorPage message="Under Construction" />
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
