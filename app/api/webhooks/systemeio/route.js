import { NextResponse } from 'next/server';
import { pushLeadsToMoxie } from '@/lib/crm/moxie';

/**
 * Handle Inbound Webhooks from Systeme.io 
 * (When a user submits a lead form or purchases a product)
 */
export async function POST(req) {
    try {
        // Parse incoming webhook body from Systeme.io
        const body = await req.json();
        
        console.log("[Systeme.io Webhook] Received Event:", JSON.stringify(body, null, 2));

        // Note: Systeme.io's exact webhook payload format should be verified via their docs,
        // but typically it includes user details like email, firstName, lastName, phone.
        // E.g., body.contact.email, body.contact.fields.phone
        
        const contact = body?.contact || body; // Fallback structure

        if (!contact || !contact.email) {
            return NextResponse.json({ success: false, error: 'No contact data found' }, { status: 400 });
        }

        // 1. Format the lead into our standard structure
        const lead = {
            name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Systeme Lead',
            email: contact.email,
            phone: contact.fields?.phone || contact.phone || null,
            source: 'Systeme.io Funnel',
            niche: 'Inbound Web Lead'
        };

        // 2. Push directly to Moxie CRM
        const moxieResults = await pushLeadsToMoxie([lead]);
        
        console.log("[Systeme.io Webhook] Synced to CRM:", moxieResults);

        return NextResponse.json({ success: true, synced: moxieResults });

    } catch (error) {
        console.error("[Systeme.io Webhook] Processing Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
