import { unauthorizedError } from "@/server/server-errors";
import * as Effect from "effect/Effect";
import { type Session } from "next-auth";

// Effect to check if the sesssion is valid. return unauthorized error fail if it is invalid
export const validateSession = (session: Session | null) =>
  Effect.if(!session, {
    onTrue: Effect.fail(unauthorizedError("Invalid session")),
    onFalse: Effect.succeed(session!),
  });
