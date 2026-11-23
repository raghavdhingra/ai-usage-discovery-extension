import type { VisitIdPayload } from '@/common/types/messages';
import { saveVisits } from '@/service-worker/saveVisits';

export function handleAiUsed({ visitId }: VisitIdPayload): Promise<void> {
  return saveVisits((visits) =>
    visits.map((visit) => (visit.visitId === visitId ? { ...visit, interacted: true } : visit)),
  );
}
