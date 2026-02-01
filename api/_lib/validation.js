const HTML_TAG_REGEX = /<[^>]*>/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN_REGEX = /^[a-f0-9]{64}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_REGEX = /^[\p{L}\p{N} .,'"-]+$/u;

function containsHtml(value) {
  return HTML_TAG_REGEX.test(value);
}

function normalizeSingleLine(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeMultiLine(value) {
  return value.trim().replace(/\r\n/g, '\n');
}

function validateText({ value, field, min, max, regex, multiline }) {
  if (typeof value !== 'string') {
    return { error: `${field} must be a string.` };
  }

  const cleaned = multiline ? normalizeMultiLine(value) : normalizeSingleLine(value);

  if (cleaned.length < min) {
    return { error: `${field} must be at least ${min} character(s).` };
  }

  if (cleaned.length > max) {
    return { error: `${field} must be ${max} characters or fewer.` };
  }

  if (containsHtml(cleaned)) {
    return { error: `${field} must not include HTML.` };
  }

  if (regex && !regex.test(cleaned)) {
    return { error: `${field} contains unsupported characters.` };
  }

  return { value: cleaned };
}

function validateOptionalText({ value, field, max, regex, multiline }) {
  if (value === undefined || value === null) {
    return { value: null };
  }
  if (typeof value !== 'string') {
    return { error: `${field} must be a string.` };
  }

  const cleaned = multiline ? normalizeMultiLine(value) : normalizeSingleLine(value);
  if (!cleaned) {
    return { value: null };
  }

  if (cleaned.length > max) {
    return { error: `${field} must be ${max} characters or fewer.` };
  }

  if (containsHtml(cleaned)) {
    return { error: `${field} must not include HTML.` };
  }

  if (regex && !regex.test(cleaned)) {
    return { error: `${field} contains unsupported characters.` };
  }

  return { value: cleaned };
}

export function validateId(id) {
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    return { error: 'Invalid id.' };
  }
  return { value: id };
}

export function validateToken(token) {
  if (typeof token !== 'string' || !TOKEN_REGEX.test(token)) {
    return { error: 'Invalid token.' };
  }
  return { value: token.toLowerCase() };
}

export function validateCreatePayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body.' };
  }

  const senderName = validateText({
    value: body.sender_name,
    field: 'sender_name',
    min: 1,
    max: 40,
    regex: NAME_REGEX,
    multiline: false,
  });
  if (senderName.error) return { ok: false, error: senderName.error };

  const receiverName = validateText({
    value: body.receiver_name,
    field: 'receiver_name',
    min: 1,
    max: 40,
    regex: NAME_REGEX,
    multiline: false,
  });
  if (receiverName.error) return { ok: false, error: receiverName.error };

  const senderEmail = validateOptionalText({
    value: body.sender_email,
    field: 'sender_email',
    max: 120,
    regex: null,
    multiline: false,
  });
  if (senderEmail.error) return { ok: false, error: senderEmail.error };
  if (senderEmail.value && !EMAIL_REGEX.test(senderEmail.value)) {
    return { ok: false, error: 'sender_email is not valid.' };
  }

  const receiverEmail = validateOptionalText({
    value: body.receiver_email,
    field: 'receiver_email',
    max: 120,
    regex: null,
    multiline: false,
  });
  if (receiverEmail.error) return { ok: false, error: receiverEmail.error };
  if (receiverEmail.value && !EMAIL_REGEX.test(receiverEmail.value)) {
    return { ok: false, error: 'receiver_email is not valid.' };
  }

  const letterMessage = validateOptionalText({
    value: body.letter_message,
    field: 'letter_message',
    max: 1000,
    regex: null,
    multiline: true,
  });
  if (letterMessage.error) return { ok: false, error: letterMessage.error };

  return {
    ok: true,
    data: {
      sender_name: senderName.value,
      sender_email: senderEmail.value,
      receiver_name: receiverName.value,
      receiver_email: receiverEmail.value,
      letter_message: letterMessage.value,
    },
  };
}

export function validateRespondPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid JSON body.' };
  }

  const id = validateId(body.id);
  if (id.error) return { ok: false, error: id.error };

  const token = validateToken(body.t);
  if (token.error) return { ok: false, error: token.error };

  const vibe = validateOptionalText({
    value: body.vibe,
    field: 'vibe',
    max: 40,
    regex: null,
    multiline: false,
  });
  if (vibe.error) return { ok: false, error: vibe.error };

  const mainPlan = validateOptionalText({
    value: body.main_plan,
    field: 'main_plan',
    max: 40,
    regex: null,
    multiline: false,
  });
  if (mainPlan.error) return { ok: false, error: mainPlan.error };

  const food = validateOptionalText({
    value: body.food,
    field: 'food',
    max: 40,
    regex: null,
    multiline: false,
  });
  if (food.error) return { ok: false, error: food.error };

  const placePref = validateOptionalText({
    value: body.place_pref,
    field: 'place_pref',
    max: 40,
    regex: null,
    multiline: false,
  });
  if (placePref.error) return { ok: false, error: placePref.error };

  const placeText = validateOptionalText({
    value: body.place_text,
    field: 'place_text',
    max: 120,
    regex: null,
    multiline: false,
  });
  if (placeText.error) return { ok: false, error: placeText.error };

  const receiverNote = validateOptionalText({
    value: body.receiver_note,
    field: 'receiver_note',
    max: 800,
    regex: null,
    multiline: true,
  });
  if (receiverNote.error) return { ok: false, error: receiverNote.error };

  return {
    ok: true,
    data: {
      id: id.value,
      token: token.value,
      vibe: vibe.value,
      main_plan: mainPlan.value,
      food: food.value,
      place_pref: placePref.value,
      place_text: placeText.value,
      receiver_note: receiverNote.value,
    },
  };
}
