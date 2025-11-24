import pool from "../db/database.js";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MigrationFile {
  name: string;
  path: string;
}

interface SeederFile {
  name: string;
  path: string;
}

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT NOW()");
    return true;
  } catch (error) {
    return false;
  }
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
    "INSERT INTO schema_migrations (migration_name) VALUES ($1) ON CONFLICT (migration_name) DO NOTHING",
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
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function runMigrations(): Promise<void> {
  try {
    await ensureMigrationsTable();
    const executedMigrations = await getExecutedMigrations();
    const allMigrations = getMigrationFiles();

    const pendingMigrations = allMigrations.filter(
      (migration) => !executedMigrations.includes(migration.name)
    );

    if (pendingMigrations.length === 0) {
      return;
    }

    for (const migration of pendingMigrations) {
      await executeMigration(migration);
    }
  } catch (error) {
    throw error;
  }
}

function getSeederFiles(): SeederFile[] {
  const seedersDir = join(__dirname, "../../../database/seeders");
  try {
    const files = readdirSync(seedersDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    return files.map((file) => ({
      name: file,
      path: join(seedersDir, file),
    }));
  } catch (error) {
    return [];
  }
}

async function executeSeeder(seederFile: SeederFile): Promise<void> {
  const seederSQL = readFileSync(seederFile.path, "utf8");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(seederSQL);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function hasData(): Promise<boolean> {
  try {
    const result = await pool.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')"
    );

    if (!result.rows[0].exists) {
      return false;
    }

    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    return parseInt(userCount.rows[0].count) > 0;
  } catch (error) {
    return false;
  }
}

export async function runSeeders(force: boolean = false): Promise<void> {
  try {
    const seeders = getSeederFiles();

    if (seeders.length === 0) {
      return;
    }

    if (!force) {
      const hasExistingData = await hasData();
      if (hasExistingData) {
        return;
      }
    }

    for (const seeder of seeders) {
      await executeSeeder(seeder);
    }
  } catch (error) {
    throw error;
  }
}

export async function initializeDatabase(
  shouldRunSeeders: boolean = true
): Promise<void> {
  try {
    const connected = await testDatabaseConnection();
    if (!connected) {
      throw new Error("Failed to connect to database");
    }

    await runMigrations();

    if (shouldRunSeeders) {
      await runSeeders(false);
    }
  } catch (error) {
    throw error;
  }
}
