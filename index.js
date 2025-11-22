const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Create table if not exists
async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      );
    `);
    console.log("Table ready");
  } catch (err) {
    console.error("Table error:", err);
  }
}

createTable();

// test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.json({ error: err.message });
  }
});


app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});


