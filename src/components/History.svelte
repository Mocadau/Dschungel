<!-- src/pages/HistoryPage.svelte -->
<script>
  import { onDestroy } from "svelte";
  import { gameProgress, playerName } from "../store.js";

  let progress = [];
  let name = "";

  const unsubProgress = gameProgress.subscribe((value) => {
    progress = value;
  });

  const unsubName = playerName.subscribe((val) => {
    name = val;
  });

  onDestroy(() => {
    unsubProgress();
    unsubName();
  });

  function downloadHistory() {
    const content = progress
      .map((entry) => `Schritt ${entry.step}: ${entry.scenario}`)
      .join("\n\n");

    const file = new Blob([content], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "geschichte.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<h1>{name}'s Dschungel-Geschichte</h1>

<div>
  {#if progress.length === 0}
    <p>Noch keine Schritte unternommen.</p>
  {:else}
    {#each progress as step}
      <p><strong>Schritt {step.step}:</strong> {step.scenario}</p>
    {/each}
  {/if}
</div>

<button on:click={downloadHistory}>Geschichte herunterladen</button>

<a href="#/">
  <button>Zurück zur Startseite</button>
</a>

<style>
  h1 {
    color: green;
    text-align: center;
    margin-top: 2rem;
  }

  p {
    text-align: center;
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  button {
    display: block;
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
</style>