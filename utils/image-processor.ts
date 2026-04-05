/**
 * Image Processing Utilities
 * 
 * Handles image loading, validation, resizing, grayscale conversion,
 * and Floyd-Steinberg dithering for artistic QR code generation.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export interface ProcessedImage {
  grayscale: number[][]; // 2D array of grayscale values (0-255)
  color?: RGB[][]; // Optional color data
  width: number;
  height: number;
  original: HTMLImageElement;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Validate uploaded image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_FORMATS.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid format. Allowed: JPG, PNG, WebP` 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB` 
    };
  }

  return { valid: true };
}

/**
 * Load an image file and return HTMLImageElement
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Load image from URL (for Unsplash integration)
 */
export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for canvas manipulation
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image from URL'));
    
    img.src = url;
  });
}

/**
 * Resize image to match QR matrix size using canvas
 */
export function resizeToMatrix(img: HTMLImageElement, targetSize: number): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Draw image scaled to target size
  ctx.drawImage(img, 0, 0, targetSize, targetSize);

  // Get pixel data
  return ctx.getImageData(0, 0, targetSize, targetSize);
}

/**
 * Convert ImageData to grayscale using luminance formula
 * Uses standard ITU-R BT.709 coefficients
 */
export function convertToGrayscale(imageData: ImageData): number[][] {
  const { width, height, data } = imageData;
  const grayscale: number[][] = [];

  for (let y = 0; y < height; y++) {
    grayscale[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // ITU-R BT.709 luma coefficients
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      grayscale[y][x] = Math.round(gray);
    }
  }

  return grayscale;
}

/**
 * Extract color data from ImageData
 */
export function extractColorData(imageData: ImageData): RGB[][] {
  const { width, height, data } = imageData;
  const colors: RGB[][] = [];

  for (let y = 0; y < height; y++) {
    colors[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      colors[y][x] = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
      };
    }
  }

  return colors;
}

/**
 * Apply Floyd-Steinberg dithering to grayscale image
 * Improves appearance by distributing quantization error
 */
export function applyDithering(grayscale: number[][]): number[][] {
  const height = grayscale.length;
  const width = grayscale[0].length;
  
  // Create copy to avoid modifying original
  const dithered: number[][] = grayscale.map(row => [...row]);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldPixel = dithered[y][x];
      const newPixel = oldPixel < 128 ? 0 : 255; // Binary threshold
      dithered[y][x] = newPixel;

      const error = oldPixel - newPixel;

      // Distribute error to neighboring pixels
      if (x + 1 < width) {
        dithered[y][x + 1] += error * 7 / 16;
      }
      if (y + 1 < height) {
        if (x > 0) {
          dithered[y + 1][x - 1] += error * 3 / 16;
        }
        dithered[y + 1][x] += error * 5 / 16;
        if (x + 1 < width) {
          dithered[y + 1][x + 1] += error * 1 / 16;
        }
      }
    }
  }

  return dithered;
}

/**
 * Process image file for QR code generation
 */
export async function processImage(
  file: File,
  targetSize: number,
  options: {
    dithering?: boolean;
    extractColor?: boolean;
  } = {}
): Promise<ProcessedImage> {
  const img = await loadImage(file);
  const imageData = resizeToMatrix(img, targetSize);
  const grayscale = convertToGrayscale(imageData);

  const processed: ProcessedImage = {
    grayscale: options.dithering ? applyDithering(grayscale) : grayscale,
    width: targetSize,
    height: targetSize,
    original: img,
  };

  if (options.extractColor) {
    processed.color = extractColorData(imageData);
  }

  return processed;
}

/**
 * Process image from URL (for Unsplash)
 */
export async function processImageFromUrl(
  url: string,
  targetSize: number,
  options: {
    dithering?: boolean;
    extractColor?: boolean;
  } = {}
): Promise<ProcessedImage> {
  const img = await loadImageFromUrl(url);
  const imageData = resizeToMatrix(img, targetSize);
  const grayscale = convertToGrayscale(imageData);

  const processed: ProcessedImage = {
    grayscale: options.dithering ? applyDithering(grayscale) : grayscale,
    width: targetSize,
    height: targetSize,
    original: img,
  };

  if (options.extractColor) {
    processed.color = extractColorData(imageData);
  }

  return processed;
}

/**
 * Calculate average brightness of image (0-255)
 */
export function getAverageBrightness(grayscale: number[][]): number {
  let sum = 0;
  let count = 0;

  for (const row of grayscale) {
    for (const value of row) {
      sum += value;
      count++;
    }
  }

  return count > 0 ? sum / count : 128;
}

/**
 * Calculate contrast ratio between darkest and lightest values
 */
export function getContrastRatio(grayscale: number[][]): number {
  let min = 255;
  let max = 0;

  for (const row of grayscale) {
    for (const value of row) {
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
  }

  // Prevent division by zero
  if (min === 0) min = 1;

  return max / min;
}
