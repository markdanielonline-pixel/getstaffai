import { test, expect } from '@playwright/test';
import { BILLING_CATALOG, COMPANY_OFFICE_KEY } from '../../lib/billing/catalog.js';

// Staff AI once ran two products at the same time: the live one, and a dead
// five-tier "AI Revenue Workforce" at $0/$97/$297/$497/$997 that survived in the
// sales agent's prompt and in several app-served marketing pages. A prospect
// could be quoted a price checkout would never charge.
//
// www.getstaffai.com is the authority for what Staff AI sells. These tests exist
// so the product can never quietly fork in two again.

const DEAD_PRODUCT_LANGUAGE = [
  /AI Revenue Workforce/i,
  /Launch Tier/i,
  /Operator Tier/i,
  /Accelerator/i,
  /Dominance/i,
  /Authority Tier/i,
];

const APP_PUBLIC_PAGES = [
  '/pricing', '/contact', '/qa', '/roadmap',
  '/how-it-works', '/why-staffai', '/industries',
];

for (const path of APP_PUBLIC_PAGES) {
  test(`no dead product language is served on ${path}`, async ({ page }) => {
    await page.goto(path);
    const body = await page.locator('body').innerText();
    for (const pattern of DEAD_PRODUCT_LANGUAGE) {
      expect(body, `${path} still advertises retired product language ${pattern}`).not.toMatch(pattern);
    }
  });
}

test('the billing catalog still matches what the public site advertises', async ({ page }) => {
  // The live marketing site is the authority. If someone changes a price there
  // and not in the catalog, checkout would charge something different.
  await page.goto('https://www.getstaffai.com/pricing');
  const body = await page.locator('body').innerText();

  const office = BILLING_CATALOG[COMPANY_OFFICE_KEY];
  expect(body).toMatch(new RegExp(`\\$${office.monthly / 100}`));

  for (const [key, product] of Object.entries(BILLING_CATALOG)) {
    if (key === COMPANY_OFFICE_KEY) continue;
    const price = `$${product.monthly / 100}`;
    expect(body, `${product.name} at ${price} is in the catalog but not advertised`).toContain(price);
  }
});

test('the sales agent never quotes a price the catalog does not contain', async ({ request }) => {
  const response = await request.post('/api/chat', {
    data: { messages: [{ role: 'user', content: 'Give me your full pricing, every plan and price.' }] },
    timeout: 60_000,
  });
  expect(response.status()).toBe(200);
  const body = await response.json();

  // A degraded agent has no credential and says nothing about price, which is
  // safe; only a live answer can misquote.
  test.skip(body.degraded === true, 'sales agent has no model credential configured');

  const allowed = new Set([
    ...Object.values(BILLING_CATALOG).map(p => `$${p.monthly / 100}`),
    ...Object.values(BILLING_CATALOG).map(p => `$${p.annual / 100}`),
    '$497', // setup fee, waived during launch, stated on the live site
  ]);
  const quoted = body.text.match(/\$[0-9][0-9,]*/g) || [];
  for (const price of quoted) {
    expect(allowed.has(price.replace(/,/g, '')), `agent quoted ${price}, which is not in the billing catalog`).toBe(true);
  }
  for (const pattern of DEAD_PRODUCT_LANGUAGE) {
    expect(body.text).not.toMatch(pattern);
  }
});
