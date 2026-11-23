import type { ReactNode } from 'react';
import { BrandHeader } from '@/common/components/BrandHeader';

interface PopupLayoutProps {
  children: ReactNode;
  footerDisabled?: boolean;
  onOpenDetails: () => void;
}

export function PopupLayout({ children, footerDisabled = false, onOpenDetails }: PopupLayoutProps) {
  return (
    <div className="flex w-80 flex-col">
      <BrandHeader />

      <main className="p-4">
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4">{children}</div>
      </main>

      <footer className="border-t border-line bg-card px-4 py-3">
        <button
          type="button"
          disabled={footerDisabled}
          onClick={onOpenDetails}
          className="w-full cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Open detailed view
        </button>
      </footer>
    </div>
  );
}
