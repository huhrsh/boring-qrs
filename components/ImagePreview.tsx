/**
 * ImagePreview Component
 * 
 * Displays thumbnail preview of uploaded or random image
 */

'use client'

export interface ImagePreviewProps {
  imageUrl?: string;
  imageName?: string;
  imageSize?: number;
  onClear: () => void;
}

export default function ImagePreview({
  imageUrl,
  imageName,
  imageSize,
  onClear,
}: ImagePreviewProps) {
  if (!imageUrl) {
    return null
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in">
      <div className="flex items-start gap-4">
        {/* Image Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {imageName || 'Uploaded Image'}
          </h3>
          {imageSize && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatFileSize(imageSize)}
            </p>
          )}
          <p className="text-xs text-green-600 dark:text-green-400 mt-2">
            ✓ Image loaded successfully
          </p>
        </div>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="flex-shrink-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Remove image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
