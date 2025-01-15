<script>
  import Router from "svelte-spa-router";
  import LandingPage from "./pages/LandingPage.svelte";
  import AdventurePage from "./pages/AdventurePage.svelte";
  import EndPage from "./pages/EndPage.svelte";

  const routes = {
    "/": LandingPage, // Startseite
    "/adventure": AdventurePage, // Abenteuerseite
    "/end": EndPage, // Endseite
  };
</script>

<header>
  <nav class="navbar">
    <h1>Dschungel-Abenteuer</h1>
    <div class="links">
      <a href="#/">Startseite</a>
      <a href="#/adventure">Abenteuer</a>
      <a href="#/end">Ende</a>
    </div>
  </nav>
</header>

<main>
  <!-- Router für Seitenwechsel -->
  <Router {routes} />
</main>

<footer>
  <p>&copy; 2025 Dschungel-Abenteuer</p>
</footer>

<style>
  /* Gesamtes Layout */
  header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #2e7d32;
    color: white;
    padding: 0.5rem 1rem;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* NavBar Styling */
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .navbar h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  .links {
    display: flex;
    gap: 1rem;
  }

  .links a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
  }

  .links a:hover {
    text-decoration: underline;
  }

  /* Hauptinhalt (Platz für Fixed-Header) */
  main {
    margin-top: 60px; /* Platz für die feste Navigationsleiste */
    padding: 1rem;
  }

  /* Footer */
  footer {
    text-align: center;
    margin-top: 2rem;
    font-size: 0.8rem;
  }

  /* Responsives Design */
  @media (max-width: 768px) {
    .navbar h1 {
      font-size: 1.2rem;
    }
    .links a {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .navbar {
      flex-direction: column;
      align-items: flex-start;
    }
    .links {
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  }
</style>