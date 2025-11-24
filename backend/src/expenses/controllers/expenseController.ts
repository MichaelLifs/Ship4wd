import { Request, Response } from "express";
import expenseService from "../services/expenseService.js";

class ExpenseController {
  async getAllExpenses(req: Request, res: Response): Promise<void> {
    try {
      const expenses = await expenseService.getAllExpenses();
      res.json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getExpensesByShopId(req: Request, res: Response): Promise<void> {
    try {
      const shopId = parseInt(req.params.shopId, 10);
      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const expenses = await expenseService.getExpensesByShopId(shopId);
      res.json({
        success: true,
        count: expenses.length,
        data: expenses,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getExpenseById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid expense ID",
        });
        return;
      }

      const expense = await expenseService.getExpenseById(id);

      if (!expense) {
        res.status(404).json({
          success: false,
          message: "Expense not found",
        });
        return;
      }

      res.json({
        success: true,
        data: expense,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async createExpense(req: Request, res: Response): Promise<void> {
    try {
      const expense = await expenseService.createExpense(req.body);

      res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: expense,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (error && typeof error === "object" && "code" in error) {
        const dbError = error as {
          code: string;
          detail?: string;
          message?: string;
        };
        res.status(500).json({
          success: false,
          error: errorMessage,
          details: dbError.detail || dbError.message,
          code: dbError.code,
        });
      } else {
        res.status(500).json({
          success: false,
          error: errorMessage,
        });
      }
    }
  }

  async updateExpense(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid expense ID",
        });
        return;
      }

      const expense = await expenseService.updateExpense(id, req.body);

      if (!expense) {
        res.status(404).json({
          success: false,
          message: "Expense not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Expense updated successfully",
        data: expense,
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "No fields to update"
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({
          success: false,
          error: errorMessage,
        });
      }
    }
  }

  async deleteExpense(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid expense ID",
        });
        return;
      }

      const expense = await expenseService.deleteExpense(id);

      if (!expense) {
        res.status(404).json({
          success: false,
          message: "Expense not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Expense deleted successfully",
        data: expense,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }
}

export default new ExpenseController();

