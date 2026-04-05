/**
 * QRCanvas Component
 * 
 * Renders QR code on HTML canvas with live preview updates
 */

'use client'

import { useRef, useEffect, useState } from 'react'
import { generateQRMatrix } from '@/lib/qr-generator'
import { mapQRToImageHighRes, generateStandardQR, validateQRContrast } from '@/utils/qr-image-mapper'
import { renderQRToCanvas, drawLoadingPlaceholder, drawErrorPlaceholder } from '@/utils/canvas-renderer'
import { loadImage, loadImageFromUrl } from '@/utils/image-processor'
import type { MappingOptions } from '@/utils/qr-image-mapper'

export interface QRCanvasProps {
  qrData: string;
  imageSource?: { file: File | null; url: string | undefined };
  options: Partial<MappingOptions>;
  qrVersion?: number;
  moduleSize?: number;
  onQRGenerated?: (success: boolean, message?: string) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export default function QRCanvas({
  qrData,
  imageSource,
  options,
  qrVersion = 15,
  moduleSize = 10,
  onQRGenerated,
  canvasRef: externalCanvasRef,
}: QRCanvasProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = externalCanvasRef || internalCanvasRef
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contrastWarning, setContrastWarning] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Reset states
    setError(null)
    setContrastWarning(null)

    // Show loading state
    if (!qrData || qrData.trim() === '') {
      drawLoadingPlaceholder(canvas, 'Enter text or URL to generate QR code')
      return
    }

    setIsGenerating(true)

    // Use setTimeout to prevent blocking UI
    setTimeout(async () => {
      try {
        const hasImage = !!(imageSource?.file || imageSource?.url)

        // Generate QR matrix
        // - With image: force higher version for more modules/detail
        // - Without image: let library auto-pick the smallest reliable version
        const qrMatrix = hasImage
          ? generateQRMatrix(qrData, 'H', qrVersion)
          : generateQRMatrix(qrData, 'H')

        // Map QR to image or generate standard QR
        let mappedQR
        if (hasImage) {
          // Load high-resolution image (don't downsample yet)
          const highResImage = imageSource.file
            ? await loadImage(imageSource.file)
            : await loadImageFromUrl(imageSource.url!)

          // Map QR to high-res image with multiple pixels per module
          // More modules × fewer pixels per module = more visible detail
          mappedQR = mapQRToImageHighRes(
            qrMatrix.modules,
            highResImage,
            qrMatrix.version,
            { ...options, pixelsPerModule: 8 }
          )

          // Validate contrast (use downsampled version for validation)
          const contrastCheck = validateQRContrast(mappedQR.pixels, qrMatrix.modules)
          if (!contrastCheck.valid) {
            setContrastWarning(contrastCheck.message || 'Low contrast detected')
          }
        } else {
          mappedQR = generateStandardQR(qrMatrix.modules)
        }

        // Render to canvas
        renderQRToCanvas(canvas, mappedQR.pixels, {
          scale: 2,
          smoothing: hasImage,
        })

        setIsGenerating(false)
        onQRGenerated?.(true)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to generate QR code'
        setError(errorMsg)
        drawErrorPlaceholder(canvas, errorMsg)
        setIsGenerating(false)
        onQRGenerated?.(false, errorMsg)
      }
    }, 10)
  }, [qrData, imageSource, options, moduleSize, onQRGenerated, canvasRef])

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-2xl border-2 border-gray-200 w-full flex justify-center">
        <canvas
          ref={canvasRef}
          className="border-2 border-gray-300 rounded-xl max-w-full h-auto"
          style={{ width: '360px', height: '360px' }}
          width={360}
          height={360}
        />
        {isGenerating && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-cyan-600"></div>
              <p className="text-sm font-bold text-gray-900">Generating...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-800 px-5 py-4 rounded-xl text-sm max-w-md shadow-lg">
          <strong className="font-bold">Error:</strong>
          <span className="font-medium"> {error}</span>
        </div>
      )}

      {contrastWarning && !error && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 text-yellow-900 px-5 py-4 rounded-xl text-sm max-w-md shadow-lg">
          <strong className="font-bold">Tip:</strong>
          <span className="font-medium"> {contrastWarning}</span>
        </div>
      )}
    </div>
  )
}
