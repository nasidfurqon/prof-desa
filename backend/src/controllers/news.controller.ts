import { Request, Response } from "express";
import { NewsRelatedType } from "@prisma/client";
import { newsService } from "../services/news.service";
import { asyncHandler } from "../utils/async-handler";
import { sendPaginated, sendSuccess } from "../utils/response.helper";
import { AppError } from "../utils/app-error";

function parseFiles(req: Request) {
  const files = req.files as { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return { thumbnail: files?.thumbnail, images: files?.images };
}

const RELATED_TYPES = new Set(["GENERAL", "ORGANIZATION", "UMKM", "SCHOOL"]);

function parseBody(req: Request) {
  const { title, summary, content, relatedType, relatedId, publishedAt } = req.body;
  return {
    title,
    summary,
    content,
    relatedType: RELATED_TYPES.has(relatedType) ? (relatedType as NewsRelatedType) : undefined,
    relatedId: relatedId !== undefined && relatedId !== "" ? Number(relatedId) : undefined,
    publishedAt: publishedAt ? new Date(publishedAt) : undefined,
  };
}

export const newsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const { items, total } = await newsService.list({ page, limit, search, sortBy, sortOrder });
    return sendPaginated(res, items, { page, limit, total });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const news = await newsService.getById(Number(req.params.id));
    return sendSuccess(res, news);
  }),

  detailBySlug: asyncHandler(async (req: Request, res: Response) => {
    const news = await newsService.getBySlug(req.params.slug);
    return sendSuccess(res, news);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = parseBody(req);
    if (!body.title || !body.summary || !body.content) {
      throw new AppError("Title, summary, and content are required", 422);
    }
    const news = await newsService.create(body, parseFiles(req), req.user?.userId);
    return sendSuccess(res, news, "News created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const body = parseBody(req);
    const news = await newsService.update(id, body, parseFiles(req));
    return sendSuccess(res, news, "News updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await newsService.remove(Number(req.params.id));
    return sendSuccess(res, null, "News deleted");
  }),
};
