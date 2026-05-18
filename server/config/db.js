const mysql = require("mysql2");

function getPoolConfig() {
    const url = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASS || process.env.DB_PASSWORD;

    if (url) {
        // Pass URI for host resolution + override password explicitly
        // mysql2 merges explicit options over URI-parsed values
        const config = { uri: url, waitForConnections: true, connectionLimit: 10, connectTimeout: 30000 };
        if (password) config.password = password;
        return config;
    }

    return {
        host: process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || '3306', 10),
        user: process.env.MYSQLUSER || 'root',
        password: password || '',
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 30000,
    };
}

const pool = mysql.createPool(getPoolConfig());

module.exports = pool.promise();
