import type { AiVisit, Interaction } from '@/common/types/site';

export function getInteractions(visit: AiVisit): Interaction[] {
  return visit.interactions ?? [];
}

export function countInteractions(visits: AiVisit[]): number {
  return visits.reduce((total, visit) => total + getInteractions(visit).length, 0);
}

export function getLastInteractionAt(visits: AiVisit[]): number | null {
  const times = visits.flatMap(getInteractions).map((interaction) => interaction.at);
  return times.length > 0 ? Math.max(...times) : null;
}
