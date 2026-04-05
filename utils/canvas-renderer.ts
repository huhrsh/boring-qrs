/**
 * Canvas Renderer Utilities
 * 
 * Handles high-quality canvas rendering with support for
 * high-DPI displays and pixel-perfect QR code output.
 */

export interface RenderOptions {
  scale?: number; // Scaling factor for high-DPI displays
  moduleSize?: number; // (Unused, kept for backwards-compat)
  smoothing?: boolean; // Enable/disable image smoothing
}

// Fixed on-screen size (in CSS pixels) for the QR preview canvas.
// The underlying ImageData can be much larger for extra detail,
// but the visual size stays constant so it never overlaps the UI.
const FIXED_DISPLAY_SIZE = 360;

const DEFAULT_RENDER_OPTIONS: RenderOptions = {
  scale: 2, // 2x for retina displays
  moduleSize: 10,
  smoothing: true,
};

/**
 * Render QR ImageData to canvas with high-DPI support
 */
export function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  imageData: ImageData,
  options: RenderOptions = {}
): void {
  const opts = { ...DEFAULT_RENDER_OPTIONS, ...options };
  const { scale = 2, smoothing = true } = opts;

  const imageSize = imageData.width; // High-res source size

  // On-screen size is fixed so the QR never "grows" and
  // covers nearby buttons or layout elements.
  const displaySize = FIXED_DISPLAY_SIZE;

  // Internal canvas size for high-DPI rendering
  canvas.width = displaySize * scale;
  canvas.height = displaySize * scale;
  canvas.style.width = `${displaySize}px`;
  canvas.style.height = `${displaySize}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas 2D context');
  }

  // Reset any existing transforms then scale for high-DPI
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(scale, scale);

  // Enable or disable smoothing depending on options
  ctx.imageSmoothingEnabled = smoothing;
  ctx.imageSmoothingQuality = smoothing ? 'high' : 'low';

  // Create temporary canvas for the image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageSize;
  tempCanvas.height = imageSize;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    throw new Error('Failed to get temporary canvas context');
  }

  // Put ImageData onto temporary canvas
  tempCtx.putImageData(imageData, 0, 0);

  // Draw high-res image downscaled into the fixed display area
  ctx.clearRect(0, 0, displaySize, displaySize);
  ctx.drawImage(tempCanvas, 0, 0, imageSize, imageSize, 0, 0, displaySize, displaySize);
}

/**
 * Export canvas to PNG blob
 */
export function canvasToPNG(
  canvas: HTMLCanvasElement,
  quality: number = 0.95
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      },
      'image/png',
      quality
    );
  });
}

/**
 * Download canvas as PNG file
 */
export async function downloadCanvasAsPNG(
  canvas: HTMLCanvasElement,
  filename: string = `artistic-qr-${Date.now()}.png`
): Promise<void> {
  const blob = await canvasToPNG(canvas);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Get canvas data URL for preview
 */
export function getCanvasDataURL(
  canvas: HTMLCanvasElement,
  type: string = 'image/png'
): string {
  return canvas.toDataURL(type);
}

/**
 * Clear canvas
 */
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Get optimal module size for given container dimensions
 */
export function calculateOptimalModuleSize(
  qrSize: number,
  containerWidth: number,
  containerHeight: number,
  maxModuleSize: number = 15
): number {
  const maxSize = Math.min(containerWidth, containerHeight);
  const calculatedSize = Math.floor(maxSize / qrSize);
  return Math.min(calculatedSize, maxModuleSize);
}

/**
 * Draw a loading placeholder on canvas
 */
export function drawLoadingPlaceholder(
  canvas: HTMLCanvasElement,
  message: string = 'Generating...'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw background
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0, 0, width, height);
  
  // Draw text
  ctx.fillStyle = '#6b7280';
  ctx.font = '16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, width / 2, height / 2);
}

/**
 * Draw error message on canvas
 */
export function drawErrorPlaceholder(
  canvas: HTMLCanvasElement,
  error: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw background
  ctx.fillStyle = '#fee2e2';
  ctx.fillRect(0, 0, width, height);
  
  // Draw error text
  ctx.fillStyle = '#dc2626';
  ctx.font = '14px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap error message
  const words = error.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width - 40 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Draw lines
  const lineHeight = 20;
  const startY = height / 2 - (lines.length * lineHeight) / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });
}

/**
 * Get actual pixel dimensions of canvas (accounting for DPI scaling)
 */
export function getCanvasActualSize(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
} {
  return {
    width: canvas.width,
    height: canvas.height,
    displayWidth: parseInt(canvas.style.width || '0'),
    displayHeight: parseInt(canvas.style.height || '0'),
  };
}
