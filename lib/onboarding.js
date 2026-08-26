import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { publishEvent } from './events';

/**
 * Stage A: Company Discovery
 * Uses an external scraping API (like Firecrawl or Crawl4AI) to fetch the website
 * and structures the extracted data to form the seed of the "Company Brain".
 */
export async function discoverCompanyData(orgId, websiteUrl) {
  console.log(`[Onboarding] Starting discovery for ${websiteUrl} (Org: ${orgId})`);

  // 1. Scrape the website
  let rawMarkdown = "";
  try {
    // In a production environment, this calls a dedicated scraper.
    // Fallback/Demo: Using a mock or a direct fetch if no API key is provided.
    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    if (firecrawlKey) {
      const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${firecrawlKey}`
        },
        body: JSON.stringify({ url: websiteUrl })
      });
      const data = await response.json();
      rawMarkdown = data.data?.markdown || data.data?.content || "";
    } else {
      console.warn("[Onboarding] No FIRECRAWL_API_KEY found. Proceeding with simulated extraction.");
      rawMarkdown = `# ${websiteUrl}\nWe are an innovative company providing enterprise AI solutions to streamline operations.`;
    }
  } catch (error) {
    console.error("[Onboarding] Scraping failed:", error);
    throw new Error("Failed to scrape company website.");
  }

  // 2. Synthesize Data with LLM
  const model = google('gemini-2.5-flash');
  
  const { object: companyBrain } = await generateObject({
    model,
    system: "You are an expert data analyst. Extract core company facts from the provided markdown. Output accurate, highly structured JSON.",
    prompt: `Analyze this website content and extract the core company profile:\n\n${rawMarkdown.substring(0, 15000)}`,
    schema: z.object({
      overview: z.string().describe("A concise 2-sentence mission and overview."),
      products_and_services: z.array(z.string()).describe("List of main products or services."),
      target_audience: z.string().describe("The primary Ideal Customer Profile (ICP)."),
      tone_and_voice: z.string().describe("The brand's tone of voice (e.g., Professional, Playful, Direct)."),
      key_policies: z.array(z.string()).optional().describe("Any visible public policies (e.g., refund policy, working hours).")
    })
  });

  // 3. Save to database
  const supabase = await createAdminClient();
  const { data: org, error } = await supabase
    .from('organizations')
    .update({ 
      settings: { 
        website: websiteUrl, 
        company_brain: companyBrain 
      } 
    })
    .eq('id', orgId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update organization: ${error.message}`);
  }

  // 4. Emit event
  await publishEvent({
    event_type: 'onboarding.completed',
    org_id: orgId,
    source: 'discovery_pipeline',
    data: { website: websiteUrl }
  });

  return companyBrain;
}
