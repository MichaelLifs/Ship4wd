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

/**
 * @swagger
 * /api/income-transactions:
 *   get:
 *     tags: [Income Transactions]
 */
router.get(
  "/",
  incomeTransactionController.getAllIncomeTransactions.bind(
    incomeTransactionController
  )
);

/**
 * @swagger
 * /api/income-transactions/shop/{shopId}:
 *   get:
 *     tags: [Income Transactions]
 */
router.get(
  "/shop/:shopId",
  validate(shopIdSchema, "params"),
  incomeTransactionController.getIncomeTransactionsByShopId.bind(
    incomeTransactionController
  )
);

/**
 * @swagger
 * /api/income-transactions/{id}:
 *   get:
 *     tags: [Income Transactions]
 */
router.get(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  incomeTransactionController.getIncomeTransactionById.bind(
    incomeTransactionController
  )
);

/**
 * @swagger
 * /api/income-transactions:
 *   post:
 *     tags: [Income Transactions]
 */
router.post(
  "/",
  validate(createIncomeTransactionSchema),
  incomeTransactionController.createIncomeTransaction.bind(
    incomeTransactionController
  )
);

/**
 * @swagger
 * /api/income-transactions/{id}:
 *   put:
 *     tags: [Income Transactions]
 */
router.put(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  validate(updateIncomeTransactionSchema),
  incomeTransactionController.updateIncomeTransaction.bind(
    incomeTransactionController
  )
);

/**
 * @swagger
 * /api/income-transactions/{id}:
 *   delete:
 *     tags: [Income Transactions]
 */
router.delete(
  "/:id",
  validate(incomeTransactionIdSchema, "params"),
  incomeTransactionController.deleteIncomeTransaction.bind(
    incomeTransactionController
  )
);

export default router;
