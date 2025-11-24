import pg from "pg";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "../../");
const backendDir = join(projectRoot, "backend");

try {
  dotenv.config({ path: join(backendDir, ".env") });
} catch (e) {
  dotenv.config({ path: join(projectRoot, ".env") });
}

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface MigrationRow {
  migration_name: string;
}

async function getLastMigration(): Promise<string | undefined> {
  const result = await pool.query<MigrationRow>(
    "SELECT migration_name FROM schema_migrations ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0]?.migration_name;
}

async function removeMigration(migrationName: string): Promise<void> {
  await pool.query("DELETE FROM schema_migrations WHERE migration_name = $1", [
    migrationName,
  ]);
}

async function rollbackLastMigration(): Promise<void> {
  try {
    const lastMigration = await getLastMigration();

    if (!lastMigration) {
      console.log("No migrations to rollback");
      await pool.end();
      return;
    }

    await removeMigration(lastMigration);
    console.log(`Rolled back migration: ${lastMigration}`);
  } catch (error) {
    console.error("Error rolling back migration:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

rollbackLastMigration();
