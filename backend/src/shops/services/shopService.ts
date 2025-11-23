import shopRepository from "../repositories/shopRepository.js";
import {
  formatShop,
  formatShops,
  extractUpdateableFields,
  validateRequiredFields,
} from "../models/shopModel.js";
import {
  CreateShopData,
  UpdateShopData,
  ShopPublicFields,
} from "../types/shop.types.js";

class ShopService {
  async getAllShops(): Promise<ShopPublicFields[]> {
    const shops = await shopRepository.findAll();
    return formatShops(shops);
  }

  async getShopById(id: number): Promise<ShopPublicFields | null> {
    const shop = await shopRepository.findById(id);
    return formatShop(shop || null);
  }

  async createShop(shopData: CreateShopData): Promise<ShopPublicFields> {
    const validation = validateRequiredFields(shopData);
    if (!validation.valid) {
      throw new Error(
        `Missing required fields: ${validation.missingFields.join(", ")}`
      );
    }

    await shopRepository.create(shopData);
    // Get the created shop with users
    const shops = await shopRepository.findAll();
    const createdShop = shops.find(s => s.shop_name === shopData.shop_name);
    if (!createdShop) {
      throw new Error("Failed to retrieve created shop");
    }
    return formatShop(createdShop) || createdShop;
  }

  async updateShop(
    id: number,
    updateData: UpdateShopData
  ): Promise<ShopPublicFields | null> {
    const allowedUpdateData = extractUpdateableFields(updateData);

    await shopRepository.update(id, allowedUpdateData);
    // Get the updated shop with users
    const shop = await shopRepository.findById(id);
    return formatShop(shop || null);
  }

  async deleteShop(id: number): Promise<ShopPublicFields | null> {
    const shop = await shopRepository.softDelete(id);
    return formatShop(shop) || shop;
  }
}

export default new ShopService();

