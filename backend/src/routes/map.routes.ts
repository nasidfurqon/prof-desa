import { Router } from "express";
import { mapController } from "../controllers/map.controller";

const router = Router();

router.get("/", mapController.list);

export default router;
