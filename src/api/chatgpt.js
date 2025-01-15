import { Configuration, OpenAIApi } from "openai";

const apiKey = import.meta.env.VITE_API_KEY;
const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);

/**
 * Generiere ein Szenario basierend auf dem angegebenen Fortschritt und Kontext
 * @param {string} context - Der bisherige Fortschritt und Kontext des Spiels
 * @param {number} step - Der aktuelle Schritt (z. B. Schritt 1 von 10)
 * @returns {Promise<object>} - Ein Objekt mit dem Szenario, Optionen und der richtigen Antwort
 */
export async function generateScenario(context, step) {
  const prompt = `
    Erstelle ein Survival-Szenario für ein Abenteuer-Spiel in der Wildnis. Das Szenario ist Schritt ${step} von 10.
    Der Kontext ist bisher: "${context}".

    Regeln:
    - Das Szenario muss eine Überlebenssituation beschreiben.
    - Es gibt 4 Optionen, von denen 3 richtig sind und 1 falsch ist.
    - Schreibe klar und detailliert.
    - Am Ende gib die richtige Option an.
    - Wenn der Spieler die falsche Option wählt, schreibe eine Nachricht wie: "Das Abenteuer endet hier."
    Antworte in folgendem JSON-Format:
    {
      "scenario": "Beschreibung des Szenarios",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctOptions": [1, 2, 3],
      "failureMessage": "Nachricht für falsche Wahl"
    }
  `;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Fehler beim Generieren des Szenarios:", error);
    throw error;
  }
}