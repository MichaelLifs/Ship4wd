import { Router, Request, Response } from "express";
import pool from "../db/database.js";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "OK",
      message: "Database connection active",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      status: "ERROR",
      message: errorMessage,
    });
  }
});

export default router;
