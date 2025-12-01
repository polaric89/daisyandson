/**
 * High-Resolution PNG Export Utility
 * 
 * Exports the badge design as a print-ready transparent PNG
 * at 2000-3000px resolution with perfect circular clipping.
 * 
 * NO compression - maintains full photo quality for print.
 */

/**
 * Export badge design to high-resolution PNG
 * 
 * @param {Object} options - Export options
 * @param {HTMLImageElement} options.image - Source image element
 * @param {Object} options.position - Image position {x, y}
 * @param {number} options.zoom - Zoom level
 * @param {number} options.rotation - Rotation in degrees
 * @param {number} options.previewSize - Preview canvas size (e.g., 300)
 * @param {number} options.exportSize - Export size (e.g., 2000)
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function exportToPng({
  image,
  position,
  zoom,
  rotation,
  previewSize = 300,
  exportSize = 2000
}) {
  return new Promise((resolve, reject) => {
    try {
      // Create high-resolution canvas
      const canvas = document.createElement('canvas')
      canvas.width = exportSize
      canvas.height = exportSize
      
      const ctx = canvas.getContext('2d', {
        alpha: true,
        // Disable image smoothing for crisp exports
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      // Calculate scale factor between preview and export
      const scaleFactor = exportSize / previewSize

      // Clear canvas with transparent background
      ctx.clearRect(0, 0, exportSize, exportSize)

      // Create circular clipping path
      ctx.beginPath()
      ctx.arc(
        exportSize / 2,
        exportSize / 2,
        exportSize / 2,
        0,
        Math.PI * 2
      )
      ctx.closePath()
      ctx.clip()

      // Save the context state
      ctx.save()

      // Move to center of canvas
      ctx.translate(exportSize / 2, exportSize / 2)

      // Apply position offset (scaled)
      ctx.translate(position.x * scaleFactor, position.y * scaleFactor)

      // Apply rotation
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180)
      }

      // Calculate scaled image dimensions
      const scaledWidth = image.width * zoom * scaleFactor
      const scaledHeight = image.height * zoom * scaleFactor

      // Draw image centered
      ctx.drawImage(
        image,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      )

      // Restore context
      ctx.restore()

      // Export as PNG with maximum quality (no compression)
      // The second parameter '1.0' ensures highest quality
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      
      resolve(dataUrl)
    } catch (error) {
      reject(new Error('Failed to export image: ' + error.message))
    }
  })
}

/**
 * Export badge design with custom size
 * Useful for different print requirements
 * 
 * @param {Object} options - Export options (same as exportToPng)
 * @param {number} customSize - Custom export size in pixels
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function exportWithCustomSize(options, customSize) {
  return exportToPng({
    ...options,
    exportSize: customSize
  })
}

/**
 * Export multiple sizes at once
 * Returns an object with all requested sizes
 * 
 * @param {Object} options - Export options
 * @param {number[]} sizes - Array of sizes to export (e.g., [1000, 2000, 3000])
 * @returns {Promise<Object>} - Object with size keys and dataUrl values
 */
export async function exportMultipleSizes(options, sizes = [1000, 2000, 3000]) {
  const exports = {}
  
  for (const size of sizes) {
    exports[size] = await exportToPng({
      ...options,
      exportSize: size
    })
  }
  
  return exports
}

/**
 * Convert base64 data URL to Blob
 * Useful for uploading to servers
 * 
 * @param {string} dataUrl - Base64 data URL
 * @returns {Blob} - PNG Blob
 */
export function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',')
  const mime = parts[0].match(/:(.*?);/)[1]
  const bstr = atob(parts[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new Blob([u8arr], { type: mime })
}

/**
 * Download the exported PNG directly
 * 
 * @param {string} dataUrl - Base64 data URL
 * @param {string} filename - Download filename
 */
export function downloadPng(dataUrl, filename = 'badge-design.png') {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default exportToPng

