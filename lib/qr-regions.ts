/**
 * QR Regions Helper
 * 
 * Identifies critical QR code regions that must be preserved for scannability:
 * - Finder patterns (3 corner squares)
 * - Timing patterns (alternating horizontal/vertical lines)
 * - Quiet zone (white border)
 * - Alignment patterns (for larger QR versions)
 */

/**
 * Check if coordinates are within a finder pattern (7x7 squares in corners)
 * Finder patterns are located at:
 * - Top-left: (0,0) to (6,6)
 * - Top-right: (size-7, 0) to (size-1, 6)
 * - Bottom-left: (0, size-7) to (6, size-1)
 */
export function isFinderPattern(x: number, y: number, size: number): boolean {
  // Top-left finder pattern
  if (x < 7 && y < 7) return true;
  
  // Top-right finder pattern
  if (x >= size - 7 && y < 7) return true;
  
  // Bottom-left finder pattern
  if (x < 7 && y >= size - 7) return true;
  
  return false;
}

/**
 * Check if coordinates are on a timing pattern
 * Timing patterns are alternating dark/light modules:
 * - Horizontal: row 6, from column 8 to size-9
 * - Vertical: column 6, from row 8 to size-9
 */
export function isTimingPattern(x: number, y: number, size: number): boolean {
  // Horizontal timing pattern (row 6)
  if (y === 6 && x >= 8 && x < size - 8) return true;
  
  // Vertical timing pattern (column 6)
  if (x === 6 && y >= 8 && y < size - 8) return true;
  
  return false;
}

/**
 * Check if coordinates are in the quiet zone (4-module white border)
 * Most QR code specs use 4 modules, but we'll use 2 for tighter fit
 */
export function isQuietZone(x: number, y: number, size: number, quietZoneWidth: number = 2): boolean {
  return (
    x < quietZoneWidth ||
    y < quietZoneWidth ||
    x >= size - quietZoneWidth ||
    y >= size - quietZoneWidth
  );
}

/**
 * Check if coordinates are on an alignment pattern
 * Alignment patterns appear in QR codes version 2 and above
 * They are 5x5 modules and help with scanning larger codes
 */
export function isAlignmentPattern(x: number, y: number, size: number, version: number): boolean {
  if (version < 2) return false;

  // Alignment pattern centers for each version
  const alignmentPatternPositions: { [key: number]: number[] } = {
    2: [18],
    3: [22],
    4: [26],
    5: [30],
    6: [34],
    7: [6, 22, 38],
    8: [6, 24, 42],
    9: [6, 26, 46],
    10: [6, 28, 50],
  };

  const positions = alignmentPatternPositions[version];
  if (!positions) return false;

  // Check if coordinate is near any alignment pattern center (within 2 modules)
  for (const centerX of positions) {
    for (const centerY of positions) {
      // Skip if this overlaps with finder patterns
      if ((centerX < 10 && centerY < 10) ||
          (centerX < 10 && centerY > size - 10) ||
          (centerX > size - 10 && centerY < 10)) {
        continue;
      }

      if (Math.abs(x - centerX) <= 2 && Math.abs(y - centerY) <= 2) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if a module position is safe to modify with artistic effects
 * Returns false for critical regions that must be preserved
 */
export function isSafeForModification(
  x: number, 
  y: number, 
  size: number, 
  version: number,
  preserveQuietZone: boolean = false
): boolean {
  // Always preserve finder patterns and timing patterns
  if (isFinderPattern(x, y, size)) return false;
  if (isTimingPattern(x, y, size)) return false;
  if (isAlignmentPattern(x, y, size, version)) return false;
  
  // Optionally preserve quiet zone
  if (preserveQuietZone && isQuietZone(x, y, size)) return false;
  
  return true;
}

/**
 * Get a map of all safe-to-modify positions
 * Useful for visualization and debugging
 */
export function getSafeModificationMap(size: number, version: number): boolean[][] {
  const map: boolean[][] = [];
  
  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      map[y][x] = isSafeForModification(x, y, size, version);
    }
  }
  
  return map;
}

/**
 * Calculate the percentage of modules that are safe to modify
 */
export function getSafeModificationPercentage(size: number, version: number): number {
  let safeCount = 0;
  const totalCount = size * size;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isSafeForModification(x, y, size, version)) {
        safeCount++;
      }
    }
  }
  
  return (safeCount / totalCount) * 100;
}
