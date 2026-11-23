export function BrandHeader() {
  return (
    <header className="flex items-center gap-2.5 border-b border-line bg-card px-4 py-3">
      <img src="/logo.svg" alt="" className="size-7" />
      <div className="flex flex-col leading-tight">
        <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-sm font-semibold text-transparent">
          Straiker
        </span>
        <span className="text-[11px] text-slate-500">AI Usage Discovery</span>
      </div>
    </header>
  );
}
