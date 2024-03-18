"use server";

import MainSection from "@/app/_components/edit-ebl/main-section";
import ErrorPage from "@/app/_components/ebl-detail/error-page";
import { getLatestBillOfLading } from "@/lib/utils";
import { getLogger } from "@/lib/logger";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";
import { type EBlFormType } from "@/types/ebl";

export default async function Page({ params }: { params: { uuid: string } }) {
  const execution = async () => {
    const ebl = await api.ebl.getByID.query(params.uuid);
    getLogger().info(`Got eBL from Server: ${JSON.stringify(ebl)}`);

    const eblContent = getLatestBillOfLading(ebl)
    if (!eblContent) {
      throw new TRPCClientError("EBl NOT_FOUND");
    }

    const hash = eblContent.metadata.docHash
    if (!hash) {
      throw new TRPCClientError("EBl File Hash NOT_FOUND");
    }

    const docFile = await api.docFile.findByUuid.query(hash);
    if (!docFile) {
      throw new TRPCClientError("docFile NOT_FOUND");
    }

    const images = await api.docImage.getUrls.query({ docFileId: docFile.id })
    const eblForm: EBlFormType = {
      metadata: {
        username: "",
        docHash: hash,
      },
      file: {
        name: eblContent?.file.name ?? "",
        type: eblContent?.file.file_type ?? "",
        content: "",
      },
      bl_number: eblContent?.bill_of_lading.transportDocumentReference ?? "",
      bl_doc_type: eblContent?.doc_type ?? "HouseBillOfLading",
      to_order: false,
      pol: {
        locationName: eblContent?.bill_of_lading.shipmentLocations[0]?.location.locationName ?? "",
        UNLocationCode: eblContent?.bill_of_lading.shipmentLocations[0]?.location.UNLocationCode ?? "",
      },
      pod: {
        locationName: eblContent?.bill_of_lading.shipmentLocations[1]?.location.locationName ?? "",
        UNLocationCode: eblContent?.bill_of_lading.shipmentLocations[1]?.location.UNLocationCode ?? "",
      },
      shipper: eblContent?.bill_of_lading.shippingInstruction.documentParties[1]?.party.identifyingCodes[0]?.partyCode ?? "",
      consignee: eblContent?.bill_of_lading.shippingInstruction.documentParties[2]?.party.identifyingCodes[0]?.partyCode ?? "",
      release_agent: eblContent?.bill_of_lading.shippingInstruction.documentParties[3]?.party.identifyingCodes[0]?.partyCode ?? "",
      note: eblContent?.note,
      draft: false,
    }
    return <MainSection ebl={eblForm} images={images} />;
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eBL Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
