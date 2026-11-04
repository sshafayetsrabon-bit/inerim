import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { cmsDevServer } from './cms-dev-server.ts';

export default defineConfig(() => {
  return {
    // Absolute base so nested routes like /shop/hpl-sheet load their assets correctly.
    base: '/',
    plugins: [react(), tailwindcss(), cmsDevServer()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => (id.includes('node_modules/marked') || id.includes('node_modules/dompurify') ? 'markdown' : undefined),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : { ignored: ['**/.cms-data/**'] },
    },
  };
});
