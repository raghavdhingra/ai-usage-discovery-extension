export type StatusVariant = 'ai' | 'not-ai' | 'unsupported' | 'error';

const VARIANTS: Record<StatusVariant, { label: string; className: string; dotClassName: string }> = {
  ai: {
    label: 'AI tool detected',
    className: 'bg-status-ai-soft text-status-ai',
    dotClassName: 'bg-status-ai',
  },
  'not-ai': {
    label: 'Not an AI tool',
    className: 'bg-status-neutral-soft text-status-neutral',
    dotClassName: 'bg-status-neutral',
  },
  unsupported: {
    label: "Can't check this page",
    className: 'bg-status-warn-soft text-status-warn',
    dotClassName: 'bg-status-warn',
  },
  error: {
    label: 'Something went wrong',
    className: 'bg-status-error-soft text-status-error',
    dotClassName: 'bg-status-error',
  },
};

export function StatusBadge({ variant }: { variant: StatusVariant }) {
  const { label, className, dotClassName } = VARIANTS[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dotClassName}`} />
      {label}
    </span>
  );
}
