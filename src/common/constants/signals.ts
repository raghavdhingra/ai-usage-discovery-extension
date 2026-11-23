import type { SignalDefinition, SignalId } from '@/common/types/site';

export const SIGNALS: Record<SignalId, SignalDefinition> = {
  'ai-word': { label: 'AI word', weight: 3 },
  'prompt-wording': { label: 'Prompt wording', weight: 2 },
  'model-picker': { label: 'Model picker', weight: 2 },
  'ai-nearby': { label: 'AI nearby', weight: 1 },
  'send-control': { label: 'Send control', weight: 2 },
};

export const AI_SCORE_THRESHOLD = 5;

export const AI_BUTTON_CONFIDENCE = 50;
