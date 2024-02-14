import { getServerAuthSession } from "@/server/auth";
import { invalidQueryError, unauthorizedError } from "@/server/server-errors";
import { pipe } from "effect";
import * as Effect from "effect/Effect";

// Effect to check if the sesssion is valid. return unauthorized error fail if it is invalid
export const validateSession = () =>
  pipe(
    Effect.tryPromise({
      try: async () => getServerAuthSession(),
      catch: (error) => invalidQueryError(error),
    }),

    Effect.flatMap((session) =>
      Effect.if(!session, {
        onTrue: Effect.fail(unauthorizedError("Invalid session")),
        onFalse: Effect.succeed(session!),
      }),
    ),
  );
