import { getSessionEntry, getVisits, setSessionEntry } from '@/common/chrome/storage';
import type { AiTool, AiVisit, InteractionType } from '@/common/types/site';
import { saveVisits } from '@/service-worker/saveVisits';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

interface Activity {
  tabId?: number;
  tool: AiTool;
  hostname: string;
  interactionType?: InteractionType;
}

export async function recordActivity({ tabId, tool, hostname, interactionType }: Activity): Promise<void> {
  const now = Date.now();
  const session = tabId === undefined ? undefined : await getSessionEntry(tabId, tool.toolId);
  const isActive = session !== undefined && now - session.lastActiveAt < SESSION_TIMEOUT_MS;

  let visitId: string;

  if (isActive) {
    visitId = session.visitId;

    const visit = (await getVisits()).find((v) => v.visitId === visitId);
    if (interactionType && visit && !visit.interacted) {
      await saveVisits((visits) =>
        visits.map((v) => (v.visitId === visitId ? { ...v, interacted: true, interactionType } : v)),
      );
    }
  } else {
    const visit: AiVisit = {
      visitId: crypto.randomUUID(),
      toolId: tool.toolId,
      name: tool.name,
      category: tool.category,
      hostname,
      method: 'domain',
      signals: [],
      detectedAt: now,
      interacted: Boolean(interactionType),
      interactionType: interactionType ?? null,
    };
    visitId = visit.visitId;
    await saveVisits((visits) => [...visits, visit]);
  }

  if (tabId !== undefined) await setSessionEntry(tabId, tool.toolId, { visitId, lastActiveAt: now });
}
