const { Pool } = require("pg");
require('dotenv').config();

// Configuration SSL FORCÉE pour Render PostgreSQL
// Render exige TOUJOURS SSL, donc on force la configuration
const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  user: process.env.PGUSER || "postgres", 
  password: process.env.PGPASSWORD || "1234",
  database: process.env.PGDATABASE || "courses",
  port: process.env.PGPORT || 5432,
  // SSL FORCÉ pour Render - ne dépend plus des variables d'environnement
  ssl: process.env.PGHOST ? {
    rejectUnauthorized: false,
    require: true,
    requestCert: false
  } : false,
  // Options supplémentaires pour Render
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 10
});

module.exports = pool;
