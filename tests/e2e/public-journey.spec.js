import { test, expect } from '@playwright/test';

// The pre-login journey a real prospect takes. These are the pages that decide
// whether Staff AI can sell at all, so a failure here is a revenue failure.

test('login page loads and does not offer a sign-in method that cannot work', async ({ page }) => {
  await page.goto('/portal/login');
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  await expect(page.getByPlaceholder(/name@company\.com/i)).toBeVisible();

  // Google OAuth is not enabled on the Supabase project. Showing the button
  // would offer a route that can only fail, so it must stay hidden until the
  // provider is actually enabled.
  await expect(page.getByRole('button', { name: /sign in with google/i })).toHaveCount(0);

  // Password recovery must be reachable; it was a dead end until the redirect
  // allow-list was corrected.
  await expect(page.getByRole('button', { name: /forgot password/i })).toBeVisible();
});

test('signup page accepts the details a new customer must provide', async ({ page }) => {
  await page.goto('/portal/signup');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
});

test('pricing page states the product that checkout actually sells', async ({ page }) => {
  await page.goto('/pricing');
  const body = await page.locator('body').innerText();
  // The public sales agent once quoted a five-tier product at $0/$97/$297 that
  // checkout could never charge. The price on the page and the price in the
  // billing catalog must not drift apart again.
  expect(body).toMatch(/Company Office/i);
  expect(body).toMatch(/\$199/);
});

test('health endpoint responds', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
});

test('public sales agent never returns a raw provider error to a visitor', async ({ request }) => {
  const response = await request.post('/api/chat', {
    data: { messages: [{ role: 'user', content: 'What does Staff AI cost?' }] },
    timeout: 60_000,
  });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(typeof body.text).toBe('string');
  expect(body.text.length).toBeGreaterThan(10);
  // Infrastructure detail must never reach a prospect. This looks for actual
  // provider error signatures rather than any occurrence of a word like
  // "token", which the agent uses legitimately when explaining that Staff AI
  // has no customer-facing token charges.
  const providerLeak = [
    /invalid authentication/i,
    /OAuth 2 access token/i,
    /developers\.google\.com/i,
    /api\.openai\.com/i,
    /openrouter\.ai\/api/i,
    /\bAPI key\b/i,
    /\b(401|403)\b/,
  ];
  for (const pattern of providerLeak) {
    expect(body.text, `sales agent leaked provider detail matching ${pattern}`).not.toMatch(pattern);
  }

  // When a credential is missing the agent is allowed to degrade, but it must
  // say so honestly rather than silently pretending to be a working salesperson.
  if (body.degraded) {
    expect(body.text).toMatch(/getstaffai\.com|team/i);
  }
});

test('the authenticated success agent is not reachable without signing in', async ({ request }) => {
  const response = await request.post('/api/support/agent', {
    data: { messages: [{ role: 'user', content: 'hello' }] },
  });
  expect(response.status()).toBe(401);
});
