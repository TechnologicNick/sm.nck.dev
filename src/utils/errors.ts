import { NextApiResponse } from "next";

export abstract class HttpError extends Error {
  abstract status: number;
}

export class BadRequestError extends HttpError {
  status = 400;
}

export class NotFoundError extends HttpError {
  status = 404;
}

export class InternalServerError extends HttpError {
  status = 500;
}

export const handleHttpError = <T extends NextApiResponse>(error: unknown, res: T) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
  } else {
    throw error;
  }
}
