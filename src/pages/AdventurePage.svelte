<script>
  import { generateScenario } from "../api/chatgpt.js";
  import { gameProgress, gameState } from "../store.js";
  import { onDestroy } from "svelte";

  let scenario = null; // Aktuelles Szenario
  let loading = false;

  let unsubscribeState, unsubscribeProgress;
  let currentStep = 1;
  let context = "";
  let progress = [];
  let gameOver = false;

  unsubscribeState = gameState.subscribe((state) => {
    currentStep = state.currentStep;
    context = state.context;
    gameOver = state.gameOver;
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
    try {
      scenario = await generateScenario(context, currentStep);
      console.log("Szenario geladen:", scenario); // Debugging
    } catch (error) {
      console.error("Fehler beim Laden des Szenarios:", error);
    } finally {
      loading = false;
    }
  }

 function chooseOption(index) {
  if (!scenario.correctOptions.includes(index + 1)) {
    gameState.update((state) => ({ ...state, gameOver: true }));
  } else {
    // Kontext basierend auf der gewählten Option
    const newContext = scenario.nextStep[`contextForOption${index + 1}`];

    // Fortschritt und Kontext aktualisieren
    gameState.update((state) => ({
      ...state,
      currentStep: state.currentStep + 1,
      context: `${state.context} ${newContext}`,
    }));

    // Nächstes Szenario laden
    if (currentStep < 10) {
      loadScenario();
    } else {
      alert("Du hast das Abenteuer erfolgreich abgeschlossen!");
    }
  }
}

  $: if (currentStep === 1 && !scenario) {
    loadScenario();
  }
</script>

{#if gameOver}
  <h1>Spiel vorbei</h1>
  <p>Das Abenteuer endet hier...</p>
  <button on:click={() => location.reload()}>Neu starten</button>
{:else}
  {#if loading}
    <p>Lädt Szenario...</p>
  {:else}
    {#if scenario}
      <h1>Schritt {currentStep} von 10</h1>
      <p>{scenario.scenario}</p>
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