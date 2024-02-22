import Image from "next/image";
import React from "react";

import { HblNonNegotiableBadge } from "@/app/_components/common/ebl-badges";
import CalendarIcon from "@/app/_icons/calendar-icon";
import LocationIcon from "@/app/_icons/location-icon";
import PdfIcon from "@/app/_icons/pdf-icon";
import { Button } from "@/components/ui/button";

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

const FileDetails = () => {
  return (
    <section className="flex flex-col items-start rounded-lg border border-solid border-[#DFE4E9] bg-white p-[1.875rem] shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="grow whitespace-nowrap text-[1.375rem] font-semibold leading-8 text-main">
          3904-3455
        </div>
        <HblNonNegotiableBadge />
      </div>
      <div className="mt-[1.875rem] flex w-full items-stretch justify-between gap-5 self-stretch">
        <div className="flex w-full gap-5">
          <div className="flex flex-col items-start ">
            <Image
              src="/ebl-pdf-preview.jpg"
              alt="eBL Preview"
              width={123}
              height={170}
            />
          </div>
          <div className="ml-[3.75rem] flex flex-col items-start text-[.8125rem] leading-[1.125rem]">
            <div className="flex flex-col items-start justify-start gap-[.875rem]">
              <FileDetailsLine title="File Name">
                <div className="font-semibold text-main">BL3904-3455.pdf</div>
              </FileDetailsLine>

              <FileDetailsLine title="File Type">
                <PdfIcon className="h-[18px] w-[18px]" />
                <div className="ml-2.5 font-semibold text-main">PDF</div>
              </FileDetailsLine>

              <FileDetailsLine title="Port of Loading">
                <LocationIcon />
                <div className="ml-2.5 font-semibold text-main">
                  Panama City, Panama
                </div>
              </FileDetailsLine>

              <FileDetailsLine title="Port of Discharge">
                <LocationIcon />
                <div className="ml-2.5 font-semibold text-main">
                  London, United Kingdom
                </div>
              </FileDetailsLine>

              <FileDetailsLine title="ETA">
                <div className="flex h-[18px] w-[18px] items-center justify-center text-[#738DBC]">
                  <CalendarIcon />
                </div>
                <div className="ml-2.5 font-semibold text-main">
                  Apr 16, 2009
                </div>
              </FileDetailsLine>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-end">
          <Button className="flex h-[2.75rem] w-[11.25rem] items-center justify-center rounded-lg border border-secondary1 bg-white text-sm font-semibold">
            <a href="...">Download eB/L</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FileDetails;
