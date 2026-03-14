import { getLLM } from './llm-router';
import { generateText } from 'ai';

/**
 * Lead Gen Agent - Outscraper Integration
 * 
 * Fetches businesses from Google Maps via Outscraper API and extracts their emails.
 */
export async function runLeadGenerationCampaign({ niche, location, maxLimit = 500, outscraperApiKey }) {
  if (!outscraperApiKey) {
    throw new Error('Outscraper API key is required.');
  }

  // First, we use Gemini (high reasoning, low cost) to formulate the perfect
  // search query for Outscraper based on the user's natural language input.
  const { text: searchQuery } = await generateText({
    model: getLLM('reasoning'),
    system: `You are an expert Lead Generation Search Architect. 
    Convert the user's niche and location into a highly targeted Google Maps search query string.
    Example Input: "plumbers in miami" -> "plumbers, Miami, FL, USA"
    Example Input: "tech startups austin" -> "software company, Austin, TX"
    ONLY output the search query, nothing else.`,
    prompt: `Niche: ${niche}\nLocation: ${location}`
  });

  console.log(`[Lead Gen] Formulated Outscraper Query: "${searchQuery}"`);

  // Call the Outscraper API for Google Maps Emails
  // Using the /maps/search endpoint with the emails & contacts enrichment flag.
  try {
    const response = await fetch(\`https://api.app.outscraper.com/maps/search-v2?query=\${encodeURIComponent(searchQuery)}&limit=\${maxLimit}&async=false&extract_contacts=true\`, {
      method: 'GET',
      headers: {
        'X-API-KEY': outscraperApiKey
      }
    });

    if (!response.ok) {
        throw new Error(\`Outscraper error: \${response.statusText}\`);
    }

    const data = await response.json();
    
    // Process and clean the leads
    const leads = [];
    
    if (data && data.data && data.data.length > 0) {
      // Outscraper returns results in an array of arrays when async=false
      const results = data.data[0] || [];
      
      for (const business of results) {
        // Only keep businesses that have emails or phones
        const emails = business.emails || [];
        const phones = business.phones || [];
        
        if (emails.length > 0 || phones.length > 0) {
          leads.push({
            name: business.name,
            website: business.site,
            phone: phones.length > 0 ? phones[0] : null,
            email: emails.length > 0 ? emails[0] : null,
            address: business.full_address,
            niche: business.type,
            source: 'Outscraper'
          });
        }
      }
    }

    console.log(\`[Lead Gen] Successfully scraped \${leads.length} leads with contact info.\`);
    return leads;

  } catch (error) {
    console.error("[Lead Gen] Error fetching from Outscraper:", error);
    throw error;
  }
}
