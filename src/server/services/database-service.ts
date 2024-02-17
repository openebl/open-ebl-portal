import type { Prisma, PrismaClient } from "@prisma/client";
import { Context, Effect, Exit } from "effect";
import { type Scope } from "effect/Scope";
import {
  internalServerError,
  type InternalServerError,
} from "../server-errors";

export type FlatTransaction = Prisma.TransactionClient & {
  $commit: () => Promise<void>;
  $rollback: () => Promise<void>;
};

const ROLLBACK = { [Symbol.for("prisma.client.extension.rollback")]: true };

export async function beginTransaction(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>,
) {
  let setTxClient: (txClient: Prisma.TransactionClient) => void;
  let commit: () => void;
  let rollback: () => void;

  // a promise for getting the tx inner client
  const txClient = new Promise<Prisma.TransactionClient>((res) => {
    setTxClient = (txClient) => res(txClient);
  });

  // a promise for controlling the transaction
  const txPromise = new Promise((_res, _rej) => {
    commit = () => _res(undefined);
    rollback = () => _rej(ROLLBACK);
  });

  // opening a transaction to control externally
  const p = prisma as PrismaClient;
  const tx = p.$transaction((txClient) => {
    setTxClient(txClient as unknown as Prisma.TransactionClient);
    return txPromise;
  });

  // return a proxy TransactionClient with `$commit` and `$rollback` methods
  return new Proxy(await txClient, {
    get(target, prop) {
      if (prop === "$commit") {
        return () => {
          commit();
          return tx;
        };
      }
      if (prop === "$rollback") {
        return () => {
          rollback();
          return tx;
        };
      }
      return target[prop as keyof typeof target];
    },
  }) as FlatTransaction;
}

const createTransaction = (
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>,
) =>
  Effect.acquireRelease(
    Effect.tryPromise({
      try: () => beginTransaction(prisma),
      catch: (err) => internalServerError(err),
    }),
    (tx, exit) =>
      // The release function for the Effect.acquireRelease operation is responsible for handling the acquired resource (bucket) after the main effect has completed.
      // It is called regardless of whether the main effect succeeded or failed.
      // If the main effect failed, Exit.isFailure(exit) will be true, and the function will perform a rollback by calling deleteBucket(bucket).
      // If the main effect succeeded, Exit.isFailure(exit) will be false, and the function will return Effect.unit, representing a successful, but do-nothing effect.
      Exit.isFailure(exit)
        ? Effect.promise(() => tx.$rollback().catch((): void => undefined)) // ignore ROLLBACK exception to ensure effect error handling works well
        : Effect.promise(() => tx.$commit()),
  );

export class DatabaseError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.name = "DatabaseError";
    if (cause) this.cause = cause;
  }
}

export class DatabaseService extends Context.Tag("DatabaseService")<
  DatabaseService,
  {
    readonly transaction: () => Effect.Effect<
      FlatTransaction,
      InternalServerError,
      Scope
    >;
  }
>() {}

export type DatabaseServiceType = {
  readonly transaction: () => Effect.Effect<
    FlatTransaction,
    InternalServerError,
    Scope
  >;
};

export const liveDatabaseService = (
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>,
) =>
  ({
    transaction: () => {
      return createTransaction(prisma);
    },
  }) as DatabaseServiceType;
