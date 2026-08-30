/**
 * Moxie CRM Integration Utility
 * 
 * Handles pushing leads from Outscraper into Moxie, and updating 
 * prospect records when the Setter Agent books an appointment.
 */

// Important: Moxie CRM API details need to be verified against their 
// official developer documentation. Below is a standard REST implementation.
const MOXIE_API_BASE = process.env.MOXIE_API_URL || 'https://api.moxie.com/v1';

/**
 * Pushes a list of leads (from Outscraper) into Moxie CRM as new Contact/Lead records.
 */
export async function pushLeadsToMoxie(leads) {
    if (!process.env.MOXIE_API_KEY) {
        console.error("[Moxie CRM] API Key missing. Cannot ingest leads.");
        throw new Error("MOXIE_API_KEY is missing.");
    }

    const results = [];
    
    // In a real scenario, this should be chunked/batched to respect rate limits.
    for (const lead of leads) {
        try {
            const response = await fetch(`${MOXIE_API_BASE}/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MOXIE_API_KEY}`
                },
                body: JSON.stringify({
                    firstName: lead.name.split(' ')[0], // Best effort split
                    lastName: lead.name.split(' ').slice(1).join(' '),
                    email: lead.email,
                    phone: lead.phone,
                    companyName: lead.name,
                    website: lead.website,
                    customFields: {
                        niche: lead.niche,
                        source: lead.source || 'StaffAi Outscraper',
                        address: lead.address
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                results.push({ ...lead, moxieId: data.id, success: true });
            } else {
                console.error(`[Moxie CRM] Failed to ingest lead ${lead.name}: ${response.statusText}`);
                results.push({ ...lead, success: false, error: response.statusText });
            }
        } catch (error) {
             console.error(`[Moxie CRM] Network error ingesting lead ${lead.name}:`, error);
             results.push({ ...lead, success: false, error: error.message });
        }
    }

    return results;
}

/**
 * Updates a contact's stage in Moxie CRM when an appointment is booked
 */
export async function updateContactStage(moxieContactId, newStage = 'Appointment Booked') {
     if (!process.env.MOXIE_API_KEY) {
        console.error("[Moxie CRM] API Key missing. Cannot update stage.");
        throw new Error("MOXIE_API_KEY is missing.");
    }

    try {
        const response = await fetch(`${MOXIE_API_BASE}/contacts/${moxieContactId}/stage`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.MOXIE_API_KEY}`
            },
            body: JSON.stringify({ stage: newStage })
        });
        
        return response.ok;
    } catch (error) {
        console.error("[Moxie CRM] Error updating contact stage:", error);
        return false;
    }
}
