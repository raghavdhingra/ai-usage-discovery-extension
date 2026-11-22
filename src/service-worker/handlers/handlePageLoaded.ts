import { getVisits, setVisits } from '@/common/chrome/storage';
import type { HostnamePayload, PageLoadedResult } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';
import { matchDomain } from '@/service-worker/detection/matchDomain';

let writeQueue: Promise<void> = Promise.resolve();

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
  };

  writeQueue = writeQueue.then(async () => {
    const visits = await getVisits();
    await setVisits([...visits, visit]);
  });
  await writeQueue;

  return { isAi: true, visitId: visit.visitId };
}
