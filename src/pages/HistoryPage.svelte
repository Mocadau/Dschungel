<script>
  import { onDestroy } from "svelte";
  import { push } from "svelte-spa-router";
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
    let fileContent = `${name}'s Dschungel-Abenteuer\n\n`;
    fileContent += progress.map((entry) => entry.scenario).join("\n\n");

    const file = new Blob([fileContent], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "geschichte.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function goHome() {
    push("/");
  }
</script>

<h1>{name}'s Dschungel-Geschichte</h1>

{#if progress.length === 0}
  <p>Noch keine Schritte unternommen.</p>
{:else}
  {#each progress as step}
    <p>{step.scenario}</p>
  {/each}
{/if}

<button on:click={downloadHistory}>Geschichte herunterladen</button>
<button on:click={goHome}>Zurück zur Startseite</button>

<style>
  h1 {
    color: green;
    text-align: center;
    margin-top: 2rem;
  }

  p {
    text-align: center;
    font-size: 1.2rem;
    margin: 0.5rem auto;
    max-width: 600px;
    line-height: 1.4;
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