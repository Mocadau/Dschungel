export async function generateScenario(context, step, selectedOption = null) {
  const prompt = `
    Erstelle ein Survival-Szenario in der Wildnis für Schritt ${step} von 10.
    Der Kontext bisher: "${context}".
    Tiere müssen im Mittelpunkt stehen. Jedes Szenario soll mindestens ein neues Tier einführen.
    Basierend auf der gewählten Antwort (${selectedOption}), schreibe die Geschichte sinnvoll weiter.
    Das Szenario muss realistisch, spannend und zusammenhängend sein.

    Gib das Szenario in folgendem JSON-Format zurück:
    {
      "scenario": "Beschreibung der Situation mit neuen Tieren.",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctOptions": [1, 2, 3],
      "failureMessage": "Nachricht bei falscher Wahl.",
      "nextStep": {
        "contextForOption1": "Fortsetzung der Geschichte basierend auf Option 1.",
        "contextForOption2": "Fortsetzung der Geschichte basierend auf Option 2.",
        "contextForOption3": "Fortsetzung der Geschichte basierend auf Option 3.",
        "contextForOption4": "Fortsetzung der Geschichte, wenn Option 4 (falsch) gewählt wurde."
      }
    }
  `;

  try {
    const response = await fetch("http://localhost:3000/api/generate-scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Fehler: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Falls JSON als String zurückkommt, bereinigen und parsen
    if (typeof data.scenario === "string") {
      const jsonString = data.scenario
        .replace("```json", "")
        .replace("```", "")
        .trim();
      return JSON.parse(jsonString);
    }

    return data;
  } catch (error) {
    console.error("Fehler bei der Szenario-Generierung:", error);
    throw error;
  }
}