import pg from "pg";
import dotenv from "dotenv";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../../.env") });

const { Pool } = pg;
const connectionString: string | undefined = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERROR: DATABASE_URL not found in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

interface MigrationFile {
  name: string;
  path: string;
}

async function ensureMigrationsTable(): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
  await pool.query(query);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query(
    "SELECT migration_name FROM schema_migrations ORDER BY id"
  );
  return result.rows.map((row) => row.migration_name);
}

async function markMigrationAsExecuted(migrationName: string): Promise<void> {
  await pool.query(
    "INSERT INTO schema_migrations (migration_name) VALUES ($1)",
    [migrationName]
  );
}

function getMigrationFiles(): MigrationFile[] {
  const migrationsDir = join(__dirname, "../../../database/migrations");
  try {
    const files = readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    return files.map((file) => ({
      name: file,
      path: join(migrationsDir, file),
    }));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error reading migrations directory:", errorMessage);
    return [];
  }
}

async function executeMigration(migrationFile: MigrationFile): Promise<void> {
  const migrationSQL = readFileSync(migrationFile.path, "utf8");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(migrationSQL);
    await markMigrationAsExecuted(migrationFile.name);
    await client.query("COMMIT");
    console.log(`✓ Executed: ${migrationFile.name}`);
  } catch (error) {
    await client.query("ROLLBACK");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`✗ Failed: ${migrationFile.name}`, errorMessage);
    throw error;
  } finally {
    client.release();
  }
}

async function runMigrations(): Promise<void> {
  try {
    console.log("Starting migrations...\n");

    await ensureMigrationsTable();
    const executedMigrations = await getExecutedMigrations();
    const allMigrations = getMigrationFiles();

    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration.name)
    );

    if (pendingMigrations.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    console.log(`Found ${pendingMigrations.length} pending migration(s):\n`);

    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }

    console.log("\n✓ All migrations completed successfully!");
  } catch (error) {
    console.error("\n✗ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
