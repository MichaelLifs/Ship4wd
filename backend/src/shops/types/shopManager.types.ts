export interface ShopUser {
  id: number;
  shop_id: number;
  user_id: number;
  created_at: Date;
}

export interface CreateShopManagerData {
  shop_id: number;
  user_id: number;
}

export interface ShopManagerWithUser {
  id: number;
  shop_id: number;
  user_id: number;
  created_at: Date;
  user: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role: string | null;
  };
}

