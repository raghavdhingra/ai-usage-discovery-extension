import type { AiVisit } from '@/common/types/site';

const VISITS_KEY = 'aiVisits';

let writeQueue: Promise<unknown> = Promise.resolve();

export async function getVisits(): Promise<AiVisit[]> {
  const result = await browser.storage.local.get(VISITS_KEY);
  return (result[VISITS_KEY] as AiVisit[] | undefined) ?? [];
}

export function updateVisits(update: (visits: AiVisit[]) => AiVisit[]): Promise<AiVisit[]> {
  const write = writeQueue.then(async () => {
    const visits = update(await getVisits());
    await browser.storage.local.set({ [VISITS_KEY]: visits });
    return visits;
  });
  writeQueue = write.catch(() => undefined);
  return write;
}

export interface SessionEntry {
  visitId: string;
  lastActiveAt: number;
}

type TabSession = Record<string, SessionEntry>;

const tabKey = (tabId: number) => `tab-${tabId}`;

async function getTabSession(tabId: number): Promise<TabSession> {
  const result = await browser.storage.session.get(tabKey(tabId));
  return (result[tabKey(tabId)] as TabSession | undefined) ?? {};
}

export async function getSessionEntry(tabId: number, toolId: string): Promise<SessionEntry | undefined> {
  const session = await getTabSession(tabId);
  return session[toolId];
}

export async function setSessionEntry(tabId: number, toolId: string, entry: SessionEntry): Promise<void> {
  const session = await getTabSession(tabId);
  session[toolId] = entry;
  await browser.storage.session.set({ [tabKey(tabId)]: session });
}

export function removeTabSession(tabId: number): Promise<void> {
  return browser.storage.session.remove(tabKey(tabId));
}

export function clearTabSessions(): Promise<void> {
  return browser.storage.session.clear();
}
