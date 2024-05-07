"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { HblNonNegotiableBadge } from "@/app/_components/common/ebl-badges";
import LocationIcon from "@/app/_icons/location-icon";
import PdfIcon from "@/app/_icons/pdf-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { type EBlRecordType } from "@/types/ebl";
import { latestBillOfLadingEvent } from "@/lib/ebl";
import type { ImageType } from "@/app/_components/common/props/types";

const FileDetailsLine = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-start">
    <div className="mr-8 w-[7rem] whitespace-nowrap font-normal text-light">
      {title}
    </div>
    {children}
  </div>
);

const FileDetails = ({ ebl, images }: { ebl: EBlRecordType; images: ImageType[]; }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const event = latestBillOfLadingEvent(ebl)
  const content = event?.bill_of_lading
  const id = ebl.bl?.id
  const fileName = event?.file?.name

  return (
    <section className="flex flex-col items-start rounded-lg border border-solid border-[#DFE4E9] bg-white p-[1.875rem] shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="grow whitespace-nowrap text-[1.375rem] font-semibold leading-8 text-main">
          {content?.transportDocumentReference}
        </div>
        <HblNonNegotiableBadge />
      </div>
      <div className="mt-[1.875rem] flex w-full items-stretch justify-between gap-5 self-stretch">
        <div className="flex w-full gap-5">
          <div className="flex flex-col items-start cursor-pointer">
            <Image
              src={images[0]?.thumbnailUrl ?? images[0]?.imageUrl ?? ""}
              alt="eBL Preview"
              width={123}
              height={170}
              className="w-auto"
              priority
              onClick={() => setModalOpen(true)}
            />
          </div>
          <div className="ml-[3.75rem] flex flex-col items-start text-[.8125rem] leading-[1.125rem]">
            <div className="flex flex-col items-start justify-start gap-[.875rem]">
              <FileDetailsLine title="File Name">
                <div className="font-semibold text-main">{decodeURIComponent(event?.file?.name ?? "")}</div>
              </FileDetailsLine>

              <FileDetailsLine title="File Type">
                <PdfIcon className="h-[18px] w-[18px]" />
                <div className="ml-2.5 font-semibold text-main">{event?.file?.file_type}</div>
              </FileDetailsLine>

              <FileDetailsLine title="Port of Loading">
                <LocationIcon />
                <div className="ml-2.5 font-semibold text-main">
                  {content?.shipmentLocations?.[0]?.location?.locationName}
                </div>
              </FileDetailsLine>

              <FileDetailsLine title="Port of Discharge">
                <LocationIcon />
                <div className="ml-2.5 font-semibold text-main">
                  {content?.shipmentLocations?.[1]?.location?.locationName}
                </div>
              </FileDetailsLine>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <Button className="flex h-[2.75rem] w-[11.25rem] items-center justify-center rounded-lg border border-secondary1 bg-white text-sm font-semibold p-0">
            <a className="h-full w-full flex justify-center items-center" href={`/api/file/download/${id}/${fileName}`} target="_blank">Download eBL</a>
          </Button>
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className={cn("fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[50vw] max-h-[90vh] overflow-auto p-0 font-content border-[2px] border-[#738DBC] !rounded-none")}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              src={image?.imageUrl ?? ""}
              alt={`eBL full-sized ${index + 1}`}
              width={1230}
              height={6000}
            />
          ))}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FileDetails;
