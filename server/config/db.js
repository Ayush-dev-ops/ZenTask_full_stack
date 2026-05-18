const mysql = require("mysql2");

const url = process.env.MYSQL_URL || process.env.DATABASE_URL || process.env.MYSQL_PRIVATE_URL;

let pool;
if (url) {
    console.log('[db] connecting via URL, host:', url.split('@')[1]?.split('/')[0]);
    // Pass string directly — more reliable than { uri: url } in mysql2 v3
    pool = mysql.createPool(url);
} else {
    console.log('[db] connecting via explicit params, host:', process.env.MYSQLHOST || 'localhost');
    pool = mysql.createPool({
        host: process.env.MYSQLHOST || 'localhost',
        port: parseInt(process.env.MYSQLPORT || '3306', 10),
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.DB_PASS || '',
        database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 30000,
    });
}

module.exports = pool.promise();
