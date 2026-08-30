import { getLLM } from './llm-router';
import { generateText, stepCountIs, tool } from 'ai';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Appointment Setter Agent
 * 
 * Handles bidirectional SMS conversations, remembers context using a KV store, 
 * qualifies the lead, and pushes a Moxie Calendar booking link.
 */

const SYSTEM_PROMPT = `You are an expert Appointment Setter for StaffAi. 
Your goal is to qualify the prospect over SMS and get them to book a meeting.
Always be concise, conversational, and direct (max 2 sentences per text).

RULES:
1. If the user asks a complex objection, answer it elegantly.
2. If the user shows high intent or asks to talk, USE THE 'escalate_to_closer' TOOL.
3. If they are ready to book, USE THE 'provide_booking_link' TOOL and send them the link.
4. You are representing the company. Be professional but texting-friendly (no emojis unless matching their energy).`;

export async function processSmsReply(phoneNumber, incomingMessage, moxieCalendarLink) {
    const supabase = await createAdminClient();
    const { data: saved, error: loadError } = await supabase
      .from('sms_conversation_memory')
      .select('messages')
      .eq('phone_number', phoneNumber)
      .maybeSingle();
    if (loadError) throw new Error(`Could not load SMS history: ${loadError.message}`);
    const history = Array.isArray(saved?.messages) ? saved.messages.slice(-30) : [];
    
    // Add user's new message to history
    history.push({ role: 'user', content: incomingMessage });

    try {
        // 2. Route to the optimal model based on history size
        // If the conversation is long, we use DeepSeek for cost logic.
        // If it's short/standard, we use GPT-4o-mini (fast).
        const modelTier = history.length > 10 ? 'cost' : 'fast';
        const model = getLLM(modelTier);

        console.log(`[Setter Agent] Processing SMS for ${phoneNumber} using ${modelTier} model.`);

        // 3. Generate response with tools
        const { text, toolCalls } = await generateText({
            model: model,
            system: SYSTEM_PROMPT,
            messages: history,
            tools: {
                escalate_to_closer: tool({
                    description: 'Trigger this tool immediately if the user says "Call me", "Let\'s talk on the phone", or needs to speak to a human.',
                    inputSchema: z.object({
                        reason: z.string().describe('The reason for escalation based on what the user said.')
                    }),
                    execute: async ({ reason }) => {
                        console.log(`[Setter Agent] ESCALATION TRIGGERED: ${reason}`);
                        return { success: false, needsHumanFollowUp: true, reason };
                    }
                }),
                provide_booking_link: tool({
                    description: 'Trigger this tool to give the user the booking link when they agree to a meeting or ask for times.',
                    inputSchema: z.object({}),
                    execute: async () => {
                        return `Here is the calendar link to book: ${moxieCalendarLink}`;
                    }
                })
            },
            stopWhen: stepCountIs(3)
        });

        // Add assistant's reply to history
        if (text) {
            history.push({ role: 'assistant', content: text });
            const { error: saveError } = await supabase.from('sms_conversation_memory').upsert({
              phone_number: phoneNumber,
              messages: history.slice(-30),
              updated_at: new Date().toISOString(),
            });
            if (saveError) throw new Error(`Could not save SMS history: ${saveError.message}`);
        }

        return {
            replyText: text,
            toolsTriggered: toolCalls
        };

    } catch (error) {
        console.error("[Setter Agent] Error processing SMS:", error);
        throw error;
    }
}
