const mysql = require("mysql2");

// Build connection config, preferring MYSQL_URL (Railway provides this)
function getPoolConfig() {
    if (process.env.MYSQL_URL) {
        return { uri: process.env.MYSQL_URL, waitForConnections: true, connectionLimit: 10 };
    }
    return {
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10),
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQLPASSWORD || '',
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'ethara',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 30000,
    };
}

const pool = mysql.createPool(getPoolConfig());

module.exports = pool.promise();
