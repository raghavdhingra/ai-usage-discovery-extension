import { useState } from 'react';
import { SignalList } from '@/common/components/SignalList';
import { StatusBadge } from '@/common/components/StatusBadge';
import { countInteractions, getLastInteractionAt } from '@/common/utils/interactions';
import { formatRelativeTime } from '@/common/utils/time';
import { VisitTimeline } from '@/sidepanel/components/VisitTimeline';
import type { ToolGroup } from '@/sidepanel/utils/groupByTool';

export function ToolCard({ latest, visits }: ToolGroup) {
  const [open, setOpen] = useState(false);
  const interactionCount = countInteractions(visits);
  const lastUsedAt = getLastInteractionAt(visits);

  return (
    <div className="rounded-xl border border-line bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer flex-col gap-2 p-4 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">{latest.name}</span>
          <StatusBadge variant={lastUsedAt ? 'used' : 'visited'} />
        </div>
        <span className="text-xs text-slate-500">
          {latest.category} · {latest.hostname}
        </span>
        <span className="flex items-center justify-between text-xs text-slate-500">
          {visits.length} {visits.length === 1 ? 'visit' : 'visits'} · {interactionCount}{' '}
          {interactionCount === 1 ? 'interaction' : 'interactions'} ·{' '}
          {lastUsedAt ? `last used ${formatRelativeTime(lastUsedAt)}` : 'not used yet'}
          <span className="text-slate-400">{open ? '▾' : '▸'}</span>
        </span>
        {latest.method === 'signal' && <SignalList signals={latest.signals} method="signal" />}
      </button>

      {open && (
        <ul className="divide-y divide-line border-t border-line">
          {visits.map((visit) => (
            <VisitTimeline key={visit.visitId} visit={visit} />
          ))}
        </ul>
      )}
    </div>
  );
}
