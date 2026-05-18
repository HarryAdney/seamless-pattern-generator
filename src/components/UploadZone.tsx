import { useState, useCallback, type DragEvent } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function UploadZone({ onFileSelect, fileInputRef }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="py-16">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] tracking-tight mb-4">
          Create Seamless Patterns
        </h2>
        <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Upload any image and instantly convert it into a seamlessly repeating pattern.
          Perfect for backgrounds, textures, and surface designs.
        </p>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative max-w-2xl mx-auto cursor-pointer rounded-2xl border-2 border-dashed p-12
          transition-all duration-200 ease-out
          ${isDragOver
            ? 'border-[var(--color-primary-400)] bg-[var(--color-primary-50)] scale-[1.02]'
            : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary-300)] hover:bg-[var(--color-primary-50)]/30'
          }
        `}
      >
        <input
          ref={fileInputRef as React.RefObject<HTMLInputElement>}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div className={`
            flex items-center justify-center w-16 h-16 rounded-2xl mb-6
            transition-colors duration-200
            ${isDragOver
              ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]'
            }
          `}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <p className="text-lg font-medium text-[var(--color-text)] mb-1">
            {isDragOver ? 'Drop your image here' : 'Drag and drop your image'}
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            or click to browse -- PNG, JPG, WebP, SVG
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-3xl mx-auto mt-20">
        <h3 className="text-lg font-semibold text-[var(--color-text)] text-center mb-8">
          How it works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StepCard
            number={1}
            title="Upload"
            description="Upload the pattern or image you created"
          />
          <StepCard
            number={2}
            title="Generate"
            description="The tool offsets and wraps your image to create a seamless tile"
          />
          <StepCard
            number={3}
            title="Download"
            description="Download your seamless pattern and use it anywhere"
          />
        </div>
      </div>

      {/* Info section */}
      <div className="max-w-2xl mx-auto mt-20 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">
            What is a seamless pattern?
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            A seamless pattern is an image that can be placed side-by-side with copies of itself
            without any visible seams or interruptions. This lets you repeat the image to create
            a pattern that can go on forever -- perfect for unique backgrounds, textures, or
            brand elements.
          </p>
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">
            How does the tool work?
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            The generator uses the offset-wrap technique: it shifts your image by 50% horizontally
            and vertically, wrapping the pixels that go past the edges back to the opposite side.
            This creates a tile where the edges match perfectly when repeated. All processing
            happens locally in your browser -- your images never leave your device.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative bg-white rounded-xl border border-[var(--color-border)] p-6 text-center
      hover:border-[var(--color-primary-200)] hover:shadow-md transition-all duration-200">
      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-600)] text-sm font-semibold mb-3">
        {number}
      </div>
      <h4 className="font-medium text-[var(--color-text)] mb-1">{title}</h4>
      <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  );
}
