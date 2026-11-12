import { GoogleGenAI } from '@google/genai';

type ChatMessage = { role: 'user' | 'assistant' | 'model'; content: string };
type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

const instructions = `You are Redium, the official AI assistant on the Sferavis website.
Sferavis is an independent, broad science-focused organization exploring astronomy, astrophysics, particle physics, and other scientific fields. It is not NASA and does not operate the SPHEREx mission.
Help visitors understand Sferavis, its website sections, astronomy, astrophysics, and NASA's SPHEREx mission. Be welcoming, clear, scientifically careful, and concise.
Never claim to have live access to the website, private databases, current SPHEREx observations, or user accounts. Do not invent project capabilities, scientific measurements, team details, or links. If you do not know a Sferavis-specific fact, say so and direct the visitor to the relevant website section or official contact channel.
Distinguish established science from hypotheses. For medical, legal, financial, or safety-critical questions, provide general information and recommend an appropriate qualified source.`;

const MODEL = 'gemini-3.5-flash-lite';
const REQUEST_TIMEOUT_MS = 15000;

function parseMessages(body: unknown): ChatMessage[] {
  const raw = (body && typeof body === 'object' ? (body as { messages?: unknown }).messages : undefined);
  if (!Array.isArray(raw)) return [];
  const messages = raw.slice(-12)
    .filter((item): item is ChatMessage =>
      !!item &&
      typeof item === 'object' &&
      ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'assistant' || (item as ChatMessage).role === 'model') &&
      typeof (item as ChatMessage).content === 'string')
    .map(item => ({ role: item.role, content: item.content.trim().slice(0, 2000) }))
    .filter(item => item.content.length > 0);

  // The UI's canned greeting is an assistant message, not a Gemini response.
  // Gemini conversations must begin with a user turn.
  const firstUserIndex = messages.findIndex(message => message.role === 'user');
  return firstUserIndex === -1 ? [] : messages.slice(firstUserIndex);
}

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object' || !('status' in error)) return undefined;
  return typeof error.status === 'number' ? error.status : undefined;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const messages = parseMessages(req.body);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Please send a message to Redium.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Redium is not configured yet. Add GEMINI_API_KEY in the server environment.',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: REQUEST_TIMEOUT_MS } });
    const result = await ai.models.generateContent({
      model: MODEL,
      contents: messages.map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }],
      })),
      config: { systemInstruction: instructions, maxOutputTokens: 700, temperature: 0.45 },
    });
    const reply = result.text?.trim();
    if (reply) return res.status(200).json({ reply });
    console.error('Redium: Gemini returned an empty reply.');
  } catch (error) {
    const status = getErrorStatus(error);
    console.error('Redium: Gemini request failed:', {
      status,
      message: error instanceof Error ? error.message : String(error),
    });

    if (status === 401 || status === 403) {
      return res.status(503).json({
        error: 'Google rejected the API key. Check that GEMINI_API_KEY is valid and enabled for the deployed Vercel environment, then redeploy.',
      });
    }

    if (status === 429) {
      return res.status(429).json({
        error: 'Gemini is rate-limited or its free-tier quota is exhausted. Check Google AI Studio quota and try again later.',
      });
    }

    if (status === 400 || status === 404) {
      return res.status(502).json({
        error: 'Gemini rejected the request. Check the Vercel function logs for the provider error.',
      });
    }
  }

  return res.status(503).json({
    error: 'Redium could not get a reply. Check the Gemini API key and free-tier quota, then try again.',
  });
}
