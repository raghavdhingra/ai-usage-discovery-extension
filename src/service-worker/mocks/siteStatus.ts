import type { SiteStatus } from '@/common/types/site';

const MINUTE = 60 * 1000;

export const MOCK_DELAY_MS = 600;

export type MockSiteStatusKey = 'aiByDomain' | 'aiBySignal' | 'notAi' | 'unsupported';

export const ACTIVE_MOCK: MockSiteStatusKey = 'aiByDomain';

export function getMockSiteStatus(key: MockSiteStatusKey): SiteStatus {
  switch (key) {
    case 'aiByDomain':
      return {
        status: 'ai',
        hostname: 'chatgpt.com',
        name: 'ChatGPT',
        category: 'Chat assistant',
        method: 'domain',
        signals: [],
        confidence: 'high',
        lastUsedAt: Date.now() - 2 * MINUTE,
      };
    case 'aiBySignal':
      return {
        status: 'ai',
        hostname: 'notion.so',
        name: 'Notion',
        category: 'Embedded AI',
        method: 'signal',
        signals: ['ai-network', 'keyword', 'prompt-input'],
        confidence: 'medium',
        lastUsedAt: null,
      };
    case 'notAi':
      return {
        status: 'not-ai',
        hostname: 'wikipedia.org',
        signals: ['keyword'],
        confidence: 'low',
      };
    case 'unsupported':
      return { status: 'unsupported' };
  }
}
