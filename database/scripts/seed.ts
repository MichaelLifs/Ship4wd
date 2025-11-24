import pg from "pg";
import dotenv from "dotenv";
import { readFileSync, readdirSync } from "fs";
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

interface SeederFile {
  name: string;
  path: string;
}

function getSeederFiles(): SeederFile[] {
  const seedersDir = join(__dirname, "../seeders");
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

async function runSeeders(): Promise<void> {
  try {
    const seeders = getSeederFiles();

    if (seeders.length === 0) {
      return;
    }

    for (const seeder of seeders) {
      await executeSeeder(seeder);
    }
  } catch (error) {
    console.error("Error running seeders:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function runSpecificSeeder(seederName: string): Promise<void> {
  try {
    const seedersDir = join(__dirname, "../seeders");
    const seederPath = join(seedersDir, seederName);

    const seederFile: SeederFile = {
      name: seederName,
      path: seederPath,
    };

    await executeSeeder(seederFile);
  } catch (error) {
    console.error("Error running seeder:", error);
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
