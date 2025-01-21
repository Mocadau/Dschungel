import Home from './components/Home.svelte';
import GamePage from './pages/GamePage.svelte';
import AdventurePage from './pages/AdventurePage.svelte';
import ChatGPT from './components/ChatGPT.svelte';
import HistoryPage from './pages/HistoryPage.svelte';

const routes = {
  '/': Home,
  '/game': GamePage,
  '/adventure': AdventurePage,
  '/chat': ChatGPT,
  '/history': HistoryPage // Korrigierte Verlinkung
};

export default routes;