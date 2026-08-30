import { NextResponse } from 'next/server';
import { dispatchTaskToAgent, pollProvisionTask } from '@/lib/provision';
import { createAdminClient } from '@/lib/supabase/server';
import { hasValidWorkerAuthorization } from '@/lib/worker-auth';

export async function POST(req) {
  try {
    if (!hasValidWorkerAuthorization(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const taskResult = await supabase.from('employee_tasks')
      .select('id, employee_id, description, idempotency_key, provision_task_id')
      .eq('id', targetTaskId)
      .single();
    if (taskResult.error) throw taskResult.error;

    if (taskResult.data.provision_task_id) {
      pollProvisionTask(taskResult.data.id)
        .catch(err => console.error("Provision task synchronization failed:", err));
    } else {
      try {
        await dispatchTaskToAgent(taskResult.data.employee_id, taskResult.data.description, {
          idempotencyKey: taskResult.data.idempotency_key,
          waitForResult: false,
        });
        pollProvisionTask(taskResult.data.id)
          .catch(err => console.error("Provision task synchronization failed:", err));
      } catch (dispatchError) {
        await supabase.from('employee_tasks').update({
          status: 'failed',
          provision_status: 'unavailable',
          error_details: dispatchError.message,
          provision_last_synced_at: new Date().toISOString(),
        }).eq('id', taskResult.data.id);
        return NextResponse.json({ error: 'Provision runtime unavailable', taskId: taskResult.data.id }, { status: 503 });
      }
    }

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
