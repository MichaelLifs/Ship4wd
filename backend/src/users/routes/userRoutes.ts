import { Router } from "express";
import userController from "../controllers/userController.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  validate,
} from "../validators/userValidator.js";

const router = Router();

router.post("/login", userController.login.bind(userController));
router.get("/", userController.getAllUsers.bind(userController));
router.get("/role/:role", userController.getUsersByRole.bind(userController));
router.get(
  "/:id",
  validate(userIdSchema, "params"),
  userController.getUserById.bind(userController)
);
router.post(
  "/",
  validate(createUserSchema),
  userController.createUser.bind(userController)
);
router.put(
  "/:id",
  validate(userIdSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser.bind(userController)
);
router.delete(
  "/:id",
  validate(userIdSchema, "params"),
  userController.deleteUser.bind(userController)
);

export default router;
