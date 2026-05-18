export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-primary-600)] shadow-lg shadow-[var(--color-primary-600)]/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">
              Seamless Pattern Generator
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Convert any image into a seamlessly repeating pattern
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
