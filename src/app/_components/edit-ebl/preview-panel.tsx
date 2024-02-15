"use client";

import { Input } from "@/components/ui/input";

import FitScreenIcon from "@/app/_icons/fit-screen-icon";
import MinusIcon from "@/app/_icons/minus-icon";
import PlusIcon from "@/app/_icons/plus-icon";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DownloadIcon from "@/app/_icons/download-icon";
import Image from "next/image";

const PreviewPanel = ({ images }: { images: string[] }) => {
  const [selectedDocument, setSelectedDocument] = useState(images[0]);
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom level as a percentage

  console.log('selectedDocument', selectedDocument);

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel < 300 ? zoomLevel + 10 : zoomLevel);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel > 50 ? zoomLevel - 10 : zoomLevel);
  };

  const handleSelectDocument = (index: number) => {
    setSelectedDocument(images[index]);
  };

  // This would be replaced with an actual upload function
  const handleUpload = () => {
    console.log("Upload functionality to be implemented");
  };

  return (
    <div className="flex h-[48.125rem] w-[38.75rem] flex-col items-stretch rounded-tl-lg bg-[#333639] flex-1">
      {/* Toolbar */}
      <div className="flex h-[3.75rem] items-center justify-between border-b px-[1.875rem] text-[0.8125rem] font-semibold leading-[1.125rem]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 text-white">
            <Input
              className="m-0 h-[1.875rem] w-[1.875rem] rounded-none border-none bg-black text-[0.8125rem] font-semibold leading-[1.125rem]"
              value={1}
              onChange={() => {0}}
            />
            <p>/</p>
            <p>3</p>
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
              onChange={() => {0}}
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
          <Button variant="flat" onClick={handleUpload} className="text-white">
            Upload New B/L
          </Button>
          <Button variant="flat" className="h-[1.875rem] w-[1.875rem] p-0">
            <DownloadIcon className="text-white" />
          </Button>
        </div>
      </div>

      {/* Main view */}
      <div className="flex flex-1">
        {/* Page Selector */}
        <div className="flex flex-col bg-[#2D2D2D] w-[8.125rem] flex-shrink-0 p-5 gap-5">
            {[1,2,3].map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-center cursor-pointer"
                onClick={() => handleSelectDocument(index)}
              >
                <Image src="/ebl-pdf-preview.jpg" width={123} height={170} alt="preview" />
              </div>
            ))}
        </div>
        {/* Document preview */}
        <div className="flex-1 bg-[#333639]"></div>
      </div>
    </div>
  );
};

export default PreviewPanel;
