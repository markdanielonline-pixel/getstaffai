import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We need an exact end-to-end run!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runE2E() {
  console.log("🚀 STARTING FULL E2E SYSTEM TEST 🚀\n");

  console.log("[1] Fetching existing test Org & Employee...");
  const { data: emp, error: empErr } = await supabase.from('employees').select('*, organizations(*)').eq('name', 'Jordan (AI)').single();
  if (!emp) throw new Error("Could not find Jordan (AI). Did you run run-seed.js?");

  console.log(`✅ Found Employee: ${emp.name} in Org: ${emp.organizations.name}`);

  console.log("\n[2] Setting Org to Free Tier to test Upgrade Throttling...");
  await supabase.from('organizations').update({ subscription_tier: 'free' }).eq('id', emp.org_id);
  console.log("✅ Set to Free Tier.");

  console.log("\n[3] Simulating Incoming Webhook from Customer...");
  
  try {
      const webhookRes = await fetch('https://getstaffai.com/api/webhooks/incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          from: 'markdanielonline@gmail.com',
          to: 'jordan@getstaffai.com',
          text: 'Hey Jordan! I am doing a final system test. Can you send me an email confirming you are alive, online, and using the Resend API? Please keep it very short and professional.'
        })
      });
      const webhookData = await webhookRes.text();
      console.log("   --> Webhook response:", webhookData);
  } catch (e) {
    console.log(`❌ Failed to reach local webhook: ${e.message}`);
  }

  console.log("\n🎉 E2E TEST COMPLETE.");
}

runE2E().catch(e => console.error(e));
