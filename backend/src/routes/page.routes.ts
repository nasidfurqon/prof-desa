import { Router } from "express";
import { pageController } from "../controllers/page.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", pageController.list);
router.put("/:id", authMiddleware, pageController.update);

export default router;
