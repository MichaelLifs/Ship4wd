import { Router } from "express";
import expenseController from "../controllers/expenseController.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseIdSchema,
  shopIdSchema,
  validate,
} from "../validators/expenseValidator.js";

const router = Router();

// Get all expenses
router.get("/", expenseController.getAllExpenses.bind(expenseController));

// Get expenses by shop ID
router.get(
  "/shop/:shopId",
  validate(shopIdSchema, "params"),
  expenseController.getExpensesByShopId.bind(expenseController)
);

// Get expense by ID
router.get(
  "/:id",
  validate(expenseIdSchema, "params"),
  expenseController.getExpenseById.bind(expenseController)
);

// Create expense
router.post(
  "/",
  validate(createExpenseSchema),
  expenseController.createExpense.bind(expenseController)
);

// Update expense
router.put(
  "/:id",
  validate(expenseIdSchema, "params"),
  validate(updateExpenseSchema),
  expenseController.updateExpense.bind(expenseController)
);

// Delete expense
router.delete(
  "/:id",
  validate(expenseIdSchema, "params"),
  expenseController.deleteExpense.bind(expenseController)
);

export default router;

