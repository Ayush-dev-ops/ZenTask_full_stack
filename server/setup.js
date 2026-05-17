const mysql = require('mysql2/promise');
require('dotenv').config();

// Build connection config, preferring MYSQL_URL (Railway provides this)
function getConnectionConfig() {
    // Railway sets MYSQL_URL as a full connection string
    if (process.env.MYSQL_URL) {
        return { uri: process.env.MYSQL_URL, multipleStatements: true };
    }
    return {
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQLPASSWORD || '',
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'ethara',
        multipleStatements: true,
        connectTimeout: 30000,
    };
}

async function setup() {
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 3000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        let db;
        try {
            console.log(`[setup] Attempt ${attempt}/${MAX_RETRIES} — connecting to MySQL...`);
            const config = getConnectionConfig();
            db = await mysql.createConnection(config);

            const schema = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'member'
                );

                CREATE TABLE IF NOT EXISTS projects (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    created_by INT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS project_members (
                    project_id INT NOT NULL,
                    user_id INT NOT NULL,
                    PRIMARY KEY (project_id, user_id),
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS tasks (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    project_id INT NOT NULL,
                    assigned_to INT,
                    created_by INT NOT NULL,
                    due_date DATE,
                    priority VARCHAR(50) DEFAULT 'medium',
                    status VARCHAR(50) DEFAULT 'todo',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
                );
            `;

            await db.query(schema);
            console.log('[setup] Tables created successfully');
            await db.end();
            process.exit(0);
        } catch (err) {
            console.error(`[setup] Attempt ${attempt} failed:`, err.message || err);
            if (db) {
                try { await db.end(); } catch (_) { /* ignore */ }
            }
            if (attempt < MAX_RETRIES) {
                console.log(`[setup] Retrying in ${RETRY_DELAY_MS / 1000}s...`);
                await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
            } else {
                console.error('[setup] All retries exhausted. Exiting.');
                process.exit(1);
            }
        }
    }
}

setup();
