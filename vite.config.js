import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from "url";
import path from 'path';
// import nunjucks from '@vituum/vite-plugin-nunjucks';

// export default defineConfig({
//   server: {
//     port: 3000,
//   },
//   preview: {
//     port: 8080,
//   },
// });

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
  },
  preview: {
    port: 8080,
  },
  plugins: [
    // nunjucks({
    //   reload: true,
    //   root: 'null',
    //   filters: {},
    //   extensions: {},
    //   data: '*.json',
    //   globals: {
    //       template: 'src/views/template.njk'
    //   },
    //   filetypes: {
    //       html: /.(json.html|njk.json.html|njk.html)$/,
    //       json: /.(json.njk.html)$/
    //   },
    //   nunjucks: {} // nunjucks options
    // })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: 'docs',
    sourcemap: true,
    minify: false,
    optimizeDeps: {},
  },
});
