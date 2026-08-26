import { NextResponse } from 'next/server';
import { getCEO } from '@/app/actions/auth';
import { discoverCompanyData } from '@/lib/onboarding';

export async function POST(req) {
  try {
    const ceo = await getCEO();
    if (!ceo) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { websiteUrl } = await req.json();
    if (!websiteUrl) {
      return NextResponse.json({ error: 'websiteUrl is required' }, { status: 400 });
    }

    const orgId = ceo.org_id || '00000000-0000-0000-0000-000000000000';
    
    // Run the discovery pipeline
    const companyBrain = await discoverCompanyData(orgId, websiteUrl);

    return NextResponse.json({ 
      success: true, 
      message: 'Company discovery completed successfully',
      data: companyBrain 
    });

  } catch (err) {
    console.error("[Discover API Error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
