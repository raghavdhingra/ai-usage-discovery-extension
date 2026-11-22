import { SIGNALS } from '@/common/constants/signals';
import type { DetectionMethod, SignalId } from '@/common/types/site';

interface SignalListProps {
  signals: SignalId[];
  method?: DetectionMethod;
}

export function SignalList({ signals, method }: SignalListProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-slate-500">Signals</span>
      {method === 'domain' ? (
        <span className="text-xs text-slate-700">Detected by domain (known AI tool)</span>
      ) : signals.length === 0 ? (
        <span className="text-xs text-slate-400">None found</span>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {signals.map((id) => (
            <span
              key={id}
              className="rounded-md border border-line bg-surface px-2 py-0.5 text-[11px] text-slate-600"
            >
              {SIGNALS[id].label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
