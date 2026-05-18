interface PatternPreviewProps {
  title: string;
  imageSrc: string;
  label: string;
  highlight?: boolean;
}

export function PatternPreview({ title, imageSrc, label, highlight }: PatternPreviewProps) {
  return (
    <div className={`
      rounded-2xl border overflow-hidden transition-all duration-200
      ${highlight
        ? 'border-[var(--color-primary-200)] bg-white shadow-lg shadow-[var(--color-primary-600)]/5'
        : 'border-[var(--color-border)] bg-white'
      }
    `}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-light)]">
        <div className="flex items-center gap-2">
          {highlight && (
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent-500)]" />
          )}
          <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
      </div>
      <div className="checkerboard p-4">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-auto rounded-lg"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
}
