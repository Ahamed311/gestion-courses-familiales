const { Pool } = require("pg");
require('dotenv').config();

// Configuration pour la production (Render fournit les variables PG*)
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres", 
  password: process.env.PGPASSWORD || "1234",
  database: process.env.PGDATABASE || "courses",
  port: process.env.PGPORT || 5432,
  ssl: process.env.NODE_ENV === 'production' || process.env.PGHOST ? {
    rejectUnauthorized: false
  } : false
});

module.exports = pool;
