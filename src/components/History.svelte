<script>
  import { gameProgress } from "../store.js";
  let progress = [];

  const unsubscribe = gameProgress.subscribe((value) => {
    progress = value;
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div>
  <h3>Spielverlauf</h3>
  <ul>
    {#each progress as entry}
      <li>Schritt {entry.step}: {entry.scenario}</li>
    {/each}
  </ul>
</div>