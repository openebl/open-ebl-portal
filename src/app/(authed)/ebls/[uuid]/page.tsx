"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/ebl-detail/main-section";
import LeftArrowIcon from "@/app/_icons/left-arrow-icon.svg";
import { latestBillOfLadingEvent } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";

const Content = async ({ uuid }: { uuid: string }) => {
  try {
    const ebl = await api.ebl.getByID.query(uuid);
    if (!ebl) throw new Error("NOT_FOUND");

    const eblEvent = latestBillOfLadingEvent(ebl);
    const eblContent = eblEvent?.bill_of_lading_v3;
    if (!eblContent) {
      throw new TRPCClientError("EBl NOT_FOUND");
    }

    const hash = String(eblEvent?.metadata?.docHash);
    const docFile = await api.docFile.findByUuid.query(hash);
    // TODO: if not found docFile, download from bu server and generate docFile record
    const images = docFile ? await api.docImage.getUrls.query({ docFileId: docFile.id }) : [];

    return <MainSection ebl={ebl} images={images} />;
  } catch (err) {
    getLogger().error(err);

    return err instanceof Error && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong`} />
    );
  }
};

const Page = async ({ params }: { params: { uuid: string } }) => {
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

      <Content uuid={params.uuid} />
    </div>
  );
};

export default Page;
