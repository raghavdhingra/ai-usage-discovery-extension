import type { InteractionPayload, MessageSender } from '@/common/types/messages';
import { matchDomain } from '@/service-worker/detection/matchDomain';
import { recordActivity } from '@/service-worker/recordActivity';

export async function handleInteraction(
  { hostname, interactionType }: InteractionPayload,
  { tabId }: MessageSender,
): Promise<void> {
  const tool = matchDomain(hostname);
  if (!tool) return;

  await recordActivity({ tabId, tool, hostname, interactionType });
}
