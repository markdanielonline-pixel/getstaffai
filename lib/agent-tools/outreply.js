/**
 * OutReply, the social publishing engine behind the Social Media Manager.
 *
 * Verified against the live API on 2026-09-06: the Staff AI key carries
 * read:pages, write:posts, write:media and write:comments, and two pages are
 * connected. Nothing here invents a capability the key does not have.
 */
const BASE = process.env.OUTREPLY_BASE_URL || 'https://api.outreply.com/api/v1';

function key() {
  const value = process.env.OUTREPLY_API_KEY;
  if (!value) throw new Error('OUTREPLY_API_KEY is not configured');
  return value;
}

async function call(path, options = {}) {
  const res = await fetch(BASE + path, {
    ...options,
    headers: { authorization: `Bearer ${key()}`, 'content-type': 'application/json', ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = { raw: text.slice(0, 400) }; }
  if (!res.ok) {
    const detail = body?.error || body?.message || body?.raw || `HTTP ${res.status}`;
    throw new Error(`OutReply ${path} failed: ${detail}`);
  }
  return body;
}

export async function listPages() {
  const body = await call('/pages');
  return (body.pages || []).map(p => ({
    id: p.id,
    platform: p.platform,
    name: p.name,
    brandId: p.brand_id,
  }));
}

/**
 * A scheduled post is the safe default for an autonomous employee: it is
 * visible and cancellable before it reaches an audience. `publish` exists for
 * when the customer has explicitly asked for it to go out now.
 */
export async function schedulePost({ pageId, message, scheduledAt, mediaIds = [] }) {
  return call('/posts/schedule', {
    method: 'POST',
    body: JSON.stringify({
      page_id: pageId,
      message,
      scheduled_at: scheduledAt,
      ...(mediaIds.length ? { media_ids: mediaIds } : {}),
    }),
  });
}

export async function publishPost({ pageId, message, mediaIds = [] }) {
  return call('/posts/publish', {
    method: 'POST',
    body: JSON.stringify({
      page_id: pageId,
      message,
      ...(mediaIds.length ? { media_ids: mediaIds } : {}),
    }),
  });
}

export async function listScheduled() {
  const body = await call('/posts/scheduled');
  return body.posts || body.scheduled || body;
}

export async function cancelScheduled(id) {
  return call(`/posts/scheduled/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function isConfigured() {
  return Boolean(process.env.OUTREPLY_API_KEY);
}
