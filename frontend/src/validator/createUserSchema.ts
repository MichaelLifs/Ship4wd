import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must not exceed 100 characters"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must not exceed 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z
    .string()
    .min(1, "Role is required")
    .refine((val) => ["Admin", "Shop", "User"].includes(val), {
      message: "Role must be Admin, Shop, or User",
    }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
