import pool from "../../db/database.js";
import { loadQuery } from "../queries/queryLoader.js";
import { Shop, CreateShopData, UpdateShopData } from "../types/shop.types.js";
import { ShopPublicFields } from "../types/shop.types.js";

class ShopRepository {
  async findAll(): Promise<ShopPublicFields[]> {
    const queryText = loadQuery("findAllShops");
    const result = await pool.query<ShopPublicFields>(queryText, []);
    return result.rows;
  }

  async findById(id: number): Promise<ShopPublicFields | undefined> {
    const queryText = loadQuery("findShopById");
    const result = await pool.query<ShopPublicFields>(queryText, [id]);
    return result.rows[0];
  }

  async create(shopData: CreateShopData): Promise<ShopPublicFields> {
    const { shop_name, user_id, description, address, phone } = shopData;
    const queryText = loadQuery("createShop");
    const userIdValue =
      user_id && Array.isArray(user_id) && user_id.length > 0 ? user_id : null;
    const result = await pool.query<ShopPublicFields>(queryText, [
      shop_name,
      userIdValue,
      description || null,
      address || null,
      phone || null,
    ]);
    return result.rows[0];
  }

  async update(
    id: number,
    updateData: UpdateShopData
  ): Promise<ShopPublicFields> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (updateData.shop_name !== undefined) {
      fields.push(`shop_name = $${paramIndex++}`);
      values.push(updateData.shop_name);
    }
    if (updateData.user_id !== undefined) {
      fields.push(`user_id = $${paramIndex++}`);
      const userIdValue =
        updateData.user_id &&
        Array.isArray(updateData.user_id) &&
        updateData.user_id.length > 0
          ? updateData.user_id
          : null;
      values.push(userIdValue);
    }
    if (updateData.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(updateData.description || null);
    }
    if (updateData.address !== undefined) {
      fields.push(`address = $${paramIndex++}`);
      values.push(updateData.address || null);
    }
    if (updateData.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(updateData.phone || null);
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);

    const baseQuery = loadQuery("updateShop");
    const queryText = baseQuery
      .replace("{FIELDS}", fields.join(", "))
      .replace("{ID_PARAM}", `$${paramIndex}`);

    const result = await pool.query<ShopPublicFields>(queryText, values);
    return result.rows[0];
  }

  async softDelete(id: number): Promise<ShopPublicFields> {
    const queryText = loadQuery("deleteShop");
    const result = await pool.query<ShopPublicFields>(queryText, [id]);
    return result.rows[0];
  }
}

export default new ShopRepository();
