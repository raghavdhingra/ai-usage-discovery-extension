import { getSessionVisitId, setSessionVisitId } from '@/common/chrome/storage';
import type { HostnamePayload, MessageSender, PageLoadedResult } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';
import { matchDomain } from '@/service-worker/detection/matchDomain';
import { saveVisits } from '@/service-worker/saveVisits';

export async function handlePageLoaded(
  { hostname }: HostnamePayload,
  { tabId }: MessageSender,
): Promise<PageLoadedResult> {
  const tool = matchDomain(hostname);
  if (!tool) return { isAi: false };

  if (tabId !== undefined) {
    const sessionVisitId = await getSessionVisitId(tabId, tool.toolId);
    if (sessionVisitId) return { isAi: true, visitId: sessionVisitId };
  }

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
  };

  await saveVisits((visits) => [...visits, visit]);
  if (tabId !== undefined) await setSessionVisitId(tabId, tool.toolId, visit.visitId);

  return { isAi: true, visitId: visit.visitId };
}
