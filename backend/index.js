import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false, // common for managed DBs / self-signed certs
  },
  host: "team6db.postgres.database.azure.com",
  user: "team6db",
  password: "Start123!",
  database: "postgres",
  port: 5432,
});

app.get("/kunden", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM kunden WHERE vorname = $1 AND nachname = $2",
      [req.query.firstname, req.query.lastname],
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: "User exists", artikel: [] });
    } else {
      res.status(200).json({
        message: "User or Password is incorect",
        artikel: [],
      });
    }
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      error: err.message,
      code: err.code,
    });
  }
});
app.get("/artikel", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM artikel");
    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      error: err.message,
      code: err.code,
    });
  }
});
app.listen(3000, () => {
  console.log(" Backend running");
});
