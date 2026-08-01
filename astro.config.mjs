import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Static, zero-JS-by-default output. No UI framework is installed —
// the only client-side script in this project is the two-line IntersectionObserver
// used for the scroll-reveal on the catalogue grid. Language switching and the
// fullscreen menu are pure CSS (:checked / :has()), no hydration required.
export default defineConfig({
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
