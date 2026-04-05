/**
 * QR Code Generator Module
 * 
 * Generates QR code matrices with auto-scaling based on data length.
 * Uses high error correction (H level) for 30% error tolerance.
 */

import qrcode from 'qrcode-generator';

export interface QRMatrix {
  modules: boolean[][];
  size: number;
  version: number;
}

/**
 * Generate a QR code matrix from text/URL data
 * 
 * @param data - The text or URL to encode in the QR code
 * @param errorCorrectionLevel - Error correction level (default: 'H' for high)
 * @param forceVersion - Force a specific QR version for more modules (optional)
 * @returns QR matrix with modules (2D boolean array) and metadata
 */
export function generateQRMatrix(
  data: string,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'H',
  forceVersion?: number
): QRMatrix {
  if (!data || data.trim() === '') {
    throw new Error('QR code data cannot be empty');
  }

  // Use forced version for higher resolution, or auto-detect
  // Higher version = more modules = more detail for artistic rendering
  const typeNumber = forceVersion || 0; // 0 = auto-detect
  const qr = qrcode(typeNumber, errorCorrectionLevel);
  qr.addData(data);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const modules: boolean[][] = [];

  // Build 2D boolean array representing QR modules
  // true = dark module, false = light module
  for (let row = 0; row < moduleCount; row++) {
    modules[row] = [];
    for (let col = 0; col < moduleCount; col++) {
      modules[row][col] = qr.isDark(row, col);
    }
  }

  // Calculate QR version from module count
  // Version formula: (moduleCount - 21) / 4 + 1
  const version = Math.floor((moduleCount - 21) / 4) + 1;

  return {
    modules,
    size: moduleCount,
    version,
  };
}

/**
 * Get recommended version for given data length
 * Useful for UI feedback about QR complexity
 */
export function getRecommendedVersion(dataLength: number): number {
  // Approximate capacity at H error correction level
  const capacities = [
    { version: 1, capacity: 17 },
    { version: 2, capacity: 32 },
    { version: 3, capacity: 53 },
    { version: 4, capacity: 78 },
    { version: 5, capacity: 106 },
    { version: 6, capacity: 134 },
    { version: 7, capacity: 154 },
    { version: 8, capacity: 192 },
    { version: 9, capacity: 230 },
    { version: 10, capacity: 271 },
  ];

  for (const { version, capacity } of capacities) {
    if (dataLength <= capacity) {
      return version;
    }
  }

  return 10; // Max supported version
}

/**
 * Validate if data can be encoded in a QR code
 */
export function canEncodeData(data: string): { valid: boolean; error?: string } {
  if (!data || data.trim() === '') {
    return { valid: false, error: 'Data cannot be empty' };
  }

  // Check if data is too long for version 10
  if (data.length > 271) {
    return { 
      valid: false, 
      error: 'Data is too long (max 271 characters for H error correction). Consider shortening your URL.' 
    };
  }

  return { valid: true };
}
