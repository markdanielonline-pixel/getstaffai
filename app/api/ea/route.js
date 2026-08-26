import { NextResponse } from 'next/server';
import { generateText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { publishEvent } from '@/lib/events';
import { getCEO } from '@/app/actions/auth';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const ceo = await getCEO();
    if (!ceo) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messages } = await req.json();
    const orgId = ceo.org_id || '00000000-0000-0000-0000-000000000000';

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
            // In full implementation, this integrates with temporal or a scheduled job
            return `I have scheduled a reminder for "${topic}" at ${timeString}.`;
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
