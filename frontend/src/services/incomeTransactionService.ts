const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

interface IncomeTransaction {
  id: number;
  shop_id: number;
  customer_name: string;
  amount: number;
  transaction_date: string;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateIncomeTransactionData {
  shop_id: number;
  customer_name: string;
  amount: number;
  transaction_date: string; // ISO date string (YYYY-MM-DD)
}

interface UpdateIncomeTransactionData {
  customer_name?: string;
  amount?: number;
  transaction_date?: string; // ISO date string (YYYY-MM-DD)
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  count?: number;
}

export const incomeTransactionService = {
  async getAllIncomeTransactions(): Promise<IncomeTransaction[]> {
    try {
      const response = await fetch(`${API_URL}/income-transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<IncomeTransaction[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getIncomeTransactionsByShopId(shopId: number): Promise<IncomeTransaction[]> {
    try {
      const response = await fetch(`${API_URL}/income-transactions/shop/${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<IncomeTransaction[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getIncomeTransactionById(id: number): Promise<IncomeTransaction> {
    try {
      const response = await fetch(`${API_URL}/income-transactions/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<IncomeTransaction> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transaction");
      }

      if (!data.data) {
        throw new Error("Transaction not found");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async createIncomeTransaction(transactionData: CreateIncomeTransactionData): Promise<IncomeTransaction> {
    try {
      const response = await fetch(`${API_URL}/income-transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const data: ApiResponse<IncomeTransaction> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to create transaction");
      }

      if (!data.data) {
        throw new Error("Transaction creation failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateIncomeTransaction(
    id: number,
    transactionData: UpdateIncomeTransactionData
  ): Promise<IncomeTransaction> {
    try {
      const response = await fetch(`${API_URL}/income-transactions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const data: ApiResponse<IncomeTransaction> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to update transaction");
      }

      if (!data.data) {
        throw new Error("Transaction update failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteIncomeTransaction(id: number): Promise<IncomeTransaction> {
    try {
      const response = await fetch(`${API_URL}/income-transactions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<IncomeTransaction> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete transaction");
      }

      if (!data.data) {
        throw new Error("Transaction deletion failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

