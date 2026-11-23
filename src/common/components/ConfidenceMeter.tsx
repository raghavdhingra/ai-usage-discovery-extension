const SEGMENTS = 4;

function fillClass(percent: number): string {
  if (percent >= 80) return 'bg-confidence-high';
  if (percent >= 50) return 'bg-confidence-medium';
  return 'bg-confidence-low';
}

export function ConfidenceMeter({ percent }: { percent: number }) {
  const filled = Math.round((percent / 100) * SEGMENTS);
  const label = `${percent}%`;

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
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={label}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full ${index < filled ? fillClass(percent) : 'bg-confidence-track'}`}
          />
        ))}
      </div>
    </div>
  );
}
