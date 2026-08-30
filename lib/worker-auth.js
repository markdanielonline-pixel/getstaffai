import { timingSafeEqual } from 'node:crypto';

export function hasValidWorkerAuthorization(request) {
  const configuredSecret = process.env.WORKER_SECRET_KEY;
  if (!configuredSecret) {
    console.error('[Worker API] WORKER_SECRET_KEY is not configured. Requests are disabled.');
    return false;
  }

  const suppliedHeader = request.headers.get('authorization');
  if (!suppliedHeader?.startsWith('Bearer ')) return false;

  const suppliedSecret = suppliedHeader.slice('Bearer '.length);
  const expected = Buffer.from(configuredSecret);
  const supplied = Buffer.from(suppliedSecret);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
