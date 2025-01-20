<script>
  let container;
</script>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden;
  }

  div {
    width: 100vw;
    height: 100vh;
    background: url('/assets/your-background-image.jpg') no-repeat center center fixed;
    background-size: cover;
  }
</style>

<div bind:this={container}></div>