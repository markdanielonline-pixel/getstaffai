import { generateText, stepCountIs, tool } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { salesModel, isProviderAuthError } from '@/lib/sales/model';
import { SALES_AGENT_FACTS, SHARED_STYLE } from '@/lib/sales/product-knowledge';

export const maxDuration = 30;

// This is the AUTHENTICATED Customer Success agent. It is deliberately a
// different agent from the public sales agent at /api/chat: it knows who it is
// talking to and what their workforce is actually doing, and it does not sell.
const SUCCESS_SYSTEM_PROMPT = `You are Staff AI's Customer Success agent, talking to an existing, signed-in Staff AI customer. You are not a salesperson and not a ticket form.

Your job is to get the customer unstuck. In order:
1. Answer the question directly using what you know about Staff AI and about this customer's actual account state, which is given to you below.
2. If something is genuinely wrong with their account, say what is wrong in plain language and what happens next.
3. If you cannot resolve it, raise it yourself with the escalate tool. Never tell a customer to "contact support" - you are support, and escalation is your job, not theirs.

${SALES_AGENT_FACTS}

OPERATIONAL GUIDANCE YOU CAN GIVE:
- Where things live: Conversations is where they talk to their Executive Assistant. AI Workforce is where they hire and dismiss employees. Settings and Support covers billing.
- A workforce that is still setting up resolves itself; provisioning continues on its own and the dashboard keeps checking.
- Hiring installs a real AI employee and takes about a minute. Dismissing removes that employee's runtime.
- Billing, cancellation and invoices are managed from Settings and Support.

HONESTY:
- If their account state below contradicts what they are describing, trust the account state and say what you see.
- Never claim to have taken an action you have not taken. The only action you can take is raising an escalation.
- Never invent features. If it is not in what Staff AI does above, say it is not available yet.

${SHARED_STYLE}`;

function accountSummary({ ceo, organization, employees }) {
  const lines = [
    `Customer: ${ceo.name || 'unknown'} (${ceo.email})`,
    `Account status: ${ceo.is_founder ? 'founder / internal' : ceo.status}`,
    organization
      ? `Active company: ${organization.name} (workforce ${organization.workforce_status || 'unknown'})`
      : 'Active company: none yet',
  ];
  if (employees?.length) {
    lines.push('Employees:');
    for (const e of employees) {
      lines.push(`  - ${e.name}, ${e.title || e.role}, lifecycle ${e.status}, runtime ${e.provision_runtime_status}${e.provision_error ? `, last error: ${e.provision_error}` : ''}`);
    }
  } else {
    lines.push('Employees: none yet');
  }
  return lines.join('\n');
}

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  let payload;
  try { payload = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  if (messages.length === 0) return NextResponse.json({ error: 'A message is required' }, { status: 400 });

  const admin = await createAdminClient();
  const { data: ceo } = await admin.from('ceos')
    .select('id, name, email, status, is_founder, org_id').eq('id', user.id).single();
  if (!ceo) return NextResponse.json({ error: 'No account found' }, { status: 404 });

  const [{ data: organization }, { data: employees }] = await Promise.all([
    ceo.org_id
      ? admin.from('organizations').select('id, name, workforce_status').eq('id', ceo.org_id).maybeSingle()
      : Promise.resolve({ data: null }),
    ceo.org_id
      ? admin.from('employees').select('name, title, role, status, provision_runtime_status, provision_error')
          .eq('org_id', ceo.org_id).neq('status', 'alumni').order('created_at')
      : Promise.resolve({ data: [] }),
  ]);

  const { model, provider, id } = salesModel();
  if (!model) {
    return NextResponse.json({
      text: "I can't reach my systems right now, so I've not been able to look at your account. Use Settings and Support to raise this and the Staff AI team will pick it up.",
      degraded: true,
    });
  }

  try {
    const result = await generateText({
      model,
      system: `${SUCCESS_SYSTEM_PROMPT}\n\nTHIS CUSTOMER'S ACCOUNT RIGHT NOW:\n${accountSummary({ ceo, organization, employees })}`,
      messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content ?? '') })),
      stopWhen: stepCountIs(3),
      tools: {
        escalate: tool({
          description: 'Raise this customer\'s issue with the Staff AI team as an owned support ticket. Use it whenever you cannot resolve the problem yourself.',
          inputSchema: z.object({
            subject: z.string().describe('Short subject line'),
            summary: z.string().describe('What the customer needs and what you already established'),
            category: z.enum(['general', 'billing', 'technical', 'account_access', 'incident']).default('technical'),
            priority: z.enum(['normal', 'urgent']).default('normal'),
          }),
          execute: async (input) => {
            const { data, error } = await admin.from('support_tickets').insert({
              ceo_id: ceo.id,
              org_id: ceo.org_id,
              name: ceo.name || 'Staff AI customer',
              email: ceo.email,
              company_name: organization?.name || null,
              category: input.category,
              priority: input.priority,
              subject: input.subject,
              message: input.summary,
              source: 'customer_success_agent',
              status: 'open',
              metadata: { raised_by: 'customer_success_agent' },
            }).select('id').single();
            if (error) {
              console.error('[success-agent] escalation insert failed:', error.message);
              return { success: false };
            }
            return { success: true, ticketId: data.id };
          },
        }),
      },
    });

    return NextResponse.json({ text: result.text, model: `${provider}:${id}` });
  } catch (error) {
    console.error(`[success-agent] generation failed (provider=${provider}, auth=${isProviderAuthError(error)}):`, error?.message || error);
    return NextResponse.json({
      text: "Something on my side just failed, so I couldn't answer that properly. Raise it in Settings and Support and the team will take it from there.",
      degraded: true,
    });
  }
}
