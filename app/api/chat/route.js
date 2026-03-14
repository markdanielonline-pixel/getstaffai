import { streamText } from 'ai';
import { getLLM } from '@/lib/agents/llm-router';
import { z } from 'zod';
import { enrollLeadInSysteme } from '@/lib/systeme';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
  try {
    const { messages, agentType } = await req.json();
    
    // Determine which routing tier to use based on agent complexity
    let tier = 'fast';
    if (agentType === 'closer') tier = 'closer';
    
    const model = getLLM(tier);
    
    let systemPrompt = "You are a helpful AI assistant.";
    
    // Distinct Agent System Prompts mimicking the StaffAi behavior
    if (agentType === 'lead_gen') {
      systemPrompt = `You are the StaffAi Lead Generation Agent. Your goal is to capture the user's initial interest, ask for their name and email, and qualify them quickly with high energy and urgency. 
      CRITICAL INSTRUCTIONS: 
      - Be incredibly concise. 
      - Use text-message style (short sentences). 
      - Do not use robotic markdown formatting or lists.
      - Ask exactly one simple qualification question at a time.
      - Start by asking what they are looking for today.`;
    } else if (agentType === 'setter') {
      systemPrompt = `You are the StaffAi Appointment Setter Agent. Your goal is to qualify the prospect's needs and drive them to book a specific time on the calendar. 
      CRITICAL INSTRUCTIONS:
      - Be direct, authoritative but extremely polite.
      - Always propose next steps (e.g., 'Does tomorrow at 2 PM PST work?'). 
      - Use short, text-message style sentences.
      - Never break character. You are booking a meeting on behalf of the StaffAi revenue team.`;
    } else if (agentType === 'closer') {
      systemPrompt = `You are the StaffAi Closing Agent. You handle objections, build value, and close deals. 
      CRITICAL INSTRUCTIONS:
      - If the user asks for pricing, explain the value first (time saved, revenue recovered). 
      - Push confidently toward a final decision. 
      - If they say yes, present a mock Stripe checkout link like '[stripe.com/pay/staffai-launch]'.
      - Use a highly persistent, persuasive, and conversational tone.
      - Do not use bullets. Speak like a senior sales closer over SMS.`;
    }
    
    // Define Tools based on the agent type
    let tools = {};

    if (agentType === 'lead_gen') {
      tools = {
        lookupBusiness: {
          description: "Look up a business on Google Maps using Outscraper to find contact info. Use this when a user wants you to check if they can scrape a certain niche in a city.",
          parameters: z.object({
            query: z.string().describe("The search query for Google Maps, e.g., 'plumbers in Dallas, TX'")
          }),
          execute: async ({ query }) => {
            console.log(`[Tool] Looking up business via Outscraper: ${query}`);
            try {
              const url = `https://api.outscraper.com/maps/search-v2?query=${encodeURIComponent(query)}&limit=3`;
              const response = await fetch(url, {
                headers: { 'X-API-KEY': process.env.OUTSCRAPER_API_KEY || '' }
              });
              const data = await response.json();
              
              if (data && data.data && data.data.length > 0) {
                const results = data.data[0].map(biz => `${biz.name} (${biz.phone || 'No phone'}) - ${biz.site || 'No website'}`);
                return {
                  success: true,
                  message: `I found these businesses: \n` + results.join('\n'),
                  sample: results
                };
              } else {
                return { success: false, message: "I couldn't find any results for that query." };
              }
            } catch (error) {
              console.error("Outscraper API Error:", error);
              return { success: false, message: "There was an error accessing the scraping API." };
            }
          }
        },
        captureContactInfo: {
          description: "When the user shares their name and email, trigger this strictly to lock the lead in.",
          parameters: z.object({
            name: z.string().describe("The user's provided first and last name"),
            email: z.string().email().describe("The user's provided email address")
          }),
          execute: async ({ name, email }) => {
            console.log(`[Tool] Capturing lead info for: ${name} <${email}>`);
            
            // 1. Push to StaffAi Systeme.io Campaigns
            const marketingResult = await enrollLeadInSysteme(email, name);
            
            // 2. Push to Supabase Dashboard Live Feed
            try {
              const { supabase } = await import('@/lib/supabase');
              await supabase.from('leads').insert({
                name,
                email,
                stage: 'Contacted',
                source: 'AI Web Widget'
              });
              console.log("[Tool] Lead logged to Supabase dashboard successfully.");
            } catch (err) {
              console.error("[Tool] Dashboard Supabase error: ", err);
            }

            return {
              success: true,
              message: `You successfully secured the lead! 
                Marketing status text: ${marketingResult.success ? "Enrolled" : "Warning - Check marketing key"}
                Reply back acknowledging you have their details and push the conversation forward.`
            };
          }
        }
      };
    } else if (agentType === 'setter') {
      tools = {
        checkCalendarAvailability: {
          description: "Check the Moxie calendar for available time slots on a given date.",
          parameters: z.object({
            date: z.string().describe("The date to check in YYYY-MM-DD format, e.g., '2024-10-15'")
          }),
          execute: async ({ date }) => {
            console.log(`[Tool] Checking Moxie calendar for: ${date}`);
            if (!process.env.MOXIE_API_KEY) {
              console.warn("MOXIE_API_KEY missing. Simulating availability for demo.");
              return { success: true, availableSlots: ["10:00 AM", "1:30 PM", "3:00 PM", "4:15 PM"] };
            }

            try {
              const url = `${process.env.MOXIE_API_URL}/calendar/availability?date=${date}`;
              const response = await fetch(url, { headers: { 'Authorization': `Bearer ${process.env.MOXIE_API_KEY}` }});
              const data = await response.json();
              return { success: true, availableSlots: data.slots || [] };
            } catch (err) {
              return { success: false, message: "Could not retrieve calendar at this time." };
            }
          }
        },
        bookAppointment: {
          description: "Book an appointment directly into the Moxie CRM calendar.",
          parameters: z.object({
            name: z.string().describe("The lead's full name"),
            email: z.string().email().describe("The lead's email address"),
            timeSlot: z.string().describe("The desired time slot, e.g., '1:30 PM'")
          }),
          execute: async ({ name, email, timeSlot }) => {
            console.log(`[Tool] Booking Moxie appointment for ${name} at ${timeSlot}`);
            if (!process.env.MOXIE_API_KEY) {
              console.warn("MOXIE_API_KEY missing. Simulating booking for demo.");
              return { success: true, message: `Successfully booked a placeholder meeting for ${name} at ${timeSlot}. Your CRM will sync once the key is added!` };
            }

            try {
              const url = `${process.env.MOXIE_API_URL}/calendar/book`;
              const response = await fetch(url, {
                method: 'POST',
                headers: { 
                  'Authorization': `Bearer ${process.env.MOXIE_API_KEY}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, time: timeSlot })
              });
              
              if (response.ok) {
                return { success: true, message: `Successfully booked meeting for ${name} at ${timeSlot}.` };
              } else {
                return { success: false, message: "The time slot was no longer available." };
              }
            } catch (err) {
              return { success: false, message: "Error communicating with CRM to book appointment." };
            }
          }
        }
      };
    }

    const result = streamText({
      model,
      messages,
      system: systemPrompt,
      tools: Object.keys(tools).length > 0 ? tools : undefined,
    });
    
    return result.toDataStreamResponse();
  } catch (err) {
    console.error("Chat API Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
