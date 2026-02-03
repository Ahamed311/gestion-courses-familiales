const { Pool } = require("pg");
require('dotenv').config();

// Configuration pour la production (Render fournit DATABASE_URL)
const pool = process.env.DATABASE_URL ? 
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }) :
  new Pool({
    host: process.env.PGHOST || process.env.DB_HOST || "localhost",
    user: process.env.PGUSER || process.env.DB_USER || "postgres",
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || "1234",
    database: process.env.PGDATABASE || process.env.DB_NAME || "courses",
    port: process.env.PGPORT || process.env.DB_PORT || 5432,
    ssl: false
  });

module.exports = pool;
