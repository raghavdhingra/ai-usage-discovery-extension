import type { InteractionPayload } from '@/common/types/messages';
import { saveVisits } from '@/service-worker/saveVisits';

export function handleInteraction({ visitId, interactionType }: InteractionPayload): Promise<void> {
  return saveVisits((visits) =>
    visits.map((visit) =>
      visit.visitId === visitId ? { ...visit, interacted: true, interactionType } : visit,
    ),
  );
}
