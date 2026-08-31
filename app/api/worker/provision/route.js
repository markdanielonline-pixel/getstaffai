import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hasValidWorkerAuthorization } from '@/lib/worker-auth';
import { provisionInitialWorkforce } from '@/lib/workforce';

const requestSchema = z.object({
  ceoId: z.string().uuid(),
  intelligenceLevel: z.enum(['free', 'venture', 'executive', 'prestige']),
});

export async function POST(request) {
  if (!hasValidWorkerAuthorization(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const input = requestSchema.parse(await request.json());
    const result = await provisionInitialWorkforce(input.ceoId, input.intelligenceLevel);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid provisioning request' }, { status: 400 });
    }
    console.error('[Worker Provisioning API]', error);
    return NextResponse.json({ error: 'Workforce provisioning failed' }, { status: 500 });
  }
}
