import type { HostnamePayload, MessageSender, PageLoadedResult } from '@/common/types/messages';
import { matchDomain } from '@/service-worker/detection/matchDomain';
import { recordActivity } from '@/service-worker/recordActivity';

export async function handlePageLoaded(
  { hostname }: HostnamePayload,
  { tabId }: MessageSender,
): Promise<PageLoadedResult> {
  const tool = matchDomain(hostname);
  if (!tool) return { isAi: false };

  await recordActivity({ tabId, tool, hostname });
  return { isAi: true };
}
