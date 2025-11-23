import { Router } from "express";
import userRoutes from "../users/routes/userRoutes.js";
import shopRoutes from "../shops/routes/shopRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/shops", shopRoutes);

export default router;
