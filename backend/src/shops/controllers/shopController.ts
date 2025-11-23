import { Request, Response } from "express";
import shopService from "../services/shopService.js";

class ShopController {
  async getAllShops(req: Request, res: Response): Promise<void> {
    try {
      const shops = await shopService.getAllShops();
      res.json({
        success: true,
        count: shops.length,
        data: shops,
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

  async getShopById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const shop = await shopService.getShopById(id);

      if (!shop) {
        res.status(404).json({
          success: false,
          message: "Shop not found",
        });
        return;
      }

      res.json({
        success: true,
        data: shop,
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

  async createShop(req: Request, res: Response): Promise<void> {
    try {
      const shop = await shopService.createShop(req.body);

      res.status(201).json({
        success: true,
        message: "Shop created successfully",
        data: shop,
      });
    } catch (error: unknown) {
      console.error("Error creating shop:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      
      // Check if it's a database error
      if (error && typeof error === "object" && "code" in error) {
        const dbError = error as { code: string; detail?: string; message?: string };
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

  async updateShop(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const shop = await shopService.updateShop(id, req.body);

      if (!shop) {
        res.status(404).json({
          success: false,
          message: "Shop not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Shop updated successfully",
        data: shop,
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

  async deleteShop(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const shop = await shopService.deleteShop(id);

      if (!shop) {
        res.status(404).json({
          success: false,
          message: "Shop not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Shop deleted successfully",
        data: shop,
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

export default new ShopController();

