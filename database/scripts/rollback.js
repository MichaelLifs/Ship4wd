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
    console.error('ERROR: DATABASE_URL not found in .env');
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
            console.log('No migrations to rollback.');
            await pool.end();
            return;
        }

        console.log(`Rolling back: ${lastMigration}`);
        console.log('\n⚠️  Warning: This script only removes the migration record.');
        console.log('⚠️  You need to manually drop/alter tables if needed.\n');

        await removeMigration(lastMigration);

        console.log(`✓ Removed migration record: ${lastMigration}`);
        console.log('\n⚠️  Remember to manually handle table/column changes if needed.');
    } catch (error) {
        console.error('\n✗ Rollback failed:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

rollbackLastMigration();

