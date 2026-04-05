/**
 * Logo Component
 * 
 * Displays the logo with fallback handling
 */

'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function Logo() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0 ${imageError ? 'bg-white/20 rounded-xl' : ''}`}>
      {!imageError && (
        <Image
          src="/logo.png"
          alt="boring qrs logo"
          width={56}
          height={56}
          className="object-contain"
          priority
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
}
