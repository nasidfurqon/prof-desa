import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { AppError } from "../utils/app-error";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}`, data: null });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message, data: null });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({ success: false, message: err.message, data: null });
  }

  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  return res.status(500).json({ success: false, message, data: null });
}
