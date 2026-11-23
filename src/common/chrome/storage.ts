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
