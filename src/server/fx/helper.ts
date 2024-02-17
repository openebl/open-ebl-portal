import { internalServerError } from "@/server/server-errors";
import { Effect } from "effect";

export const asyncFnToEffect = <R>(fn: () => Promise<R>) =>
  Effect.tryPromise({
    try: fn,
    catch: (error) => internalServerError(error),
  });
