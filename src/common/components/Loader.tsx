export function Loader({ label }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-8">
      <span className="size-7 animate-spin rounded-full border-[3px] border-line border-t-status-ai" />
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </div>
  );
}
