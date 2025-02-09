"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { hashQueryKey } from "@/lib/hashkey";
import ErrorView from "./error-view";
import ProcessingView from "./processing-view";
import UploadView from "./upload-view";
import UploadingView from "./uploading-view";
import type { EBlFileProcessResultType } from "@/types/ebl";

const MainSection = () => {
  const router = useRouter();
  const [status, setStatus] = useState("new");
  const [fileUuid, setFileUuid] = useState("");
  const [lastError, setLastError] = useState("");

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
    if (extraction?.ebl) {
      router.push(`/ebls/new/edit?uuid=${fileUuid}`);
    }
    if (extraction?.status === "failed") {
      setLastError(extraction?.error ?? "Unknown error");
      setStatus("error");
    }
  }, [extraction, router, fileUuid]);

  if (error) {
    setLastError(error?.message ?? "Unknown error");
    setStatus("error");
  }

  const handleFileSelected = async (f: File) => {
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
        const result = (await res.json()) as EBlFileProcessResultType;
        const { uuid } = result;
        setFileUuid(uuid);
        setStatus("processing");
      } else {
        console.error("Failed to upload file", res.status, res.statusText, await res.text());
        setLastError(res.statusText ?? "Unknown error");
        setStatus("error");
      }
    }
  };

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eBL</div>

      <div className="mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid border-border-light bg-white shadow-lg">
        {status === "new" && <UploadView onFileSelected={handleFileSelected} />}
        {status === "uploading" && <UploadingView />}
        {status === "processing" && <ProcessingView />}
        {status === "error" && <ErrorView message={lastError} />}
        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Link
            href="/ebls"
            tabIndex={-1}
          >
            <Button
              variant="outline"
              size="lg"
              className="w-[11.25rem]"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
