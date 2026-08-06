import { Router } from "express";
import { schoolController } from "../controllers/school.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createUploader } from "../config/multer";

const router = Router();
const upload = createUploader("schools");
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", schoolController.list);
router.get("/:id", schoolController.detail);
router.post("/", authMiddleware, uploadFields, schoolController.create);
router.put("/:id", authMiddleware, uploadFields, schoolController.update);
router.delete("/:id", authMiddleware, schoolController.remove);

export default router;
