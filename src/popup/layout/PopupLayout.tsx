import type { ReactNode } from 'react';

interface PopupLayoutProps {
  children: ReactNode;
  footerDisabled?: boolean;
}

export function PopupLayout({ children, footerDisabled = false }: PopupLayoutProps) {
  return (
    <div className="flex w-80 flex-col">
      <header className="flex items-center gap-2.5 border-b border-line bg-card px-4 py-3">
        <img src="/logo.svg" alt="" className="size-7" />
        <div className="flex flex-col leading-tight">
          <span className="bg-gradient-to-r from-brand-from to-brand-to bg-clip-text text-sm font-semibold text-transparent">
            Straiker
          </span>
          <span className="text-[11px] text-slate-500">AI Usage Discovery</span>
        </div>
      </header>

      <main className="p-4">
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4">{children}</div>
      </main>

      <footer className="border-t border-line bg-card px-4 py-3">
        <button
          type="button"
          disabled={footerDisabled}
          className="w-full cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Open detailed view
        </button>
      </footer>
    </div>
  );
}
