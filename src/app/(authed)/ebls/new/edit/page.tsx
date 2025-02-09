"use server";

import ErrorPage from "@/app/_components/ebl-detail/error-page";
import MainSection from "@/app/_components/edit-ebl/main-section";
import { readRequestBodyToBuffer } from "@/server/fx/streram";
import { api } from "@/trpc/server";
import { type EBlFormType } from "@/types/ebl";
import { TRPCClientError } from "@trpc/client";
import { isEmpty } from "remeda";

export default async function Page({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const execution = async () => {
    const uuid = Array.isArray(searchParams?.uuid) ? searchParams?.uuid[0] : searchParams?.uuid;

    if (isEmpty(uuid)) {
      throw new TRPCClientError("NOT_FOUND");
    }

    const hash = uuid.split("-")[0];
    const docFile = await api.docFile.findByUuid.query(hash!);
    if (!docFile) {
      throw new TRPCClientError("docFile NOT_FOUND");
    }

    const [extraction, contentResult] = await Promise.all([
      api.docExtraction.get.query({ uuid }),
      docFile.contentUrl ? fetch(docFile.contentUrl) : Promise.resolve(null),
    ]);

    if (!extraction?.ebl) {
      throw new TRPCClientError("extraction NOT_FOUND");
    }

    const contentType = contentResult?.headers.get("content-type");
    const content = await readRequestBodyToBuffer(contentResult?.body);
    const contentBase64 = Buffer.from(content).toString("base64");

    const eblForm: EBlFormType = {
      ...extraction.ebl,
      metadata: {
        username: "",
        docHash: hash!,
      },
      file: {
        name: docFile.filename ?? "(unknown)",
        type: contentType ?? "binary/octet-stream",
        content: contentBase64, // be used to upload to bu server but not for download file
      },
      note: "",
      draft: true,
    };

    return (
      <MainSection
        eblForm={eblForm}
        eblRecord={undefined}
      />
    );
  };

  return execution().catch((err) => {
    return err instanceof TRPCClientError && err.message === "NOT_FOUND" ? (
      <ErrorPage message="eB/L Not Found" />
    ) : (
      <ErrorPage message={`Something went wrong: ${err}`} />
    );
  });
}
