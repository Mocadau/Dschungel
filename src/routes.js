import Home from './components/Home.svelte';
import GamePage from './pages/GamePage.svelte';
import AdventurePage from './pages/AdventurePage.svelte';
import ChatGPT from './components/ChatGPT.svelte';

const routes = {
  '/': Home,
  '/game': GamePage,
  '/adventure': AdventurePage,
  '/chat': ChatGPT
};

export default routes;