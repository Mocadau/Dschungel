<script>
  import { generateScenario } from "../api/chatgpt.js";

  let currentStep = 1; // Aktueller Schritt des Spiels
  let context = ""; // Fortschritt und Kontext des Abenteuers
  let scenario = null; // Das aktuelle Szenario
  let loading = false; // Ladeanzeige
  let gameOver = false; // Spielstatus

  // Lade das erste Szenario
  async function loadScenario() {
    loading = true;
    try {
      scenario = await generateScenario(context, currentStep);
    } catch (error) {
      console.error("Fehler beim Laden des Szenarios:", error);
      scenario = {
        scenario: "Ein Fehler ist aufgetreten. Bitte lade die Seite neu.",
        options: [],
        correctOptions: [],
        failureMessage: "",
      };
    } finally {
      loading = false;
    }
  }

  // Wähle eine Option und entscheide über den Spielverlauf
  function chooseOption(index) {
    if (!scenario.correctOptions.includes(index + 1)) {
      gameOver = true;
      scenario.failureMessage = scenario.failureMessage || "Das Abenteuer endet hier.";
    } else {
      currentStep++;
      context += ` ${scenario.scenario} Du hast Option ${index + 1} gewählt.`;
      if (currentStep <= 10) {
        loadScenario();
      }
    }
  }

  // Initiales Szenario laden
  $: if (currentStep === 1 && !loading && !scenario) {
    loadScenario();
  }
</script>

{#if gameOver}
  <h1>Spiel vorbei</h1>
  <p>{scenario.failureMessage}</p>
  <button on:click={() => location.reload()}>Neu starten</button>
{:else}
  {#if loading}
    <p>Lädt Szenario...</p>
  {:else}
    <h1>Schritt {currentStep} von 10</h1>
    <p>{scenario.scenario}</p>
    <div class="options">
      {#each scenario.options as option, i}
        <button on:click={() => chooseOption(i)}>{option}</button>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
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
  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
</style>