/**
 * Random Image Fetcher
 * 
 * Fetches and caches random scenic images from Unsplash
 */

import { fetchRandomScenicPhoto, getOptimizedImageUrl, triggerDownload, isUnsplashConfigured } from './unsplash'

// Cache for recently fetched images
const imageCache: string[] = []
const CACHE_SIZE = 10

/**
 * Fetch a random scenic image URL
 * Returns cached image if Unsplash is not configured
 */
export async function fetchRandomScenic(): Promise<{
  url: string;
  attribution?: {
    photographerName: string;
    photographerUrl: string;
  };
}> {
  // Check if Unsplash is configured
  if (!isUnsplashConfigured()) {
    // Fallback to placeholder service
    return {
      url: `https://picsum.photos/800/800?random=${Date.now()}`,
    }
  }

  try {
    const photo = await fetchRandomScenicPhoto()
    const imageUrl = getOptimizedImageUrl(photo, 800)

    // Add to cache
    imageCache.push(imageUrl)
    if (imageCache.length > CACHE_SIZE) {
      imageCache.shift()
    }

    // Trigger download as per Unsplash API guidelines
    if (photo.urls.full) {
      triggerDownload(photo.urls.full)
    }

    return {
      url: imageUrl,
      attribution: {
        photographerName: photo.user.name,
        photographerUrl: `https://unsplash.com/@${photo.user.username}`,
      },
    }
  } catch (error) {
    console.error('Failed to fetch from Unsplash:', error)
    
    // Fallback to cached image or placeholder
    if (imageCache.length > 0) {
      const randomIndex = Math.floor(Math.random() * imageCache.length)
      return { url: imageCache[randomIndex] }
    }

    // Ultimate fallback
    return {
      url: `https://picsum.photos/800/800?random=${Date.now()}`,
    }
  }
}

/**
 * Preload multiple random images for better UX
 */
export async function preloadRandomImages(count: number = 5): Promise<void> {
  if (!isUnsplashConfigured()) return

  try {
    const promises = Array.from({ length: count }, () => fetchRandomScenic())
    await Promise.allSettled(promises)
  } catch (error) {
    console.error('Failed to preload images:', error)
  }
}

/**
 * Clear image cache
 */
export function clearImageCache(): void {
  imageCache.length = 0
}
