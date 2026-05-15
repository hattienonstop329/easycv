import { useAIKey } from './ai-store';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';

interface AnthropicResponse {
  content?: { type: string; text?: string }[];
  error?: { type: string; message: string };
}

async function callAnthropic(systemPrompt: string, userPrompt: string, maxTokens = 320): Promise<string> {
  const { apiKey, model } = useAIKey.getState();
  if (!apiKey) throw new Error('No API key set. Open AI settings to add one.');

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      // Required header for direct browser calls (key never leaves the user's machine).
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    let detail = `${res.status} ${res.statusText}`;
    try {
      const body = (await res.json()) as AnthropicResponse;
      if (body.error) detail = body.error.message;
    } catch {
      /* swallow — keep status code */
    }
    throw new Error(detail);
  }

  const body = (await res.json()) as AnthropicResponse;
  const text = body.content?.find((c) => c.type === 'text')?.text;
  if (!text) throw new Error('Empty response from the API.');
  return text.trim();
}

export async function rewriteBullet(bullet: string, jobContext?: string): Promise<string> {
  const system =
    'You are a concise resume editor. You rewrite a single bullet to be tighter, ' +
    'more specific, and start with a strong past-tense action verb. You do not invent ' +
    'numbers; you flag missing impact with "[add a number]" if the bullet has none. ' +
    'You return ONLY the rewritten bullet — no quotes, no preamble, no follow-up.';
  const user = jobContext
    ? `Job context: ${jobContext}\n\nRewrite this resume bullet:\n${bullet}`
    : `Rewrite this resume bullet:\n${bullet}`;
  const out = await callAnthropic(system, user, 220);
  // Strip surrounding quotes if the model added them anyway.
  return out.replace(/^["'`]+|["'`]+$/g, '').trim();
}

export async function rewriteSummary(summary: string, role?: string): Promise<string> {
  const system =
    'You are a concise resume editor. You rewrite a 2-4 sentence professional summary ' +
    'to be sharper and free of cliches ("results-driven", "passionate", etc.). Keep the ' +
    'same factual claims; do not invent metrics. Return ONLY the rewritten summary.';
  const user = role
    ? `Target role: ${role}\n\nRewrite this summary:\n${summary}`
    : `Rewrite this summary:\n${summary}`;
  return callAnthropic(system, user, 320);
}
