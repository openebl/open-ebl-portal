"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/ebl-detail/main-section";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon";
import { getLogger } from "@/lib/logger";
import { tryCatchAsync } from "@/lib/tryblock";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { Either } from "effect";
import Link from "next/link";

const Page = async ({ params }: { params: { uuid: string } }) => {
  let block: JSX.Element | null = null;
  try {
    const ebl = await api.ebl.getWithImages.query(params.uuid);
    const journey = await api.eBlJourney.get.query(params.uuid);
    block = <MainSection ebl={ebl.ebl} journey={journey} />;

  } catch(err) {
    getLogger().error(err);

    block = err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eB/L Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong`} />
    )
  }

  return (
    <div className="px-12 py-10 font-content">
      <Link
        className="flex items-center justify-start text-xs font-semibold text-secondary1"
        href="/ebls"
      >
        <LeftArrowIcon className="mr-2" />
        Back
      </Link>

      {block}

    </div>
  );
};

export default Page;
