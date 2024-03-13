"use client";

import { Input } from "@/components/ui/input";

import FitScreenIcon from "@/app/_icons/fit-screen-icon";
import MinusIcon from "@/app/_icons/minus-icon";
import PlusIcon from "@/app/_icons/plus-icon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DownloadIcon from "@/app/_icons/download-icon";
import Image from "next/image";
import Link from "next/link";
import type { ImageType } from "@/app/_components/common/props/types";

const PreviewPanel = ({ images }: { images: ImageType[] }) => {
  const [selectedDocument, setSelectedDocument] = useState(images[0]);
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom level as a percentage
  const [page, setPage] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel < 300 ? zoomLevel + 10 : zoomLevel);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel > 50 ? zoomLevel - 10 : zoomLevel);
  };

  const handleSelectDocument = (index: number) => {
    setSelectedDocument(images[index]);
    setPage(index + 1);
  };

  return (
    <div className="flex h-[48.125rem] w-[38.75rem] flex-1 flex-col items-stretch rounded-tl-lg bg-[#333639]">
      {/* Toolbar */}
      <div className="flex h-[3.75rem] items-center justify-between border-b px-[1.875rem] text-[0.8125rem] font-semibold leading-[1.125rem]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 text-white">
            <Input
              className="m-0 h-[1.875rem] w-[1.875rem] rounded-none border-none bg-black text-[0.8125rem] font-semibold leading-[1.125rem]"
              value={page}
              onChange={() => {
                0;
              }}
            />
            <p>/</p>
            <p>{images.length}</p>
          </div>

          <div className="flex items-center gap-2 text-white">
            <Button
              variant="flat"
              onClick={handleZoomOut}
              className="h-[1.875rem] w-[1.875rem] p-0 text-white"
            >
              <MinusIcon />
            </Button>
            <Input
              className="m-0 h-[1.875rem] w-[3.75rem] rounded-none border-none bg-black text-[0.8125rem] font-semibold leading-[1.125rem]"
              value={zoomLevel}
              onChange={() => {
                0;
              }}
            />
            <Button
              variant="flat"
              onClick={handleZoomIn}
              className="h-[1.875rem] w-[1.875rem] p-0 p-0 text-white"
            >
              <PlusIcon />
            </Button>
          </div>

          <Button
            variant="flat"
            onClick={handleZoomIn}
            className="h-[1.875rem] w-[1.875rem] p-0 text-white"
          >
            <FitScreenIcon className="text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-7">
          <Link href="/ebls/new">
            <Button variant="flat" className="text-white">
              Upload New BL
            </Button>
          </Link>
          <Button variant="flat" className="h-[1.875rem] w-[1.875rem] p-0">
            <DownloadIcon className="text-white" />
          </Button>
        </div>
      </div>

      {/* Main view */}
      <div className="flex flex-1">
        {/* Page Selector */}
        <div className="flex w-[8.125rem] flex-shrink-0 flex-col gap-5 bg-[#2D2D2D] p-5">
          {images.map(({ imageUrl }, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center justify-center"
              onClick={() => handleSelectDocument(index)}
            >
              <Image
                src={imageUrl}
                width={123}
                height={170}
                alt="preview"
                className={
                  selectedDocument?.page === index + 1 ? 'border-[3px] border-[#20C2C2]' : 'border-none'
                }
              />
            </div>
          ))}
        </div>
        {/* Document preview */}
        <div className="flex flex-1 bg-[#333639] justify-center overflow-auto min-h-full">
          {selectedDocument && <Image
            src={selectedDocument.imageUrl}
            width={500}
            height={680}
            alt="preview"
            priority
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top'
            }}
          />}
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
