import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/async-handler";
import { sendPaginated, sendSuccess } from "../utils/response.helper";
import { AppError } from "../utils/app-error";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

    const { items, total } = await userService.list({ page, limit, search, sortBy, sortOrder });
    return sendPaginated(res, items, { page, limit, total });
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getById(Number(req.params.id));
    return sendSuccess(res, user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, isActive } = req.body ?? {};
    if (!name || !email) {
      throw new AppError("Name and email are required", 422);
    }
    const user = await userService.create({ name, email, password, isActive });
    return sendSuccess(res, user, "User created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, email, password, isActive } = req.body ?? {};
    const user = await userService.update(id, { name, email, password, isActive });
    return sendSuccess(res, user, "User updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await userService.remove(Number(req.params.id));
    return sendSuccess(res, null, "User deleted");
  }),
};
