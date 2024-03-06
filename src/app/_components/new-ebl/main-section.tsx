"use client";

import { api } from "@/trpc/react";
import { DocAiTaskStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { hashQueryKey } from "@/lib/hashkey";
import ErrorView from "./error-view";
import ProcessingView from "./processing-view";
import UploadView from "./upload-view";
import UploadingView from "./uploading-view";

const MainSection = () => {
  const router = useRouter();
  const [status, setStatus] = useState("new");
  const [dockFileId, setDocFileId] = useState(0n);
  const [lastError, setLastError] = useState("");

  const { data: task, error: taskError } = api.docAiTask.get.useQuery(
    { docFileId: dockFileId },
    {
      queryKeyHashFn: hashQueryKey,
      refetchInterval: 1000,
      staleTime: Infinity,
      enabled: status === "processing",
    },
  );

  const { data: eblId, error: eblError } = api.ebl.findByDocFileId.useQuery(
    dockFileId,
    {
      queryKeyHashFn: hashQueryKey,
      enabled:
        status === "processing" && task?.status === DocAiTaskStatus.COMPLETED,
    },
  );

  if (eblId) {
    router.push(`/ebls/${eblId}/edit`);
  }

  if (task?.status === DocAiTaskStatus.FAILED) {
    setLastError(task.error ?? "Unknown error");
    setStatus("error");
  }
  if (taskError ?? eblError) {
    setLastError(taskError?.message ?? eblError?.message ?? "Unknown error");
    setStatus("error");
  }

  const handleFileSelected = async (f: File) => {
    setStatus("uploading");
    const res = await fetch("/api/file/ebl", {
      method: "POST",
      body: f,
      headers: {
        "Content-Type": f.type,
        "X-Filename": f.name,
      },
    }).catch((err) => {
      console.error(err);
    });

    if (res) {
      if (res?.ok) {
        const id = await res.text();
        console.log(`File uploaded successfully. task: ${id}`);
        setDocFileId(BigInt(id));
        setStatus("processing");
      } else {
        console.error(
          "Failed to upload file",
          res.status,
          res.statusText,
          await res.text(),
        );
      }
    }
  };

  return (
    <div className="px-12 py-10 font-content">
      <div className="text-2xl font-bold leading-9 text-main">New eB/L</div>

      <div className="mt-[1.875rem] flex h-[53.5rem] flex-col justify-between rounded-lg border border-solid border-border-light bg-white shadow-lg">
        {status === "new" && <UploadView onFileSelected={handleFileSelected} />}
        {status === "uploading" && <UploadingView />}
        {status === "processing" && <ProcessingView />}
        {status === "error" && <ErrorView message={lastError} />}
        <div className="flex h-[5.25rem] w-full items-center justify-between border-t-[1px] border-[#D9D9D9] px-[1.875rem]">
          <Link href="/ebls">
            <Button variant="outline" size="lg" className="w-[11.25rem]">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
