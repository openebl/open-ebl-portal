"use server";

import MainSection from "@/app/_components/edit-ebl/main-section";
import ErrorPage from "@/app/_components/ebl-detail/error-page";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { type EBlFormType } from "@/types/ebl";
import { EBlDocType } from "@/types/ebl/common";
import { eblParties, latestBillOfLadingEvent } from "@/lib/ebl";
import { env } from "@/env";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { processFileDocReUpload } from "@/server/fx/ebl";
import { s3StorageService } from "@/server/services/storage-service";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { uuid: string } }) {
  const execution = async () => {
    const ebl = await api.ebl.getByID.query(params.uuid);
    getLogger().info(`Got eBL from Server: ${JSON.stringify(ebl)}`);

    const documentParties = eblParties(ebl, false);
    const eblEvent = latestBillOfLadingEvent(ebl);
    const eblContent = eblEvent?.bill_of_lading_v3;
    if (!eblContent) {
      throw new TRPCClientError("EBl NOT_FOUND");
    }

    const eblId = ebl.bl?.id ?? ""
    const filename = eblEvent?.file?.name ?? ""
    const contentType = eblEvent?.file?.file_type ?? ""
    const hash = String(eblEvent?.metadata?.docHash)
    const docFile = await api.docFile.findByUuid.query(hash);
    if (!docFile) {
      // If not found docFile, download from bu server and generate docFile record
      const session = await getServerAuthSession();
      if (!session) redirect("/api/auth/signin");

      // download from bu server
      const response = await fetch(`${env.BU_SERVER_URL}/ebl/${eblId}/document`, {
        method: 'GET',
        headers: {
          'accept': 'application/octet-stream',
          'Authorization': `Bearer ${env.BU_SERVER_API_KEY}`,
          // 'X-Business-Unit-ID': String(session?.platform.platformId),
        },
      })
      // generate docFile record in db
      await processFileDocReUpload({
        filename,
        contentType,
        body: response.body,
        session,
        db,
        storage: s3StorageService,
      });
    }

    // TODO: wait for openAPI documentation to update
    const polLocation = eblContent?.transports?.portOfLoading as { locationName: string; UNLocationCode: string };
    const podLocation = eblContent?.transports?.portOfDischarge as { locationName: string; UNLocationCode: string };
    const eblForm: EBlFormType = {
      metadata: {
        username: "",
        docHash: hash,
      },
      file: {
        name: filename,
        type: contentType,
        content: "", // not need to pass current file content to client in edit mode, because if not upload new file, pass "" and bu server will use old file automatically
      },
      bl_number: eblContent?.transportDocumentReference ?? "",
      bl_doc_type: (eblEvent?.doc_type as EBlDocType) ?? EBlDocType.HouseBillOfLading,
      to_order: false,
      pol: {
        locationName: polLocation?.locationName ?? "",
        UNLocationCode: polLocation?.UNLocationCode ?? "",
      },
      pod: {
        locationName: podLocation?.locationName ?? "",
        UNLocationCode: podLocation?.UNLocationCode ?? "",
      },
      shipper: documentParties?.shipper ?? "",
      consignee: documentParties?.consignee ?? "",
      release_agent: documentParties?.releaser ?? "",
      note: eblEvent?.note,
      draft: false,
    };
    return <MainSection eblForm={eblForm} eblRecord={ebl} />;
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
