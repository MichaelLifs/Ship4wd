import {
  Shop,
  CreateShopData,
  UpdateShopData,
  ShopPublicFields,
} from "../types/shop.types.js";

export const SHOP_PUBLIC_FIELDS = [
  "id",
  "shop_name",
  "user_id",
  "description",
  "address",
  "phone",
  "deleted",
  "created_at",
  "updated_at",
] as const;

export const SHOP_REQUIRED_FIELDS = ["shop_name"] as const;

export const SHOP_UPDATEABLE_FIELDS = [
  "shop_name",
  "user_id",
  "description",
  "address",
  "phone",
] as const;

export const sanitizeShop = (shop: Shop | null): ShopPublicFields | null => {
  if (!shop) return null;
  return shop;
};

export const formatShop = (shop: Shop | null): ShopPublicFields | null => {
  if (!shop) return null;

  let users:
    | { id: number; name: string; last_name: string; email: string }[]
    | null = null;
  if (shop.users) {
    if (typeof shop.users === "string") {
      try {
        users = JSON.parse(shop.users);
      } catch (e) {
        users = null;
      }
    } else if (Array.isArray(shop.users)) {
      users = shop.users;
    }
  }

  return {
    id: shop.id,
    shop_name: shop.shop_name,
    user_id: Array.isArray(shop.user_id)
      ? shop.user_id
      : shop.user_id
      ? [shop.user_id]
      : null,
    description: shop.description || null,
    address: shop.address || null,
    phone: shop.phone || null,
    deleted: shop.deleted || false,
    created_at: shop.created_at,
    updated_at: shop.updated_at,
    users: users || null,
  };
};

export const formatShops = (shops: Shop[]): ShopPublicFields[] => {
  if (!Array.isArray(shops)) return [];
  return shops
    .map(formatShop)
    .filter((shop): shop is ShopPublicFields => shop !== null);
};

export const extractUpdateableFields = (
  data: UpdateShopData
): UpdateShopData => {
  const updateData: UpdateShopData = {};

  (SHOP_UPDATEABLE_FIELDS as readonly (keyof UpdateShopData)[]).forEach(
    (field) => {
      if (data[field] !== undefined) {
        (updateData as any)[field] = data[field];
      }
    }
  );

  return updateData;
};

export const getPublicFieldsSQL = (): string => {
  return SHOP_PUBLIC_FIELDS.join(", ");
};

export const validateRequiredFields = (
  data: Partial<CreateShopData>
): { valid: boolean; missingFields: string[] } => {
  const missingFields = SHOP_REQUIRED_FIELDS.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
  );

  return {
    valid: missingFields.length === 0,
    missingFields: [...missingFields],
  };
};

export const SHOP_MODEL_STRUCTURE = {
  id: "number (auto-increment)",
  shop_name: "string (max 255, required)",
  user_id: "number (optional, foreign key to users)",
  description: "text (optional)",
  address: "string (max 500, optional)",
  phone: "string (max 50, optional)",
  deleted: "boolean (default: false)",
  created_at: "timestamp (auto)",
  updated_at: "timestamp (auto)",
} as const;
