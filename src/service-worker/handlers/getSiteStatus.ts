import { getVisits } from '@/common/chrome/storage';
import { getActiveTab, sendMessageToTab } from '@/common/chrome/tabs';
import { MESSAGE } from '@/common/types/messages';
import type { SiteStatus } from '@/common/types/site';
import { matchDomain } from '@/service-worker/detection/matchDomain';

const RETRY_INTERVAL_MS = 300;
const RETRY_TIMEOUT_MS = 2000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function askTabForHostname(tabId: number): Promise<string | null> {
  try {
    const { hostname } = await sendMessageToTab(tabId, MESSAGE.GET_HOSTNAME);
    return hostname || null;
  } catch {
    return null;
  }
}

async function getActiveHostname(): Promise<string | null> {
  const giveUpAt = Date.now() + RETRY_TIMEOUT_MS;

  while (true) {
    const tab = await getActiveTab();
    if (!tab) return null;

    const hostname = await askTabForHostname(tab.id);
    if (hostname) return hostname;

    if (!tab.isLoading || Date.now() >= giveUpAt) return null;
    await wait(RETRY_INTERVAL_MS);
  }
}

export async function getSiteStatus(): Promise<SiteStatus> {
  const hostname = await getActiveHostname();
  if (!hostname) return { status: 'unsupported' };

  const tool = matchDomain(hostname);
  if (!tool) return { status: 'not-ai', hostname, signals: [], confidence: 'none' };

  const usedTimes = (await getVisits())
    .filter((visit) => visit.toolId === tool.toolId && visit.interacted)
    .map((visit) => visit.detectedAt);
  const lastUsedAt = usedTimes.length > 0 ? Math.max(...usedTimes) : null;

  return {
    status: 'ai',
    hostname,
    name: tool.name,
    category: tool.category,
    method: 'domain',
    signals: [],
    confidence: 'high',
    lastUsedAt,
  };
}
