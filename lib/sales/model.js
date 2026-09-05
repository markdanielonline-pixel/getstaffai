import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Staff AI's own customer-facing agents are Staff AI's own operating cost, so
// the founder model-routing policy should govern them. OpenRouter is preferred
// when a key is present, which is what makes that policy expressible here; the
// Google path is the historical fallback.
//
// This deliberately reports whether a usable credential exists, because the
// public sales agent previously surfaced a raw provider authentication error to
// prospects when its key stopped working.
export const FOUNDER_SALES_MODEL = process.env.SALES_AGENT_MODEL || 'openai/gpt-5-nano';

export function salesModel() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    const openrouter = createOpenAI({
      apiKey: openRouterKey,
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'HTTP-Referer': 'https://getstaffai.com',
        'X-Title': 'Staff AI Sales Agent',
      },
    });
    return { model: openrouter(FOUNDER_SALES_MODEL), provider: 'openrouter', id: FOUNDER_SALES_MODEL };
  }
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return { model: google('gemini-2.5-flash'), provider: 'google', id: 'gemini-2.5-flash' };
  }
  return { model: null, provider: 'none', id: null };
}

export function isProviderAuthError(error) {
  const message = String(error?.message || error || '');
  return /invalid authentication|api key|unauthorized|401|permission denied|credential/i.test(message);
}
