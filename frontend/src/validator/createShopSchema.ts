import { z } from "zod";

export const createShopSchema = z.object({
  shop_name: z
    .string()
    .min(1, "Shop name is required")
    .max(255, "Shop name must not exceed 255 characters"),
  user_id: z
    .array(z.number().int().positive("User ID must be a positive number"))
    .optional()
    .nullable(),
  description: z
    .string()
    .optional()
    .nullable(),
  address: z
    .string()
    .max(500, "Address must not exceed 500 characters")
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(50, "Phone must not exceed 50 characters")
    .optional()
    .nullable(),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;

