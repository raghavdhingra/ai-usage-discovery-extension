import type { AiDetectedPayload, VisitIdPayload } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';
import { saveVisits } from '@/service-worker/saveVisits';

export async function handleAiDetected({
  hostname,
  confidence,
  signals,
}: AiDetectedPayload): Promise<VisitIdPayload> {
  const visit: AiVisit = {
    visitId: crypto.randomUUID(),
    toolId: hostname,
    name: hostname,
    category: 'Embedded AI',
    hostname,
    method: 'signal',
    signals,
    confidence,
    detectedAt: Date.now(),
    interacted: false,
    interactionType: null,
    interactions: [],
  };

  await saveVisits((visits) => [...visits, visit]);
  return { visitId: visit.visitId };
}
