import { NextResponse } from 'next/server';
import { instantiateEmployee } from '@/lib/factory';

export async function GET(req) {
  try {
    console.log("🚀 Testing Employee Factory via API...");
    // Just a dry run with a random UUID
    const dummyOrgId = '00000000-0000-0000-0000-000000000001';
    
    // We expect this to fail gracefully if 'outbound-sdr-v1' doesn't exist,
    // but the code will execute up to the Supabase lookup.
    const employee = await instantiateEmployee({
      orgId: dummyOrgId,
      roleTemplateId: 'outbound-sdr-v1',
      managerId: null,
      departmentId: null,
      onboardingAnswers: {
        company_name: 'StaffAi Demo Inc',
        target_audience: 'B2B SaaS companies'
      }
    });

    return NextResponse.json({ success: true, employee });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
