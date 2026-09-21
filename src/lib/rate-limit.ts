const buckets = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 300_000; // Bersihkan Map setiap 5 menit

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // On-demand cleanup untuk mencegah kebocoran memori (memory leaks)
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    for (const [k, bucket] of buckets.entries()) {
      if (now > bucket.resetAt) {
        buckets.delete(k);
      }
    }
    lastCleanup = now;
  }

  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
