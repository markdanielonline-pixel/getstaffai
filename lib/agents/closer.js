import { getLLM } from './llm-router';
import { generateText } from 'ai';

/**
 * Closer Agent
 * 
 * Handles Telnyx Voice Call Control (TeXML / JSON Webhooks).
 * When a user speaks on the phone, Telnyx transcribes it. We pass the transcript 
 * to the LLM (GPT-4o-mini for lowest latency) to figure out what to say back.
 * We return instructions to Telnyx to Play Audio using Google Neural2 TTS.
 */

const SYSTEM_PROMPT = `You are an expert Voice 'Closer' Agent for StaffAi.
You are currently on a live phone call with a prospect who is interested in deploying AI agents for revenue gen.
You must speak CONCISELY. Treat this like a real phone call (no long paragraphs).
If they ask to speak to a human or founder, say "I'd be happy to transfer you." 

Be polite, authoritative, and helpful.`;

export async function processVoiceInteraction(callId, currentTranscript, chatHistory = []) {
    // 1. Ensure we use the absolute fastest model (GPT-4o-mini)
    const model = getLLM('closer');

    // Add user's transcribed speech to history
    chatHistory.push({ role: 'user', content: currentTranscript });

    try {
        console.log(`[Closer Agent] Processing Voice for Call: ${callId}`);

        const { text, toolCalls } = await generateText({
            model: model,
            system: SYSTEM_PROMPT,
            messages: chatHistory,
            // Example of a Live Transfer tool for the Closer
            tools: {
                transfer_to_human: {
                    description: 'Trigger this tool if the user asks for a real person, a human, an agent, or explicitly requests to be transferred.',
                    execute: async () => {
                        return { action: 'transfer', message: "Transferring you now, please hold." };
                    }
                }
            }
        });

        // Check if the LLM decided to transfer the call
        if (toolCalls && toolCalls.length > 0) {
            const transferTool = toolCalls.find(tc => tc.toolName === 'transfer_to_human');
            if (transferTool) {
                return {
                    textToSay: "I'll transfer you to our founding team right now. One moment.",
                    action: 'transfer',
                    history: chatHistory
                };
            }
        }

        // Add assistant's reply to history
        if (text) {
            chatHistory.push({ role: 'assistant', content: text });
        }

        return {
            textToSay: text,
            action: 'speak', // Instructs webhook to use TTS
            history: chatHistory
        };

    } catch (error) {
        console.error("[Closer Agent] Error processing Voice:", error);
         return {
            textToSay: "I am having some connection issues. Let me call you right back.",
            action: 'speak', 
            history: chatHistory
        };
    }
}
