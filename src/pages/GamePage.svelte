<script>
  import { playerName } from "../store.js";

  // URL-Parameter abrufen
  const urlParams = new URLSearchParams(window.location.search);
  let name = decodeURIComponent(urlParams.get('name') || 'Spieler');
  playerName.set(name); // Name im Store speichern

  // Beispieltext für die Frage
  let question = 'Welche Aktion möchtest du ausführen?';

  // Optionen für die Buttons
  let options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

  function handleOptionClick(option) {
    alert(`Du hast "${option}" gewählt!`);
  }
</script>

<div class="container">
  <h1>Willkommen im Abenteuer, {name}!</h1>

  <!-- Platzhalter-Bild -->
  <div class="image-placeholder">
    <p>Bildplatzhalter</p>
  </div>

  <!-- Text -->
  <p class="question">{question}</p>

  <!-- Buttons -->
  <div class="button-group">
    {#each options as option}
      <button on:click={() => handleOptionClick(option)}>{option}</button>
    {/each}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: Arial, sans-serif;
  }

  h1 {
    margin-bottom: 2rem;
    color: #2e7d32;
  }

  .image-placeholder {
    width: 300px;
    height: 200px;
    border: 2px dashed #2e7d32;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    color: #2e7d32;
    font-size: 1.2rem;
  }

  .question {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    text-align: center;
  }

  .button-group {
    display: flex;
    gap: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #1b5e20;
  }
</style>