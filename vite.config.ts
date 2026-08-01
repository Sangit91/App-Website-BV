import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3000,
      allowedHosts: ['localhost', '.localhost', '127.0.0.1', 'bvdh.local'],
      hmr: process.env.DISABLE_HMR !== 'true' ? { clientPort: 3000 } : false,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: process.env.NODE_ENV === 'production' ? {} : {
        '/api': {
          target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || '3001'}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
