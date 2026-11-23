import { useState } from 'react';
import { SignalList } from '@/common/components/SignalList';
import { StatusBadge } from '@/common/components/StatusBadge';
import { formatRelativeTime } from '@/common/utils/time';
import type { ToolGroup } from '@/sidepanel/utils/groupByTool';

const INTERACTION_LABEL = { 'prompt-submit': 'Prompt submitted', 'ai-button': 'AI button clicked' };

export function ToolCard({ latest, visits }: ToolGroup) {
  const [open, setOpen] = useState(false);
  const lastUsed = visits.find((visit) => visit.interacted);

  return (
    <div className="rounded-xl border border-line bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer flex-col gap-2 p-4 text-left"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">{latest.name}</span>
          <StatusBadge variant={lastUsed ? 'used' : 'visited'} />
        </div>
        <span className="text-xs text-slate-500">
          {latest.category} · {latest.hostname}
        </span>
        <span className="flex items-center justify-between text-xs text-slate-500">
          {visits.length} {visits.length === 1 ? 'visit' : 'visits'} ·{' '}
          {lastUsed ? `last used ${formatRelativeTime(lastUsed.detectedAt)}` : 'not used yet'}
          <span className="text-slate-400">{open ? '▾' : '▸'}</span>
        </span>
        {latest.method === 'signal' && <SignalList signals={latest.signals} method="signal" />}
      </button>

      {open && (
        <ul className="divide-y divide-line border-t border-line">
          {visits.map((visit) => (
            <li key={visit.visitId} className="flex items-center justify-between px-4 py-2 text-xs">
              <span className="text-slate-500">{formatRelativeTime(visit.detectedAt)}</span>
              <span className={visit.interacted ? 'font-medium text-status-ai' : 'text-slate-400'}>
                {visit.interactionType ? INTERACTION_LABEL[visit.interactionType] : 'Visited'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
