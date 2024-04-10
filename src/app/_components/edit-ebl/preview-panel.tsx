"use client";

import { Input } from "@/components/ui/input";

import FitScreenIcon from "@/app/_icons/fit-screen-icon";
import MinusIcon from "@/app/_icons/minus-icon";
import PlusIcon from "@/app/_icons/plus-icon";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DownloadIcon from "@/app/_icons/download-icon";
import Image from "next/image";
import type { ImageType } from "@/app/_components/common/props/types";
import type { EBlFileProcessResultType, EBlFormType } from "@/types/ebl";
import { api } from "@/trpc/react";
import { hashQueryKey } from "@/lib/hashkey";
import { toast } from "sonner";
import type { UseFormReturn } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog"
import JumpingLoader from "../common/jumping-loader";

const PreviewPanel = ({
  docId,
  form,
  updateFormDataByNewEBl
}: {
  docId: string;
  form: UseFormReturn<EBlFormType>;
  updateFormDataByNewEBl: (form: EBlFormType) => void
}) => {
  const originalImageWidth = 500;
  const originalImageHeight = 680;

  const [selectedDocument, setSelectedDocument] = useState<ImageType | null | undefined>(null);
  const [zoomLevel, setZoomLevel] = useState(100); // Zoom level as a percentage
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("new");
  const [lastError, setLastError] = useState("");
  const [fileUuid, setFileUuid] = useState("");
  const [fileHash, setFileHash] = useState(form.getValues().metadata.docHash ?? "");
  const [fileInfo, setFileInfo] = useState<EBlFormType["file"]>({
    name: form.getValues().file.name,
    type: form.getValues().file.type,
    content: form.getValues().file.content,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { data: docFile } = api.docFile.findByUuid.useQuery(
    fileHash,
    {
      queryKeyHashFn: hashQueryKey,
      staleTime: Infinity,
      enabled: !!fileHash,
    },
  );

  const { data: images } = api.docImage.getUrls.useQuery(
    { docFileId: docFile?.id ?? 0n },
    {
      queryKeyHashFn: hashQueryKey,
      staleTime: Infinity,
      enabled: !!docFile?.id,
    },
  );

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedDocument(images[0]);
    }
  }, [images]);

  const { data: extraction, error } = api.docExtraction.get.useQuery(
    { uuid: fileUuid },
    {
      queryKeyHashFn: hashQueryKey,
      refetchInterval: 1000,
      staleTime: Infinity,
      enabled: status === "processing",
    },
  );

  useEffect(() => {
    if (extraction) {
      extraction.file = fileInfo
      extraction.metadata.docHash = fileHash
      updateFormDataByNewEBl(extraction)
      setStatus("done")
    }
  }, [extraction, fileInfo, fileHash, updateFormDataByNewEBl]);

  if (error) {
    setLastError(error?.message ?? "Unknown error");
    setStatus("error");
  }

  const handleZoomIn = () => {
    setZoomLevel(zoomLevel + 10);
  };

  const handleZoomOut = () => {
    setZoomLevel(zoomLevel > 50 ? zoomLevel - 10 : zoomLevel);
  };

  const handleZoomByInput = (event: ChangeEvent<HTMLInputElement>) => {
    const targetZoom = Number(event.target.value);
    if (!isNaN(targetZoom)) setZoomLevel(targetZoom);
  };

  const handleZoomFullScreen = () => {
    const zoomVal = Math.round((imageContainerRef.current!.offsetWidth / originalImageWidth) * 100);
    setZoomLevel(zoomVal);
  };

  const handleSelectDocument = (index: number) => {
    setSelectedDocument(images?.[index]);
    setPage(index + 1);
  };

  const handleSelectDocumentByInput = (event: ChangeEvent<HTMLInputElement>) => {
    const targetPage = Number(event.target.value);
    const totalPages = images?.length ?? 0;
    setPage(targetPage);
    if (targetPage >= 1 && targetPage <= totalPages) {
      setSelectedDocument(images?.[targetPage - 1]);
    }
  };

  const downloadDocument = async () => {
    if (!fileInfo.content && docId) { // not upload new bl file, download from bu server
      const link = document.createElement('a');
      link.href = `/api/file/download/${docId}/${fileInfo.name}`;
      link.download = fileInfo.name;
      link.click();
    } else { // user newly uploaded file, download from AWS S3 presigned url (get storage key in docFile table by fileHash)
      const link = document.createElement('a');
      link.href = `/api/file/download_from_s3/${fileHash}`;
      link.download = fileInfo.name;
      link.click();
    }
  }

  const onFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      const f = e.target.files[0];
      setStatus("uploading");
      const encodedFilename = encodeURIComponent(f.name); // ensure that any non-ASCII characters are properly handled
      const res = await fetch("/api/file/ebl", {
        method: "POST",
        body: f,
        headers: {
          "Content-Type": f.type,
          "X-Filename": encodedFilename,
        },
      }).catch((err) => {
        console.error(err);
      });

      if (res) {
        if (res?.ok) {
          const result = await res.json() as EBlFileProcessResultType;
          const { uuid, fileContentBase64: newContent } = result;
          const newHash = String(uuid.split("-")[0]);
          if (!newContent) {
            console.error("Failed to upload file", "No content returned");
            setLastError("No content returned");
            setStatus("error");
            return;
          }
          setFileUuid(uuid);
          setFileHash(newHash);
          setFileInfo({
            name: f.name,
            type: f.type,
            content: newContent,
          });
          setStatus("processing");
        } else {
          console.error(
            "Failed to upload file",
            res.status,
            res.statusText,
            await res.text(),
          );
          setLastError(res.statusText ?? "Unknown error");
          setStatus("error");
        }
      }
    }
  };

  return (
    <div className="flex h-[48.125rem] w-[38.75rem] flex-1 flex-col items-stretch rounded-tl-lg bg-[#333639]">
      {/* Toolbar */}
      <div className="flex shrink-0 h-[3.75rem] items-center justify-between border-b px-[1.875rem] text-[0.8125rem] font-semibold leading-[1.125rem]">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 text-white">
            <Input
              className="m-0 h-[1.875rem] w-[1.875rem] rounded-none border-none bg-black text-[0.8125rem] font-semibold leading-[1.125rem]"
              value={page}
              onChange={handleSelectDocumentByInput}
            />
            <p>/</p>
            <p>{images?.length}</p>
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
              onChange={handleZoomByInput}
            />
            <Button
              variant="flat"
              onClick={handleZoomIn}
              className="h-[1.875rem] w-[1.875rem] p-0 text-white"
            >
              <PlusIcon />
            </Button>
          </div>

          <Button
            variant="flat"
            onClick={handleZoomFullScreen}
            className="h-[1.875rem] w-[1.875rem] p-0 text-white"
          >
            <FitScreenIcon className="text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-7">
          <Button variant="flat" className="text-white" onClick={() => fileInputRef.current?.click()}>
            Upload New BL
          </Button>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={onFilesChange}
          />
          <Button variant="flat" className="h-[1.875rem] w-[1.875rem] p-0" onClick={downloadDocument}>
            <DownloadIcon className="text-white" />
          </Button>
        </div>
      </div>

      {/* Main view */}
      <div className="flex flex-1">
        {/* Page Selector */}
        <div className="flex w-[8.125rem] flex-shrink-0 flex-col gap-5 bg-[#2D2D2D] p-5">
          {images?.map(({ imageUrl, thumbnailUrl }, index) => (
            <div
              key={index}
              className="flex cursor-pointer items-center justify-center"
              onClick={() => handleSelectDocument(index)}
            >
              <Image
                src={thumbnailUrl ?? imageUrl ?? ""}
                width={123}
                height={170}
                alt="preview"
                priority
                className={
                  selectedDocument?.page === index + 1 ? 'border-[3px] border-[#20C2C2]' : 'border-none'
                }
              />
            </div>
          ))}
        </div>
        {/* Document preview */}
        <div className="flex flex-1 bg-[#333639]">
          <div className="relative w-full h-full overflow-auto" ref={imageContainerRef}>
            {selectedDocument && <Image
              src={selectedDocument.imageUrl ?? ""}
              width={originalImageWidth * (zoomLevel / 100)}
              height={originalImageHeight * (zoomLevel / 100)}
              alt="full"
              className="absolute left-1/2 -translate-x-1/2"
              priority
            />}
          </div>
        </div>
      </div>

      {["uploading", "processing"].includes(status) &&
        <Dialog open={true}>
          <DialogContent
            showCloseButton={false}
            className={"p-0 font-content"}
          >
            <div className="flex flex-col items-center justify-center py-[3.125rem] text-main bg-white rounded-[4px]">
              <JumpingLoader className="text-secondary1" />
              <p className="mt-10 text-base font-semibold">Scanning documents...</p>
              <p className="my-2.5 whitespace-nowrap text-[0.75rem] font-normal leading-[1.125rem]">
                This may take a moment, thank you for your patience.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      }
      {status === "error" && toast.error(lastError)}
    </div>
  );
};

export default PreviewPanel;
