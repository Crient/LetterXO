import { randomBytes } from 'crypto';
import { applyCors, getClientIp, readJson, sendJson } from '../_lib/http.js';
import { rateLimit } from '../_lib/rateLimit.js';
import { getSupabaseClient } from '../_lib/supabase.js';
import { validateCreatePayload } from '../_lib/validation.js';

const CREATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

export default async function handler(req, res) {
  const cors = applyCors(req, res);
  if (cors.handled) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const ip = getClientIp(req);
  const rate = rateLimit({ key: `create:${ip}`, limit: CREATE_LIMIT, windowMs: WINDOW_MS });
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

  const validation = validateCreatePayload(body);
  if (!validation.ok) {
    return sendJson(res, 400, { error: validation.error });
  }

  const viewToken = randomBytes(32).toString('hex');
  const editToken = randomBytes(32).toString('hex');

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    return sendJson(res, 500, { error: 'Server configuration error.' });
  }

  const { data, error } = await supabase
    .from('valentines')
    .insert({
      sender_name: validation.data.sender_name,
      sender_email: validation.data.sender_email,
      receiver_name: validation.data.receiver_name,
      receiver_email: validation.data.receiver_email,
      letter_message: validation.data.letter_message,
      view_token: viewToken,
      edit_token: editToken,
    })
    .select('id')
    .single();

  if (error || !data) {
    return sendJson(res, 500, { error: 'Failed to create valentine.' });
  }

  return sendJson(res, 200, {
    id: data.id,
    edit_token: editToken,
    view_token: viewToken,
  });
}
