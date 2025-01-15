<script>
  let playerName = '';

  function startAdventure() {
    if (playerName.trim()) {
      // Navigation zur Abenteuerseite mit URL-Parametern
      window.location.href = `#/adventure?name=${encodeURIComponent(playerName)}`;
    }
  }
</script>

<h1>Willkommen im Dschungel-Abenteuer!</h1>
<p>Bitte gib deinen Namen ein, bevor du startest:</p>

<input type="text" bind:value={playerName} placeholder="Dein Name" />
<button on:click={startAdventure} disabled={!playerName.trim()}>Abenteuer starten</button>

<style>
  input {
    padding: 0.5rem;
    margin: 1rem 0;
    display: block;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
</style>