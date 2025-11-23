const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string | null;
  is_verified: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateUserData {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string | null;
}

interface UpdateUserData {
  name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<User[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      if (!data.data) {
        throw new Error("User not found");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to create user");
      }

      if (!data.data) {
        throw new Error("User creation failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    try {
      const dataToSend: UpdateUserData = { ...userData };
      if (dataToSend.password === "") {
        delete dataToSend.password;
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors
            .map((err) => err.message)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(data.message || "Failed to update user");
      }

      if (!data.data) {
        throw new Error("User update failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id: number): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<User> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      if (!data.data) {
        throw new Error("User deletion failed");
      }

      return data.data;
    } catch (error) {
      throw error;
    }
  },

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/users/role/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: ApiResponse<User[]> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users by role");
      }

      return data.data || [];
    } catch (error) {
      throw error;
    }
  },
};
