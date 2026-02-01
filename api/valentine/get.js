import { applyCors, sendJson } from '../_lib/http.js';
import { getSupabaseClient } from '../_lib/supabase.js';
import { validateId, validateToken } from '../_lib/validation.js';

export default async function handler(req, res) {
  const cors = applyCors(req, res);
  if (cors.handled) return;

  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  const { id, t } = req.query || {};
  const idResult = validateId(id);
  if (idResult.error) return sendJson(res, 400, { error: idResult.error });

  const tokenResult = validateToken(t);
  if (tokenResult.error) return sendJson(res, 400, { error: tokenResult.error });

  let supabase;
  try {
    supabase = getSupabaseClient();
  } catch (error) {
    return sendJson(res, 500, { error: 'Server configuration error.' });
  }

  const { data, error } = await supabase
    .from('valentines')
    .select(
      'id, sender_name, sender_email, receiver_name, receiver_email, letter_message, responded_at, created_at'
    )
    .eq('id', idResult.value)
    .eq('edit_token', tokenResult.value)
    .single();

  if (error || !data) {
    return sendJson(res, 404, { error: 'Valentine not found.' });
  }

  return sendJson(res, 200, { valentine: data });
}
