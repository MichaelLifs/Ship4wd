import userService from '../services/userService.js';

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json({
                success: true,
                count: users.length,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createUser(req, res) {
        try {
            const { name, email } = req.body;

            if (!name || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Name and email are required'
                });
            }

            const user = await userService.createUser(name, email);

            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            if (error.code === '23505') {
                res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            const user = await userService.login(email, password);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            res.json({
                success: true,
                message: 'Login successful',
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new UserController();

