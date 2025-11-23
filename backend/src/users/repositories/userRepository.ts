import pool from "../../db/database.js";
import { loadQuery } from "../queries/queryLoader.js";
import { User, CreateUserData, UpdateUserData } from "../types/user.types.js";
import { UserPublicFields } from "../types/user.types.js";

class UserRepository {
  async findAll(): Promise<UserPublicFields[]> {
    const queryText = loadQuery("findAllUsers");
    const result = await pool.query<UserPublicFields>(queryText, []);
    return result.rows;
  }

  async findById(id: number): Promise<UserPublicFields | undefined> {
    const queryText = loadQuery("findUserById");
    const result = await pool.query<UserPublicFields>(queryText, [id]);
    return result.rows[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const queryText = loadQuery("findUserByEmail");
    const result = await pool.query<User>(queryText, [email]);
    return result.rows[0];
  }

  async create(userData: CreateUserData): Promise<UserPublicFields> {
    const { name, last_name, email, password, role } = userData;
    const queryText = loadQuery("createUser");
    const result = await pool.query<UserPublicFields>(queryText, [
      name,
      last_name,
      email,
      password,
      role,
    ]);
    return result.rows[0];
  }

  async update(
    id: number,
    updateData: UpdateUserData
  ): Promise<UserPublicFields> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updateData.name !== undefined) {
      fields.push(`name = $${paramIndex++}`);
      values.push(updateData.name);
    }
    if (updateData.last_name !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(updateData.last_name);
    }
    if (updateData.email !== undefined) {
      fields.push(`email = $${paramIndex++}`);
      values.push(updateData.email);
    }
    if (updateData.password !== undefined) {
      fields.push(`password = $${paramIndex++}`);
      values.push(updateData.password);
    }
    if (updateData.role !== undefined) {
      fields.push(`role = $${paramIndex++}`);
      values.push(updateData.role || null);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const baseQuery = loadQuery("updateUser");
    const queryText = baseQuery
      .replace("{FIELDS}", fields.join(", "))
      .replace("{ID_PARAM}", `$${paramIndex}`);

    const result = await pool.query<UserPublicFields>(queryText, values);
    return result.rows[0];
  }

  async softDelete(id: number): Promise<UserPublicFields> {
    const queryText = loadQuery("deleteUser");
    const result = await pool.query<UserPublicFields>(queryText, [id]);
    return result.rows[0];
  }

  async findByRole(role: string): Promise<UserPublicFields[]> {
    const queryText = loadQuery("findUsersByRole");
    const result = await pool.query<UserPublicFields>(queryText, [role]);
    return result.rows;
  }
}

export default new UserRepository();
