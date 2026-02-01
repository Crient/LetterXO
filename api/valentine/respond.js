import { applyCors, getClientIp, readJson, sendJson } from '../_lib/http.js';
import { rateLimit } from '../_lib/rateLimit.js';
import { getSupabaseClient } from '../_lib/supabase.js';
import { validateRespondPayload } from '../_lib/validation.js';

const RESPOND_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

export default async function handler(req, res) {
  const cors = applyCors(req, res);
  if (cors.handled) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const ip = getClientIp(req);
  const rate = rateLimit({ key: `respond:${ip}`, limit: RESPOND_LIMIT, windowMs: WINDOW_MS });
  if (!rate.allowed) {
    res.setHeader('Retry-After', rate.retryAfter.toString());
    return sendJson(res, 429, { error: 'Rate limit exceeded. Try again later.' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch (error) {
    return sendJson(res, 400, { error: 'Invalid JSON body.' });
  }

  const validation = validateRespondPayload(body);
  if (!validation.ok) {
    return sendJson(res, 400, { error: validation.error });
  }

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    return sendJson(res, 500, { error: 'Server configuration error.' });
  }

  const { data, error } = await supabase
    .from('valentines')
    .update({
      vibe: validation.data.vibe,
      main_plan: validation.data.main_plan,
      food: validation.data.food,
      place_text: validation.data.place_text,
      place_pref: validation.data.place_pref,
      receiver_note: validation.data.receiver_note,
      responded_at: new Date().toISOString(),
    })
    .eq('id', validation.data.id)
    .eq('edit_token', validation.data.token)
    .select('view_token')
    .single();

  if (error || !data) {
    return sendJson(res, 404, { error: 'Valentine not found.' });
  }

  return sendJson(res, 200, { ok: true, view_token: data.view_token });
}
