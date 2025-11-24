import { Router } from "express";
import incomeTransactionController from "../controllers/incomeTransactionController.js";
import {
  createIncomeTransactionSchema,
  updateIncomeTransactionSchema,
  incomeTransactionIdSchema,
  shopIdSchema,
  validate,
} from "../validators/incomeTransactionValidator.js";

const router = Router();

// Get all income transactions
router.get(
  "/",
  incomeTransactionController.getAllIncomeTransactions.bind(
    incomeTransactionController
  )
);

// Get income transactions by shop ID
router.get(
  "/shop/:shopId",
  validate(shopIdSchema, "params"),
  incomeTransactionController.getIncomeTransactionsByShopId.bind(
    incomeTransactionController
  )
);

// Get income transaction by ID
router.get(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  incomeTransactionController.getIncomeTransactionById.bind(
    incomeTransactionController
  )
);

// Create income transaction
router.post(
  "/",
  validate(createIncomeTransactionSchema),
  incomeTransactionController.createIncomeTransaction.bind(
    incomeTransactionController
  )
);

// Update income transaction
router.put(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  validate(updateIncomeTransactionSchema),
  incomeTransactionController.updateIncomeTransaction.bind(
    incomeTransactionController
  )
);

// Delete income transaction
router.delete(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  incomeTransactionController.deleteIncomeTransaction.bind(
    incomeTransactionController
  )
);

export default router;

