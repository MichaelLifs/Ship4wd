import pg from 'pg';
import dotenv from 'dotenv';
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
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function getLastMigration() {
    const result = await pool.query(
        'SELECT migration_name FROM schema_migrations ORDER BY id DESC LIMIT 1'
    );
    return result.rows[0]?.migration_name;
}

async function removeMigration(migrationName) {
    await pool.query(
        'DELETE FROM schema_migrations WHERE migration_name = $1',
        [migrationName]
    );
}

async function rollbackLastMigration() {
    try {
        const lastMigration = await getLastMigration();

        if (!lastMigration) {
            await pool.end();
            return;
        }

        await removeMigration(lastMigration);
    } catch (error) {
        process.exit(1);
    } finally {
        await pool.end();
    }
}

rollbackLastMigration();

