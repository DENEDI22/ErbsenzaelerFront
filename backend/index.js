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

app.post("/bestellung", async (req, res) => {
  const { kunde, artikel, gesamtpreis } = req.body;

  if (!kunde || !artikel || artikel.length === 0 || gesamtpreis === undefined) {
    return res.status(400).json({ error: "Ungültige Bestellung" });
  }

  const { vorname, nachname, strasse, hausnr, plz, ort } = kunde;

  if (!vorname || !nachname || !strasse || !hausnr || !plz || !ort) {
    return res.status(400).json({ error: "Alle Kundenfelder sind Pflicht" });
  }

  try {
    const check = await pool.query(
      `
      SELECT kundennr
      FROM kunden
      WHERE vorname  = $1
        AND nachname = $2
        AND strasse  = $3
        AND hausnr   = $4
        AND plz      = $5
      `,
      [vorname, nachname, strasse, hausnr, plz],
    );

    if (check.rows.length > 0) {
      return res.status(200).json({
        message: "Kunde existiert bereits",
        kundennr: check.rows[0].kundennr,
      });
    }

    const insert = await pool.query(
      `
      INSERT INTO kunden (vorname, nachname, strasse, ort, hausnr, plz, kundennr)
      VALUES ($1, $2, $3, $4, $5, $6, nextval('kunden_kundennr_seq'))
      RETURNING kundennr
      `,
      [vorname, nachname, strasse, ort, hausnr, plz],
    );

    res.status(201).json({
      message: "Kunde neu angelegt",
      kundennr: insert.rows[0].kundennr,
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(" Backend running");
});
