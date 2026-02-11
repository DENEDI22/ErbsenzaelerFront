import express from "express";
import pkg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

const api_prefix = process.env.API_PREFIX;

app.get(api_prefix + "/artikel", async (req, res) => {
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

app.post(api_prefix + "/artikel", async (req, res) => {
  const { name, messeinheit, preis } = req.body;

  if (!name || !messeinheit || preis === undefined) {
    return res.status(400).json({
      error: "Alle Felder sind Pflicht",
    });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO artikel ("name", messeinheit, preis)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, messeinheit, preis],
    );

    res.status(201).json({
      message: "Artikel angelegt",
      artikel: result.rows[0],
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      error: err.message,
      code: err.code,
    });
  }
});

app.put(api_prefix + "/artikel/:nr", async (req, res) => {
  const { nr } = req.params;
  const { name, messeinheit, preis } = req.body;

  if (!nr) {
    return res.status(400).json({ error: "nr fehlt" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE artikel
      SET
        "name" = $1,
        messeinheit = $2,
        preis = $3
      WHERE nr = $4
      RETURNING *
      `,
      [name ?? "", messeinheit ?? "", preis ?? 0, nr],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Artikel nicht gefunden",
      });
    }

    res.status(200).json({
      message: "Artikel aktualisiert",
      artikel: result.rows[0],
    });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({
      error: err.message,
      code: err.code,
    });
  }
});

app.post(api_prefix + "/bestellung", async (req, res) => {
  const { kunde, artikel, gesamtpreis } = req.body;

  if (!kunde || !artikel || artikel.length === 0 || gesamtpreis === undefined) {
    return res.status(400).json({ error: "Ungültige Bestellung" });
  }

  const { vorname, nachname, strasse, hausnr, plz, ort } = kunde;

  if (!vorname || !nachname || !strasse || !hausnr || !plz || !ort) {
    return res.status(400).json({ error: "Alle Kundenfelder sind Pflicht" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let kundennr;
    const check = await client.query(
      `
      SELECT kundennr
      FROM kunden
      WHERE vorname  = $1
        AND nachname = $2
        AND strasse  = $3
        AND hausnr   = $4
        AND plz      = $5
        AND ort      = $6
      `,
      [vorname, nachname, strasse, hausnr, plz, ort],
    );

    if (check.rows.length > 0) {
      kundennr = check.rows[0].kundennr;
    } else {
      const insertKunde = await client.query(
        `
        INSERT INTO kunden (vorname, nachname, strasse, ort, hausnr, plz)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING kundennr
        `,
        [vorname, nachname, strasse, ort, hausnr, plz],
      );
      kundennr = insertKunde.rows[0].kundennr;
    }

    const insertHeader = await client.query(
      `
      INSERT INTO bestellunghdr (datum, "kundenNr")
      VALUES (NOW(), $1)
      RETURNING "nr"
      `,
      [kundennr],
    );

    const headerNr = insertHeader.rows[0].nr;

    for (const a of artikel) {
      await client.query(
        `
        INSERT INTO bestellungzeile
        (menge, "headerNr", "artikelNr")
        VALUES($1, $2, $3);
        `,
        [a.menge, headerNr, a.artikelnr],
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Bestellung erfolgreich",
      kundennr,
      headerNr,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.listen(process.env.PORT, () => {
  console.log(" Backend running on " + process.env.PORT + " with API_PREFIX: " + process.env.API_PREFIX);
});
