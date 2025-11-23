import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const createUserSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 1 character",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  last_name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 1 character",
    "string.max": "Last name must not exceed 100 characters",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().max(50).optional().allow("", null).messages({
    "string.max": "Role must not exceed 50 characters",
  }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Name must be at least 1 character",
    "string.max": "Name must not exceed 100 characters",
  }),
  last_name: Joi.string().min(1).max(100).optional().messages({
    "string.min": "Last name must be at least 1 character",
    "string.max": "Last name must not exceed 100 characters",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Please enter a valid email address",
  }),
  password: Joi.string().min(6).optional().messages({
    "string.min": "Password must be at least 6 characters",
  }),
  role: Joi.string().max(50).optional().allow("", null).messages({
    "string.max": "Role must not exceed 50 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const userIdSchema = Joi.object({
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
