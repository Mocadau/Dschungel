<script>
  import { generateScenario } from "../api/chatgpt.js";
  import { gameProgress, gameState, playerName } from "../store.js";
  import { onDestroy } from "svelte";
  import { navigate } from "svelte-routing";

  let scenario = null; // Aktuelles Szenario
  let imageURL = ""; // URL des generierten Bildes
  let loading = false;

  let unsubscribeState, unsubscribeProgress;
  let currentStep = 1;
  let context = "";
  let progress = [];
  let gameOver = false;
  let gameCompleted = false;

  unsubscribeState = gameState.subscribe((state) => {
    currentStep = state.currentStep;
    context = state.context;
    gameOver = state.gameOver;
    gameCompleted = state.gameCompleted;
  });

  unsubscribeProgress = gameProgress.subscribe((value) => {
    progress = value;
  });

  onDestroy(() => {
    unsubscribeState();
    unsubscribeProgress();
  });

  async function loadScenario() {
    loading = true;
    console.log(`Lade Szenario für Schritt ${currentStep}...`);

    try {
      scenario = await generateScenario(context, currentStep);
      console.log("Szenario erfolgreich geladen:", scenario);

      // Bildgenerierung auskommentiert
      /*
      console.log("Bildgenerierung ist aktiviert. Erzeuge Bild...");
      const imagePrompt = `Create a small, realistic image of the following dangerous animal and its environment: ${scenario.dangerousAnimal} in ${scenario.environment}`;
      const imageResponse = await fetch("http://localhost:3000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!imageResponse.ok) {
        throw new Error(`Fehler bei der Bildgenerierung: ${imageResponse.statusText}`);
      }

      const imageData = await imageResponse.json();
      imageURL = imageData.url || "";
      console.log("Bild erfolgreich generiert:", imageURL);
      */
    } catch (error) {
      console.error("Fehler beim Laden des Szenarios oder Bildes:", error);
    } finally {
      loading = false;
    }
  }

  function chooseOption(index) {
    if (!scenario.correctOptions.includes(index + 1)) {
      console.log("Falsche Option gewählt:", index + 1);
      gameState.update((state) => ({ ...state, gameOver: true }));
    } else {
      console.log("Richtige Option gewählt:", index + 1);
      const newContext = scenario.nextStep[`contextForOption${index + 1}`];

      // Fortschritt und Kontext aktualisieren
      gameState.update((state) => ({
        ...state,
        currentStep: state.currentStep + 1,
        context: `${state.context} ${newContext}`,
      }));

      gameProgress.update((progress) => [...progress, scenario.scenario]);

      // Nächstes Szenario laden
      if (currentStep < 10) {
        loadScenario();
      } else {
        console.log("Abenteuer erfolgreich abgeschlossen!");
        gameState.update((state) => ({ ...state, gameCompleted: true }));
      }
    }
  }

  function downloadHistory() {
    const element = document.createElement("a");
    const file = new Blob([progress.map(step => step.scenario).join("\n\n")], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "geschichte.txt";
    document.body.appendChild(element);
    element.click();
  }

  $: if (currentStep === 1 && !scenario) {
    loadScenario();
  }
</script>

<style>
  .image-container {
    width: 256px;
    height: 256px;
    margin: 1rem auto;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>

<a href="http://localhost:5173/#/">Zur Home-Seite</a>

{#if gameOver}
  <h1>Leider hast du es nicht geschafft.</h1>
  <p>Versuche es erneut oder lade die Geschichte herunter.</p>
  <button on:click={() => location.reload()}>Neu starten</button>
  <button on:click={downloadHistory}>Geschichte herunterladen</button>
  <button on:click={() => navigate("/history")}>Zur Geschichte</button>
{:else if gameCompleted}
  <h1>Herzlichen Glückwunsch! Du hast das Abenteuer abgeschlossen.</h1>
  <p>Hier ist die Geschichte deines Abenteuers:</p>
  <button on:click={downloadHistory}>Geschichte herunterladen</button>
  <button on:click={() => navigate("/history")}>Zur Geschichte</button>
{:else}
  {#if loading}
    <p>Lädt Szenario...</p>
  {:else}
    {#if scenario}
      <h1>Schritt {currentStep} von 10</h1>
      <p>{scenario.scenario}</p>

      <!-- Bild oder Platzhalter anzeigen -->
      <div class="image-container">
        {#if imageURL}
          <img src={imageURL} alt="Szenario-Bild" style="max-width: 100%; max-height: 100%;" />
        {:else}
          <p>Kein Bild verfügbar</p>
        {/if}
      </div>

      <!-- Antwort-Buttons -->
      <div class="options">
        {#each scenario.options as option, i}
          <button on:click={() => chooseOption(i)}>{option}</button>
        {/each}
      </div>
    {:else}
      <p>Kein Szenario verfügbar.</p>
    {/if}
  {/if}
{/if}
