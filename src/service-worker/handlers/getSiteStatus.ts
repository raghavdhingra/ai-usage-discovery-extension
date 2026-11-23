import { getVisits } from '@/common/chrome/storage';
import { getActiveTab, sendMessageToTab } from '@/common/chrome/tabs';
import { MESSAGE, type PageInfo } from '@/common/types/messages';
import type { SiteStatus } from '@/common/types/site';
import { getLastInteractionAt } from '@/common/utils/interactions';
import { matchDomain } from '@/service-worker/detection/matchDomain';

const RETRY_INTERVAL_MS = 300;
const RETRY_TIMEOUT_MS = 2000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function askTabForPageInfo(tabId: number): Promise<PageInfo | null> {
  try {
    const info = await sendMessageToTab(tabId, MESSAGE.GET_PAGE_INFO);
    return info?.hostname ? info : null;
  } catch {
    return null;
  }
}

async function getActivePageInfo(): Promise<PageInfo | null> {
  const giveUpAt = Date.now() + RETRY_TIMEOUT_MS;

  while (true) {
    const tab = await getActiveTab();
    if (!tab) return null;

    const info = await askTabForPageInfo(tab.id);
    if (info) return info;

    if (!tab.isLoading || Date.now() >= giveUpAt) return null;
    await wait(RETRY_INTERVAL_MS);
  }
}

export async function getSiteStatus(): Promise<SiteStatus> {
  const info = await getActivePageInfo();
  if (!info) return { status: 'unsupported' };

  const { hostname, signalResult } = info;
  const visits = await getVisits();
  const tool = matchDomain(hostname);

  if (tool) {
    return {
      status: 'ai',
      hostname,
      name: tool.name,
      category: tool.category,
      method: 'domain',
      signals: [],
      confidence: 100,
      lastUsedAt: getLastInteractionAt(visits.filter((visit) => visit.toolId === tool.toolId)),
    };
  }

  if (signalResult) {
    const usedTimes = visits
      .filter((visit) => visit.toolId === hostname && visit.interacted)
      .map((visit) => visit.detectedAt);

    return {
      status: 'ai',
      hostname,
      name: hostname,
      category: 'Embedded AI',
      method: 'signal',
      signals: signalResult.signals,
      confidence: signalResult.confidence,
      lastUsedAt: usedTimes.length > 0 ? Math.max(...usedTimes) : null,
    };
  }

  return { status: 'not-ai', hostname, signals: [], confidence: 0 };
}
