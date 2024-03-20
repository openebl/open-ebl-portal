"use server";

import MainSection from "@/app/_components/edit-ebl/main-section";
import ErrorPage from "@/app/_components/ebl-detail/error-page";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { type EBlFormType } from "@/types/ebl";
import { eblParties, latestBillOfLadingEvent } from "@/lib/ebl";

export default async function Page({ params }: { params: { uuid: string } }) {
  const execution = async () => {
    const ebl = await api.ebl.getByID.query(params.uuid);
    getLogger().info(`Got eBL from Server: ${JSON.stringify(ebl)}`);

    const documentParties = eblParties(ebl, false)
    const eblEvent = latestBillOfLadingEvent(ebl)
    const eblContent = eblEvent?.bill_of_lading
    if (!eblContent) {
      throw new TRPCClientError("EBl NOT_FOUND");
    }

    const hash = String(eblEvent?.metadata?.docHash)
    const docFile = await api.docFile.findByUuid.query(hash);
    const images = docFile ? await api.docImage.getUrls.query({ docFileId: docFile.id }) : []

    // TODO: wait for openAPI documentation to update
    const polLocation = eblContent?.shipmentLocations?.[0]?.location as { locationName: string, UNLocationCode: string }
    const podLocation = eblContent?.shipmentLocations?.[1]?.location as { locationName: string, UNLocationCode: string }
    const eblForm: EBlFormType = {
      metadata: {
        username: "",
        docHash: hash,
      },
      file: {
        name: eblEvent?.file?.name ?? "",
        type: eblEvent?.file?.file_type ?? "",
        content: "",
      },
      bl_number: eblContent?.transportDocumentReference ?? "",
      bl_doc_type: eblEvent?.doc_type ?? "HouseBillOfLading",
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
    }
    return <MainSection eblForm={eblForm} eblRecord={ebl} images={images} />;
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
