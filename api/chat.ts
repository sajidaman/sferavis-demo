import { GoogleGenAI } from '@google/genai';
import { generateText, type ModelMessage } from 'ai';

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

const MODELS = ['google/gemini-3.8-flash', 'google/gemini-3.5-flash'];
const PER_MODEL_TIMEOUT_MS = 15000;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function parseMessages(body: unknown): ChatMessage[] {
  const raw = (body && typeof body === 'object' ? (body as { messages?: unknown }).messages : undefined);
  if (!Array.isArray(raw)) return [];
  return raw.slice(-12)
    .filter((item): item is ChatMessage =>
      !!item &&
      typeof item === 'object' &&
      ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'assistant' || (item as ChatMessage).role === 'model') &&
      typeof (item as ChatMessage).content === 'string')
    .map(item => ({ role: item.role, content: item.content.trim().slice(0, 2000) }))
    .filter(item => item.content.length > 0);
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

  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (openAiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: instructions },
            ...messages.map(({ role, content }) => ({
              role: role === 'user' ? 'user' : 'assistant',
              content,
            })),
          ],
          max_tokens: 700,
          temperature: 0.45,
        }),
        signal: AbortSignal.timeout(PER_MODEL_TIMEOUT_MS),
      });

      if (!response.ok) {
        const details = await response.text();
        console.error(`Redium: OpenAI request failed (${response.status}):`, details.slice(0, 500));
        return res.status(503).json({
          error: 'Redium could not get a reply right now. Please try again in a moment.',
        });
      }

      const result = await response.json() as {
        choices?: Array<{ message?: { content?: string | null } }>;
      };
      const reply = result.choices?.[0]?.message?.content?.trim();
      if (reply) return res.status(200).json({ reply });
      console.error('Redium: OpenAI returned an empty reply.');
    } catch (error) {
      console.error('Redium: OpenAI request failed:', error instanceof Error ? error.message : String(error));
      return res.status(503).json({
        error: 'Redium could not get a reply right now. Please try again in a moment.',
      });
    }

    return res.status(503).json({
      error: 'Redium could not get a reply right now. Please try again in a moment.',
    });
  }

  const modelMessages: ModelMessage[] = messages.map(m => ({
    role: m.role === 'model' ? 'assistant' : 'user',
    content: m.content,
  }));

  for (const model of MODELS) {
    try {
      const { text } = await generateText({
        model,
        instructions,
        messages: modelMessages,
        maxOutputTokens: 700,
        temperature: 0.45,
        maxRetries: 1,
        timeout: PER_MODEL_TIMEOUT_MS,
      });
      const reply = text.trim();
      if (reply) return res.status(200).json({ reply });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Redium: AI Gateway ${model} failed:`, message);
      if (/credit card|unauthori[sz]ed|authentication/i.test(message)) break;
    }
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: PER_MODEL_TIMEOUT_MS } });
      const result = await ai.models.generateContent({
        model: MODELS[0].replace('google/', ''),
        contents: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        config: { systemInstruction: instructions, maxOutputTokens: 700, temperature: 0.45 },
      });
      const reply = result.text?.trim();
      if (reply) return res.status(200).json({ reply });
    } catch (error) {
      console.error('Redium: direct Gemini fallback failed:', error instanceof Error ? error.message : String(error));
    }
  }

  return res.status(503).json({
    error: 'Redium is having trouble answering right now. Please try again in a moment.',
  });
}
