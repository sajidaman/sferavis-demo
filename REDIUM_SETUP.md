# Redium deployment setup

Redium is the Sferavis website assistant. The chat interface is included in the React site and sends messages to the server-side `/api/chat` function. The function calls Gemini using the existing `@google/genai` dependency.

## Enable Redium on the Vercel deployment

1. Open the Sferavis project in the Vercel dashboard.
2. Go to **Settings → Environment Variables**.
3. Add a server-side variable named `GEMINI_API_KEY` (the code also accepts `GOOGLE_API_KEY`).
4. Paste a Gemini API key created in Google AI Studio as its value.
5. Enable it for the environments you use (Production, and Preview if needed).
6. Save the variable and redeploy the latest deployment. The key must be configured on the server/hosting project; adding it to browser code or GitHub source files is not safe and will not configure the running API.

**Security:** Do not put the key in a `VITE_*` variable, React component, public source file, or committed `.env` file. The key is read only by `api/chat.ts` on the server.

## Local development

Create a local `.env.local` file (it is ignored by Git) and add either supported key name:

```env
GEMINI_API_KEY=your_real_key_here
```

Run the app using the project's development setup. The `/api/chat` endpoint requires a Vercel Functions-compatible local runtime; Vite's static dev server alone does not execute the function.

## What Redium can currently do

- Answer general questions about astronomy, astrophysics, and SPHEREx.
- Explain Sferavis and guide visitors through the website.
- Maintain short conversational context during the open chat session.

Redium does not currently query live SPHEREx archives, private Sferavis databases, or user accounts. Its responses are AI-generated and may be inaccurate.
