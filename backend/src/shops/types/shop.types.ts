export interface Shop {
  id: number;
  shop_name: string;
  user_id: number[] | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  users?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
  }[] | null;
}

export interface CreateShopData {
  shop_name: string;
  user_id?: number[] | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface UpdateShopData {
  shop_name?: string;
  user_id?: number[] | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
}

export interface ShopPublicFields {
  id: number;
  shop_name: string;
  user_id: number[] | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
  users?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
  }[] | null;
}

