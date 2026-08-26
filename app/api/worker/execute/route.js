import { NextResponse } from 'next/server';
import { executeTask } from '@/lib/engine';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const { taskId, orgId, employeeId, description, idempotencyKey } = await req.json();

    // The caller can either pass an existing taskId, OR pass the raw intent and we create the task here.
    let targetTaskId = taskId;

    const supabase = await createAdminClient();

    if (!targetTaskId) {
      if (!orgId || !employeeId || !description || !idempotencyKey) {
        return NextResponse.json({ error: 'Missing required fields to create a task' }, { status: 400 });
      }

      // Idempotency Check
      const { data: existingTask } = await supabase
        .from('employee_tasks')
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingTask) {
        return NextResponse.json({ 
          message: 'Task already exists', 
          taskId: existingTask.id, 
          status: existingTask.status 
        });
      }

      // Create new task
      const { data: newTask, error } = await supabase
        .from('employee_tasks')
        .insert({
          org_id: orgId,
          employee_id: employeeId,
          description: description,
          idempotency_key: idempotencyKey,
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (error) throw error;
      targetTaskId = newTask.id;
    }

    // In a real serverless env like Vercel, we would use `waitUntil(executeTask(targetTaskId))` 
    // to return the 202 Accepted instantly while the background function runs.
    // Since we are running in a long-lived Node.js process (Next.js server), 
    // we can just fire and forget the Promise.
    executeTask(targetTaskId).catch(err => console.error("Background task failed:", err));

    return NextResponse.json({ 
      success: true, 
      message: 'Task queued for execution', 
      taskId: targetTaskId 
    }, { status: 202 });

  } catch (err) {
    console.error("[Worker API Error]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
