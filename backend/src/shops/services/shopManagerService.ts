import shopManagerRepository from "../repositories/shopManagerRepository.js";
import {
  CreateShopManagerData,
  ShopManagerWithUser,
} from "../types/shopManager.types.js";

class ShopManagerService {
  async addManager(
    managerData: CreateShopManagerData
  ): Promise<ShopManagerWithUser> {
    const shopUser = await shopManagerRepository.create(managerData);
    
    // Fetch the full manager data with user info
    const managers = await shopManagerRepository.findByShopId(managerData.shop_id);
    const manager = managers.find((m) => m.user_id === managerData.user_id);
    
    if (!manager) {
      throw new Error("Failed to retrieve created manager");
    }
    
    return manager;
  }

  async getShopManagers(shopId: number): Promise<ShopManagerWithUser[]> {
    return await shopManagerRepository.findByShopId(shopId);
  }

  async removeManager(shopId: number, userId: number): Promise<void> {
    const deleted = await shopManagerRepository.delete(shopId, userId);
    if (!deleted) {
      throw new Error("Manager not found or already removed");
    }
  }
}

export default new ShopManagerService();

