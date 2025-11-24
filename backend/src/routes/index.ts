import { Router } from "express";
import userRoutes from "../users/routes/userRoutes.js";
import shopRoutes from "../shops/routes/shopRoutes.js";
import expenseRoutes from "../expenses/routes/expenseRoutes.js";
import incomeTransactionRoutes from "../income_transactions/routes/incomeTransactionRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/users", userRoutes);
router.use("/shops", shopRoutes);
router.use("/expenses", expenseRoutes);
router.use("/income-transactions", incomeTransactionRoutes);

export default router;
