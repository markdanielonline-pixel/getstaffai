import { openAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { deepseek } from '@ai-sdk/deepseek';

/**
 * StaffAi Dynamic LLM Router
 * 
 * Routes to the optimal model based on the task:
 * - 'fast': Low-latency responses (GPT-4o-mini). Ideal for Voice and simple Setter chats.
 * - 'reasoning': High intelligence / complex logic (Gemini 2.5 Flash/Pro).
 * - 'cost': Best price-to-performance (DeepSeek V3 / R1).
 */
export function getLLM(tier = 'fast') {
  switch (tier) {
    case 'fast':
      // Temporarily using Gemini since OpenAI key is not yet provided
      return google('gemini-2.5-flash-preview-04-17');
      
    case 'reasoning':
      // Gemini 2.5 Flash is excellent for long-context reasoning 
      // (like reading scraping results or complex negotiation histories).
      return google('gemini-2.5-flash-preview-04-17');
      
    case 'cost':
      // DeepSeek represents the lowest cost per token while maintaining GPT-4 class logic.
      return deepseek('deepseek-chat');
      
    case 'closer':
      // Temporarily using Gemini for Voice Closer
      return google('gemini-2.5-flash-preview-04-17');
      
    default:
      return google('gemini-2.5-flash-preview-04-17');
  }
}
