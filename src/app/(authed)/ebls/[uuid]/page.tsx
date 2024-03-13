"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/ebl-detail/main-section";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import Link from "next/link";

const Page = async ({ params }: { params: { uuid: string } }) => {
  let block: JSX.Element | null = null;
  try {
    const ebl = await api.ebl.getByID.query(params.uuid);
    if (!ebl) throw new Error("NOT_FOUND");
    block = <MainSection ebl={ebl} />;

  } catch (err) {
    getLogger().error(err);

    block = err instanceof Error && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong`} />
    )
  }

  return (
    <div className="px-12 py-10 font-content">
      <Link
        className="flex items-center justify-start text-xs font-semibold text-secondary1"
        href="/ebls"
        prefetch={false}
      >
        <LeftArrowIcon className="mr-2" />
        Back
      </Link>

      {block}

    </div>
  );
};

export default Page;
