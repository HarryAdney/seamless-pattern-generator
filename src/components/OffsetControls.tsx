interface OffsetControlsProps {
  offsetX: number;
  offsetY: number;
  onChange: (offsetX: number, offsetY: number) => void;
}

export function OffsetControls({ offsetX, offsetY, onChange }: OffsetControlsProps) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="5 9 2 12 5 15" />
          <polyline points="9 5 12 2 15 5" />
          <polyline points="19 9 22 12 19 15" />
          <polyline points="9 19 12 22 15 19" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Offset</h3>
        <span className="text-xs text-[var(--color-text-muted)]">
          -- adjust where the seam falls
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SliderControl
          id="offset-x"
          label="Horizontal"
          value={offsetX}
          onChange={(v) => onChange(v, offsetY)}
        />
        <SliderControl
          id="offset-y"
          label="Vertical"
          value={offsetY}
          onChange={(v) => onChange(offsetX, v)}
        />
      </div>
    </div>
  );
}

function SliderControl({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm text-[var(--color-text-secondary)]">{label}</label>
        <span className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-alt)] px-2 py-0.5 rounded">
          {value}%
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          bg-[var(--color-border-light)]
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[var(--color-primary-600)]
          [&::-webkit-slider-thumb]:shadow-md
          [&::-webkit-slider-thumb]:shadow-[var(--color-primary-600)]/20
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white
          [&::-webkit-slider-thumb]:transition-transform
          [&::-webkit-slider-thumb]:duration-100
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--color-primary-600)]
          [&::-moz-range-thumb]:border-2
          [&::-moz-range-thumb]:border-white
          [&::-moz-range-thumb]:shadow-md
          [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  );
}
