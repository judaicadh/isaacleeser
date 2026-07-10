// @ts-check
import { defineConfig } from "astro/config";
import { unified } from '@astrojs/markdown-remark';


import remarkToc from "remark-toc";
import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  markdown: {
    processor: unified(
        { remarkPlugins: [[remarkToc, { heading: 'toc', maxDepth: 3 }]],
        }),
  },
  site: "https://www.leeser.judaicadhpenn.org",
  integrations: [react()],

  vite: {
    optimizeDeps: {
      exclude: [


      ],
    },
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
