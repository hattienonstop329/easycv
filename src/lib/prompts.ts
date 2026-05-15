// Daily writing prompts cycle by day-of-year so the same prompt is stable for a whole day.

export const PROMPTS: ReadonlyArray<string> = [
  'rewrite your weakest bullet today.',
  'add a number to one bullet — money, percent, headcount, time.',
  'cut one filler word from your summary.',
  'turn one "responsible for" into a strong verb.',
  'read your bullets aloud — fix any that don\'t sound human.',
  'is every bullet starting with a verb? if not, fix one.',
  'pick your favorite project — make its description shorter.',
  'add one specific outcome to your most recent job.',
  'check that your top job uses past or present tense consistently.',
  'drop one cliché ("team player", "results-driven", "passionate").',
  'is your name spelled correctly? double-check.',
  'rewrite the first sentence of your summary as if you were writing to a friend.',
  'count the bullets in your most recent job — five or six is the sweet spot.',
  'one bullet should tell a story with a beginning, middle, and end. find it.',
  'replace one weak verb with a louder one: "helped" → "led", "worked on" → "shipped".',
  'add a link to a project you\'re proud of.',
  'if you removed one section, which would it be? consider hiding it.',
  'check that every date format matches (Jan 2022 vs 01/2022 — pick one).',
];

export function todaysPrompt(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const doy = Math.floor(diff / (1000 * 60 * 60 * 24));
  return PROMPTS[doy % PROMPTS.length];
}
