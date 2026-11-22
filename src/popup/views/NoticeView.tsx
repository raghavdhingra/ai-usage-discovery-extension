import type { ReactNode } from 'react';
import { StatusBadge } from '@/common/components/StatusBadge';

interface NoticeViewProps {
  variant: 'unsupported' | 'error';
  children: ReactNode;
}

export function NoticeView({ variant, children }: NoticeViewProps) {
  return (
    <div className="flex flex-col items-start gap-3">
      <StatusBadge variant={variant} />
      <p className="text-sm leading-relaxed text-slate-600">{children}</p>
    </div>
  );
}
