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

router.get("/", shopController.getAllShops.bind(shopController));
router.get(
  "/:id",
  validate(shopIdSchema, "params"),
  shopController.getShopById.bind(shopController)
);
router.post(
  "/",
  validate(createShopSchema),
  shopController.createShop.bind(shopController)
);
router.put(
  "/:id",
  validate(shopIdSchema, "params"),
  validate(updateShopSchema),
  shopController.updateShop.bind(shopController)
);
router.delete(
  "/:id",
  validate(shopIdSchema, "params"),
  shopController.deleteShop.bind(shopController)
);

router.get(
  "/:shopId/managers",
  validateManager(managerShopIdSchema, "params"),
  shopManagerController.getShopManagers.bind(shopManagerController)
);
router.post(
  "/:shopId/managers",
  validateManager(managerShopIdSchema, "params"),
  validateManager(addManagerSchema),
  shopManagerController.addManager.bind(shopManagerController)
);
router.delete(
  "/:shopId/managers/:userId",
  validateManager(managerShopIdSchema, "params"),
  validateManager(userIdSchema, "params"),
  shopManagerController.removeManager.bind(shopManagerController)
);

export default router;

