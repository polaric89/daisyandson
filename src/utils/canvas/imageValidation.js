/**
 * Image Quality Validation Utility
 * 
 * Validates uploaded images meet minimum requirements
 * for high-quality badge printing.
 */

// Minimum dimensions for print quality (800px as specified)
const MIN_DIMENSION = 800

// Recommended dimensions for best quality
const RECOMMENDED_DIMENSION = 1500

// Maximum file size (20MB to handle high-res photos)
const MAX_FILE_SIZE = 20 * 1024 * 1024

// Supported image types
const SUPPORTED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'image/tiff'
]

/**
 * Validate image file quality and dimensions
 * 
 * @param {File} file - Image file to validate
 * @returns {Promise<Object>} - Validation result
 */
export async function validateImageQuality(file) {
  return new Promise((resolve) => {
    // Check file type
    if (!SUPPORTED_TYPES.includes(file.type)) {
      resolve({
        isValid: false,
        error: `Unsupported image format. Please use JPEG, PNG, or WebP.`
      })
      return
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      resolve({
        isValid: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
      })
      return
    }

    // Check image dimensions
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const { width, height } = img
      const minDimension = Math.min(width, height)

      // Check minimum size
      if (minDimension < MIN_DIMENSION) {
        resolve({
          isValid: false,
          error: `Image too small (${width}×${height}px). Minimum ${MIN_DIMENSION}×${MIN_DIMENSION}px required for print quality.`
        })
        return
      }

      // Check for recommended size
      let warning = null
      if (minDimension < RECOMMENDED_DIMENSION) {
        warning = `Image resolution is acceptable but may not be optimal for large prints. ${RECOMMENDED_DIMENSION}×${RECOMMENDED_DIMENSION}px or higher recommended.`
      }

      resolve({
        isValid: true,
        warning,
        dimensions: { width, height },
        aspectRatio: width / height,
        fileSize: file.size,
        fileType: file.type
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        isValid: false,
        error: 'Failed to load image. The file may be corrupted.'
      })
    }

    img.src = url
  })
}

/**
 * Get image metadata
 * 
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Image metadata
 */
export async function getImageMetadata(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified)
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Calculate optimal crop area for circular badge
 * 
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Object} - Optimal crop area
 */
export function calculateOptimalCrop(width, height) {
  const size = Math.min(width, height)
  
  return {
    x: (width - size) / 2,
    y: (height - size) / 2,
    size
  }
}

/**
 * Format file size for display
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default validateImageQuality

