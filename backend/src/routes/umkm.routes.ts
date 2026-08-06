import { Router } from "express";
import { umkmController } from "../controllers/umkm.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createUploader } from "../config/multer";

const router = Router();
const upload = createUploader("umkms");
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", umkmController.list);
router.get("/:id", umkmController.detail);
router.post("/", authMiddleware, uploadFields, umkmController.create);
router.put("/:id", authMiddleware, uploadFields, umkmController.update);
router.delete("/:id", authMiddleware, umkmController.remove);

export default router;
