type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ApiResponse = {
  status: (code: number) => ApiResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

type SuggestionRow = { classification: string };
const MAX_TRACKLET_ID = 13;

function getString(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() : null;
}

function getTrackletId(value: unknown): string | null {
  const trackletId = getString(value);
  if (!trackletId || !/^\d{1,8}$/.test(trackletId)) return null;
  return Number(trackletId) <= MAX_TRACKLET_ID ? trackletId : null;
}

function getSupabaseConfig(): { url: string; key: string } | null {
  const rawUrl = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!rawUrl || !key) return null;

  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') return null;
    return { url: url.origin, key };
  } catch {
    return null;
  }
}

async function requestSupabase(
  config: { url: string; key: string },
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set('apikey', config.key);
  headers.set('Authorization', `Bearer ${config.key}`);
  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(10000),
  });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return res.status(503).json({
      error: 'Public verification is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the server environment.',
    });
  }

  if (req.method === 'GET') {
    const trackletId = getTrackletId(req.query?.trackletId);
    if (!trackletId) return res.status(400).json({ error: 'A valid tracklet ID is required.' });

    const query = new URLSearchParams({
      select: 'classification',
      tracklet_id: `eq.${trackletId}`,
      limit: '1000',
    });
    try {
      const response = await requestSupabase(config, `tracklet_classification_suggestions?${query}`);
      if (!response.ok) {
        console.error('Tracklet verification: Supabase read failed.', { status: response.status });
        return res.status(502).json({ error: 'Could not load community suggestions.' });
      }

      const rows = await response.json() as SuggestionRow[];
      const counts = new Map<string, number>();
      for (const row of rows) {
        if (typeof row.classification === 'string') {
          counts.set(row.classification, (counts.get(row.classification) ?? 0) + 1);
        }
      }
      const suggestions = [...counts.entries()]
        .map(([classification, count]) => ({ classification, count }))
        .sort((left, right) => right.count - left.count || left.classification.localeCompare(right.classification));
      return res.status(200).json({ suggestions });
    } catch (error) {
      console.error('Tracklet verification: Supabase read request failed.', {
        message: error instanceof Error ? error.message : String(error),
      });
      return res.status(502).json({ error: 'Could not load community suggestions.' });
    }
  }

  const body = req.body && typeof req.body === 'object'
    ? req.body as Record<string, unknown>
    : {};
  const trackletId = getTrackletId(body.trackletId);
  const classification = getString(body.classification);
  const rationale = getString(body.rationale);
  const voterId = getString(body.voterId);

  if (!trackletId) return res.status(400).json({ error: 'A valid tracklet ID is required.' });
  if (!classification || classification.length < 2 || classification.length > 80) {
    return res.status(400).json({ error: 'Classification must be between 2 and 80 characters.' });
  }
  if (rationale !== null && rationale.length > 500) {
    return res.status(400).json({ error: 'Reasoning must be 500 characters or fewer.' });
  }
  if (!voterId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(voterId)) {
    return res.status(400).json({ error: 'A valid browser voter ID is required.' });
  }

  const query = new URLSearchParams({ on_conflict: 'tracklet_id,voter_id' });
  try {
    const response = await requestSupabase(
      config,
      `tracklet_classification_suggestions?${query}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          tracklet_id: Number(trackletId),
          voter_id: voterId,
          classification,
          rationale: rationale || null,
        }),
      },
    );
    if (!response.ok) {
      console.error('Tracklet verification: Supabase write failed.', { status: response.status });
      return res.status(502).json({ error: 'Could not save your suggestion.' });
    }
    return res.status(200).json({ saved: true });
  } catch (error) {
    console.error('Tracklet verification: Supabase write request failed.', {
      message: error instanceof Error ? error.message : String(error),
    });
    return res.status(502).json({ error: 'Could not save your suggestion.' });
  }
}
