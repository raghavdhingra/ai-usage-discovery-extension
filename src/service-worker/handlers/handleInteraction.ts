import type { InteractionPayload } from '@/common/types/messages';
import type { AiVisit, Interaction } from '@/common/types/site';
import { getInteractions } from '@/common/utils/interactions';
import { saveVisits } from '@/service-worker/saveVisits';

function addInteraction(visit: AiVisit, interaction: Interaction): AiVisit {
  return {
    ...visit,
    interacted: true,
    interactionType: visit.interactionType ?? interaction.type,
    interactions: [...getInteractions(visit), interaction],
  };
}

export function handleInteraction({ visitId, interactionType }: InteractionPayload): Promise<void> {
  const interaction: Interaction = { type: interactionType, at: Date.now() };

  return saveVisits((visits) =>
    visits.map((visit) => (visit.visitId === visitId ? addInteraction(visit, interaction) : visit)),
  );
}
