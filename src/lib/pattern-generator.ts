/**
 * Generates a seamless pattern from an image using the offset-wrap technique.
 *
 * The algorithm:
 * 1. Draw the original image onto a canvas
 * 2. Offset the image by the specified horizontal and vertical amounts
 * 3. Wrap the pixels that go past the edges back to the opposite side
 * 4. The result is a tile that repeats seamlessly when placed side-by-side
 */
export function generateSeamlessPattern(
  img: HTMLImageElement,
  offsetX: number = 50,
  offsetY: number = 50
): HTMLCanvasElement {
  const w = img.width;
  const h = img.height;
  const shiftX = Math.round((w * offsetX) / 100);
  const shiftY = Math.round((h * offsetY) / 100);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  // Draw the original image
  ctx.drawImage(img, 0, 0);

  // Get the original pixel data
  const originalData = ctx.getImageData(0, 0, w, h);

  // Create the offset version by shifting with wrap-around
  const resultData = ctx.createImageData(w, h);
  const src = originalData.data;
  const dst = resultData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcX = ((x + shiftX) % w + w) % w;
      const srcY = ((y + shiftY) % h + h) % h;
      const srcIdx = (srcY * w + srcX) * 4;
      const dstIdx = (y * w + x) * 4;
      dst[dstIdx] = src[srcIdx];
      dst[dstIdx + 1] = src[srcIdx + 1];
      dst[dstIdx + 2] = src[srcIdx + 2];
      dst[dstIdx + 3] = src[srcIdx + 3];
    }
  }

  ctx.putImageData(resultData, 0, 0);
  return canvas;
}

/**
 * Wraps a seamless tile at (dx, dy) with its content rolled by (rollX, rollY) pixels,
 * splitting into up to 4 sub-rects to handle the wrap-around seam.
 */
function drawRolled(
  ctx: CanvasRenderingContext2D,
  tile: HTMLCanvasElement,
  dx: number, dy: number,
  rollX: number, rollY: number
): void {
  const W = tile.width;
  const H = tile.height;
  const rx = ((rollX % W) + W) % W;
  const ry = ((rollY % H) + H) % H;

  if (rx === 0 && ry === 0) { ctx.drawImage(tile, dx, dy); return; }

  const x2 = W - rx;
  const y2 = H - ry;
  if (x2 > 0 && y2 > 0) ctx.drawImage(tile, rx, ry, x2, y2, dx,      dy,      x2, y2);
  if (rx > 0 && y2 > 0) ctx.drawImage(tile,  0, ry, rx, y2, dx + x2, dy,      rx, y2);
  if (x2 > 0 && ry > 0) ctx.drawImage(tile, rx,  0, x2, ry, dx,      dy + y2, x2, ry);
  if (rx > 0 && ry > 0) ctx.drawImage(tile,  0,  0, rx, ry, dx + x2, dy + y2, rx, ry);
}

/**
 * Builds a metatile that encodes the stagger offsets so it tiles seamlessly in
 * a straight grid while reproducing a half-drop (offsetY) or brick (offsetX) repeat.
 *
 * - offsetY > 0  →  2W × H  metatile  (right column rolled up by staggerY)
 * - offsetX > 0  →  W × 2H  metatile  (bottom row rolled left by staggerX)
 * - both         →  2W × 2H metatile  (all four quadrants)
 * - neither      →  returns the tile unchanged
 */
export function generateMetatile(
  seamlessTile: HTMLCanvasElement,
  offsetX: number,
  offsetY: number
): HTMLCanvasElement {
  const W = seamlessTile.width;
  const H = seamlessTile.height;
  const staggerX = Math.round(W * offsetX / 100);
  const staggerY = Math.round(H * offsetY / 100);
  const hasX = staggerX > 0 && staggerX < W;
  const hasY = staggerY > 0 && staggerY < H;

  if (!hasX && !hasY) return seamlessTile;

  const canvas = document.createElement('canvas');
  canvas.width  = hasY ? W * 2 : W;
  canvas.height = hasX ? H * 2 : H;
  const ctx = canvas.getContext('2d')!;

  // TL — no stagger
  drawRolled(ctx, seamlessTile, 0, 0, 0, 0);
  // TR — half-drop column: roll tile content up by staggerY
  if (hasY) drawRolled(ctx, seamlessTile, W, 0, 0, staggerY);
  // BL — brick row: roll tile content left by staggerX (≡ right by W − staggerX)
  if (hasX) drawRolled(ctx, seamlessTile, 0, H, W - staggerX, 0);
  // BR — both applied
  if (hasX && hasY) drawRolled(ctx, seamlessTile, W, H, W - staggerX, staggerY);

  return canvas;
}
