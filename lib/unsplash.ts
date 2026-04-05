/**
 * Unsplash API Integration
 * 
 * Fetches random scenic images for artistic QR code generation
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com'
const ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
  alt_description: string | null;
}

/**
 * Fetch a random scenic photo from Unsplash
 */
export async function fetchRandomScenicPhoto(
  query: string = 'nature,landscape,mountains,ocean,forest,scenic'
): Promise<UnsplashPhoto> {
  if (!ACCESS_KEY) {
    throw new Error('Unsplash API key not configured. Please set NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in .env.local')
  }

  const params = new URLSearchParams({
    query,
    orientation: 'landscape',
    content_filter: 'high',
  })

  const response = await fetch(
    `${UNSPLASH_API_URL}/photos/random?${params}`,
    {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data as UnsplashPhoto
}

/**
 * Download trigger for Unsplash photo (required by API guidelines)
 */
export async function triggerDownload(downloadUrl: string): Promise<void> {
  if (!ACCESS_KEY) return

  try {
    await fetch(downloadUrl, {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    })
  } catch (error) {
    console.error('Failed to trigger Unsplash download:', error)
  }
}

/**
 * Get optimized image URL for specific size
 */
export function getOptimizedImageUrl(
  photo: UnsplashPhoto,
  width: number = 800
): string {
  return `${photo.urls.raw}&w=${width}&q=80&fit=max`
}

/**
 * Check if Unsplash API is configured
 */
export function isUnsplashConfigured(): boolean {
  return !!ACCESS_KEY && ACCESS_KEY !== 'your_unsplash_access_key_here'
}
