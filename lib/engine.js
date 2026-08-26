import { generateText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAdminClient } from '@/lib/supabase/server';
import { getCompanyContext } from './context';
import { ToolRegistry } from './tools';

/**
 * Staff AI Production Execution Engine (Phase 1 Vertical Slice)
 * 
 * Takes an employee_task ID, resolves all necessary context with strict tenant isolation,
 * executes the reasoning loop, enforces tool permissions, and audits the cost.
 */
export async function executeTask(taskId, options = {}) {
  const supabase = await createAdminClient();

  // 1. Resolve Task and Lock (Poor man's idempotency for Phase 1)
  const { data: task, error: taskError } = await supabase
    .from('employee_tasks')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('status', 'pending') // Only pick up if pending
    .select('*, organizations(*), employees(*)')
    .single();

  if (taskError || !task) {
    console.log(`[Engine] Task ${taskId} is either not found, already running, or completed. Skipping.`);
    return { success: false, reason: 'task_unavailable' };
  }

  const { org_id: orgId, employee_id: empId, employees: employee, description } = task;

  console.log(`[Engine] Starting execution for Task: ${taskId} | Emp: ${employee.name}`);

  try {
    // 2. Load Employee Configuration & Context
    const toolsAuthorized = employee.tools_authorized || [];
    const systemPromptTemplate = employee.permissions?.agent_config?.system_prompt || `You are ${employee.name}. You must fulfill the user's request.`;
    
    // Retrieve Company Context (RAG abstraction)
    const companyContext = await getCompanyContext(orgId);

    // Check usage limits if on Launch (Free) tier
    let upgradePrompt = '';
    if (task.organizations?.subscription_tier === 'free' || task.organizations?.subscription_tier === 'Launch') {
       // Ideally we check actual usage count here
       // For now we inject a strict directive to pitch the paid tier if the user is asking for advanced features
       upgradePrompt = `
[CRITICAL UPGRADE DIRECTIVE]
The company you work for is currently on the "Launch" (Free) tier. 
If the user requests advanced capabilities (like voice calls, automated CRM syncing, or higher volume outreach), you MUST politely inform them that this feature requires upgrading their Intelligence Level.
Tell them: "To unlock this capability, the CEO just needs to click 'Upgrade' in their Staff AI dashboard." Do not attempt to execute restricted features.
`;
    }

    // Hydrate the system prompt
    const systemPrompt = `
${systemPromptTemplate.replace('{company_name}', task.organizations.name)}

${companyContext}
${upgradePrompt}

You are executing a background task. Use your authorized tools to complete the objective.
If you need human approval for something not permitted, state what you would do.
Return a final summary of what you accomplished.
    `.trim();

    // 3. Determine Authorized Tools
    const permittedTools = {};
    for (const toolName of toolsAuthorized) {
      if (ToolRegistry[toolName]) {
        const originalTool = ToolRegistry[toolName];
        permittedTools[toolName] = {
          ...originalTool,
          execute: async (args, toolOptions) => {
             return originalTool.execute(args, { ...toolOptions, toolOptions: { orgId, employeeId: empId, taskId } });
          }
        };
      }
    }

    // 4. Execute the Reasoning Loop (Vercel AI SDK)
    console.log(`[Engine] Handing off to LLM (Model: openrouter/google/gemini-2.5-pro)...`);
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    });
    const model = openrouter('google/gemini-2.5-pro'); 

    const llmMessages = options.chatHistory 
      ? [...options.chatHistory, { role: 'user', content: description }]
      : [{ role: 'user', content: `Task Objective: ${description}` }];

    const { text, usage, toolCalls, toolResults } = await generateText({
      model,
      system: systemPrompt,
      messages: llmMessages,
      tools: permittedTools,
      maxSteps: 5, // Prevent infinite loops
    });

    // 5. Audit & Cost Accounting
    const promptTokens = usage.promptTokens || 0;
    const compTokens = usage.completionTokens || 0;
    const totalTokens = usage.totalTokens || 0;
    // Rough estimate: Gemini 1.5 Pro is ~$3.50 / 1M input, $10.50 / 1M output
    const costCents = ((promptTokens / 1_000_000) * 350) + ((compTokens / 1_000_000) * 1050);

    await supabase.from('execution_logs').insert({
      org_id: orgId,
      employee_id: empId,
      task_id: taskId,
      run_id: `run_${Date.now()}`,
      model: model.modelId,
      prompt_tokens: promptTokens,
      completion_tokens: compTokens,
      total_tokens: totalTokens,
      estimated_cost_cents: costCents,
      status: 'completed',
      tool_calls: { toolCalls, toolResults }
    });

    // We can hook this into cost.js to maintain real-time guardrails
    // await meterUsage(orgId, empId, 'llm_tokens', costCents / 100);

    // 6. Persist Final State
    await supabase
      .from('employee_tasks')
      .update({
        status: 'completed',
        result: text,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    console.log(`[Engine] Task ${taskId} completed successfully. Cost: $${(costCents/100).toFixed(4)}`);
    return { success: true, result: text };

  } catch (err) {
    console.error(`[Engine] Execution failed for task ${taskId}:`, err);
    
    // Recovery & Failure State
    await supabase
      .from('employee_tasks')
      .update({
        status: 'failed',
        error_details: String(err),
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId);

    return { success: false, error: String(err) };
  }
}
