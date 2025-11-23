import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createShopSchema = Joi.object({
  shop_name: Joi.string().min(1).max(255).required().messages({
    "string.empty": "Shop name is required",
    "string.min": "Shop name must be at least 1 character",
    "string.max": "Shop name must not exceed 255 characters",
    "any.required": "Shop name is required",
  }),
  user_id: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .allow(null)
    .messages({
      "array.base": "User ID must be an array of numbers",
      "array.includes": "All items in user_id array must be positive integers",
    }),
  description: Joi.string().optional().allow("", null).messages({
    "string.base": "Description must be a string",
  }),
  address: Joi.string().max(500).optional().allow("", null).messages({
    "string.max": "Address must not exceed 500 characters",
  }),
  phone: Joi.string().max(50).optional().allow("", null).messages({
    "string.max": "Phone must not exceed 50 characters",
  }),
});

export const updateShopSchema = Joi.object({
  shop_name: Joi.string().min(1).max(255).optional().messages({
    "string.min": "Shop name must be at least 1 character",
    "string.max": "Shop name must not exceed 255 characters",
  }),
  user_id: Joi.array()
    .items(Joi.number().integer().positive())
    .optional()
    .allow(null)
    .messages({
      "array.base": "User ID must be an array of numbers",
      "array.includes": "All items in user_id array must be positive integers",
    }),
  description: Joi.string().optional().allow("", null).messages({
    "string.base": "Description must be a string",
  }),
  address: Joi.string().max(500).optional().allow("", null).messages({
    "string.max": "Address must not exceed 500 characters",
  }),
  phone: Joi.string().max(50).optional().allow("", null).messages({
    "string.max": "Phone must not exceed 50 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const shopIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});

export const validate = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[property] as any;

    // Convert empty array to null for user_id before validation
    if (
      data &&
      data.user_id &&
      Array.isArray(data.user_id) &&
      data.user_id.length === 0
    ) {
      data.user_id = null;
    }

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
      return;
    }

    req[property] = value;
    next();
  };
};
