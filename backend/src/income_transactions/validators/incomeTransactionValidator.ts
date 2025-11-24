import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createIncomeTransactionSchema = Joi.object({
  shop_id: Joi.number().integer().positive().required().messages({
    "number.base": "Shop ID must be a number",
    "number.integer": "Shop ID must be an integer",
    "number.positive": "Shop ID must be a positive number",
    "any.required": "Shop ID is required",
  }),
  customer_name: Joi.string().min(1).max(255).required().messages({
    "string.empty": "Customer name is required",
    "string.min": "Customer name must be at least 1 character",
    "string.max": "Customer name must not exceed 255 characters",
    "any.required": "Customer name is required",
  }),
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),
  transaction_date: Joi.string()
    .isoDate()
    .required()
    .messages({
      "string.base": "Transaction date must be a string",
      "string.isoDate":
        "Transaction date must be a valid ISO date (YYYY-MM-DD)",
      "any.required": "Transaction date is required",
    }),
});

export const updateIncomeTransactionSchema = Joi.object({
  customer_name: Joi.string().min(1).max(255).optional().messages({
    "string.min": "Customer name must be at least 1 character",
    "string.max": "Customer name must not exceed 255 characters",
  }),
  amount: Joi.number().positive().optional().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
  }),
  transaction_date: Joi.string()
    .isoDate()
    .optional()
    .messages({
      "string.base": "Transaction date must be a string",
      "string.isoDate":
        "Transaction date must be a valid ISO date (YYYY-MM-DD)",
    }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const incomeTransactionIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.integer": "ID must be an integer",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});

export const shopIdSchema = Joi.object({
  shopId: Joi.number().integer().positive().required().messages({
    "number.base": "Shop ID must be a number",
    "number.integer": "Shop ID must be an integer",
    "number.positive": "Shop ID must be a positive number",
    "any.required": "Shop ID is required",
  }),
});

export const validate = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[property] as any;

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

