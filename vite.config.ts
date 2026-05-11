import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import prerender from 'vite-plugin-prerender';

// List of routes to pre-render
const routes = [
  '/',
  '/about',
  '/faq',
  '/blog',
  '/privacy',
  '/terms',
  '/contact',
  '/nba',
  '/nfl',
  '/march-madness-halftime-timer',
  // Blog posts
  '/blog/nba-round-two-predictions',
  '/blog/can-76ers-comeback-3-1',
  '/blog/2026-nfl-draft-round-1-breakdown',
  '/blog/wolves-one-win-away-injuries',
  '/blog/nikola-jokic-mvp-race',
  '/blog/nba-players-second-half-performance',
  '/blog/nfl-vs-nba-halftime-comparison',
  '/blog/the-science-of-nba-halftime'
];

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(), 
    react(),
    prerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: routes,
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterDocumentEvent: 'app-rendered',
      },
      postProcess(renderedRoute) {
        // Clean up the HTML if needed
        renderedRoute.html = renderedRoute.html.replace(
          /window\.__PRERENDER_INJECTED/g,
          'JSON.parse(window.__PRERENDER_INJECTED)'
        );
        return renderedRoute;
      },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));