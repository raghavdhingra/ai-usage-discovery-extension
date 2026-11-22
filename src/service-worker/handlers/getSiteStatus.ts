import { getVisits } from '@/common/chrome/storage';
import { getActiveTabId, sendMessageToTab } from '@/common/chrome/tabs';
import { MESSAGE } from '@/common/types/messages';
import type { SiteStatus } from '@/common/types/site';
import { matchDomain } from '@/service-worker/detection/matchDomain';

async function getActiveHostname(): Promise<string | null> {
  const tabId = await getActiveTabId();
  if (tabId === undefined) return null;

  try {
    const { hostname } = await sendMessageToTab(tabId, MESSAGE.GET_HOSTNAME);
    return hostname || null;
  } catch {
    return null;
  }
}

export async function getSiteStatus(): Promise<SiteStatus> {
  const hostname = await getActiveHostname();
  if (!hostname) return { status: 'unsupported' };

  const tool = matchDomain(hostname);
  if (!tool) return { status: 'not-ai', hostname, signals: [], confidence: 'none' };

  const lastUsedAt = (await getVisits())
    .filter((visit) => visit.toolId === tool.toolId && visit.interacted)
    .reduce<number | null>((latest, visit) => Math.max(latest ?? 0, visit.detectedAt), null);

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
