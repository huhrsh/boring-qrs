'use client'

import { useState, useRef, useCallback } from 'react'
import QRCanvas from '@/components/QRCanvas'
import InputForm from '@/components/InputForm'
import ImagePreview from '@/components/ImagePreview'
import DownloadButton from '@/components/DownloadButton'
import GalleryImage from '@/components/GalleryImage'
import { fetchRandomScenic } from '@/lib/random-image-fetcher'
import type { MappingOptions } from '@/utils/qr-image-mapper'

export default function HomePage() {
  // QR Data
  const [qrData, setQrData] = useState('')

  // Image State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const [isLoadingRandom, setIsLoadingRandom] = useState(false)
  const [photoAttribution, setPhotoAttribution] = useState<{
    photographerName: string;
    photographerUrl: string;
  } | undefined>()

  // QR Options
  const [strength, setStrength] = useState(0.7)
  const [colorMode, setColorMode] = useState<'grayscale' | 'color'>('grayscale')
  const [ditheringEnabled, setDitheringEnabled] = useState(false)
  const [qrDetail, setQrDetail] = useState(15) // QR version for detail level

  // QR Generation State
  const [isGeneratingQR, setIsGeneratingQR] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const randomImageObjectUrlRef = useRef<string | null>(null)

  // Process uploaded image
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setUploadedFile(file)
      setImageUrl(URL.createObjectURL(file))
      setPhotoAttribution(undefined)
    } catch (error) {
      console.error('Failed to process image:', error)
      alert('Failed to process image. Please try another file.')
    }
  }, [])

  // Fetch random scenic image (only when explicitly requested)
  const handleRandomImage = useCallback(async () => {
    setIsLoadingRandom(true)
    try {
      const { url, attribution } = await fetchRandomScenic()
      // Fetch the image bytes once and create a stable object URL
      const response = await fetch(url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)

      // Cleanup any previous random image URL to avoid memory leaks
      if (randomImageObjectUrlRef.current) {
        URL.revokeObjectURL(randomImageObjectUrlRef.current)
      }
      randomImageObjectUrlRef.current = objectUrl

      setUploadedFile(null)
      setImageUrl(objectUrl)
      setPhotoAttribution(attribution)
    } catch (error) {
      console.error('Failed to fetch random image:', error)
      alert('Failed to load random image. Please try again.')
    } finally {
      setIsLoadingRandom(false)
    }
  }, []) // Empty deps - only fetches when button clicked, not on URL change

  // Clear image
  const handleClearImage = useCallback(() => {
    setUploadedFile(null)
    setImageUrl(undefined)
    setPhotoAttribution(undefined)

    if (randomImageObjectUrlRef.current) {
      URL.revokeObjectURL(randomImageObjectUrlRef.current)
      randomImageObjectUrlRef.current = null
    }
  }, [])

  // Handle option changes
  const handleColorModeChange = useCallback((mode: 'grayscale' | 'color') => {
    setColorMode(mode)
  }, [])

  const handleDitheringChange = useCallback((enabled: boolean) => {
    setDitheringEnabled(enabled)
  }, [])

  const mappingOptions: Partial<MappingOptions> = {
    strength,
    colorMode,
    threshold: 128,
    preserveQuietZone: true,
    dithering: ditheringEnabled,
  }

  const qrOptions = {
    version: qrDetail,
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
      {/* Hero */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2">
          Create QR Codes That
          <br className="hidden sm:block" />
          <span className="text-cyan-200"> Actually Look Good</span>
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed px-2">
          Free, no-login QR generator. Blend images, pick colors, download instantly.
          <br className="hidden sm:block" />
          All processing happens in your browser.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-8">
        {/* Left Column: Input Controls */}
        <div className="w-full space-y-5">
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5">
              Configure your QR
            </h3>
            <InputForm
              qrData={qrData}
              onQRDataChange={setQrData}
              onImageUpload={handleImageUpload}
              onRandomImage={handleRandomImage}
              onClearImage={handleClearImage}
              onStrengthChange={setStrength}
              onColorModeChange={handleColorModeChange}
              onDitheringChange={handleDitheringChange}
              onDetailChange={setQrDetail}
              strength={strength}
              colorMode={colorMode}
              ditheringEnabled={ditheringEnabled}
              qrDetail={qrDetail}
              hasImage={!!imageUrl}
              isLoadingRandom={isLoadingRandom}
            />
          </div>

          {/* Image Preview - Hidden, using image in QR directly */}

          {/* Photo Attribution */}
          {photoAttribution && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
              <p className="font-medium mb-1">📸 Photo Credit</p>
              Photo by{' '}
              <a
                href={photoAttribution.photographerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-900 transition-colors"
              >
                {photoAttribution.photographerName}
              </a>
              {' '}on{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline hover:text-blue-900 transition-colors"
              >
                Unsplash
              </a>
            </div>
          )}
        </div>

        {/* Right Column: QR Preview & Download */}
        <div className="w-full space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="w-full bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 text-center">
              Live preview
            </h3>
            <QRCanvas
              qrData={qrData}
              imageSource={{ file: uploadedFile, url: imageUrl }}
              options={mappingOptions}
              qrVersion={qrDetail}
              moduleSize={10}
              onQRGenerated={(success) => setIsGeneratingQR(!success)}
              canvasRef={canvasRef}
            />
          </div>

          {/* Download Button */}
          <DownloadButton
            canvasRef={canvasRef}
            disabled={!qrData || isGeneratingQR}
            filename={`boring-qr-${Date.now()}.png`}
          />

          {/* Tips */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-4 sm:p-5 shadow-lg">
            <h4 className="text-sm font-bold text-cyan-900 mb-3">
              Pro tips for best results
            </h4>
            <ul className="text-xs sm:text-sm text-cyan-900 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold text-base">•</span>
                <span><strong>Strength 50-70%</strong> balances art and scannability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold text-base">•</span>
                <span><strong>High-contrast photos</strong> work best</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-600 font-bold text-base">•</span>
                <span><strong>Test before printing</strong> with your phone camera</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Example gallery */}
      <section className="mt-8 sm:mt-12 lg:mt-16 mb-6 sm:mb-8 lg:mb-12">
        <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
            What You Can Create
          </h3>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            Transform boring QR codes into branded, artistic designs
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {/* Portrait QR Example */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-white/50 p-5 flex flex-col shadow-xl">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 mb-3 relative overflow-hidden">
              <GalleryImage
                src="/examples/qr-portrait.png"
                alt="Portrait QR code example"
                placeholderColor="cyan"
              />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Portrait QR</h4>
            <p className="text-xs text-gray-600">
              Personal branding, social profiles, digital business cards
            </p>
          </div>

          {/* Landscape QR Example */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-white/50 p-5 flex flex-col shadow-xl">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 mb-3 relative overflow-hidden">
              <GalleryImage
                src="/examples/qr-landscape.png"
                alt="Landscape QR code example"
                placeholderColor="purple"
              />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Landscape QR</h4>
            <p className="text-xs text-gray-600">
              Scenic photos, travel destinations, nature photography
            </p>
          </div>

          {/* Brand QR Example */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-white/50 p-5 flex flex-col shadow-xl">
            <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 mb-3 relative overflow-hidden">
              <GalleryImage
                src="/examples/qr-brand.png"
                alt="Brand QR code example"
                placeholderColor="emerald"
              />
            </div>
            <h4 className="text-sm font-bold text-gray-900 mb-1">Brand QR</h4>
            <p className="text-xs text-gray-600">
              Marketing materials, posters, event signage, flyers
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}