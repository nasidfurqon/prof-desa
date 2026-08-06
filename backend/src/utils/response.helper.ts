import { Response } from "express";

export function sendSuccess(res: Response, data: unknown = {}, message = "Success", statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendPaginated(
  res: Response,
  items: unknown[],
  pagination: { page: number; limit: number; total: number },
  message = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data: items,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
}
