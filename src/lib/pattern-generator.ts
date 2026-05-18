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
