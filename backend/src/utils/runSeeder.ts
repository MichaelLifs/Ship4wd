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

interface SeederFile {
  name: string;
  path: string;
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
    console.log("No seeders directory found or no seeder files.");
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
    console.log(`✓ Executed: ${seederFile.name}`);
  } catch (error) {
    await client.query("ROLLBACK");
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`✗ Failed: ${seederFile.name}`, errorMessage);
    throw error;
  } finally {
    client.release();
  }
}

async function runSeeders(): Promise<void> {
  try {
    console.log("Starting seeders...\n");

    const seeders = getSeederFiles();

    if (seeders.length === 0) {
      console.log("No seeders found.");
      return;
    }

    console.log(`Found ${seeders.length} seeder(s):\n`);

    for (const seeder of seeders) {
      await executeSeeder(seeder);
    }

    console.log("\n✓ All seeders completed successfully!");
  } catch (error) {
    console.error("\n✗ Seeding failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function runSpecificSeeder(seederName: string): Promise<void> {
  try {
    const seedersDir = join(__dirname, "../../../database/seeders");
    const seederPath = join(seedersDir, seederName);

    const seederFile: SeederFile = {
      name: seederName,
      path: seederPath,
    };

    await executeSeeder(seederFile);
    console.log("\n✓ Seeder completed successfully!");
  } catch (error) {
    console.error("\n✗ Seeder failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const args = process.argv.slice(2);
const seederIndex = args.indexOf("--seeder");

if (seederIndex !== -1 && args[seederIndex + 1]) {
  const seederName = args[seederIndex + 1];
  runSpecificSeeder(seederName);
} else {
  runSeeders();
}
