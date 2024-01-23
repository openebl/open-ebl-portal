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

export async function tryCatchAsync<T>(runnable: () => Promise<T>): Promise<Either<Error, T>> {
  try {
    const result = await runnable();
    return right(result);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return left(err instanceof Error ? err : new Error(`${err}`));
  }
}
