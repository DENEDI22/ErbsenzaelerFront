import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "myuser",
  password: "mypassword",
  database: "postgres",
  port: 5432,
});

app.get("/artikel", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Artikel");
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
