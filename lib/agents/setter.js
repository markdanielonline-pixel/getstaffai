import { getLLM } from './llm-router';
import { generateText, tool } from 'ai';
import { z } from 'zod';

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

// Mocking KV store for conversation history (replace with actual @vercel/kv or Upstash Redis in prod)
// Keys: phone number -> Value: Array of {role: 'user'|'assistant', content: string}
const conversationMemory = new Map(); 

export async function processSmsReply(phoneNumber, incomingMessage, moxieCalendarLink) {
    // 1. Retrieve conversation history
    let history = conversationMemory.get(phoneNumber) || [];
    
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
                    parameters: z.object({
                        reason: z.string().describe('The reason for escalation based on what the user said.')
                    }),
                    execute: async ({ reason }) => {
                        console.log(`[Setter Agent] ESCALATION TRIGGERED: ${reason}`);
                        // Here we would enqueue a job for the Closer Agent to call them or notify the human.
                        return "Escalation initiated. A human or voice closer will contact them shortly.";
                    }
                }),
                provide_booking_link: tool({
                    description: 'Trigger this tool to give the user the booking link when they agree to a meeting or ask for times.',
                    parameters: z.object({}),
                    execute: async () => {
                        return `Here is the calendar link to book: ${moxieCalendarLink}`;
                    }
                })
            },
            maxSteps: 3 // Allow the agent to use a tool and then generate a final reply
        });

        // Add assistant's reply to history
        if (text) {
            history.push({ role: 'assistant', content: text });
            conversationMemory.set(phoneNumber, history);
        }

        return {
            replyText: text,
            toolsTriggered: toolCalls
        };

    } catch (error) {
        console.error("[Setter Agent] Error processing SMS:", error);
        return {
            replyText: "I'm having a bit of trouble connecting right now, but I will get back to you shortly!",
            error: error.message
        };
    }
}
