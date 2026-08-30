// ════════════════════════════════════════════════════════════════════
// LLM ROUTER: 4-TIER COST-OPTIMIZED ROUTING
// ════════════════════════════════════════════════════════════════════
// Ported from staffai-web/lib/llm/router.ts. Pricing tier ceilings:
// Venture -> DeepSeek R1 max. Executive -> Grok 4 max. Prestige -> Claude Sonnet.
// ════════════════════════════════════════════════════════════════════

function scoreComplexity(messages, taskType) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const text = lastUserMsg.toLowerCase();

  if (taskType === 'ea_first_contact') return 'expert';
  if (taskType === 'gm_board_report') return 'expert';
  if (taskType === 'employee_elevation') return 'expert';
  if (taskType === 'disciplinary_action') return 'expert';
  if (taskType === 'ceo_deep_decision') return 'expert';
  if (taskType === 'ea_relationship' || taskType === 'gm_strategy') return 'expert';

  if (taskType === 'tech_support') return 'high';
  if (taskType === 'board_report') return 'high';

  const highComplexMarkers = [
    'strategy', 'strategic', 'recommend', 'pattern', 'integration', 'architecture',
    'negotiat', 'escalat', 'dispute', 'legal', 'financial', 'contract',
    'competitive analysis', 'market', 'forecast', 'projection'
  ];
  let highScore = 0;
  for (const m of highComplexMarkers) if (text.includes(m)) highScore += 1;

  const reasoningMarkers = [
    'think through', 'analyse', 'analyze', 'plan', 'review', 'evaluate',
    'compare', 'why', 'how should', 'what would', 'decision',
    'pros and cons', 'option', 'propose', 'outline', 'approach',
    'code', 'technical', 'system', 'debug', 'logic'
  ];
  let reasoningScore = 0;
  for (const m of reasoningMarkers) if (text.includes(m)) reasoningScore += 1;

  const smallTalkMarkers = [
    'hi', 'hello', 'good morning', 'good afternoon', 'good evening',
    'how are you', 'how are things', 'whats up', 'thanks', 'thank you',
    'see you', 'cheers', 'catch you', 'talk later', 'talk soon',
    'yes', 'no', 'ok', 'okay', 'got it', 'understood', 'sounds good',
    'cool', 'great', 'awesome', 'perfect', 'looks good',
    'what time', 'when', 'today', 'tomorrow', 'this week', 'next week',
    'reminder', 'remind me', 'update', 'status', 'what happened'
  ];
  let smallTalkScore = 0;
  for (const m of smallTalkMarkers) if (text.includes(m)) smallTalkScore += 1;

  const isLikelySmallTalk = lastUserMsg.length < 200 && smallTalkScore >= 2;

  if (highScore >= 2) return 'high';
  if (reasoningScore >= 2) return 'reasoning';
  if (isLikelySmallTalk) return 'small_talk';

  const userTurns = messages.filter(m => m.role === 'user').length;
  if (userTurns > 4) return 'reasoning';
  if (lastUserMsg.length > 300) return 'reasoning';

  return 'small_talk';
}

const MODELS = {
  deepseek_v3: 'deepseek/deepseek-chat-v3-0324',
  deepseek_r1: 'deepseek/deepseek-r1',
  grok4: 'grok-4',
  claude_sonnet: 'claude-sonnet-4-6',
  openrouter_reliable: 'openai/gpt-4o-mini',
  // Free-tier models — GLM-5.2 is primary, gemma + gemini are fallbacks
  glm_free: 'z-ai/glm-5.2:free',
  openrouter_free: 'google/gemma-4-31b-it:free',
  openrouter_gemini: 'google/gemini-2.5-flash',
};

function selectModel(level, complexity) {
  if (level === 'venture' || level === 'provisional') {
    if (complexity === 'small_talk') return { model: MODELS.deepseek_v3, provider: 'openrouter' };
    return { model: MODELS.deepseek_r1, provider: 'openrouter' };
  }

  if (level === 'executive') {
    if (complexity === 'small_talk') return { model: MODELS.deepseek_v3, provider: 'openrouter' };
    if (complexity === 'reasoning') return { model: MODELS.deepseek_r1, provider: 'openrouter' };
    return { model: MODELS.grok4, provider: 'xai' };
  }

  if (level === 'prestige') {
    if (complexity === 'small_talk') return { model: MODELS.deepseek_v3, provider: 'openrouter' };
    if (complexity === 'reasoning') return { model: MODELS.deepseek_r1, provider: 'openrouter' };
    if (complexity === 'high') return { model: MODELS.grok4, provider: 'xai' };
    return { model: MODELS.claude_sonnet, provider: 'anthropic' };
  }

  return { model: MODELS.deepseek_v3, provider: 'openrouter' };
}

async function callOpenRouter(model, system, messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://getstaffai.com',
      'X-Title': 'StaffAI',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.75,
      max_tokens: 1500,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callAnthropic(model, system, messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      system,
      messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.content[0].text;
}

async function callXAI(model, system, messages) {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.75,
      max_tokens: 1500,
    }),
  });
  if (!res.ok) throw new Error(`xAI error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callLLM(req) {
  const complexity = scoreComplexity(req.messages, req.taskType);
  const { model, provider } = req.forceModel
    ? { model: req.forceModel, provider: 'openrouter' }
    : selectModel(req.level, complexity);

  console.log(`[LLM Router] level=${req.level} task=${req.taskType} complexity=${complexity} model=${model} provider=${provider}`);

  try {
    switch (provider) {
      case 'anthropic':
        return await callAnthropic(model, req.system, req.messages);
      case 'xai':
        return await callXAI(model, req.system, req.messages);
      case 'openrouter':
      default:
        return await callOpenRouter(model, req.system, req.messages);
    }
  } catch (err) {
    console.error(`[LLM Router] Primary failed (${provider}/${model}):`, err.message);

    // Tier-aware fallback chain — never jump above the tier ceiling.
    const chain = req.level === 'prestige'
      ? [() => callXAI(MODELS.grok4, req.system, req.messages), () => callOpenRouter(MODELS.deepseek_r1, req.system, req.messages), () => callOpenRouter(MODELS.deepseek_v3, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_reliable, req.system, req.messages), () => callOpenRouter(MODELS.glm_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_gemini, req.system, req.messages)]
      : req.level === 'executive'
      ? [() => callOpenRouter(MODELS.deepseek_r1, req.system, req.messages), () => callOpenRouter(MODELS.deepseek_v3, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_reliable, req.system, req.messages), () => callOpenRouter(MODELS.glm_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_gemini, req.system, req.messages)]
      : [() => callOpenRouter(MODELS.deepseek_r1, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_reliable, req.system, req.messages), () => callOpenRouter(MODELS.glm_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_free, req.system, req.messages), () => callOpenRouter(MODELS.openrouter_gemini, req.system, req.messages)];

    for (const attempt of chain) {
      try {
        return await attempt();
      } catch (fallbackErr) {
        console.error('[LLM Router] Fallback failed:', fallbackErr.message);
      }
    }

    throw new Error(`[LLM Router] All models failed for level=${req.level} task=${req.taskType} complexity=${complexity}. Primary error: ${err.message}`);
  }
}
