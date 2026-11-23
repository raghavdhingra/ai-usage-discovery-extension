interface StatTilesProps {
  tools: number;
  visits: number;
  used: number;
}

export function StatTiles({ tools, visits, used }: StatTilesProps) {
  const stats = [
    { label: 'Tools', value: tools },
    { label: 'Visits', value: visits },
    { label: 'Used', value: used },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map(({ label, value }) => (
        <div key={label} className="rounded-xl border border-line bg-card px-3 py-2.5 text-center">
          <div className="text-lg font-semibold text-slate-800">{value}</div>
          <div className="text-[11px] text-slate-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
