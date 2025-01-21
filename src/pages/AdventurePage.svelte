<script>
  import { onDestroy } from "svelte";
  import { push } from "svelte-spa-router";

  import { generateScenario } from "../api/chatgpt.js";
  import { gameProgress, gameState, playerName } from "../store.js";

  let scenario = null; 
  let imageURL = "";   
  let loading = false;

  // Lokale Variablen
  let currentStep, context, gameOver, gameCompleted, progress, name;

  const unsubState = gameState.subscribe((state) => {
    currentStep = state.currentStep;
    context = state.context;
    gameOver = state.gameOver;
    gameCompleted = state.gameCompleted;
  });

  const unsubProgress = gameProgress.subscribe((value) => {
    progress = value;
  });

  const unsubPlayer = playerName.subscribe((value) => {
    name = value;
  });

  onDestroy(() => {
    unsubState();
    unsubProgress();
    unsubPlayer();
  });

  $: progressPercentage = (currentStep / 10) * 100;

  async function loadScenario() {
    loading = true;
    try {
      scenario = await generateScenario(context, currentStep);
      console.log("Szenario geladen:", scenario);
      console.log("Gefährliches Tier:", scenario.dangerousAnimal);
      console.log("Umgebung:", scenario.environment);
      console.log("Korrekte Optionen:", scenario.correctOptions);

      // Bild-Generierung
      if (scenario.dangerousAnimal && scenario.environment) {
        const imagePrompt = `Create a small, realistic image of ${scenario.dangerousAnimal} in ${scenario.environment}`;
        console.log("Bild-Prompt:", imagePrompt);

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
        console.log("Bild-URL:", imageURL);
      } else {
        console.log("Keine Daten für Bildgenerierung (dangerousAnimal/environment).");
      }
    } catch (error) {
      console.error("Fehler beim Laden von Szenario/Bild:", error);
    } finally {
      loading = false;
    }
  }

  function chooseOption(index) {
    // Speichere diesen Schritt
    gameProgress.update((prev) => [
      ...prev,
      { step: currentStep, scenario: scenario.scenario }
    ]);

    if (!scenario.correctOptions.includes(index + 1)) {
      console.log(`Falsche Option gewählt: ${index + 1}`);
      gameState.update((state) => ({ ...state, gameOver: true }));
      return;
    }

    // Richtige Option
    console.log(`Richtige Option gewählt: ${index + 1}`);
    const newContext = scenario.nextStep[`contextForOption${index + 1}`];

    gameState.update((state) => ({
      ...state,
      currentStep: state.currentStep + 1,
      context: state.context + " " + newContext,
    }));

    if (currentStep < 10) {
      loadScenario();
    } else {
      console.log("Abenteuer erfolgreich abgeschlossen!");
      gameState.update((state) => ({ ...state, gameCompleted: true }));
    }
  }

  // --------------------------------------
  // NEU: Soft-Neustart, Name bleibt im Store
  function restartGame() {
    console.log("Neustart angefordert – Spielername bleibt:", name);

    // gameState zurücksetzen (außer Name)
    gameState.set({
      currentStep: 1,
      context: "",
      gameOver: false,
      gameCompleted: false,
    });

    // Fortschritt zurücksetzen
    gameProgress.set([]);

    // Zur Abenteuerseite navigieren, damit wir ab Schritt 1 anfangen
    push("/adventure");
  }
  // --------------------------------------

  function downloadHistory() {
    const text = progress.map(p => p.scenario).join("\n\n");
    const fileText = `${name}'s Dschungel-Abenteuer\n\n${text}`;
    const file = new Blob([fileText], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "geschichte.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // Erstes Laden
  $: if (currentStep === 1 && !scenario && !gameOver && !gameCompleted) {
    loadScenario();
  }

  function goHome() {
    push("/");
  }

  function goHistory() {
    push("/history");
  }
</script>

<nav>
  <button on:click={goHome}>Zur Startseite</button>
</nav>

{#if gameOver}
  <h1>Leider hast du es nicht geschafft, {name}.</h1>
  <p>Versuche es erneut oder lade die Geschichte herunter.</p>
  <!-- NEU: Soft-Neustart statt location.reload() -->
  <button on:click={restartGame}>Neu starten</button>

  <button on:click={downloadHistory}>Geschichte herunterladen</button>
  <button on:click={goHistory}>Zur Geschichte</button>

{:else if gameCompleted}
  <h1>Herzlichen Glückwunsch, {name}! Du hast das Abenteuer abgeschlossen.</h1>
  <p>Du kannst jetzt die Geschichte herunterladen oder die History ansehen.</p>
  <button on:click={downloadHistory}>Geschichte herunterladen</button>
  <button on:click={goHistory}>Zur Geschichte</button>

{:else}
  {#if loading}
    <p>Lädt Szenario...</p>
  {:else}
    {#if scenario}
      <h2>Willkommen, {name}!</h2>
      <h3>Schritt {currentStep} von 10</h3>

      <!-- Fortschrittsanzeige -->
      <div class="progressbar">
        <div class="progress" style="width: {progressPercentage}%;"></div>
      </div>

      <p>{scenario.scenario}</p>

      <div class="image-container">
        {#if imageURL}
          <img src={imageURL} alt="Szenario-Bild" style="max-width: 100%; max-height: 100%;" />
        {:else}
          <p>Kein Bild verfügbar</p>
        {/if}
      </div>

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

<style>
  nav {
    margin-bottom: 1rem;
  }
  h2, h3 {
    text-align: center;
    margin: 0.5rem 0;
  }
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
  .progressbar {
    width: 50%;
    height: 20px;
    background-color: #ddd;
    margin: 1rem auto;
    border-radius: 10px;
  }
  .progress {
    height: 100%;
    background-color: #2e7d32;
    border-radius: 10px;
    transition: width 0.3s ease;
  }
</style>