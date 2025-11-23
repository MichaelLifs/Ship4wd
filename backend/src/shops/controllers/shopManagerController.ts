import { Request, Response } from "express";
import shopManagerService from "../services/shopManagerService.js";

class ShopManagerController {
  async getShopManagers(req: Request, res: Response): Promise<void> {
    try {
      const shopId = parseInt(req.params.shopId, 10);
      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const managers = await shopManagerService.getShopManagers(shopId);

      res.json({
        success: true,
        count: managers.length,
        data: managers,
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

  async addManager(req: Request, res: Response): Promise<void> {
    try {
      const shopId = parseInt(req.params.shopId, 10);
      if (isNaN(shopId)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID",
        });
        return;
      }

      const { user_id } = req.body;
      if (!user_id) {
        res.status(400).json({
          success: false,
          message: "user_id is required",
        });
        return;
      }

      const manager = await shopManagerService.addManager({
        shop_id: shopId,
        user_id,
      });

      res.status(201).json({
        success: true,
        message: "Manager added successfully",
        data: manager,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      
      if (error && typeof error === "object" && "code" in error) {
        const dbError = error as { code: string; detail?: string };
        if (dbError.code === "23505") {
          res.status(409).json({
            success: false,
            message: "This user is already a manager of this shop",
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async removeManager(req: Request, res: Response): Promise<void> {
    try {
      const shopId = parseInt(req.params.shopId, 10);
      const userId = parseInt(req.params.userId, 10);

      if (isNaN(shopId) || isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid shop ID or user ID",
        });
        return;
      }

      await shopManagerService.removeManager(shopId, userId);

      res.json({
        success: true,
        message: "Manager removed successfully",
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

export default new ShopManagerController();

