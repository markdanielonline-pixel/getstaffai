/**
 * Turns a Playwright run into one line of truth for the monitor.
 *
 * The suite runs on the VPS against production because Playwright cannot run on
 * Vercel, and its result has to reach the same alerting path as everything
 * else. An interface that is broken while every API returns 200 is exactly the
 * failure the backend sweep cannot see.
 *
 * One complication, and it is a real product fact rather than a test problem:
 * Vercel challenges headless browsers from datacenter addresses with its
 * Security Checkpoint. The account is on Hobby, where IP bypass rules are not
 * available, so the synthetic customer gets challenged from the VPS. A
 * challenged check is reported as blocked, not failed - calling it a failure
 * would make the monitor cry wolf every run, and the fix is a plan upgrade, not
 * a code change.
 */
const CHECKPOINT = /Vercel Security Checkpoint|verifying your browser/i;

export default class MonitorReporter {
  constructor(options = {}) {
    this.endpoint = options.endpoint || process.env.STAFFAI_MONITOR_UI_URL
      || 'https://app.getstaffai.com/api/monitor/ui';
    this.secret = options.secret || process.env.STAFFAI_MONITOR_SECRET || '';
    this.passed = 0;
    this.skipped = 0;
    this.failures = [];
    this.blocked = [];
    this.startedAt = Date.now();
  }

  onTestEnd(test, result) {
    if (result.status === 'passed') { this.passed += 1; return; }
    if (result.status === 'skipped') { this.skipped += 1; return; }

    const title = test.titlePath().filter(Boolean).join(' > ');
    const error = result.error?.message || result.status;
    if (CHECKPOINT.test(error)) {
      this.blocked.push({ title });
      return;
    }
    this.failures.push({ title, error: String(error).slice(0, 500) });
  }

  async onEnd() {
    // Once the checkpoint has challenged this address it challenges most of the
    // run, and the collateral failures do not mention it: a page that never
    // rendered just looks like a missing element. So if any check was
    // explicitly challenged, the whole run is reported as blocked rather than
    // failing. A run that was genuinely blocked and a product that is genuinely
    // broken must not look the same in the alert.
    const challenged = this.blocked.length > 0;
    if (challenged) {
      this.blocked = this.blocked.concat(this.failures.map(f => ({ title: f.title })));
      this.failures = [];
    }

    const payload = {
      passed: this.passed,
      failed: this.failures.length,
      skipped: this.skipped,
      blocked: this.blocked.length,
      failures: this.failures,
      blockedTests: this.blocked,
      durationMs: Date.now() - this.startedAt,
    };

    // Written to disk rather than posted from here. Node fetch inside the
    // Playwright container is challenged by the same checkpoint the tests hit,
    // while curl from the host is not, so the runner script does the posting.
    // Reporting must not be able to fail for the reason being reported.
    try {
      const fs = await import('node:fs');
      fs.writeFileSync(process.env.STAFFAI_MONITOR_REPORT || 'monitor-report.json', JSON.stringify(payload));
      console.log('[monitor-reporter] wrote report: ' + this.passed + ' passed / ' + this.failures.length + ' failed / ' + this.blocked.length + ' blocked');
    } catch (error) {
      console.log('[monitor-reporter] could not write the report:', error?.message || error);
    }
  }
}
