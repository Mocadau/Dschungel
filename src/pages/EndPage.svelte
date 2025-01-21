<script>
  import { gameProgress, gameState } from "../store.js";

  let progress = [];
  let gameOver = false;

  gameProgress.subscribe((value) => {
    progress = value;
  });

  gameState.subscribe((state) => {
    gameOver = state.gameOver;
  });
</script>

{#if gameOver}
  <h1>Leider hast du es nicht geschafft.</h1>
  <p>Versuche es erneut oder lade die Geschichte herunter.</p>
  <a href="#/">
    <button>Zurück zur Startseite</button>
  </a>
{:else}
  <h1>Herzlichen Glückwunsch! Du hast das Abenteuer abgeschlossen.</h1>
  <p>Hier ist die Geschichte deines Abenteuers:</p>
  <ul>
    {#each progress as step, index}
      <li>Schritt {index + 1}: {step}</li>
    {/each}
  </ul>
  <a href="#/">
    <button>Zurück zur Startseite</button>
  </a>
{/if}

<style>
  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }

  ul {
    margin: 2rem auto;
    max-width: 600px;
    list-style: none;
    padding: 0;
  }

  li {
    background-color: #f4f4f4;
    margin: 0.5rem 0;
    padding: 1rem;
    border-radius: 4px;
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
</style>