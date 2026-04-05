/**
 * QR to Image Mapper
 * 
 * Maps QR code modules to image pixels with artistic effects
 * while preserving scannability through contrast control and
 * critical region protection.
 */

import { isSafeForModification } from '@/lib/qr-regions';
import type { RGB } from './image-processor';

export interface MappingOptions {
  strength: number; // 0-1, blend between original QR and image
  colorMode: 'grayscale' | 'color';
  threshold: number; // Contrast threshold (0-255)
  preserveQuietZone: boolean;
  dithering?: boolean; // Add subtle dot-like texture in safe regions
}

export interface MappedQR {
  pixels: ImageData;
  size: number;
}

const DEFAULT_OPTIONS: MappingOptions = {
  strength: 0.7,
  colorMode: 'grayscale',
  threshold: 128,
  preserveQuietZone: false,
};

/**
 * Map QR modules to high-resolution image with sub-pixel detail
 * Each QR module is rendered as pixelsPerModule×pixelsPerModule image pixels
 */
export function mapQRToImageHighRes(
  qrModules: boolean[][],
  highResImage: HTMLImageElement | ImageData,
  version: number,
  options: Partial<MappingOptions> & { pixelsPerModule?: number } = {}
): MappedQR {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const pixelsPerModule = options.pixelsPerModule || 20; // Default 20 pixels per QR module
  const qrSize = qrModules.length;
  const outputSize = qrSize * pixelsPerModule;

  // Create high-res canvas
  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // Draw the high-res image
  if (highResImage instanceof HTMLImageElement) {
    ctx.drawImage(highResImage, 0, 0, outputSize, outputSize);
  } else {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = highResImage.width;
    tempCanvas.height = highResImage.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.putImageData(highResImage, 0, 0);
      ctx.drawImage(tempCanvas, 0, 0, outputSize, outputSize);
    }
  }

  // Get the high-res image data
  const imageData = ctx.getImageData(0, 0, outputSize, outputSize);
  const data = imageData.data;

  // Calculate dynamic threshold
  const threshold = calculateDynamicThresholdHighRes(qrModules, imageData, pixelsPerModule);

  // Apply QR pattern overlay with sub-pixel detail preservation
  for (let qrY = 0; qrY < qrSize; qrY++) {
    for (let qrX = 0; qrX < qrSize; qrX++) {
      const qrModule = qrModules[qrY][qrX];
      const isSafe = isSafeForModification(qrX, qrY, qrSize, version, opts.preserveQuietZone);

      // Process each pixel within this QR module
      for (let py = 0; py < pixelsPerModule; py++) {
        for (let px = 0; px < pixelsPerModule; px++) {
          const pixelY = qrY * pixelsPerModule + py;
          const pixelX = qrX * pixelsPerModule + px;
          const idx = (pixelY * outputSize + pixelX) * 4;

          if (!isSafe) {
            // Critical regions: use image colors but with strong contrast
            // Instead of pure black/white, darken/lighten the actual pixel colors
            let r = data[idx];
            let g = data[idx + 1];
            let b = data[idx + 2];

            if (qrModule) {
              // Dark module: use darkened image color (55% of original brightness for better visibility)
              const darkenFactor = 0.55;
              data[idx] = Math.round(r * darkenFactor);
              data[idx + 1] = Math.round(g * darkenFactor);
              data[idx + 2] = Math.round(b * darkenFactor);
            } else {
              // Light module: use bright white for maximum contrast
              data[idx] = 255;
              data[idx + 1] = 255;
              data[idx + 2] = 255;
            }
          } else {
            // Safe regions: blend image with QR pattern
            let r = data[idx];
            let g = data[idx + 1];
            let b = data[idx + 2];

            // Optional subtle dithering-style noise in safe regions only.
            // This does not break contrast rules but gives a more textured look.
            if (opts.dithering) {
              const noiseStrength = 0.12; // 0-1, keep small for safety
              const jitter = () => (Math.random() - 0.5) * 255 * noiseStrength;
              r = Math.max(0, Math.min(255, r + jitter()));
              g = Math.max(0, Math.min(255, g + jitter()));
              b = Math.max(0, Math.min(255, b + jitter()));
            }

            if (opts.colorMode === 'color') {
              // Color mode: adjust brightness while preserving color
              const brightness = (r + g + b) / 3;
              let targetBrightness: number;

              if (qrModule) {
                // Dark module: darken the image (reduced strength for more image visibility)
                targetBrightness = brightness * (1 - opts.strength * 0.45);
                targetBrightness = Math.min(targetBrightness, threshold - 20);
              } else {
                // Light module: lighten the image  
                const lighten = 1 + opts.strength * 0.35;
                targetBrightness = brightness * lighten;
                targetBrightness = Math.max(targetBrightness, threshold + 20);
              }

              const factor = brightness > 0 ? targetBrightness / brightness : 1;
              data[idx] = Math.min(255, r * factor);
              data[idx + 1] = Math.min(255, g * factor);
              data[idx + 2] = Math.min(255, b * factor);
            } else {
              // Grayscale mode
              const gray = (r + g + b) / 3;
              let newGray: number;

              if (qrModule) {
                // Dark module (reduced strength for more image visibility)
                newGray = gray * (1 - opts.strength * 0.45);
                newGray = Math.min(newGray, threshold - 20);
              } else {
                // Light module
                newGray = gray + (255 - gray) * opts.strength * 0.35;
                newGray = Math.max(newGray, threshold + 20);
              }

              const value = Math.round(Math.max(0, Math.min(255, newGray)));
              data[idx] = value;
              data[idx + 1] = value;
              data[idx + 2] = value;
            }
          }
          data[idx + 3] = 255; // Alpha
        }
      }
    }
  }

  return { pixels: imageData, size: outputSize };
}

/**
 * Calculate dynamic threshold from high-res image
 */
function calculateDynamicThresholdHighRes(
  qrModules: boolean[][],
  imageData: ImageData,
  pixelsPerModule: number
): number {
  let sum = 0;
  let count = 0;

  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const idx = (y * imageData.width + x) * 4;
      const brightness = (imageData.data[idx] + imageData.data[idx + 1] + imageData.data[idx + 2]) / 3;
      sum += brightness;
      count++;
    }
  }

  return sum / count;
}

/**
 * Map QR modules to image pixels with artistic blending
 */
export function mapQRToImage(
  qrModules: boolean[][],
  grayscale: number[][],
  colorData: RGB[][] | undefined,
  version: number,
  options: Partial<MappingOptions> = {}
): MappedQR {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const size = qrModules.length;

  // Validate inputs
  if (grayscale.length !== size || grayscale[0].length !== size) {
    throw new Error('Image size must match QR matrix size');
  }

  if (opts.colorMode === 'color' && !colorData) {
    throw new Error('Color data required for color mode');
  }

  // Create ImageData for canvas rendering
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  const imageData = ctx.createImageData(size, size);
  const { data } = imageData;

  // Calculate dynamic threshold based on image statistics
  const dynamicThreshold = calculateDynamicThreshold(grayscale, opts.threshold);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const qrModule = qrModules[y][x]; // true = dark, false = light
      const isSafe = isSafeForModification(x, y, size, version, opts.preserveQuietZone);

      let r: number, g: number, b: number;

      if (!isSafe) {
        // Critical regions: preserve original QR pattern
        [r, g, b] = qrModule ? [0, 0, 0] : [255, 255, 255];
      } else {
        // Safe regions: blend QR with image
        if (opts.colorMode === 'color' && colorData) {
          [r, g, b] = mapColorModule(
            qrModule,
            colorData[y][x],
            grayscale[y][x],
            dynamicThreshold,
            opts.strength
          );
        } else {
          const gray = mapGrayscaleModule(
            qrModule,
            grayscale[y][x],
            dynamicThreshold,
            opts.strength
          );
          [r, g, b] = [gray, gray, gray];
        }
      }

      const idx = (y * size + x) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255; // Alpha
    }
  }

  return {
    pixels: imageData,
    size,
  };
}

/**
 * Map a single grayscale module
 */
function mapGrayscaleModule(
  qrModule: boolean,
  imageValue: number,
  threshold: number,
  strength: number
): number {
  // Original QR values
  const qrDark = 0;
  const qrLight = 255;
  const originalValue = qrModule ? qrDark : qrLight;

  // Map image to appropriate range
  let mappedValue: number;
  if (qrModule) {
    // Dark module: map to darker portion of image (0 to threshold)
    mappedValue = (imageValue / 255) * threshold;
  } else {
    // Light module: map to lighter portion of image (threshold to 255)
    mappedValue = threshold + ((imageValue / 255) * (255 - threshold));
  }

  // Blend based on strength
  const blended = (1 - strength) * originalValue + strength * mappedValue;

  // Ensure contrast is maintained
  const final = qrModule 
    ? Math.min(blended, threshold - 20) // Keep dark modules dark
    : Math.max(blended, threshold + 20); // Keep light modules light

  return Math.round(Math.max(0, Math.min(255, final)));
}

/**
 * Map a single color module
 */
function mapColorModule(
  qrModule: boolean,
  imageColor: RGB,
  imageBrightness: number,
  threshold: number,
  strength: number
): [number, number, number] {
  const qrDark = 0;
  const qrLight = 255;

  // Calculate target brightness range
  let targetBrightness: number;
  if (qrModule) {
    // Dark module: use darker version of image color
    targetBrightness = (imageBrightness / 255) * (threshold * 0.8);
  } else {
    // Light module: use lighter version or white
    targetBrightness = threshold + ((imageBrightness / 255) * (255 - threshold));
  }

  // Calculate brightness adjustment factor
  const currentBrightness = (imageColor.r + imageColor.g + imageColor.b) / 3;
  const factor = currentBrightness > 0 
    ? targetBrightness / currentBrightness 
    : 1;

  // Apply factor to color channels
  let r = imageColor.r * factor;
  let g = imageColor.g * factor;
  let b = imageColor.b * factor;

  // Blend with original QR
  const originalValue = qrModule ? qrDark : qrLight;
  r = (1 - strength) * originalValue + strength * r;
  g = (1 - strength) * originalValue + strength * g;
  b = (1 - strength) * originalValue + strength * b;

  // Clamp values
  r = Math.round(Math.max(0, Math.min(255, r)));
  g = Math.round(Math.max(0, Math.min(255, g)));
  b = Math.round(Math.max(0, Math.min(255, b)));

  return [r, g, b];
}

/**
 * Calculate dynamic threshold based on image statistics
 * Ensures good contrast even for low-contrast images
 */
function calculateDynamicThreshold(grayscale: number[][], baseThreshold: number): number {
  let min = 255;
  let max = 0;
  let sum = 0;
  let count = 0;

  for (const row of grayscale) {
    for (const value of row) {
      min = Math.min(min, value);
      max = Math.max(max, value);
      sum += value;
      count++;
    }
  }

  const average = sum / count;
  const range = max - min;

  // If image has low contrast, use average as threshold
  if (range < 80) {
    return average;
  }

  // Otherwise, use base threshold adjusted to image characteristics
  return Math.max(
    min + 40, // At least 40 above minimum
    Math.min(
      max - 40, // At least 40 below maximum
      baseThreshold
    )
  );
}

/**
 * Generate a standard QR code without image (fallback)
 */
export function generateStandardQR(qrModules: boolean[][]): MappedQR {
  const size = qrModules.length;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  const imageData = ctx.createImageData(size, size);
  const { data } = imageData;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = qrModules[y][x] ? 0 : 255;
      const idx = (y * size + x) * 4;
      data[idx] = value;     // R
      data[idx + 1] = value; // G
      data[idx + 2] = value; // B
      data[idx + 3] = 255;   // A
    }
  }

  return { pixels: imageData, size };
}

/**
 * Validate that QR has sufficient contrast
 * Returns true if contrast meets minimum requirements
 */
export function validateQRContrast(pixels: ImageData, qrModules: boolean[][]): {
  valid: boolean;
  contrast: number;
  message?: string;
} {
  const pixelsPerModule = Math.floor(pixels.width / qrModules.length);
  const size = qrModules.length;
  let darkSum = 0;
  let darkCount = 0;
  let lightSum = 0;
  let lightCount = 0;

  for (let qrY = 0; qrY < size; qrY++) {
    for (let qrX = 0; qrX < size; qrX++) {
      // Sample center pixel of each module
      const pixelY = qrY * pixelsPerModule + Math.floor(pixelsPerModule / 2);
      const pixelX = qrX * pixelsPerModule + Math.floor(pixelsPerModule / 2);
      const idx = (pixelY * pixels.width + pixelX) * 4;
      const brightness = (pixels.data[idx] + pixels.data[idx + 1] + pixels.data[idx + 2]) / 3;

      if (qrModules[qrY][qrX]) {
        darkSum += brightness;
        darkCount++;
      } else {
        lightSum += brightness;
        lightCount++;
      }
    }
  }

  const avgDark = darkSum / darkCount;
  const avgLight = lightSum / lightCount;
  const contrast = avgLight / (avgDark + 1);

  const valid = contrast >= 3.0 && avgDark < 100 && avgLight > 155;

  return {
    valid,
    contrast,
    message: valid 
      ? 'QR contrast is good' 
      : `Low contrast (${contrast.toFixed(1)}:1). Consider reducing image strength or choosing a higher-contrast image.`,
  };
}
