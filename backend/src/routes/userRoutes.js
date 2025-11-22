import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.post('/login', userController.login.bind(userController));
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', userController.createUser.bind(userController));

export default router;

