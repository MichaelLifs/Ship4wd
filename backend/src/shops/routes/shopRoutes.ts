import { Router } from "express";
import shopController from "../controllers/shopController.js";
import shopManagerController from "../controllers/shopManagerController.js";
import {
  createShopSchema,
  updateShopSchema,
  shopIdSchema,
  validate,
} from "../validators/shopValidator.js";
import {
  addManagerSchema,
  shopIdSchema as managerShopIdSchema,
  userIdSchema,
  validate as validateManager,
} from "../validators/shopManagerValidator.js";

const router = Router();

/**
 * @swagger
 * /api/shops:
 *   get:
 *     tags: [Shops]
 */
router.get("/", shopController.getAllShops.bind(shopController));

/**
 * @swagger
 * /api/shops/{id}:
 *   get:
 *     tags: [Shops]
 */
router.get(
  "/:id",
  validate(shopIdSchema, "params"),
  shopController.getShopById.bind(shopController)
);

/**
 * @swagger
 * /api/shops:
 *   post:
 *     tags: [Shops]
 */
router.post(
  "/",
  validate(createShopSchema),
  shopController.createShop.bind(shopController)
);

/**
 * @swagger
 * /api/shops/{id}:
 *   put:
 *     tags: [Shops]
 */
router.put(
  "/:id",
  validate(shopIdSchema, "params"),
  validate(updateShopSchema),
  shopController.updateShop.bind(shopController)
);

/**
 * @swagger
 * /api/shops/{id}:
 *   delete:
 *     tags: [Shops]
 */
router.delete(
  "/:id",
  validate(shopIdSchema, "params"),
  shopController.deleteShop.bind(shopController)
);

/**
 * @swagger
 * /api/shops/{shopId}/managers:
 *   get:
 *     tags: [Shop Managers]
 */
router.get(
  "/:shopId/managers",
  validateManager(managerShopIdSchema, "params"),
  shopManagerController.getShopManagers.bind(shopManagerController)
);

/**
 * @swagger
 * /api/shops/{shopId}/managers:
 *   post:
 *     tags: [Shop Managers]
 */
router.post(
  "/:shopId/managers",
  validateManager(managerShopIdSchema, "params"),
  validateManager(addManagerSchema),
  shopManagerController.addManager.bind(shopManagerController)
);

/**
 * @swagger
 * /api/shops/{shopId}/managers/{userId}:
 *   delete:
 *     tags: [Shop Managers]
 */
router.delete(
  "/:shopId/managers/:userId",
  validateManager(managerShopIdSchema, "params"),
  validateManager(userIdSchema, "params"),
  shopManagerController.removeManager.bind(shopManagerController)
);

export default router;
