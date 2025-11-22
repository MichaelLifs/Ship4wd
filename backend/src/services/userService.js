import pool from '../../config/database.js';
import bcrypt from 'bcrypt';

class UserService {
    async getAllUsers() {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        return result.rows;
    }

    async getUserById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async createUser(name, email) {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        return result.rows[0];
    }

    async login(email, password) {
        const result = await pool.query(
            'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND deleted = false',
            [email]
        );

        if (result.rows.length === 0) {
            return null;
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

export default new UserService();

