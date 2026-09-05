import { generateText, stepCountIs, tool } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { salesModel, isProviderAuthError } from '@/lib/sales/model';
import { SALES_AGENT_FACTS, SHARED_STYLE } from '@/lib/sales/product-knowledge';
import { captureLead } from '@/lib/sales/leads';

export const maxDuration = 30;

// This is the PUBLIC, pre-login agent. It is a sales employee, not support.
// The authenticated equivalent lives at /api/support/agent and knows the
// customer's organization; the two must not be confused.
const SALES_SYSTEM_PROMPT = `You are Staff AI's AI Sales Agent on the public website. You are Staff AI's own employee, and this conversation is itself a live demonstration of what Staff AI sells.

Your job, in order of priority:
1. Understand the prospect's business well enough to be useful.
2. Recommend the Staff AI setup that actually fits them.
3. Capture their name and email so the conversation can continue.
4. Move them to signup or trial, or escalate them if they are high value or complex.

${SALES_AGENT_FACTS}

RECOMMENDING A SETUP:
Everyone starts with the Company Office, because it is what provisions the workforce. Then name the specific additional employees that match what they told you, using their own words as the reason. Do not read out the whole catalog. One or two roles, with a reason each.

CAPTURING THE LEAD:
Ask for name and email once you understand their business, and before you make a full recommendation. Weave it in: say you want to send something specific to what they described. Never ask more than twice. When you have at least an email, call the captureLead tool with everything you have learned. Call it again later if you learn materially more.

ESCALATING:
Set escalate to true when the prospect is an agency, an enterprise, asks about white-label or API access, has a complex multi-company setup, is a potential partner or investor, or has expressed frustration more than once. Tell them a human from Staff AI will follow up, and be honest that this is a handoff rather than an instant answer.

CLOSING:
Signup is at https://app.getstaffai.com/portal/signup and starts a 7-day free trial of the Company Office. Do not invent other paths. Never take payment details in chat.

${SHARED_STYLE}`;

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  if (messages.length === 0) {
    return NextResponse.json({ error: 'A message is required' }, { status: 400 });
  }

  const { model, provider, id } = salesModel();
  if (!model) {
    // A prospect must never be shown a provider error. Fail as a person would.
    console.error('[sales-agent] No usable model provider is configured.');
    return NextResponse.json({
      text: "I can't reach my systems right now. Leave your email at getstaffai.com and the Staff AI team will pick this up directly.",
      degraded: true,
    });
  }

  try {
    const result = await generateText({
      model,
      system: SALES_SYSTEM_PROMPT,
      messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '') })),
      stopWhen: stepCountIs(4),
      tools: {
        captureLead: tool({
          description: 'Record the prospect so Staff AI can follow up. Call this as soon as you have an email address, and again if you later learn materially more about them.',
          inputSchema: z.object({
            email: z.string().describe('Prospect email address'),
            name: z.string().optional().describe('Prospect name'),
            companyName: z.string().optional(),
            industry: z.string().optional(),
            summary: z.string().describe('Two or three sentences on what they need, in their own words where possible'),
            recommendedSetup: z.object({
              companyOffice: z.boolean().default(true),
              additionalRoles: z.array(z.string()).default([]),
              reason: z.string().optional(),
            }).optional(),
            escalate: z.boolean().default(false),
            escalationReason: z.string().optional(),
          }),
          execute: async (input) => {
            try {
              const id = await captureLead({
                email: input.email,
                name: input.name,
                companyName: input.companyName,
                industry: input.industry,
                summary: input.summary,
                qualification: { industry: input.industry, companyName: input.companyName },
                recommendedSetup: input.recommendedSetup || {},
                escalate: input.escalate,
                escalationReason: input.escalationReason,
                stage: 'qualified',
              });
              return { success: true, leadId: id };
            } catch (error) {
              console.error('[sales-agent] captureLead failed:', error?.message || error);
              // The agent must not tell the prospect their details were saved
              // when they were not.
              return { success: false, message: 'Not recorded. Ask them to sign up directly.' };
            }
          },
        }),
      },
    });

    return NextResponse.json({ text: result.text, model: `${provider}:${id}` });
  } catch (error) {
    const authProblem = isProviderAuthError(error);
    console.error(`[sales-agent] generation failed (provider=${provider}, authProblem=${authProblem}):`, error?.message || error);
    // Previously the raw provider error was returned to the visitor verbatim,
    // which is both unhelpful and leaks infrastructure detail.
    return NextResponse.json({
      text: "Something on my side just failed. Sign up at app.getstaffai.com/portal/signup and the Staff AI team will make sure you're looked after.",
      degraded: true,
    });
  }
}
