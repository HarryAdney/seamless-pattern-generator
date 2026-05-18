import { useState, useEffect, useRef } from 'react';

interface TiledPreviewProps {
  imageSrc: string;
  offsetX: number;
  offsetY: number;
}

export function TiledPreview({ imageSrc, offsetX, offsetY }: TiledPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      const tileW = Math.round(img.width * zoom);
      const tileH = Math.round(img.height * zoom);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const ox = Math.round(offset.x);
      const oy = Math.round(offset.y);

      ctx.imageSmoothingEnabled = zoom < 1;

      // Index-based iteration so each tile has a stable col/row index for stagger,
      // even as the user pans. Alternate rows are shifted right by offsetX% (brick
      // repeat), alternate columns are shifted down by offsetY% (half-drop repeat).
      const baseColIdx = Math.floor(-ox / tileW) - 2;
      const baseRowIdx = Math.floor(-oy / tileH) - 2;
      const numCols = Math.ceil(canvas.width / tileW) + 5;
      const numRows = Math.ceil(canvas.height / tileH) + 5;

      for (let ri = 0; ri < numRows; ri++) {
        const rowIdx = baseRowIdx + ri;
        const staggerX = ((rowIdx % 2) + 2) % 2 === 1 ? Math.round(tileW * offsetX / 100) : 0;
        for (let ci = 0; ci < numCols; ci++) {
          const colIdx = baseColIdx + ci;
          const staggerY = ((colIdx % 2) + 2) % 2 === 1 ? Math.round(tileH * offsetY / 100) : 0;
          const x = ox + colIdx * tileW + staggerX;
          const y = oy + rowIdx * tileH + staggerY;
          ctx.drawImage(img, Math.round(x), Math.round(y), tileW, tileH);
        }
      }
    };
    img.src = imageSrc;
  }, [imageSrc, zoom, offset, offsetX, offsetY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      canvas.width = container.clientWidth;
      canvas.height = 480;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.1, Math.min(5, z + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-light)]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Tiled Preview</h3>
          <span className="text-xs text-[var(--color-text-muted)]">
            -- drag to pan, scroll to zoom
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(0.1, z - 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--color-border)]
              text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors text-sm"
          >
            -
          </button>
          <span className="text-xs text-[var(--color-text-muted)] w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(5, z + 0.2))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-[var(--color-border)]
              text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] transition-colors text-sm"
          >
            +
          </button>
        </div>
      </div>
      <div
        className="relative cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </div>
  );
}
