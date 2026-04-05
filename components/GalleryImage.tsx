/**
 * GalleryImage Component
 * 
 * Gallery image with fallback placeholder
 */

'use client'

import Image from 'next/image'
import { useState } from 'react'

interface GalleryImageProps {
  src: string;
  alt: string;
  placeholderColor: 'cyan' | 'purple' | 'emerald';
}

export default function GalleryImage({ src, alt, placeholderColor }: GalleryImageProps) {
  const [imageError, setImageError] = useState(false)

  const colorClasses = {
    cyan: 'text-cyan-600',
    purple: 'text-purple-600',
    emerald: 'text-emerald-600',
  }

  return (
    <>
      {!imageError && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          onError={() => setImageError(true)}
        />
      )}
      {imageError && (
        <span className={`${colorClasses[placeholderColor]} text-sm font-medium absolute inset-0 flex items-center justify-center`}>
          Your QR here
        </span>
      )}
    </>
  )
}
