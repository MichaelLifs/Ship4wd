import { Request, Response } from "express";
import userService from "../services/userService.js";

class UserController {
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.json({
        success: true,
        count: users.length,
        data: users,
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

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
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

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        res.status(409).json({
          success: false,
          message: "Email already exists",
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

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const user = await userService.updateUser(id, req.body);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "23505"
      ) {
        res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      } else if (
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

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const user = await userService.deleteUser(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "User deleted successfully",
        data: user,
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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const user = await userService.login(req.body);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
        return;
      }

      res.json({
        success: true,
        message: "Login successful",
        data: user,
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

  async getUsersByRole(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.params;
      if (!role) {
        res.status(400).json({
          success: false,
          message: "Role parameter is required",
        });
        return;
      }

      const users = await userService.getUsersByRole(role);
      res.json({
        success: true,
        count: users.length,
        data: users,
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

export default new UserController();
