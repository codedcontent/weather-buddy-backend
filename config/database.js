const mysql = require("mysql2");

// Create connection pool
const sqlUrl =
  process.env.NODE_ENV === "dev "
    ? {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        connectionLimit: 10,
      }
    : process.env.DB_SQL_URL;

// console.log(process.env.NODE_ENV === "dev ");
const pool = mysql.createConnection(sqlUrl);

module.exports = pool;
