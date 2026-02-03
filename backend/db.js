const { Pool } = require("pg");
require('dotenv').config();

// Configuration SSL pour Render PostgreSQL
const sslConfig = process.env.NODE_ENV === 'production' || process.env.PGHOST ? {
  rejectUnauthorized: false,
  require: true
} : false;

// Configuration pour la production (Render fournit les variables PG*)
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres", 
  password: process.env.PGPASSWORD || "1234",
  database: process.env.PGDATABASE || "courses",
  port: process.env.PGPORT || 5432,
  ssl: sslConfig,
  // Options supplémentaires pour Render
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});

module.exports = pool;
