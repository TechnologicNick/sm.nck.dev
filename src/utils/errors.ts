import { TRPCError } from "@trpc/server";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/dist/rpc/codes";
import { NextApiResponse } from "next";

export abstract class HttpError extends Error {
  abstract readonly status: number;
  abstract readonly trpcErrorCode: TRPC_ERROR_CODE_KEY;
}

export class BadRequestError extends HttpError {
  status = 400 as const;
  trpcErrorCode = "BAD_REQUEST" as const;
}

export class NotFoundError extends HttpError {
  status = 404 as const;
  trpcErrorCode = "NOT_FOUND" as const;
}

export class InternalServerError extends HttpError {
  status = 500 as const;
  trpcErrorCode = "INTERNAL_SERVER_ERROR" as const;
}

export const handleHttpError = <T extends NextApiResponse>(error: unknown, res: T) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
  } else {
    throw error;
  }
}

export const rethrowAsTRPCError = (error: unknown) => {
  if (error instanceof HttpError) {
    throw new TRPCError({
      code: error.trpcErrorCode,
      message: error.message,
      cause: error,
    });
  } else {
    throw error;
  }
}
