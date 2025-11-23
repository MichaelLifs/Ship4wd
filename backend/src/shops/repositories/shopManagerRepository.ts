import pool from "../../db/database.js";
import { loadQuery } from "../queries/queryLoader.js";
import {
  ShopUser,
  CreateShopManagerData,
  ShopManagerWithUser,
} from "../types/shopManager.types.js";

class ShopManagerRepository {
  async create(
    managerData: CreateShopManagerData
  ): Promise<ShopUser> {
    const { shop_id, user_id } = managerData;
    const queryText = loadQuery("createShopManager");
    const result = await pool.query<any>(queryText, [shop_id, user_id]);
    // Return a ShopUser object (we don't have shop_users table anymore, so we create a mock object)
    return {
      id: 1,
      shop_id: result.rows[0]?.shop_id || shop_id,
      user_id: result.rows[0]?.user_id || user_id,
      created_at: result.rows[0]?.created_at || new Date(),
    };
  }

  async findByShopId(shopId: number): Promise<ShopManagerWithUser[]> {
    const queryText = loadQuery("findShopManagers");
    const result = await pool.query<any>(queryText, [shopId]);
    
    // Transform the result to match the interface
    return result.rows.map((row: any, index: number) => ({
      id: index + 1, // Generate a simple ID since we don't have shop_users table anymore
      shop_id: row.shop_id,
      user_id: row.user_id,
      created_at: row.created_at,
      user: {
        id: row.user_table_id || row.user_id,
        name: row.name,
        last_name: row.last_name,
        email: row.email,
        role: row.role,
      },
    }));
  }

  async delete(shopId: number, userId: number): Promise<ShopUser | undefined> {
    const queryText = loadQuery("deleteShopManager");
    const result = await pool.query<any>(queryText, [shopId, userId]);
    if (result.rows.length === 0) {
      return undefined;
    }
    // Return a ShopUser object (we don't have shop_users table anymore, so we create a mock object)
    return {
      id: 1,
      shop_id: result.rows[0]?.shop_id || shopId,
      user_id: result.rows[0]?.user_id || userId,
      created_at: result.rows[0]?.created_at || new Date(),
    };
  }
}

export default new ShopManagerRepository();

