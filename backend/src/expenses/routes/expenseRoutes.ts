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

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     tags: [Expenses]
 */
router.get("/", expenseController.getAllExpenses.bind(expenseController));

/**
 * @swagger
 * /api/expenses/shop/{shopId}:
 *   get:
 *     tags: [Expenses]
 */
router.get(
  "/shop/:shopId",
  validate(shopIdSchema, "params"),
  expenseController.getExpensesByShopId.bind(expenseController)
);

/**
 * @swagger
 * /api/expenses/{id}:
 *   get:
 *     tags: [Expenses]
 */
router.get(
  "/:id",
  validate(expenseIdSchema, "params"),
  expenseController.getExpenseById.bind(expenseController)
);

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     tags: [Expenses]
 */
router.post(
  "/",
  validate(createExpenseSchema),
  expenseController.createExpense.bind(expenseController)
);

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     tags: [Expenses]
 */
router.put(
  "/:id",
  validate(expenseIdSchema, "params"),
  validate(updateExpenseSchema),
  expenseController.updateExpense.bind(expenseController)
);

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     tags: [Expenses]
 */
router.delete(
  "/:id",
  validate(expenseIdSchema, "params"),
  expenseController.deleteExpense.bind(expenseController)
);

export default router;
