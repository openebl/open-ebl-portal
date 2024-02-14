import { type Either, right, left } from "effect/Either";

export function tryCatch<T>(runnable: () => T): Either<Error, T> {
  try {
    const result = runnable();
    return right(result);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return left(err instanceof Error ? err : new Error(`${err}`));
  }
}

export async function tryCatchAsync<T>(
  runnable: () => Promise<T>,
): Promise<Either<Error, NonNullable<T>>> {
  return runnable()
    .then((n) => (n ? right(n) : left(new Error("null result"))))
    .catch((err) => left(err instanceof Error ? err : new Error(`${err}`)));
}
