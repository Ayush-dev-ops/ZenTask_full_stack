const mysql = require("mysql2");

function getPoolConfig() {
    const url = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASS || process.env.DB_PASSWORD || '';

    if (url) {
        try {
            // Parse URL for host/port/db but inject password explicitly
            // (Railway's MYSQL_URL sometimes omits the password)
            const parsed = new URL(url);
            return {
                host: parsed.hostname,
                port: parseInt(parsed.port || '3306', 10),
                user: parsed.username || 'root',
                password: password || decodeURIComponent(parsed.password || ''),
                database: parsed.pathname.replace(/^\//, '') || 'railway',
                waitForConnections: true,
                connectionLimit: 10,
                connectTimeout: 30000,
            };
        } catch (e) {
            console.error('[db] Failed to parse MYSQL_URL:', e.message);
        }
    }

    return {
        host: process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || '3306', 10),
        user: process.env.MYSQLUSER || 'root',
        password,
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 30000,
    };
}

const pool = mysql.createPool(getPoolConfig());

module.exports = pool.promise();
