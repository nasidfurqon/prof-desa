import { Router } from "express";
import { organizationController } from "../controllers/organization.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createUploader } from "../config/multer";

const router = Router();
const upload = createUploader("organizations");
const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

router.get("/", organizationController.list);
router.get("/:id", organizationController.detail);
router.post("/", authMiddleware, uploadFields, organizationController.create);
router.put("/:id", authMiddleware, uploadFields, organizationController.update);
router.delete("/:id", authMiddleware, organizationController.remove);

export default router;
