export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string | null;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  name: string;
  last_name: string;
  email: string;
  password: string;
  role?: string | null;
}

export interface UpdateUserData {
  name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserPublicFields extends Omit<User, "password"> {}

