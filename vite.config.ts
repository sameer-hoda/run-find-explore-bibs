import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { vitePrerenderPlugin } from 'vite-prerender-plugin';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to slugify event names
const slugify = (text: string | null | undefined): string => {
  if (!text) {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Read events data from prd.txt to generate routes for prerendering
const eventsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/prd.txt'), 'utf-8'));
const eventRoutes = Object.values(eventsData).map((event: any) => `/event/${slugify(event.event_name)}`);

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/server',
          dest: '.'
        }
      ]
    }) as any,
    vitePrerenderPlugin({
      renderTarget: '#root',
      prerenderScript: path.resolve(__dirname, 'src/prerender.tsx'),
      additionalPrerenderRoutes: eventRoutes,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
