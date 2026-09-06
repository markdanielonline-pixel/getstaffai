import { defineConfig, devices } from '@playwright/test';

// Staff AI's permanent synthetic customer. It runs against real production by
// default, because the failures worth catching - a dead provider credential, a
// broken redirect, an entitlement gate that stopped gating - are production
// facts, not build facts.
const BASE_URL = process.env.STAFFAI_E2E_BASE_URL || 'https://app.getstaffai.com';

export default defineConfig({
  testDir: './tests/e2e',
  // A synthetic customer that gives up on the first failure hides the rest of
  // the journey, so the suite always reports everything it found.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  // Evidence is the point: a failure must be diagnosable without re-running it.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/e2e-report', open: 'never' }],
    ['json', { outputFile: 'tests/e2e-report/results.json' }],
    // A scheduled run on the VPS reports into the same alerting path as the
    // backend sweep. Inert without a secret, so a local run stays local.
    ['./tests/e2e/report-to-monitor.js'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
});
