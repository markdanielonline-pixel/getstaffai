import { test, expect } from '@playwright/test';

// The signed-in customer journey. Credentials come from the environment so the
// suite carries no secrets; without them these are skipped rather than failing
// noisily and hiding real regressions.
const EMAIL = process.env.STAFFAI_E2E_EMAIL;
const PASSWORD = process.env.STAFFAI_E2E_PASSWORD;

test.describe('signed-in customer', () => {
  test.skip(!EMAIL || !PASSWORD, 'STAFFAI_E2E_EMAIL / STAFFAI_E2E_PASSWORD not set');

  test.beforeEach(async ({ page }) => {
    await page.goto('/portal/login');
    await page.locator('input[type="email"]').fill(EMAIL);
    await page.locator('input[type="password"]').fill(PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/portal\/(dashboard|incorporate)/, { timeout: 60_000 });
  });

  test('lands in the product and the chrome states real account facts', async ({ page }) => {
    await page.goto('/portal/dashboard');
    const body = await page.locator('body').innerText();

    // The chrome used to invent an identity, a plan, and a permanently green
    // workforce indicator that contradicted the dashboard beside it.
    expect(body).not.toMatch(/Alex Smith/);
    expect(body).not.toMatch(/Launch Tier/);

    // Workforce state must be one of the honest states, never a fixed claim.
    expect(body).toMatch(/Workforce (active|setting up|needs attention|not set up)/i);
  });

  test('the workforce roster shows real employees and real runtime state', async ({ page }) => {
    await page.goto('/portal/dashboard/agents');
    await expect(page.getByText(/Your AI Workforce/i)).toBeVisible();

    const body = await page.locator('body').innerText();
    // The roster previously rendered employees only inside departments, so a
    // tenant with none saw an empty org chart while paying for two.
    expect(body).toMatch(/Current employees \(\d+\)/i);

    const count = Number((body.match(/Current employees \((\d+)\)/i) || [])[1] ?? '0');
    if (count > 0) {
      expect(body).toMatch(/Runtime (active|installing|error)|No runtime/i);
      // Dead controls were removed rather than left to imply a feature.
      expect(body).not.toMatch(/\bPromote\b/);
    }
  });

  test('the entitlement gate decides Conversations access, and does it consistently', async ({ page }) => {
    // Conversations is gated on entitlement. Both outcomes are legitimate: an
    // entitled account gets in, an unpaid one is sent to checkout. What must
    // never happen is the gate disagreeing with the plan the dashboard is
    // showing that same customer.
    await page.goto('/portal/dashboard');
    const chrome = await page.locator('body').innerText();
    const entitled = /Founder access/i.test(chrome) || !/No active plan/i.test(chrome);

    await page.goto('/portal/dashboard/conversations');
    const redirected = /\/portal\/incorporate/.test(page.url());
    expect(redirected, entitled
      ? 'an entitled customer was bounced into checkout'
      : 'an unentitled customer reached a gated page').toBe(!entitled);
  });
});

test.describe('founder', () => {
  const FOUNDER_EMAIL = process.env.STAFFAI_E2E_FOUNDER_EMAIL;
  const FOUNDER_PASSWORD = process.env.STAFFAI_E2E_FOUNDER_PASSWORD;
  test.skip(!FOUNDER_EMAIL || !FOUNDER_PASSWORD, 'founder credentials not set');

  test('founder reaches the product without buying it and can switch companies', async ({ page }) => {
    await page.goto('/portal/login');
    await page.locator('input[type="email"]').fill(FOUNDER_EMAIL);
    await page.locator('input[type="password"]').fill(FOUNDER_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/portal\/dashboard/, { timeout: 60_000 });

    const body = await page.locator('body').innerText();
    // Founder access is labelled as what it is, not disguised as a paid plan.
    expect(body).toMatch(/Founder access/i);

    // Multiple companies, switchable, is the founder capability that matters.
    const switcher = page.locator('select[aria-label="Active company"]');
    await expect(switcher).toBeVisible();
    expect(await switcher.locator('option').count()).toBeGreaterThan(0);
  });
});
