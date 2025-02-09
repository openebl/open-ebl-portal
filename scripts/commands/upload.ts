import { MaosClient } from "@bluexlab/maos-ts";
import { type Command } from "commander";
import dotenv from "dotenv";
import fs from "fs/promises";
import { errAsync, okAsync } from "neverthrow";
import { z } from "zod";

dotenv.config();
const { env } = await import("@/env.js");

const docSplitterResponseSchema = z.object({
  documents: z.array(
    z.object({
      document_type: z.string(),
      pages: z.array(z.number()).min(1),
    }),
  ),
});
const docTypeNormalizeResponseSchema = z.object({
  document_type: z.string(),
});

export default function command(command: Command) {
  // const uploadCommand = new Command("upload");

  command
    .command("upload <path>")
    .description("Upload PDF to doc-extractor.")
    .action(async (path: string) => {
      const maos = new MaosClient({
        apiKey: env.MAOS_API_KEY,
        coreUrl: env.MAOS_CORE_URL,
      });

      const fileBuffer = await fs.readFile(path);
      const fileBase64Content = fileBuffer.toString("base64");
      const request = {
        file: fileBase64Content,
      };

      await maos
        .executeAsync(env.DOC_SPLITTER_ACTOR_NAME, "", request)
        .andThen((responder) => {
          return responder.getResult(60).andThen((result) => {
            if (typeof result.state !== "string" || result.state !== "completed") {
              return errAsync(new Error("Doc splitting timeout"));
            }
            return okAsync(result);
          });
        })
        .andThen((result) => {
          const res = docSplitterResponseSchema.safeParse(result.result);
          if (!res.success) {
            return errAsync(
              new Error(`invalid doc splitter response: ${String(result.result)}: ${res.error.toString()}`),
            );
          }
          if (res.data.documents.length === 0) {
            return errAsync(new Error("No documents found in doc splitter"));
          }
          return okAsync(res.data.documents);
        })
        .andThen((documents) => {
          const request = {
            document_type: documents[0]!.document_type,
          };
          return maos.executeAsync(env.DOC_TYPE_NORMALIZER_ACTOR_NAME, "", request).andThen((responder) => {
            return responder
              .getResult(60)
              .andThen((result) => {
                if (typeof result.state !== "string" || result.state !== "completed") {
                  return errAsync(new Error("Doc type normalizer timeout"));
                }
                return okAsync(result);
              })
              .andThen((result) => {
                return okAsync({ result, pages: documents[0]!.pages });
              });
          });
        })
        .andThen((result) => {
          const res = docTypeNormalizeResponseSchema.safeParse(result.result.result);
          if (!res.success) {
            return errAsync(res.error);
          }
          const request = {
            document_type: res.data.document_type,
            pdf_file: {
              file: fileBase64Content,
              pages: result.pages,
            },
            enable_hallucination_guard: true,
          };
          return maos.executeAsync(env.DOC_EXTRACT_ACTOR_NAME, "", request).andThen((responder) => {
            return responder
              .getResult(69)
              .andThen((result) => {
                if (typeof result.state !== "string" || result.state !== "completed") {
                  return errAsync(new Error("Doc extraction timeout"));
                }
                return okAsync(result);
              })
              .andThen((result) => {
                console.log("!!!!", result);
                return okAsync(result);
              });
          });
        })
        .match(
          (result) => {
            console.log(`Long running extract response: ${JSON.stringify(result, null)}`);
          },
          (err) => console.error("Error:", err),
        );
    });
}
