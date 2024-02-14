import * as Effect from 'effect/Effect';
import * as Predicate from 'effect/Predicate';
import { NextResponse } from 'next/server';

import {
  API_STATUS_CODES,
  isApiError,
  isConflictError,
  isInvalidBodyError,
  isInvalidHeadersError,
  isInvalidParamsError,
  isInvalidQueryError,
  isInvalidResponseError,
} from '@/server/server-errors';

// const isParseError = (error: unknown): error is ParseError =>
//   Predicate.isTagged(error, "ParseError");

const formatError = (error: unknown) => {
  const isValidationError =
    isInvalidQueryError(error) ||
    isInvalidBodyError(error) ||
    isInvalidResponseError(error) ||
    isInvalidParamsError(error) ||
    isInvalidHeadersError(error) ||
    isConflictError(error);

  if (isValidationError) {
    const innerError = error.error;

    // if (isParseError(innerError)) {
    //   return formatValidationError(innerError);
    // } else
    if (Predicate.isString(innerError)) {
      return innerError;
    } else if (Predicate.isError(innerError)) {
      return innerError.message;
    }
  }

  if (Predicate.isRecord(error) && 'error' in error) {
    if (Predicate.isString(error.error)) {
      return error.error;
    } else if (error.error instanceof Error) {
      return error.error.message;
    }

    return JSON.stringify(error.error);
  }

  return JSON.stringify(error);
};

export const convertErrorToResponse = (error: unknown) => {
  const details = formatError(error);
  const tag = isApiError(error) ? error._tag : 'InternalServerError';
  return Effect.succeed(
    NextResponse.json(
      { error: tag, details },
      {
        status: Object.keys(API_STATUS_CODES).includes(tag)
          ? API_STATUS_CODES[tag]
          : 500,
      }
    )
  );
};
