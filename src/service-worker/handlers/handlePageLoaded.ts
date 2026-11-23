import type { HostnamePayload, PageLoadedResult } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';
import { matchDomain } from '@/service-worker/detection/matchDomain';
import { saveVisits } from '@/service-worker/saveVisits';

export async function handlePageLoaded({ hostname }: HostnamePayload): Promise<PageLoadedResult> {
  const tool = matchDomain(hostname);
  if (!tool) return { isAi: false };

  const visit: AiVisit = {
    visitId: crypto.randomUUID(),
    toolId: tool.toolId,
    name: tool.name,
    category: tool.category,
    hostname,
    method: 'domain',
    signals: [],
    detectedAt: Date.now(),
    interacted: false,
    interactionType: null,
    interactions: [],
  };

  await saveVisits((visits) => [...visits, visit]);
  return { isAi: true, visitId: visit.visitId };
}
