const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

interface Expense {
  id: number;
  shop_id: number;
  amount: number;
  expense_date: string;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateExpenseData {
  shop_id: number;
  amount: number;
  expense_date: string; // ISO date string (YYYY-MM-DD)
}

interface UpdateExpenseData {
  amount?: number;
  expense_date?: string; // ISO date string (YYYY-MM-DD)
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  count?: number;
}

export const expenseService = {
  async getAllExpenses(): Promise<Expense[]> {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Expense[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getExpensesByShopId(shopId: number): Promise<Expense[]> {
    try {
      const response = await fetch(`${API_URL}/expenses/shop/${shopId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Expense[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getExpenseById(id: number): Promise<Expense> {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Expense> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expense");
      }

      if (!data.data) {
        throw new Error("Expense not found");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async createExpense(expenseData: CreateExpenseData): Promise<Expense> {
    try {
      const response = await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data: ApiResponse<Expense> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to create expense");
      }

      if (!data.data) {
        throw new Error("Expense creation failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateExpense(
    id: number,
    expenseData: UpdateExpenseData
  ): Promise<Expense> {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data: ApiResponse<Expense> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to update expense");
      }

      if (!data.data) {
        throw new Error("Expense update failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteExpense(id: number): Promise<Expense> {
    try {
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<Expense> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense");
      }

      if (!data.data) {
        throw new Error("Expense deletion failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },
};

