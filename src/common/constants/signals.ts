import type { SignalDefinition, SignalId } from '@/common/types/site';

export const SIGNALS: Record<SignalId, SignalDefinition> = {
  'ai-network': { id: 'ai-network', label: 'AI network requests', weight: 2 },
  'ai-script': { id: 'ai-script', label: 'AI scripts and iframes', weight: 2 },
  'ai-disclaimer': { id: 'ai-disclaimer', label: 'AI disclaimer', weight: 2 },
  keyword: { id: 'keyword', label: 'Keyword dictionary', weight: 1 },
  'prompt-input': { id: 'prompt-input', label: 'Prompt input', weight: 1 },
  'chat-controls': { id: 'chat-controls', label: 'Chat controls', weight: 1 },
};

export const AI_THRESHOLD = 3;
