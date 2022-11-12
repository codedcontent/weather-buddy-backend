const mysql = require("mysql2");

// Create connection pool
const sqlUrl =
  process.env.environment === "dev"
    ? {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
      }
    : process.env.DB_SQL_URL;

const pool = mysql.createConnection(sqlUrl);

module.exports = pool;
