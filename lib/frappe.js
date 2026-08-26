import { InfisicalSDK } from '@infisical/sdk';
import { publishEvent } from './events';

/**
 * Staff AI Frappe/ERPNext Integration
 * Handles dynamic site and user provisioning for tenants, securely backed by Infisical.
 */

// Initialize Infisical Client using the application's machine identity
const infisical = new InfisicalSDK({
  clientId: process.env.INFISICAL_CLIENT_ID,
  clientSecret: process.env.INFISICAL_CLIENT_SECRET,
  siteUrl: process.env.INFISICAL_URL || 'http://158.220.123.254:8080'
});

async function getFrappeSecrets() {
  if (!process.env.INFISICAL_CLIENT_ID) {
    console.warn("[Frappe] Infisical Client ID missing, using fallback secrets.");
    return { adminPassword: 'FallbackAdminPassword2026!', webhookSecret: 'dummy-secret' };
  }

  const projectId = process.env.INFISICAL_PROJECT_ID;
  const adminSecret = await infisical.getSecret({ secretName: 'FRAPPE_ADMIN_PASSWORD', projectId, environment: 'prod' });
  const webhookSecret = await infisical.getSecret({ secretName: 'FRAPPE_PROVISION_WEBHOOK_SECRET', projectId, environment: 'prod' });
  
  return {
    adminPassword: adminSecret.secretValue,
    webhookSecret: webhookSecret.secretValue
  };
}

export async function provisionFrappeSite(orgId, domain) {
  try {
    const { adminPassword, webhookSecret } = await getFrappeSecrets();
    
    // We hit the internal frappe-provisioner microservice
    const provisionEndpoint = process.env.FRAPPE_PROVISIONER_URL || 'http://frappe-provisioner:9000/provision';
    
    console.log(`[Frappe] Requesting dynamic site provisioning for ${domain}...`);
    
    const response = await fetch(provisionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${webhookSecret}`
      },
      body: JSON.stringify({ domain, adminPassword })
    });
    
    if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Frappe webhook failed: ${errData}`);
    }
    
    await publishEvent({
      event_type: 'frappe.site_provisioned',
      org_id: orgId,
      source: 'frappe_integration',
      data: { domain }
    });

    return { success: true, site: domain };
  } catch (error) {
    console.error("[Frappe] Site provisioning error:", error);
    throw error;
  }
}

export async function createFrappeUser(orgId, siteDomain, employeeName, email, role) {
  try {
    const { adminPassword } = await getFrappeSecrets();
    
    // Make a REST API call to the specific tenant's Frappe site to create a User record.
    // ERPNext Endpoint: POST /api/resource/User
    // Since DNS might be local or external, it might be tricky if the site just got created.
    // Assuming internal routing or external DNS has resolved.
    const apiUrl = `http://${siteDomain}/api/resource/User`;
    
    console.log(`[Frappe] Creating user ${employeeName} (${email}) on site ${siteDomain} with role ${role}...`);
    
    const basicAuth = Buffer.from(`Administrator:${adminPassword}`).toString('base64');
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify({
        email: email,
        first_name: employeeName,
        send_welcome_email: 0,
        roles: [{ role }]
      })
    });
    
    if (!response.ok) {
        const errText = await response.text();
        console.error("[Frappe] User creation failed response:", errText);
        throw new Error(`Frappe user creation failed: ${response.statusText}`);
    }

    return { success: true, user_id: email };
  } catch (error) {
    console.error("[Frappe] User creation error:", error);
    throw error;
  }
}
