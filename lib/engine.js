/**
 * DEAD CODE. Nothing imports this module.
 *
 * It is kept only for reference. Its GLM default below is not a model policy
 * and never runs: the models actually in use are recorded in STATE.md, and
 * repair work is DeepSeek V4 Pro by standing instruction. Do not read the
 * constant under this comment as a decision anyone made recently.
 */
import { createAdminClient } from '@/lib/supabase/server';
import { getCompanyContext } from './context';
import { ToolRegistry } from './tools';

/**
 * Staff AI Production Execution Engine
 *
 * Uses a direct OpenRouter fetch loop instead of the Vercel AI SDK generateText.
 * Root cause for the switch: AI SDK Zod schema validation strips tool arguments
 * returned by OpenRouter before they reach execute(). Raw API calls return fully
 * populated args. All agent behavior, prompts, tools, and cost accounting are preserved.
 *
 * Model chain: ENGINE_MODEL env var → GLM-5.2 Free → gemini-flash (fallback)
 */

// ── Provider config ──────────────────────────────────────────────────────────
const PRIMARY_MODEL   = process.env.ENGINE_MODEL   || 'z-ai/glm-5.2:free';
const FALLBACK_MODEL  = process.env.ENGINE_FALLBACK || 'google/gemini-2.5-flash';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

/** Build the tools array in OpenRouter's expected format from ToolRegistry entries. */
function buildToolDefs(permittedTools) {
  return Object.entries(permittedTools).map(([name, toolObj]) => {
    // Extract JSON schema from the tool's parameters (zod schema or jsonSchema wrapper)
    let parameters;
    try {
      // Zod schema — convert to JSON schema
      const zodSchema = toolObj.parameters;
      if (zodSchema?._def) {
        parameters = zodSchemaToJsonSchema(zodSchema);
      } else if (zodSchema?.jsonSchema) {
        // jsonSchema() wrapper
        parameters = zodSchema.jsonSchema;
      } else {
        parameters = { type: 'object', properties: {} };
      }
    } catch {
      parameters = { type: 'object', properties: {} };
    }
    return { type: 'function', function: { name, description: toolObj.description || name, parameters } };
  });
}

/** Minimal Zod→JSON Schema converter (handles the shapes used in ToolRegistry). */
function zodSchemaToJsonSchema(zodSchema) {
  const shape = zodSchema._def?.shape?.() || {};
  const properties = {};
  const required = [];
  for (const [key, field] of Object.entries(shape)) {
    properties[key] = { type: 'string', description: field._def?.description || key };
    // Mark required unless optional
    if (!field.isOptional()) required.push(key);
  }
  return { type: 'object', properties, required, additionalProperties: false };
}

/** Single OpenRouter API call — returns the raw message object. */
async function callOpenRouter(model, messages) {
  const res = await fetch(OPENROUTER_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://getstaffai.com',
      'X-Title': 'StaffAI',
    },
    body: JSON.stringify({
      model,
      messages,
      tool_choice: 'auto',
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  if (!choice) throw new Error('OpenRouter returned no choices');

  return { message: choice.message, usage: data.usage, finishReason: choice.finish_reason };
}

/**
 * Multi-step agentic loop using raw OpenRouter fetch.
 * Handles tool calling, execution, and result injection across up to maxSteps turns.
 */
async function runAgentLoop(model, system, messages, toolDefs, permittedTools, maxSteps = 5) {
  const conversation = [{ role: 'system', content: system }, ...messages];
  let totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
  const allToolCalls = [];
  const allToolResults = [];
  let finalText = '';

  // Build request body — only include tools if we have some
  const hasTools = toolDefs.length > 0;

  for (let step = 0; step < maxSteps; step++) {
    const reqBody = {
      model,
      messages: conversation,
      max_tokens: 2048,
    };
    if (hasTools) {
      reqBody.tools = toolDefs;
      reqBody.tool_choice = 'auto';
    }

    const res = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://getstaffai.com',
        'X-Title': 'StaffAI',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenRouter ${res.status}: ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    if (!choice) throw new Error('OpenRouter returned no choices');

    // Accumulate usage
    if (data.usage) {
      totalUsage.prompt_tokens     += data.usage.prompt_tokens || 0;
      totalUsage.completion_tokens += data.usage.completion_tokens || 0;
      totalUsage.total_tokens      += data.usage.total_tokens || 0;
    }

    const assistantMsg = choice.message;
    conversation.push(assistantMsg);

    // No tool calls — model is done
    if (!assistantMsg.tool_calls?.length) {
      finalText = assistantMsg.content || '';
      console.log(`[Engine] Step ${step + 1}: LLM finished (no more tool calls). text="${finalText?.slice(0, 100)}"`);
      break;
    }

    // Execute all tool calls in this step
    const toolResultMessages = [];
    for (const tc of assistantMsg.tool_calls) {
      const toolName = tc.function.name;
      let parsedArgs = {};
      try { parsedArgs = JSON.parse(tc.function.arguments || '{}'); } catch {}

      console.log(`[Engine] Step ${step + 1}: Tool call → ${toolName}(${JSON.stringify(parsedArgs)})`);

      let toolResult = { success: false, error: 'Tool not found' };
      try {
        if (permittedTools[toolName]?.execute) {
          toolResult = await permittedTools[toolName].execute(parsedArgs);
        } else {
          console.warn(`[Engine] Tool ${toolName} not in permittedTools`);
        }
      } catch (e) {
        toolResult = { success: false, error: e.message };
        console.error(`[Engine] Tool ${toolName} threw: ${e.message}`);
      }

      allToolCalls.push({ toolName, input: parsedArgs, toolCallId: tc.id });
      allToolResults.push({ toolName, input: parsedArgs, output: toolResult, toolCallId: tc.id });

      toolResultMessages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify(toolResult),
      });
    }

    // Inject tool results and continue loop
    conversation.push(...toolResultMessages);
  }

  return { text: finalText, toolCalls: allToolCalls, toolResults: allToolResults, usage: totalUsage };
}

// ── Main exported function ───────────────────────────────────────────────────
export async function executeTask(taskId, options = {}) {
  const supabase = await createAdminClient();

  // 1. Resolve Task and Lock
  const { data: task, error: taskError } = await supabase
    .from('employee_tasks')
    .update({ status: 'running', updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('status', 'pending')
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
    const systemPromptTemplate = employee.permissions?.agent_config?.system_prompt
      || `You are ${employee.name}. You must fulfill the user's request.`;

    const companyContext = await getCompanyContext(orgId);

    let upgradePrompt = '';
    if (task.organizations?.subscription_tier === 'free' || task.organizations?.subscription_tier === 'Launch') {
      upgradePrompt = `
[CRITICAL UPGRADE DIRECTIVE]
The company you work for is currently on the "Launch" (Free) tier.
If the user requests advanced capabilities (like voice calls, automated CRM syncing, or higher volume outreach), you MUST politely inform them that this feature requires upgrading their Intelligence Level.
Tell them: "To unlock this capability, the CEO just needs to click 'Upgrade' in their Staff AI dashboard." Do not attempt to execute restricted features.
`;
    }

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
        permittedTools[toolName] = ToolRegistry[toolName]({ orgId, employeeId: empId, taskId });
      }
    }
    const toolDefs = buildToolDefs(permittedTools);

    // 4. Build conversation messages
    const llmMessages = options.chatHistory
      ? [...options.chatHistory, { role: 'user', content: description }]
      : [{ role: 'user', content: `Task Objective: ${description}` }];

    // 5. Run agentic loop — GLM-5.2 Free with gemini-flash fallback
    let activeModel = PRIMARY_MODEL;
    console.log(`[Engine] Handing off to LLM (Model: openrouter/${activeModel})...`);

    let agentResult;
    try {
      agentResult = await runAgentLoop(activeModel, systemPrompt, llmMessages, toolDefs, permittedTools);
    } catch (primaryErr) {
      console.error(`[Engine] Primary model (${activeModel}) failed: ${primaryErr.message}. Falling back to ${FALLBACK_MODEL}.`);
      activeModel = FALLBACK_MODEL;
      agentResult = await runAgentLoop(activeModel, systemPrompt, llmMessages, toolDefs, permittedTools);
    }

    const { text, toolCalls, toolResults, usage } = agentResult;
    console.log(`[Engine] LLM (${activeModel}) completed. Tools called: ${toolCalls.length}. Text: "${text?.slice(0, 80)}"`);

    // 6. Audit & Cost Accounting
    const promptTokens = usage.prompt_tokens || 0;
    const compTokens   = usage.completion_tokens || 0;
    const totalTokens  = usage.total_tokens || 0;
    const costCents    = ((promptTokens / 1_000_000) * 350) + ((compTokens / 1_000_000) * 1050);

    await supabase.from('execution_logs').insert({
      org_id: orgId,
      employee_id: empId,
      task_id: taskId,
      run_id: `run_${Date.now()}`,
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: compTokens,
      total_tokens: totalTokens,
      estimated_cost_cents: costCents,
      status: 'completed',
      tool_calls: { toolCalls, toolResults },
    });

    // 7. Persist Final State
    await supabase
      .from('employee_tasks')
      .update({ status: 'completed', result: text, updated_at: new Date().toISOString() })
      .eq('id', taskId);

    console.log(`[Engine] Task ${taskId} completed successfully. Cost: $${(costCents / 100).toFixed(4)}`);
    return { success: true, result: text };

  } catch (err) {
    console.error(`[Engine] Execution failed for task ${taskId}:`, err);
    await supabase
      .from('employee_tasks')
      .update({ status: 'failed', error_details: String(err), updated_at: new Date().toISOString() })
      .eq('id', taskId);
    return { success: false, error: String(err) };
  }
}

