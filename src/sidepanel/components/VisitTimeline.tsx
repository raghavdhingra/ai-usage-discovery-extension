import type { AiVisit, InteractionType } from '@/common/types/site';
import { getInteractions } from '@/common/utils/interactions';
import { formatDateTime, formatRelativeTime, formatTime } from '@/common/utils/time';

const INTERACTION_LABEL: Record<InteractionType, string> = {
  'prompt-submit': 'Prompt submitted',
  'ai-button': 'AI button clicked',
};

export function VisitTimeline({ visit }: { visit: AiVisit }) {
  const interactions = getInteractions(visit);

  return (
    <li className="flex flex-col gap-1.5 px-4 py-3 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-700">
          <span className="font-medium">Visited</span> {formatDateTime(visit.detectedAt)}
        </span>
        <span className="text-slate-400">{formatRelativeTime(visit.detectedAt)}</span>
      </div>

      <ul className="ml-1 flex flex-col gap-1 border-l border-line pl-3">
        {interactions.length === 0 ? (
          <li className="text-slate-400">No interactions</li>
        ) : (
          interactions.map((interaction) => (
            <li key={interaction.at} className="flex gap-2">
              <span className="text-slate-400">{formatTime(interaction.at)}</span>
              <span className="text-status-ai">{INTERACTION_LABEL[interaction.type]}</span>
            </li>
          ))
        )}
      </ul>
    </li>
  );
}
