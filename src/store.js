import { writable } from "svelte/store";

// Fortschritt des Spiels speichern
export const gameProgress = writable([]); // [{ step: 1, scenario: "...", choice: "Option 1" }]
export const gameState = writable({
  currentStep: 1,
  context: "",
  gameOver: false,
});