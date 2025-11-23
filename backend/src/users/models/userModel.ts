import {
  User,
  CreateUserData,
  UpdateUserData,
  UserPublicFields,
} from "../types/user.types.js";

export const USER_ROLES = {
  ADMIN: "admin",
  SHOP: "shop",
  USER: "user",
} as const;

export const USER_PUBLIC_FIELDS = [
  "id",
  "name",
  "last_name",
  "email",
  "role",
  "deleted",
  "created_at",
  "updated_at",
] as const;

export const USER_REQUIRED_FIELDS = [
  "name",
  "last_name",
  "email",
  "password",
] as const;

export const USER_UPDATEABLE_FIELDS = [
  "name",
  "last_name",
  "email",
  "password",
  "role",
] as const;

export const sanitizeUser = (user: User | null): UserPublicFields | null => {
  if (!user) return null;

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

export const formatUser = (user: User | null): UserPublicFields | null => {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    last_name: user.last_name,
    email: user.email,
    role: user.role || null,
    deleted: user.deleted || false,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export const formatUsers = (users: User[]): UserPublicFields[] => {
  if (!Array.isArray(users)) return [];
  return users
    .map(formatUser)
    .filter((user): user is UserPublicFields => user !== null);
};

export const extractUpdateableFields = (
  data: UpdateUserData
): UpdateUserData => {
  const updateData: UpdateUserData = {};

  (USER_UPDATEABLE_FIELDS as readonly (keyof UpdateUserData)[]).forEach(
    (field) => {
      if (data[field] !== undefined) {
        (updateData as any)[field] = data[field];
      }
    }
  );

  return updateData;
};

export const getPublicFieldsSQL = (): string => {
  return USER_PUBLIC_FIELDS.join(", ");
};

export const getAllFieldsSQL = (): string => {
  return [...USER_PUBLIC_FIELDS, "password"].join(", ");
};

export const validateRequiredFields = (
  data: Partial<CreateUserData>
): { valid: boolean; missingFields: string[] } => {
  const missingFields = USER_REQUIRED_FIELDS.filter(
    (field) =>
      !data[field] ||
      (typeof data[field] === "string" && data[field].trim() === "")
  );

  return {
    valid: missingFields.length === 0,
    missingFields: [...missingFields],
  };
};

export const USER_MODEL_STRUCTURE = {
  id: "number (auto-increment)",
  name: "string (max 100, required)",
  last_name: "string (max 100, required)",
  email: "string (max 255, unique, required)",
  password: "string (hashed, required)",
  role: "string (max 50, optional)",
  deleted: "boolean (default: false)",
  created_at: "timestamp (auto)",
  updated_at: "timestamp (auto)",
} as const;
