import { Request, Response } from "express";
import { organizationService } from "../services/organization.service";
import { asyncHandler } from "../utils/async-handler";
import { sendPaginated, sendSuccess } from "../utils/response.helper";
import { AppError } from "../utils/app-error";

function parseFiles(req: Request) {
  const files = req.files as { thumbnail?: Express.Multer.File[]; images?: Express.Multer.File[] } | undefined;
  return { thumbnail: files?.thumbnail, images: files?.images };
}

function parseBody(req: Request) {
  const { name, description, phone, email, address, latitude, longitude } = req.body;
  return {
    name,
    description,
    phone,
    email,
    address,
    latitude: latitude !== undefined && latitude !== "" ? Number(latitude) : undefined,
    longitude: longitude !== undefined && longitude !== "" ? Number(longitude) : undefined,
  };
}

export const organizationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const { items, total } = await organizationService.list({ page, limit, search, sortBy, sortOrder });
    return sendPaginated(res, items, { page, limit, total });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const organization = await organizationService.getById(id);
    return sendSuccess(res, organization);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = parseBody(req);
    if (!body.name || !body.description) {
      throw new AppError("Name and description are required", 422);
    }
    const organization = await organizationService.create(body, parseFiles(req));
    return sendSuccess(res, organization, "Organization created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const body = parseBody(req);
    const organization = await organizationService.update(id, body, parseFiles(req));
    return sendSuccess(res, organization, "Organization updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await organizationService.remove(id);
    return sendSuccess(res, null, "Organization deleted");
  }),
};
