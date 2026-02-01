const buckets = new Map();

export function rateLimit({ key, limit, windowMs }) {
  const now = Date.now();
  const refillRate = limit / windowMs;
  const bucket = buckets.get(key) || { tokens: limit, last: now };

  const elapsed = now - bucket.last;
  bucket.tokens = Math.min(limit, bucket.tokens + elapsed * refillRate);
  bucket.last = now;

  if (bucket.tokens < 1) {
    const retryAfterMs = Math.ceil((1 - bucket.tokens) / refillRate);
    const retryAfter = Math.max(1, Math.ceil(retryAfterMs / 1000));
    buckets.set(key, bucket);
    return { allowed: false, retryAfter, remaining: 0 };
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { allowed: true, remaining: Math.floor(bucket.tokens) };
}
