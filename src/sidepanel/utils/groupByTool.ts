import type { AiVisit } from '@/common/types/site';

export interface ToolGroup {
  latest: AiVisit;
  visits: AiVisit[];
}

export function groupByTool(visits: AiVisit[]): ToolGroup[] {
  const groups = new Map<string, ToolGroup>();
  for (const visit of [...visits].sort((a, b) => b.detectedAt - a.detectedAt)) {
    const group = groups.get(visit.toolId);
    if (group) group.visits.push(visit);
    else groups.set(visit.toolId, { latest: visit, visits: [visit] });
  }
  return [...groups.values()];
}
