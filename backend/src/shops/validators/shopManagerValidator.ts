import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const addManagerSchema = Joi.object({
  user_id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
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

export const userIdSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),
});

export const validate = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
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

