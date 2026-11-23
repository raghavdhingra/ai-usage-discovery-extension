import { sendMessage } from '@/common/chrome/runtime';
import { updateVisits } from '@/common/chrome/storage';
import { MESSAGE } from '@/common/types/messages';
import type { AiVisit } from '@/common/types/site';

export async function saveVisits(update: (visits: AiVisit[]) => AiVisit[]): Promise<void> {
  const visits = await updateVisits(update);
  sendMessage(MESSAGE.VISITS_UPDATED, visits).catch(() => undefined);
}
