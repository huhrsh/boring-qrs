/**
 * DownloadButton Component
 * 
 * Downloads the generated QR code as PNG
 */

'use client'

import { useRef } from 'react'
import { downloadCanvasAsPNG } from '@/utils/canvas-renderer'

export interface DownloadButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  disabled?: boolean;
  filename?: string;
}

export default function DownloadButton({
  canvasRef,
  disabled = false,
  filename,
}: DownloadButtonProps) {
  const handleDownload = async () => {
    const canvas = canvasRef.current
    if (!canvas) {
      alert('No QR code to download')
      return
    }

    try {
      const downloadFilename = filename || `artistic-qr-${Date.now()}.png`
      await downloadCanvasAsPNG(canvas, downloadFilename)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download QR code. Please try again.')
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className={`
        w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-white text-base sm:text-lg
        transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl
        ${disabled
          ? 'bg-gray-400 cursor-not-allowed opacity-60'
          : 'bg-white text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 ring-4 ring-white hover:ring-cyan-300'
        }
      `}
      style={disabled ? {} : {
        background: 'white',
        backgroundClip: 'padding-box',
      }}
    >
      <span className={disabled ? '' : 'bg-gradient-to-r from-cyan-600 via-blue-700 to-purple-700 bg-clip-text text-transparent'}>
        {disabled ? 'Generating...' : 'Download PNG'}
      </span>
    </button>
  )
}
