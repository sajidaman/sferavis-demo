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
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed.' }));
          return;
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
          res.statusCode = 503;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error:
                'Redium is not configured yet. Add GEMINI_API_KEY or GOOGLE_API_KEY to your server environment or .env.local.',
            })
          );
          return;
        }

        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyRaw || '{}');
            const messages = (body.messages || []).slice(-12);

            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey });

            const result = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                parts: [{ text: m.content }],
              })),
              config: {
                systemInstruction: `You are Redium, the official AI assistant on the Sferavis website.
Sferavis is an independent, broad science-focused organization exploring astronomy, astrophysics, particle physics, and other scientific fields. It is not NASA and does not operate the SPHEREx mission.
Help visitors understand Sferavis, its website sections, astronomy, astrophysics, and NASA's SPHEREx mission. Be welcoming, clear, scientifically careful, and concise.`,
                maxOutputTokens: 700,
                temperature: 0.45,
              },
            });

            const reply = result.text?.trim() || 'I could not generate a response.';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply }));
          } catch (err: any) {
            console.error('Dev server Redium API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: err?.message || 'Redium is having trouble responding right now.',
              })
            );
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
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
