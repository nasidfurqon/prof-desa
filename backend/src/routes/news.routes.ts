import { Router } from "express";
import { newsController } from "../controllers/news.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createUploader } from "../config/multer";

const router = Router();
const upload = createUploader("news");
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", newsController.list);
router.get("/slug/:slug", newsController.detailBySlug);
router.get("/:id", newsController.detail);
router.post("/", authMiddleware, uploadFields, newsController.create);
router.put("/:id", authMiddleware, uploadFields, newsController.update);
router.delete("/:id", authMiddleware, newsController.remove);

export default router;
