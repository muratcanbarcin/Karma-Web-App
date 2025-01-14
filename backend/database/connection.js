// Setup and export a connection pool for database operations
const mysql = require('mysql2/promise');
require('dotenv').config(); // Load environment variables from .env file

// Create a pool to manage multiple database connections efficiently
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
