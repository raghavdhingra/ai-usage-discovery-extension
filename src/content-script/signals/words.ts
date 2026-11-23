export const AI_WORDS = ['ai', 'copilot', 'gemini', 'generativeai', 'claude', 'gpt'];

export const PROMPT_STARTS = ['ask', 'describe'];

export const MODEL_PICKER_WORDS = ['model', 'claude', 'gpt', 'gemini', 'sonnet', 'opus'];

export const NEARBY_AI_WORDS = ['ai', 'agent', 'gemini', 'generativeai'];

export const SEND_WORDS = ['send', 'submit'];

export function hasWord(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some((word) => new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`).test(lower));
}
