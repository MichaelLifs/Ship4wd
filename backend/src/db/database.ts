import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../", ".env") });

const { Pool } = pg;
const connectionString: string | undefined = process.env.DATABASE_URL;

if (!connectionString) {
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;

