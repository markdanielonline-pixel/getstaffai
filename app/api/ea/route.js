import { NextResponse } from 'next/server';
import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import * as chrono from 'chrono-node';
import { DateTime } from 'luxon';
import { publishEvent } from '@/lib/events';
import { getCEO } from '@/app/actions/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const ceo = await getCEO();
    if (!ceo || !ceo.org_id) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const { messages } = await req.json();
    const orgId = ceo.org_id;

    const systemPrompt = `You are the Executive Assistant (EA) for ${ceo.name || 'the CEO'}. 
You act as the Command Center interface. You can delegate tasks to other departments, 
approve or reject pending items, and manage the CEO's schedule. 
Always be concise, professional, and highly capable.`;

    const model = google('gemini-2.5-flash');

    const result = await generateText({
      model,
      messages,
      system: systemPrompt,
      tools: {
        delegateTask: tool({
          description: "Delegate a task to a specific department or employee.",
          parameters: z.object({
            assigneeId: z.string().describe("The UUID of the department or employee"),
            taskDescription: z.string().describe("Detailed description of the task to be done")
          }),
          execute: async ({ assigneeId, taskDescription }) => {
            const supabase = await createAdminClient();
            const { data: assignee, error } = await supabase
              .from('employees')
              .select('id, org_id')
              .eq('id', assigneeId)
              .maybeSingle();
            
            if (error || !assignee || assignee.org_id !== orgId) {
              return `Error: Assignee ID ${assigneeId} is invalid or not in your organization.`;
            }

            console.log(`[EA] Delegating to ${assigneeId}: ${taskDescription}`);
            await publishEvent({
              event_type: 'task.assigned',
              org_id: orgId,
              source: 'ea_router',
              data: { assignee_id: assigneeId, task: taskDescription }
            });
            return `Successfully assigned the task. They will notify you upon completion.`;
          }
        }),
        handleApproval: tool({
          description: "Approve or reject a pending request.",
          parameters: z.object({
            eventId: z.string().describe("The UUID of the pending approval event"),
            decision: z.enum(['approve', 'reject', 'edit']).describe("The CEO's decision"),
            reason: z.string().optional().describe("Reason for the decision or edit details")
          }),
          execute: async ({ eventId, decision, reason }) => {
            const supabase = await createAdminClient();
            
            const { data: event, error } = await supabase
              .from('staffai_events')
              .select('id, org_id')
              .eq('id', eventId)
              .maybeSingle();

            if (error || !event || event.org_id !== orgId) {
              return `Error: Event ID ${eventId} is invalid or not in your organization.`;
            }

            await supabase.from('staffai_events').update({ status: 'completed' }).eq('id', eventId);
            
            await publishEvent({
              event_type: 'approval.decided',
              org_id: orgId,
              source: 'ea_router',
              data: { original_event_id: eventId, decision, reason }
            });
            
            return `Approval decision recorded as '${decision}'. The operation will resume.`;
          }
        }),
        scheduleReminder: tool({
          description: "Schedule a durable reminder or follow-up for the CEO.",
          parameters: z.object({
            timeString: z.string().describe("When to remind, e.g., 'Tomorrow at 9 AM'"),
            topic: z.string().describe("What to remind the CEO about")
          }),
          execute: async ({ timeString, topic }) => {
            const supabase = await createAdminClient();

            const now = DateTime.now().setZone(ceo.timezone || 'UTC');
            if (!now.isValid) return 'Error scheduling reminder: your account timezone is invalid.';
            const parsed = chrono.parseDate(timeString, { instant: now.toJSDate(), timezone: now.offset }, { forwardDate: true });
            if (!parsed) return `I could not understand the reminder time "${timeString}". Please include a date and time.`;
            const scheduledFor = DateTime.fromJSDate(parsed).toUTC();
            if (scheduledFor <= DateTime.utc()) return 'The reminder time must be in the future.';

            const { error } = await supabase.from('employee_tasks').insert({
              org_id: orgId,
              description: topic,
              task_type: 'reminder',
              status: 'scheduled',
              scheduled_for: scheduledFor.toISO(),
              metadata: { topic, requested_time: timeString, timezone: ceo.timezone || 'UTC' },
              idempotency_key: `reminder-${randomUUID()}`
            });

            if (error) {
               return `Error scheduling reminder: ${error.message}`;
            }

            return `I have scheduled a durable reminder for "${topic}" at ${scheduledFor.setZone(ceo.timezone || 'UTC').toFormat('DDD t ZZZZ')}.`;
          }
        })
      }
    });

    return NextResponse.json({ content: result.text });
  } catch (err) {
    console.error("EA API Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
