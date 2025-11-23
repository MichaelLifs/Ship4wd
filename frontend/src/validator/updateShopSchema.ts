import { z } from "zod";

export const updateShopSchema = z
  .object({
    shop_name: z
      .string()
      .min(1, "Shop name must be at least 1 character")
      .max(255, "Shop name must not exceed 255 characters")
      .optional(),
    user_id: z
      .array(z.number().int().positive("User ID must be a positive number"))
      .optional()
      .nullable(),
    description: z.string().optional().nullable(),
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
  })
  .refine(
    (data) => {
      const hasShopName = data.shop_name && data.shop_name.trim() !== "";
      const hasUserId = data.user_id !== undefined && data.user_id !== null;
      const hasDescription = data.description && data.description.trim() !== "";
      const hasAddress = data.address && data.address.trim() !== "";
      const hasPhone = data.phone && data.phone.trim() !== "";

      return (
        hasShopName || hasUserId || hasDescription || hasAddress || hasPhone
      );
    },
    {
      message: "At least one field must be provided for update",
      path: ["root"],
    }
  );

export type UpdateShopFormData = z.infer<typeof updateShopSchema>;
