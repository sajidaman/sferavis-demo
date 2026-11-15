import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';

// Load local environment variables (.env, .env.local) for dev server API proxy
dotenv.config();
dotenv.config({ path: '.env.local' });

function rediumChatDevPlugin(): Plugin {
  return {
    name: 'redium-chat-dev-middleware',
    configureServer(server) {
      // Run the real Vercel function so dev and production share one code path.
      server.middlewares.use('/api/chat', (req, res) => {
        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          const response = {
            status(code: number) {
              res.statusCode = code;
              return response;
            },
            setHeader(name: string, value: string) {
              res.setHeader(name, value);
            },
            json(payload: unknown) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(payload));
            },
          };

          try {
            let body: unknown = {};
            try {
              body = JSON.parse(bodyRaw || '{}');
            } catch {
              return response.status(400).json({ error: 'Invalid JSON body.' });
            }
            const mod = await server.ssrLoadModule('/api/chat.ts');
            await mod.default({ method: req.method, body }, response);
          } catch (err) {
            console.error('Dev server Redium API error:', err);
            if (!res.writableEnded) {
              response.status(500).json({ error: 'Redium is having trouble responding right now.' });
            }
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    // Relative base allows flawless hosting on GitHub Pages (https://<user>.github.io/<repo>/) as well as Vercel and custom domains
    base: process.env.GITHUB_PAGES === 'true' ? './' : '/',
    plugins: [react(), tailwindcss(), rediumChatDevPlugin()],
    assetsInclude: ['**/*.wasm'],
    build: {
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? __dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/proxy/irsa': {
          target: 'https://irsa.ipac.caltech.edu',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/irsa/, ''),
        },
        '/proxy/jpl': {
          target: 'https://ssd-api.jpl.nasa.gov',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/jpl/, ''),
        },
        '/proxy/simbad': {
          target: 'https://simbad.cds.unistra.fr',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/simbad/, ''),
        },
        '/proxy/vizier': {
          target: 'https://tapvizier.cds.unistra.fr',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/vizier/, ''),
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
