const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://postgres:TU_PASSWORD_REAL@db.geilroobnavmcalhkore.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;