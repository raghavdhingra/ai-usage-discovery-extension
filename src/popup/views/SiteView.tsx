import { ConfidenceMeter } from '@/common/components/ConfidenceMeter';
import { SignalList } from '@/common/components/SignalList';
import { StatusBadge } from '@/common/components/StatusBadge';
import type { AiSiteStatus, NotAiSiteStatus } from '@/common/types/site';
import { formatRelativeTime } from '@/common/utils/time';

export function SiteView({ data }: { data: AiSiteStatus | NotAiSiteStatus }) {
  const isAi = data.status === 'ai';

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wide text-slate-400">Current site</span>
          <span className="truncate text-sm font-medium text-slate-800">{data.hostname}</span>
        </div>
        <StatusBadge variant={data.status} />
      </div>

      {isAi && (
        <div className="flex flex-col">
          <span className="text-base font-semibold text-slate-800">{data.name}</span>
          <span className="text-xs text-slate-500">{data.category}</span>
        </div>
      )}

      <ConfidenceMeter level={data.confidence} />
      <SignalList signals={data.signals} method={isAi ? data.method : undefined} />

      {isAi && (
        <div className="flex items-center justify-between border-t border-line pt-3 text-xs">
          <span className="text-slate-500">Last used</span>
          <span className="font-medium text-slate-700">
            {data.lastUsedAt === null ? 'Not used yet' : formatRelativeTime(data.lastUsedAt)}
          </span>
        </div>
      )}
    </>
  );
}
