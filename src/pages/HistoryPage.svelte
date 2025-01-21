<script>
  import { gameProgress, playerName } from "../store.js";

  let progress = [];
  let name = "";

  gameProgress.subscribe((value) => {
    progress = value;
  });

  playerName.subscribe((value) => {
    name = value;
  });

  function downloadHistory() {
    const element = document.createElement("a");
    const file = new Blob([progress.map(step => step.scenario).join("\n\n")], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "geschichte.txt";
    document.body.appendChild(element);
    element.click();
  }
</script>

<h1>{name}'s Dschungel-Geschichte</h1>

<div>
  {#each progress as step}
    <p>{step.scenario}</p>
  {/each}
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