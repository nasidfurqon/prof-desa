import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/response.helper";
import { AppError } from "../utils/app-error";

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      throw new AppError("Email and password are required", 422);
    }

    const result = await authService.login(email, password);
    return sendSuccess(res, result, "Login successful");
  }),
};
