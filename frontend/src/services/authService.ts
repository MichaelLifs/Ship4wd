const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    id: number;
    name: string;
    last_name: string;
    email: string;
    role: string | null;
    is_verified: boolean;
  };
}

interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  role: string | null;
  is_verified: boolean;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      if (data.success && data.data) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      return data;
    } catch {
      throw new Error("Invalid email or password");
    }
  },

  logout(): void {
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
