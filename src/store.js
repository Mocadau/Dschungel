// src/store.js
import { writable } from "svelte/store";

// Fortschritt des Spiels als Array von Objekten
// Beispiel: [{ step: 1, scenario: "Du bist im Dschungel..." }, ...]
export const gameProgress = writable([]);

// Allgemeiner Spiel-Zustand
export const gameState = writable({
  currentStep: 1,
  context: "",
  gameOver: false,
  gameCompleted: false,
});

// Spielername (wird in LandingPage und anderen Dateien verwendet)
export const playerName = writable("");