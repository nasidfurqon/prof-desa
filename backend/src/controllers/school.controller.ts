import { Request, Response } from "express";
import { schoolService } from "../services/school.service";
import { asyncHandler } from "../utils/async-handler";
import { sendPaginated, sendSuccess } from "../utils/response.helper";
import { AppError } from "../utils/app-error";

function parseFiles(req: Request) {
  const files = req.files as { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return { thumbnail: files?.thumbnail, images: files?.images };
}

function parseBody(req: Request) {
  const { name, level, description, address, phone, latitude, longitude } = req.body;
  return {
    name,
    level,
    description,
    address,
    phone,
    latitude: latitude !== undefined && latitude !== "" ? Number(latitude) : undefined,
    longitude: longitude !== undefined && longitude !== "" ? Number(longitude) : undefined,
  };
}

export const schoolController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const { items, total } = await schoolService.list({ page, limit, search, sortBy, sortOrder });
    return sendPaginated(res, items, { page, limit, total });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const school = await schoolService.getById(Number(req.params.id));
    return sendSuccess(res, school);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = parseBody(req);
    if (!body.name || !body.level || !body.description) {
      throw new AppError("Name, level, and description are required", 422);
    }
    const school = await schoolService.create(body, parseFiles(req));
    return sendSuccess(res, school, "School created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const body = parseBody(req);
    const school = await schoolService.update(id, body, parseFiles(req));
    return sendSuccess(res, school, "School updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await schoolService.remove(Number(req.params.id));
    return sendSuccess(res, null, "School deleted");
  }),
};
