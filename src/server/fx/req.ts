import { Effect } from "effect";
import { internalServerError } from "@/server/server-errors";

const readRequestBodyToBuffer = async (
  stream: ReadableStream<Uint8Array> | null,
) => {
  if (!stream) {
    throw new Error("No readable stream is provided");
  }

  const reader = stream.getReader();
  let result = await reader.read();
  const chunks = [];
  while (!result.done) {
    chunks.push(result.value);
    result = await reader.read();
  }
  return Buffer.concat(chunks);
};

const bodyToBuffer = (stream: ReadableStream<Uint8Array> | null) =>
  Effect.tryPromise({
    try: () => readRequestBodyToBuffer(stream),
    catch: (error) => internalServerError(error),
  });

export { bodyToBuffer };
