import { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { PatternPreview } from './components/PatternPreview';
import { TiledPreview } from './components/TiledPreview';
import { OffsetControls } from './components/OffsetControls';
import { generateSeamlessPattern } from './lib/pattern-generator';
import type { PatternState } from './types';

function App() {
  const [pattern, setPattern] = useState<PatternState>({
    originalImage: null,
    seamlessImage: null,
    fileName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTiled, setShowTiled] = useState(false);
  const [offsetX, setOffsetX] = useState(50);
  const [offsetY, setOffsetY] = useState(50);
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const regeneratePattern = useCallback((img: HTMLImageElement, offX: number, offY: number) => {
    const seamlessCanvas = generateSeamlessPattern(img, offX, offY);
    setPattern((prev) => ({
      ...prev,
      seamlessImage: seamlessCanvas.toDataURL('image/png'),
    }));
  }, []);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);
    setPattern({ originalImage: null, seamlessImage: null, fileName: file.name });
    setOffsetX(50);
    setOffsetY(50);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const seamlessCanvas = generateSeamlessPattern(img, 50, 50);
      const originalCanvas = document.createElement('canvas');
      originalCanvas.width = img.width;
      originalCanvas.height = img.height;
      const ctx = originalCanvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      setPattern({
        originalImage: originalCanvas.toDataURL('image/png'),
        seamlessImage: seamlessCanvas.toDataURL('image/png'),
        fileName: file.name,
      });
      setLoadedImage(img);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to process image:', err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleOffsetChange = useCallback(
    (newOffsetX: number, newOffsetY: number) => {
      setOffsetX(newOffsetX);
      setOffsetY(newOffsetY);
      if (loadedImage) {
        regeneratePattern(loadedImage, newOffsetX, newOffsetY);
      }
    },
    [loadedImage, regeneratePattern]
  );

  const handleDownload = useCallback(() => {
    if (!pattern.seamlessImage) return;
    const a = document.createElement('a');
    a.href = pattern.seamlessImage;
    const baseName = pattern.fileName.replace(/\.[^.]+$/, '');
    a.download = `${baseName}-seamless.png`;
    a.click();
  }, [pattern]);

  const handleReset = useCallback(() => {
    setPattern({ originalImage: null, seamlessImage: null, fileName: '' });
    setShowTiled(false);
    setLoadedImage(null);
    setOffsetX(50);
    setOffsetY(50);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {!pattern.originalImage && !isProcessing && (
          <UploadZone
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
          />
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary-500)] animate-spin" />
            </div>
            <p className="mt-6 text-[var(--color-text-secondary)] font-medium">
              Generating seamless pattern...
            </p>
          </div>
        )}

        {pattern.originalImage && !isProcessing && (
          <div className="space-y-6">
            <OffsetControls
              offsetX={offsetX}
              offsetY={offsetY}
              onChange={handleOffsetChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PatternPreview
                title="Original"
                imageSrc={pattern.originalImage}
                label="Your uploaded image"
              />
              <PatternPreview
                title="Seamless"
                imageSrc={pattern.seamlessImage!}
                label="Generated seamless pattern"
                highlight
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary-600)] text-white rounded-xl font-medium
                  hover:bg-[var(--color-primary-700)] active:scale-[0.98] transition-all duration-150
                  shadow-lg shadow-[var(--color-primary-600)]/20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Seamless Pattern
              </button>

              <button
                onClick={() => setShowTiled(!showTiled)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-text)] rounded-xl font-medium
                  border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] active:scale-[0.98] transition-all duration-150"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
                {showTiled ? 'Hide Tiled Preview' : 'Show Tiled Preview'}
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-text-secondary)] rounded-xl font-medium
                  border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] active:scale-[0.98] transition-all duration-150"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
                Upload New Image
              </button>
            </div>

            {showTiled && pattern.seamlessImage && (
              <TiledPreview imageSrc={pattern.seamlessImage} offsetX={offsetX} offsetY={offsetY} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
