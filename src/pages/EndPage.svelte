<script>
  let message = 'Herzlichen Glückwunsch! Du hast das Abenteuer abgeschlossen.';
</script>

<h1>{message}</h1>
<p>Vielen Dank fürs Spielen!</p>

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
    margin: 1.5rem 0;
  }
  button {
    display: block;
    margin: 2rem auto;
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #1b5e20;
  }
</style>