const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

interface Shop {
  id: number;
  shop_name: string;
  user_id: number[] | null;
  description: string | null;
  address: string | null;
  phone: string | null;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
  }[] | null;
}

interface CreateShopData {
  shop_name: string;
  user_id?: number[] | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
}

interface UpdateShopData {
  shop_name?: string;
  user_id?: number[] | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export const shopService = {
  async getAllShops(): Promise<Shop[]> {
    try {
      const response = await fetch(`${API_URL}/shops`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Shop[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shops");
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching shops:", error);
      throw error;
    }
  },

  async getShopById(id: number): Promise<Shop> {
    try {
      const response = await fetch(`${API_URL}/shops/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Shop> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shop");
      }

      if (!data.data) {
        throw new Error("Shop not found");
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching shop:", error);
      throw error;
    }
  },

  async createShop(shopData: CreateShopData): Promise<Shop> {
    try {
      const response = await fetch(`${API_URL}/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopData),
      });

      const data: ApiResponse<Shop> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to create shop");
      }

      if (!data.data) {
        throw new Error("Shop creation failed");
      }

      return data.data;
    } catch (error) {
      console.error("Error creating shop:", error);
      throw error;
    }
  },

  async updateShop(id: number, shopData: UpdateShopData): Promise<Shop> {
    try {
      const dataToSend: UpdateShopData = { ...shopData };

      const response = await fetch(`${API_URL}/shops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data: ApiResponse<Shop> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to update shop");
      }

      if (!data.data) {
        throw new Error("Shop update failed");
      }

      return data.data;
    } catch (error) {
      console.error("Error updating shop:", error);
      throw error;
    }
  },

  async deleteShop(id: number): Promise<Shop> {
    try {
      const response = await fetch(`${API_URL}/shops/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Shop> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete shop");
      }

      if (!data.data) {
        throw new Error("Shop deletion failed");
      }

      return data.data;
    } catch (error) {
      console.error("Error deleting shop:", error);
      throw error;
    }
  },

  async getShopManagers(shopId: number): Promise<ShopManager[]> {
    try {
      const response = await fetch(`${API_URL}/shops/${shopId}/managers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<ShopManager[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch shop managers");
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching shop managers:", error);
      throw error;
    }
  },

  async addShopManager(shopId: number, userId: number): Promise<ShopManager> {
    try {
      const response = await fetch(`${API_URL}/shops/${shopId}/managers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const data: ApiResponse<ShopManager> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to add manager");
      }

      if (!data.data) {
        throw new Error("Manager addition failed");
      }

      return data.data;
    } catch (error) {
      console.error("Error adding manager:", error);
      throw error;
    }
  },

  async removeShopManager(shopId: number, userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/shops/${shopId}/managers/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<void> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove manager");
      }
    } catch (error) {
      console.error("Error removing manager:", error);
      throw error;
    }
  },
};

interface ShopManager {
  id: number;
  shop_id: number;
  user_id: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role: string | null;
  };
}

