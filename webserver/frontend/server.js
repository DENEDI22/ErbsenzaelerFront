import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "frontend/browser")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/browser", "index.html"));
});

app.listen(4000, () => console.log("Server running on Port 4000"));

