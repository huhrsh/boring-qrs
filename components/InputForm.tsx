/**
 * InputForm Component
 * 
 * User input controls for QR data, image upload, and generation options
 */

'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { validateImageFile } from '@/utils/image-processor'
import { canEncodeData } from '@/lib/qr-generator'

export interface InputFormProps {
  onQRDataChange: (data: string) => void;
  onImageUpload: (file: File) => void;
  onRandomImage: () => void;
  onClearImage: () => void;
  onStrengthChange: (strength: number) => void;
  onColorModeChange: (mode: 'grayscale' | 'color') => void;
  onDitheringChange: (enabled: boolean) => void;
  onDetailChange?: (detail: number) => void;
  qrData: string;
  strength: number;
  colorMode: 'grayscale' | 'color';
  ditheringEnabled: boolean;
  qrDetail?: number;
  hasImage: boolean;
  isLoadingRandom: boolean;
}

export default function InputForm({
  onQRDataChange,
  onImageUpload,
  onRandomImage,
  onClearImage,
  onStrengthChange,
  onColorModeChange,
  onDitheringChange,
  onDetailChange,
  qrData,
  strength,
  colorMode,
  ditheringEnabled,
  qrDetail = 15,
  hasImage,
  isLoadingRandom,
}: InputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [qrError, setQrError] = useState<string | null>(null)
  const [showBasics, setShowBasics] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Auto-collapse basics and open advanced when image is selected
  useEffect(() => {
    if (hasImage) {
      setShowBasics(false)
      setShowAdvanced(true)
    }
  }, [hasImage])

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file')
      return
    }

    setUploadError(null)
    onImageUpload(file)
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleQRDataChange = (value: string) => {
    const validation = canEncodeData(value)
    if (!validation.valid && value.trim() !== '') {
      setQrError(validation.error || 'Invalid data')
    } else {
      setQrError(null)
    }
    onQRDataChange(value)
  }

  return (
    <div className="w-full space-y-5">
      {/* SECTION 1: Quick Setup - URL & Image */}
      <div className="w-full">
        {/* Only show collapse button after image is selected */}
        {hasImage && (
          <button
            onClick={() => setShowBasics(!showBasics)}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 border-2 border-cyan-300 rounded-xl font-bold text-gray-900 text-sm transition-all shadow-md flex items-center justify-between mb-4"
          >
            <span>Quick Setup</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${showBasics ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Show content directly when no image, or based on showBasics when collapsed */}
        {(!hasImage || showBasics) && (
          <div className="w-full space-y-4">
            {/* QR Data Input */}
            <div>
              <label htmlFor="qr-data" className="block text-sm font-bold text-gray-900 mb-2">
                Your link or text
              </label>
              <input
                id="qr-data"
                type="text"
                value={qrData}
                onChange={(e) => handleQRDataChange(e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full px-4 py-3 sm:py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base"
              />
        {qrError && (
          <p className="mt-2 text-sm text-red-600 font-medium">{qrError}</p>
        )}
        <p className="mt-2 text-xs text-gray-500 font-medium">
          {qrData.length}/271 characters
        </p>
      </div>

      {/* Image Upload/Random */}
      <div>
        <label className="block text-sm font-bold text-gray-900 mb-3">
          Add your image (optional)
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 rounded-lg font-semibold text-sm transition-all active:scale-95"
          >
            Upload image
          </button>
          
          <button
            onClick={onRandomImage}
            disabled={isLoadingRandom}
            className="w-full px-4 py-2.5 sm:py-3 bg-gray-900 border-2 border-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingRandom ? 'Loading...' : 'Random image'}
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all
            ${ isDragging 
              ? 'border-cyan-500 bg-cyan-50 scale-[1.02]' 
              : 'border-gray-300 bg-white hover:border-cyan-400'
            }
          `}
        >
          <p className="text-sm text-gray-700 font-medium">
            or drag & drop your image here
          </p>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            JPG, PNG, WebP • Max 5MB
          </p>
        </div>

        {hasImage && (
          <button
            onClick={onClearImage}
            className="mt-3 w-full px-4 py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Remove image
          </button>
        )}

        {uploadError && (
          <p className="mt-2 text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg">{uploadError}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
          </div>
        )}
      </div>

    {/* SECTION 2: Advanced Tweaks - Collapsible */}
    {hasImage && (
      <div className="w-full">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 border-2 border-slate-300 rounded-xl font-bold text-gray-900 text-sm transition-all shadow-md flex items-center justify-between"
        >
          <span>Advanced Settings</span>
          <svg
            className={`w-4 h-4 transform transition-transform ${showAdvanced ? '' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="w-full mt-4 space-y-4 animate-in slide-in-from-top">
            {/* Image Strength Slider */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 sm:p-5 border-2 border-cyan-200">
              <label htmlFor="strength" className="block text-sm font-bold text-gray-900 mb-3">
                Image blend: {Math.round(strength * 100)}%
                {strength > 0.75 && (
                  <span className="ml-2 text-xs text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full font-bold">
                    May be harder to scan
                  </span>
                )}
                {strength >= 0.5 && strength <= 0.75 && (
                  <span className="ml-2 text-xs text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
                    Sweet spot
                  </span>
                )}
              </label>
              <p className="text-xs text-gray-700 mb-3 font-medium">
                How much of your image shows through
              </p>
              <input
                id="strength"
                type="range"
                min="0"
                max="100"
                value={strength * 100}
                onChange={(e) => onStrengthChange(parseInt(e.target.value) / 100)}
                className="w-full h-3 bg-gradient-to-r from-gray-300 via-cyan-400 to-blue-500 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-2 font-medium">
                <span>Clear</span>
                <span>Artistic</span>
              </div>
            </div>

            {/* Color Mode Toggle */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Color mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onColorModeChange('grayscale')}
                  className={`
                    px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg
                    ${colorMode === 'grayscale'
                      ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-xl'
                    }
                  `}
                >
                  Grayscale
                </button>
                <button
                  onClick={() => onColorModeChange('color')}
                  className={`
                    px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg
                    ${colorMode === 'color'
                      ? 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:shadow-xl'
                    }
                  `}
                >
                  Full color
                </button>
              </div>
            </div>

            {/* Dithering Toggle */}
            <div className="bg-white rounded-xl border-2 border-gray-200 px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-gray-900">
                Smoother gradients
              </p>
              <button
                id="dithering"
                onClick={() => onDitheringChange(!ditheringEnabled)}
                className={`
                  relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-all shadow-inner flex-shrink-0
                  ${ditheringEnabled ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform
                    ${ditheringEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* QR Detail Level Slider */}
            {onDetailChange && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-5 border-2 border-purple-200">
                <label htmlFor="detail" className="block text-sm font-bold text-gray-900 mb-3">
                  Detail level
                </label>
                <p className="text-xs text-gray-700 mb-3 font-medium">
                  Higher = more tiny squares, more detail
                </p>
                <div className="bg-white rounded-xl px-4 py-2 sm:py-3 mb-3 border-2 border-purple-200">
                  <span className="text-lg sm:text-xl font-bold text-purple-700">Level {qrDetail}</span>
                  <span className="text-xs text-gray-600 ml-2 font-medium">({21 + (qrDetail - 1) * 4} × {21 + (qrDetail - 1) * 4})</span>
                </div>
                <input
                  id="detail"
                  type="range"
                  min="5"
                  max="20"
                  value={qrDetail}
                  onChange={(e) => onDetailChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-700 mt-2 font-bold">
                  <span>Faster</span>
                  <span>Detailed</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
  )
}
