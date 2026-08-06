import { Router } from "express";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";
import mapRoutes from "./map.routes";
import pageRoutes from "./page.routes";
import userRoutes from "./user.routes";
import umkmRoutes from "./umkm.routes";
import schoolRoutes from "./school.routes";
import newsRoutes from "./news.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/maps", mapRoutes);
router.use("/pages", pageRoutes);
router.use("/users", userRoutes);
router.use("/umkms", umkmRoutes);
router.use("/schools", schoolRoutes);
router.use("/news", newsRoutes);

export default router;
