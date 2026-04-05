/**
 * Type definitions for qrcode-generator
 * Minimal types for the specific functionality we use
 */

declare module 'qrcode-generator' {
  type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

  interface QRCode {
    addData(data: string): void;
    make(): void;
    getModuleCount(): number;
    isDark(row: number, col: number): boolean;
    createDataURL(cellSize?: number, margin?: number): string;
    createImgTag(cellSize?: number, margin?: number): string;
    createSvgTag(cellSize?: number, margin?: number): string;
  }

  function qrcode(typeNumber: number, errorCorrectionLevel: ErrorCorrectionLevel): QRCode;

  export = qrcode;
}
