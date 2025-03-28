"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/ebl-detail/main-section";
import { env } from "@/env";
import { latestBillOfLadingEvent } from "@/lib/ebl";
import { getLogger } from "@/lib/logger";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { processFileDocReUpload } from "@/server/fx/ebl";
import { s3StorageService } from "@/server/services/storage-service";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { uuid: string } }) => {
  try {
    const ebl = await api.ebl.getByID.query(params.uuid);
    if (!ebl) throw new Error("NOT_FOUND");

    const eblEvent = latestBillOfLadingEvent(ebl);
    const eblContent = eblEvent?.bill_of_lading_v3;
    if (!eblContent) {
      throw new TRPCClientError("EBl NOT_FOUND");
    }

    const eblId = ebl.bl?.id ?? "";
    const filename = eblEvent?.file?.name ?? "";
    const contentType = eblEvent?.file?.file_type ?? "";
    const hash = String(eblEvent?.metadata?.docHash);
    const docFile = await api.docFile.findByUuid.query(hash);
    let docFileId = docFile?.id ?? 0n;
    // If not found docFile, download from bu server and generate docFile record
    if (!docFileId) {
      const session = await getServerAuthSession();
      if (!session) redirect("/api/auth/signin");

      // download from bu server
      const response = await fetch(`${env.BU_SERVER_URL}/ebl/${eblId}/document`, {
        method: "GET",
        headers: {
          accept: "application/octet-stream",
          Authorization: `Bearer ${env.BU_SERVER_API_KEY}`,
          "X-Business-Unit-ID": session?.businessUnitId,
        },
      });
      // generate docFile record in db
      const result = await processFileDocReUpload({
        filename,
        contentType,
        body: response.body,
        session,
        db,
        storage: s3StorageService,
      });
      docFileId = result.docFileId;
    }
    const images = await api.docImage.getUrls.query({ docFileId });
    return (
      <MainSection
        ebl={ebl}
        images={images}
      />
    );
  } catch (err) {
    getLogger().error(err);

    return <ErrorPage message={String(err)} />;
  }
};

export default Page;
