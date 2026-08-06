import { Request, Response } from "express";
import { pageRepository } from "../repositories/page.repository";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/response.helper";
import { NotFoundError } from "../utils/app-error";

export const pageController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const pages = await pageRepository.list();
    return sendSuccess(res, pages);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body ?? {};
    const page = await pageRepository.update(id, { title, content });
    if (!page) throw new NotFoundError("Page not found");
    return sendSuccess(res, page, "Page updated");
  }),
};
