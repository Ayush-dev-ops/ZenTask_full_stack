const mysql = require("mysql2");

function getPoolConfig() {
    // Use explicit params when available — more reliable than URI parsing
    if (process.env.MYSQLHOST) {
        return {
            host: process.env.MYSQLHOST,
            port: parseInt(process.env.MYSQLPORT || '3306', 10),
            user: process.env.MYSQLUSER || 'root',
            password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '',
            database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 30000,
        };
    }
    // Fallback to URI
    const url = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;
    if (url) {
        return { uri: url, waitForConnections: true, connectionLimit: 10 };
    }
    // Local dev fallback
    return {
        host: 'localhost',
        port: 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'ethara',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 30000,
    };
}

const pool = mysql.createPool(getPoolConfig());

module.exports = pool.promise();
