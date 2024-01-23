import ErrorPage from "@/app/components/ebl-detail/error-page";
import MainSection from "@/app/components/ebl-detail/main-section";
import LeftArrowIcon from "@/app/icons/left-arrow-icon";
import { tryCatchAsync } from "@/lib/tryblock";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { Either } from "effect";
import Link from "next/link";

const Page = async ({ params }: { params: { uuid: string } }) => {
  const ebl = await tryCatchAsync(async () => { return await api.ebl.find.query(params.uuid)});
  const block = Either.match(ebl, {
    onLeft: (err) =>
      err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
        <ErrorPage message="eB/L Not Found" />
      ) : (
        <ErrorPage message={`Something went wrong: ${err.message}`} />
      ),
    onRight: (ebl) => <MainSection ebl={ebl} />,
  });

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
