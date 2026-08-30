import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const startedAt = Date.now();
  const checks = {
    web: { status: 'ok' },
    database: { status: 'not_checked' },
  };

  let status = 200;

  try {
    const supabase = await createAdminClient();
    const result = await supabase.from('ceos').select('id', { count: 'exact', head: true }).limit(1);
    if (result.error) throw result.error;
    checks.database = { status: 'ok' };

    await supabase.from('operational_heartbeats').upsert({
      service_name: 'staffai-web',
      status: 'ok',
      checked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      details: { latency_ms: Date.now() - startedAt },
    });
  } catch (error) {
    status = 503;
    checks.database = { status: 'failed', message: error.message };
  }

  return NextResponse.json({
    status: status === 200 ? 'ok' : 'degraded',
    service: 'staffai-web',
    checked_at: new Date().toISOString(),
    latency_ms: Date.now() - startedAt,
    checks,
  }, { status });
}
