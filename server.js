import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

// .env-Datei laden
dotenv.config();

const app = express();
const port = 3000;

// OpenAI-Konfiguration
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("Fehler: OPENAI_API_KEY ist nicht definiert.");
  process.exit(1);
}
const openai = new OpenAI({ apiKey });

// Middleware
app.use(express.json());
app.use(cors());

// Szenario-Endpoint
app.post("/api/generate-scenario", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const scenario = response.choices[0].message.content;
    res.json({ scenario });
  } catch (error) {
    console.error("Fehler bei der Szenario-Generierung:", error);
    res.status(500).json({ error: "Fehler bei der Szenario-Generierung" });
  }
});

// Bild-Endpoint
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;

  try {
    const imageResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "256x256",
    });

    const imageUrl = imageResponse.data[0].url;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Fehler bei der Bildgenerierung:", error);
    res.status(500).json({ error: "Fehler bei der Bildgenerierung" });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});