"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

const UploadPanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chartFile, setChartFile] = useState<File>();

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files?.[0]) {
      setChartFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex h-[48.125rem] flex-col items-center justify-center p-[3.125rem] text-main">
      <p className="text-[1.375rem] font-semibold leading-8">Upload a B/L</p>
      <p className="my-2.5 whitespace-nowrap text-sm font-normal">
        Supported file formats: PNG, JPEG, TIFF and PDF
      </p>

      <Button
        className="mt-10 h-[2.75rem] w-[11.25rem]"
        onClick={() => fileInputRef.current?.click()}
      >
        Browse...
      </Button>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/png,image/jpeg,image/tiff,application/pdf"
        onChange={onFilesChange}
      />
    </div>
  );
};

export default UploadPanel;
