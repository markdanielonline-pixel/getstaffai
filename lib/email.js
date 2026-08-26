/**
 * StaffAi - Email Delivery Utility
 * 
 * Delivers system transactional and onboarding emails via Resend API
 */

const EA_NAMES_POOL = ["Sarah Jenkins", "Elena Rostova", "Clara Sterling", "Sophia Vance", "Audrey Chen", "Marcus Thorne"];

export async function sendEAOnboardingEmail(email, firstName, eaName = null) {
  const selectedEAName = eaName || EA_NAMES_POOL[Math.floor(Math.random() * EA_NAMES_POOL.length)];
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.warn("[Resend] API Key missing. Simulating EA onboarding email send.");
    console.log(`[Simulated Email] To: ${email}\nFrom: ${selectedEAName} (Executive Assistant)\nSubject: Partnership and Introduction`);
    return { success: true, simulated: true, eaName: selectedEAName };
  }

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; font-size: 16px; color: #0A0E1A; max-width: 600px; margin: 0 auto; padding: 2rem; line-height: 1.6;">
      <p>Good day ${firstName || 'CEO'},</p>
      
      <p>I would like to extend my personal appreciation for the opportunity to serve as your Executive Assistant at <strong>StaffAi</strong>. I am fully certified at the StaffAI Institute and am prepared to help manage and coordinate your business operations starting immediately.</p>
      
      <p>Your organisation is now officially established. I am currently coordinating with your General Manager to begin the company-specific onboarding training for our staff so we can prepare our workflow pipelines for launch.</p>
      
      <p>You can access your Command Preferences and monitor our real-time activity feed directly inside your **Executive Suite** by visiting the link below:</p>
      
      <p style="margin: 2rem 0; text-align: center;">
        <a href="https://getstaffai.com/portal/login" style="background-color: #1B3A6B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; font-family: 'Arial', sans-serif;">Enter the Executive Suite</a>
      </p>
      
      <p>I remain at your service for any directives or coordination needs.</p>
      
      <p>Respectfully yours,</p>
      <p><strong>${selectedEAName}</strong><br/>
      C-Suite Executive Assistant<br/>
      <em>StaffAi Corporate</em></p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `StaffAi Onboarding <onboarding@getstaffai.com>`,
        to: email,
        subject: `Corporate Setup and Introduction — ${selectedEAName}`,
        html: htmlContent
      })
    });

    if (response.ok) {
      console.log(`[Resend] Successfully sent EA Onboarding email to ${email}`);
      return { success: true, eaName: selectedEAName };
    } else {
      const err = await response.json();
      console.error("[Resend] API Error:", err);
      return { success: false, error: err };
    }
  } catch (error) {
    console.error("[Resend] Fetch Error:", error);
    return { success: false, error: error.message };
  }
}
