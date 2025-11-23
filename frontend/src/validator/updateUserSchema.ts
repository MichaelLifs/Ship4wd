import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(1, "First name must be at least 1 character")
      .max(100, "First name must not exceed 100 characters")
      .optional(),
    last_name: z
      .string()
      .min(1, "Last name must be at least 1 character")
      .max(100, "Last name must not exceed 100 characters")
      .optional(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    role: z
      .string()
      .refine(
        (val) => !val || val === "" || ["Admin", "Shop", "User"].includes(val),
        {
          message: "Role must be Admin, Shop, or User",
        }
      )
      .optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided and not empty
      const hasName = data.name && data.name.trim() !== "";
      const hasLastName = data.last_name && data.last_name.trim() !== "";
      const hasEmail = data.email && data.email.trim() !== "";
      const hasPassword = data.password && data.password.trim() !== "";
      const hasRole = data.role && data.role.trim() !== "";

      return hasName || hasLastName || hasEmail || hasPassword || hasRole;
    },
    {
      message: "At least one field must be provided for update",
      path: ["root"],
    }
  );

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
