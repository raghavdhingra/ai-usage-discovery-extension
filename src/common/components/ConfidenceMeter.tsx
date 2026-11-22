import type { ConfidenceLevel } from '@/common/types/site';

const SEGMENTS = 4;

const LEVELS: Record<ConfidenceLevel, { label: string; filled: number; fillClass: string }> = {
  none: { label: 'None', filled: 0, fillClass: 'bg-confidence-track' },
  low: { label: 'Low', filled: 1, fillClass: 'bg-confidence-low' },
  medium: { label: 'Medium', filled: 3, fillClass: 'bg-confidence-medium' },
  high: { label: 'High', filled: 4, fillClass: 'bg-confidence-high' },
};

export function ConfidenceMeter({ level }: { level: ConfidenceLevel }) {
  const { label, filled, fillClass } = LEVELS[level];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Confidence</span>
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div
        className="grid grid-cols-4 gap-1"
        role="meter"
        aria-label="AI confidence"
        aria-valuemin={0}
        aria-valuemax={SEGMENTS}
        aria-valuenow={filled}
        aria-valuetext={label}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full ${index < filled ? fillClass : 'bg-confidence-track'}`}
          />
        ))}
      </div>
    </div>
  );
}
