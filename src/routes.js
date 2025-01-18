import Home from './components/Home.svelte';
import GamePage from './pages/GamePage.svelte'; // Neue Seite importieren
import ChatGPT from './components/ChatGPT.svelte'; // Neue Seite importieren


const routes = {
  '/': Home,
    '/game': GamePage, // Neue Route für die Spielseite
  '/chat': ChatGPT // Neue Route für die ChatGPT-Seite
};

export default routes;