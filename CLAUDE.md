# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Production build to dist/
npm run typecheck  # TypeScript check without emit
npm run lint       # ESLint (flat config, TypeScript + React Hooks rules)
npm run preview    # Serve production build locally
```

There is no test suite configured.

## Architecture

Single-page React 18 app that converts uploaded images to seamless tileable patterns using the offset-wrap technique. All image processing is client-side via the HTML5 Canvas 2D API — no backend, no external API calls.

**Data flow:**

1. User uploads image → `App.tsx:handleFileSelect` loads it into an `HTMLImageElement`
2. `generateSeamlessPattern` in [src/lib/pattern-generator.ts](src/lib/pattern-generator.ts) shifts pixel data by X%/Y% offsets and wraps edges using modulo arithmetic on a Canvas, returning a Canvas element
3. The output canvas is serialized to a base64 PNG via `toDataURL` and stored in React state
4. Download creates a Blob URL attached to a hidden `<a>` element

**State:** All pattern state (`originalImage`, `seamlessImage`, `fileName`) and offset values live in `App.tsx`. Components receive callbacks; there is no external state library.

**Key files:**

- [src/lib/pattern-generator.ts](src/lib/pattern-generator.ts) — 52-line core algorithm; the only place image manipulation happens
- [src/App.tsx](src/App.tsx) — orchestrates state, processing lifecycle, and renders the appropriate phase (upload → processing spinner → results)
- [src/components/TiledPreview.tsx](src/components/TiledPreview.tsx) — interactive Canvas component with mouse-drag pan and wheel zoom; tiles the seamless image using modulo offsets drawn directly to a `<canvas>`
- [src/index.css](src/index.css) — defines the entire color system as CSS custom properties (`--color-*`); Tailwind utilities reference these variables

**Styling convention:** Tailwind utility classes only. Custom colors are CSS variables defined in `:root` in `index.css` and referenced via Tailwind's `text-[var(--color-*)]` / `bg-[var(--color-*)]` syntax, not in `tailwind.config.js`.

**`@supabase/supabase-js` is installed but unused** — do not introduce Supabase usage without explicit instruction.
