import { Router } from "express";
import userController from "../controllers/userController.js";
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
  validate,
} from "../validators/userValidator.js";

const router = Router();

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 */
router.post("/login", userController.login.bind(userController));

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 */
router.get("/", userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /api/users/role/{role}:
 *   get:
 *     tags: [Users]
 */
router.get("/role/:role", userController.getUsersByRole.bind(userController));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 */
router.get(
  "/:id",
  validate(userIdSchema, "params"),
  userController.getUserById.bind(userController)
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 */
router.post(
  "/",
  validate(createUserSchema),
  userController.createUser.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 */
router.put(
  "/:id",
  validate(userIdSchema, "params"),
  validate(updateUserSchema),
  userController.updateUser.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 */
router.delete(
  "/:id",
  validate(userIdSchema, "params"),
  userController.deleteUser.bind(userController)
);

export default router;
