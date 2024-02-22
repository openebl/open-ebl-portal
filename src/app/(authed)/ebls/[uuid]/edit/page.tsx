"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/edit-ebl/main-section";
import { tryCatchAsync } from "@/lib/tryblock";
import { api } from "@/trpc/server";
import { type EBlRowType } from "@/types/ebl";
import { TRPCClientError } from "@trpc/client";
import { Either } from "effect";

export default async function Page({ params }: { params: { uuid: string } }) {
  const ebl = await tryCatchAsync(async () => await api.ebl.getWithImages.query(params.uuid));
  const block = Either.match(ebl, {
    onLeft: (err) =>
      err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
        <ErrorPage message="eB/L Not Found" />
      ) : (
        <ErrorPage message={`Something went wrong: ${err.message}`} />
      ),
    onRight: (ebl) => <MainSection ebl={ebl.ebl as EBlRowType} images={ebl.images} />,
  });


  if (!ebl) {
    return <div>Not found</div>;
  }

  return (
    <>
    {block}
    </>
  );
}
