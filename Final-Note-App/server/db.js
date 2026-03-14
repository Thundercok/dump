// server/db.js


const path = require('path');

const mysql = require('mysql2/promise');

// Database configuration with fallback values
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',  // Empty string for no password
  database: process.env.MYSQL_DATABASE || 'noteapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Please check your MySQL username and password');
      console.error('You can set them using environment variables MYSQL_USER and MYSQL_PASSWORD');
      console.error('Or update them directly in db.js');
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Please run the init.sql script first:');
      console.error('mysql -u root -p < init.sql');
    }
  });

module.exports = pool;

