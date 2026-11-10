import { GoogleGenAI } from '@google/genai';

type ChatMessage = { role: 'user' | 'model'; content: string };
type ApiRequest = { method?: string; body?: unknown };
type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

const systemInstruction = `You are Redium, the official AI assistant on the Sferavis website.
Sferavis is an independent, broad science-focused organization exploring astronomy, astrophysics, particle physics, and other scientific fields. It is not NASA and does not operate the SPHEREx mission.
Help visitors understand Sferavis, its website sections, astronomy, astrophysics, and NASA's SPHEREx mission. Be welcoming, clear, scientifically careful, and concise.
Never claim to have live access to the website, private databases, current SPHEREx observations, or user accounts. Do not invent project capabilities, scientific measurements, team details, or links. If you do not know a Sferavis-specific fact, say so and direct the visitor to the relevant website section or official contact channel.
Distinguish established science from hypotheses. For medical, legal, financial, or safety-critical questions, provide general information and recommend an appropriate qualified source.`;

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Redium is missing its server-side Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY in the hosting environment, then redeploy.' });
  }

  const body = (req.body && typeof req.body === 'object' ? req.body : {}) as { messages?: unknown };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'Please send a message to Redium.' });
  }

  const messages = body.messages.slice(-12)
    .filter((item): item is ChatMessage =>
      !!item &&
      typeof item === 'object' &&
      ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'model') &&
      typeof (item as ChatMessage).content === 'string'
    )
    .map(item => ({ role: item.role, content: item.content.trim().slice(0, 2000) }))
    .filter(item => item.content.length > 0);

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Your latest message could not be read. Please try again.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages.map(message => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction,
        maxOutputTokens: 700,
        temperature: 0.45,
      },
    });

    const reply = result.text?.trim();
    if (!reply) return res.status(502).json({ error: 'Redium could not generate a reply. Please try again.' });
    return res.status(200).json({ reply });
  } catch (error) {
    const apiError = error as { status?: number; code?: number; message?: string };
    const upstreamStatus = Number(apiError?.status || apiError?.code || 0);
    console.error('Redium API error:', {
      status: upstreamStatus || 'unknown',
      message: apiError?.message || String(error),
    });

    if (upstreamStatus === 401 || upstreamStatus === 403) {
      return res.status(502).json({
        error: 'Gemini rejected the server API key or its project permissions. Check that the key is valid and that the Gemini API is enabled for its Google project.',
      });
    }

    if (upstreamStatus === 429) {
      return res.status(503).json({
        error: 'Redium has reached the Gemini API usage limit. Please wait a little and try again.',
      });
    }

    if (upstreamStatus === 400 || upstreamStatus === 404) {
      return res.status(502).json({
        error: 'Gemini rejected the request or model configuration. The server log contains the diagnostic details.',
      });
    }

    if (upstreamStatus >= 500 && upstreamStatus <= 599) {
      return res.status(503).json({
        error: 'The Gemini service is temporarily unavailable. Please try again shortly.',
      });
    }

    return res.status(502).json({
      error: 'Redium could not reach Gemini. Check the Vercel function logs for the underlying API error.',
    });
  }
}
