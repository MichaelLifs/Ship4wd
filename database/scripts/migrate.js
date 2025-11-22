import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '../../');
const backendDir = join(projectRoot, 'backend');

try {
    dotenv.config({ path: join(backendDir, '.env') });
} catch (e) {
    dotenv.config({ path: join(projectRoot, '.env') });
}

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('ERROR: DATABASE_URL not found in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function ensureMigrationsTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      migration_name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT NOW()
    );
  `;
    await pool.query(query);
}

async function getExecutedMigrations() {
    const result = await pool.query(
        'SELECT migration_name FROM schema_migrations ORDER BY id'
    );
    return result.rows.map(row => row.migration_name);
}

async function markMigrationAsExecuted(migrationName) {
    await pool.query(
        'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
        [migrationName]
    );
}

function getMigrationFiles() {
    const migrationsDir = join(__dirname, '../migrations');
    try {
        const files = readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        return files.map(file => ({
            name: file,
            path: join(migrationsDir, file)
        }));
    } catch (error) {
        console.error('Error reading migrations directory:', error.message);
        return [];
    }
}

async function executeMigration(migrationFile) {
    const migrationSQL = readFileSync(migrationFile.path, 'utf8');

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(migrationSQL);
        await markMigrationAsExecuted(migrationFile.name);
        await client.query('COMMIT');
        console.log(`✓ Executed: ${migrationFile.name}`);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`✗ Failed: ${migrationFile.name}`, error.message);
        throw error;
    } finally {
        client.release();
    }
}

async function runMigrations() {
    try {
        console.log('Starting migrations...\n');

        await ensureMigrationsTable();
        const executedMigrations = await getExecutedMigrations();
        const allMigrations = getMigrationFiles();

        const pendingMigrations = allMigrations.filter(
            migration => !executedMigrations.includes(migration.name)
        );

        if (pendingMigrations.length === 0) {
            console.log('No pending migrations.');
            return;
        }

        console.log(`Found ${pendingMigrations.length} pending migration(s):\n`);

        for (const migration of pendingMigrations) {
            await executeMigration(migration);
        }

        console.log('\n✓ All migrations completed successfully!');
    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run specific migration
async function runSpecificMigration(migrationName) {
    try {
        await ensureMigrationsTable();
        const executedMigrations = await getExecutedMigrations();

        if (executedMigrations.includes(migrationName)) {
            console.log(`Migration ${migrationName} has already been executed.`);
            return;
        }

        const migrationsDir = join(__dirname, '../migrations');
        const migrationPath = join(migrationsDir, migrationName);

        const migrationFile = {
            name: migrationName,
            path: migrationPath
        };

        await executeMigration(migrationFile);
        console.log('\n✓ Migration completed successfully!');
    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Main
const args = process.argv.slice(2);
const migrationIndex = args.indexOf('--migration');

if (migrationIndex !== -1 && args[migrationIndex + 1]) {
    const migrationName = args[migrationIndex + 1];
    runSpecificMigration(migrationName);
} else {
    runMigrations();
}

