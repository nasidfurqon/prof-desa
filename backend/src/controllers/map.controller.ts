import { Request, Response } from "express";
import { mapService } from "../services/map.service";
import { asyncHandler } from "../utils/async-handler";
import { sendSuccess } from "../utils/response.helper";

export const mapController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const markers = await mapService.listMarkers();
    return sendSuccess(res, markers);
  }),
};
