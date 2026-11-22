import type { AiVisit } from '@/common/types/site';

const VISITS_KEY = 'aiVisits';

export async function getVisits(): Promise<AiVisit[]> {
  const result = await browser.storage.local.get(VISITS_KEY);
  return (result[VISITS_KEY] as AiVisit[] | undefined) ?? [];
}

export async function setVisits(visits: AiVisit[]): Promise<void> {
  await browser.storage.local.set({ [VISITS_KEY]: visits });
}
