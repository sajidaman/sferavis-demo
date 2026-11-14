# Tracklet classification suggestions

The atlas keeps every supplied object **unclassified** until an AI prediction is provided. Visitors can add community hypotheses, which are stored separately and do not change that status.

## Setup

1. Run `tracklet-verification.sql` in the Supabase SQL Editor.
2. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to the Vercel server environment, then redeploy. Keep the service-role key private; it is used only by the API function and must never be added to client-side variables.

The API reads and writes suggestions through the server-side service role. Row-level security is enabled, and direct `anon`/`authenticated` table access is revoked. The current API accepts tracklet IDs 0–13, matching the supplied dataset. Each browser uses a generated voter ID to update its suggestion for a tracklet; this is a lightweight duplicate-control measure, not user authentication. Treat public submissions as unverified hypotheses.
