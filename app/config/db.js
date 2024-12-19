require('dotenv').config();

const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const promisePool = pool.promise();

// Handle the cleanup of the pool when the process exits or is terminated
const cleanup = () => {
    console.log('Closing MySQL connection pool...');
    promisePool.end().then(() => {
        console.log('MySQL connection pool closed.');
        process.exit(0);  // Exit after cleaning up
    }).catch((error) => {
        console.error('Error closing MySQL connection pool:', error);
        process.exit(1);  // Exit with error code if cleanup fails
    });
};

// Ensure graceful shutdown
process.on('SIGINT', cleanup);  // Ctrl+C (interrupt signal)
process.on('SIGTERM', cleanup); // Termination signal (e.g., in case of app termination)

module.exports = promisePool;
