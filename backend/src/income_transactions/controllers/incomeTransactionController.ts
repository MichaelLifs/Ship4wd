import { Request, Response } from "express";
import incomeTransactionService from "../services/incomeTransactionService.js";

class IncomeTransactionController {
  async getAllIncomeTransactions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const transactions =
        await incomeTransactionService.getAllIncomeTransactions();
      res.json({
        success: true,
        count: transactions.length,
        data: transactions,
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

  async getIncomeTransactionsByShopId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const shopId = parseInt(req.params.shopId, 10);
      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const transactions =
        await incomeTransactionService.getIncomeTransactionsByShopId(shopId);
      res.json({
        success: true,
        count: transactions.length,
        data: transactions,
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

  async getIncomeTransactionById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid transaction ID",
        });
        return;
      }

      const transaction =
        await incomeTransactionService.getIncomeTransactionById(id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
        return;
      }

      res.json({
        success: true,
        data: transaction,
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

  async createIncomeTransaction(req: Request, res: Response): Promise<void> {
    try {
      const transaction =
        await incomeTransactionService.createIncomeTransaction(req.body);

      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
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

  async updateIncomeTransaction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid transaction ID",
        });
        return;
      }

      const transaction = await incomeTransactionService.updateIncomeTransaction(
        id,
        req.body
      );

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Transaction updated successfully",
        data: transaction,
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

  async deleteIncomeTransaction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid transaction ID",
        });
        return;
      }

      const transaction =
        await incomeTransactionService.deleteIncomeTransaction(id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: "Transaction not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Transaction deleted successfully",
        data: transaction,
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

export default new IncomeTransactionController();

