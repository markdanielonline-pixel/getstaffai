/**
 * StaffAi - Systeme.io API Utility
 * 
 * Securely pushes generated leads to the client's Systeme.io account
 * for automated drip campaign enrollment.
 */

export async function enrollLeadInSysteme(email, firstName) {
  if (!process.env.SYSTEME_IO_API_KEY) {
    console.warn("[Systeme.io] API Key missing. Simulating enrollment for demo.");
    return { success: true, message: `Simulated enrollment for ${email}` };
  }

  try {
    const url = 'https://api.systeme.io/api/contacts';
    
    // Systeme.io standard API payload for adding a contact
    const payload = {
      email: email,
      fields: [
        { slug: 'first_name', value: firstName || 'StaffAi Lead' }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': process.env.SYSTEME_IO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`[Systeme.io] Successfully enrolled ${email} into campaigns.`);
      return { success: true };
    } else {
      const errData = await response.json();
      console.error("[Systeme.io] API Error:", errData);
      return { success: false, error: errData };
    }
  } catch (error) {
    console.error("[Systeme.io] Fetch Error:", error);
    return { success: false, error: error.message };
  }
}
