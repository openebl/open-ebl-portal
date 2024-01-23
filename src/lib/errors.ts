import { TRPCError } from "@trpc/server";

class InternalServerError extends TRPCError {
  constructor(message?: string, cause?: Error) {
    super({ message, code: "INTERNAL_SERVER_ERROR", cause });
  }
}

class NotFoundError extends TRPCError {
  constructor(message?: string, cause?: Error) {
    super({ message, code: "NOT_FOUND", cause });
  }
}

export { InternalServerError, NotFoundError };
