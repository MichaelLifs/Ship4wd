import express, { Express } from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/healthRoutes.js";
import { initializeDatabase } from "./utils/dbSetup.js";
import { swaggerSpec } from "./config/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || "4000", 10);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Ship4WD API Documentation",
  })
);

app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

async function startServer() {
  try {
    await initializeDatabase(true);
    app.listen(PORT, () => {});
  } catch (error) {
    process.exit(1);
  }
}

startServer();
