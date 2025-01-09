const mysql = require('mysql2/promise');
require('dotenv').config(); // .env dosyasından veritabanı bilgilerini alır

// Veritabanı bağlantı havuzu
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mcb789321@',
    database: process.env.DB_NAME || 'karmadb',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
