/**
 * Print-Ready Export Utility with Bleed and Cut Lines
 * 
 * Exports badge designs with professional print marks:
 * - Bleed line: Outer boundary where printing extends to
 * - Cutting line: Actual badge edge where it will be cut
 * - Safe zone: Inner area where important content should stay
 * 
 * For 58mm badges:
 * - Cutting diameter: 58mm
 * - Bleed: +3mm = 64mm total diameter
 * - Safe zone: -3mm = 52mm diameter
 */

// Convert mm to pixels at 300 DPI
const MM_TO_PX_300DPI = 11.811 // 1mm = 11.811px at 300 DPI

// Badge specifications
const BADGE_DIAMETER_MM = 58
const BLEED_MM = 3
const SAFE_ZONE_MM = 3

/**
 * Export badge design with print marks (bleed, cut, safe zone)
 * 
 * @param {Object} options - Export options
 * @param {HTMLImageElement} options.image - Source image element
 * @param {Object} options.position - Image position {x, y}
 * @param {number} options.zoom - Zoom level
 * @param {number} options.rotation - Rotation in degrees
 * @param {number} options.previewSize - Preview canvas size (e.g., 300)
 * @param {Object} options.printOptions - Print-specific options
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function exportForPrint({
  image,
  position,
  zoom,
  rotation,
  previewSize = 300,
  printOptions = {}
}) {
  const {
    dpi = 300,
    showBleedLine = true,
    showCutLine = true,
    showSafeZone = false,
    bleedLineColor = '#00BFFF', // Cyan
    cutLineColor = '#FF0000',   // Red
    safeZoneColor = '#00FF00',  // Green
    lineWidth = 2,
    backgroundColor = '#FFFFFF'
  } = printOptions

  return new Promise((resolve, reject) => {
    try {
      // Calculate sizes in pixels at specified DPI
      const pxPerMm = dpi / 25.4
      
      const cuttingDiameter = Math.round(BADGE_DIAMETER_MM * pxPerMm)
      const bleedDiameter = Math.round((BADGE_DIAMETER_MM + BLEED_MM * 2) * pxPerMm)
      const safeZoneDiameter = Math.round((BADGE_DIAMETER_MM - SAFE_ZONE_MM * 2) * pxPerMm)
      
      // Canvas size includes bleed + margin for print marks
      const margin = Math.round(10 * pxPerMm) // 10mm margin for labels
      const canvasSize = bleedDiameter + margin * 2
      
      // Create canvas
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize
      canvas.height = canvasSize
      
      const ctx = canvas.getContext('2d', {
        alpha: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      // Fill with white background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvasSize, canvasSize)

      const centerX = canvasSize / 2
      const centerY = canvasSize / 2

      // Calculate scale factor from preview to print
      const scaleFactor = cuttingDiameter / previewSize

      // --- Draw the badge image with bleed ---
      ctx.save()
      
      // Create bleed-sized circular clip
      ctx.beginPath()
      ctx.arc(centerX, centerY, bleedDiameter / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Move to center
      ctx.translate(centerX, centerY)
      
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

      ctx.restore()

      // --- Draw Print Marks ---
      ctx.lineWidth = lineWidth

      // Bleed Line (outer - cyan dashed)
      if (showBleedLine) {
        ctx.save()
        ctx.strokeStyle = bleedLineColor
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, bleedDiameter / 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // Cutting Line (middle - red solid)
      if (showCutLine) {
        ctx.save()
        ctx.strokeStyle = cutLineColor
        ctx.setLineDash([])
        ctx.lineWidth = lineWidth + 1
        ctx.beginPath()
        ctx.arc(centerX, centerY, cuttingDiameter / 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // Safe Zone (inner - green dashed)
      if (showSafeZone) {
        ctx.save()
        ctx.strokeStyle = safeZoneColor
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, safeZoneDiameter / 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }

      // --- Draw Labels ---
      ctx.font = `${Math.round(3 * pxPerMm)}px Arial`
      ctx.textAlign = 'center'

      // Bleed label
      if (showBleedLine) {
        ctx.fillStyle = bleedLineColor
        ctx.fillText('BLEED', centerX, margin / 2)
      }

      // Cut label
      if (showCutLine) {
        ctx.fillStyle = cutLineColor
        ctx.fillText('CUT LINE', centerX, canvasSize - margin / 3)
      }

      // Size info
      ctx.fillStyle = '#666666'
      ctx.font = `${Math.round(2.5 * pxPerMm)}px Arial`
      ctx.fillText(`${BADGE_DIAMETER_MM}mm Badge • ${dpi} DPI`, centerX, canvasSize - margin / 6)

      // Corner marks for alignment
      const markLength = Math.round(5 * pxPerMm)
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 1
      ctx.setLineDash([])

      // Top-left corner
      ctx.beginPath()
      ctx.moveTo(margin / 2, margin)
      ctx.lineTo(margin / 2, margin - markLength)
      ctx.moveTo(margin / 2, margin)
      ctx.lineTo(margin / 2 + markLength, margin)
      ctx.stroke()

      // Top-right corner
      ctx.beginPath()
      ctx.moveTo(canvasSize - margin / 2, margin)
      ctx.lineTo(canvasSize - margin / 2, margin - markLength)
      ctx.moveTo(canvasSize - margin / 2, margin)
      ctx.lineTo(canvasSize - margin / 2 - markLength, margin)
      ctx.stroke()

      // Bottom-left corner
      ctx.beginPath()
      ctx.moveTo(margin / 2, canvasSize - margin)
      ctx.lineTo(margin / 2, canvasSize - margin + markLength)
      ctx.moveTo(margin / 2, canvasSize - margin)
      ctx.lineTo(margin / 2 + markLength, canvasSize - margin)
      ctx.stroke()

      // Bottom-right corner
      ctx.beginPath()
      ctx.moveTo(canvasSize - margin / 2, canvasSize - margin)
      ctx.lineTo(canvasSize - margin / 2, canvasSize - margin + markLength)
      ctx.moveTo(canvasSize - margin / 2, canvasSize - margin)
      ctx.lineTo(canvasSize - margin / 2 - markLength, canvasSize - margin)
      ctx.stroke()

      // Export as PNG
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      resolve(dataUrl)
    } catch (error) {
      reject(new Error('Failed to export for print: ' + error.message))
    }
  })
}

/**
 * Export badge without print marks (clean bleed)
 * For direct print production - just the image with bleed area
 * 
 * @param {Object} options - Same as exportForPrint
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function exportCleanBleed({
  image,
  position,
  zoom,
  rotation,
  previewSize = 300,
  dpi = 300
}) {
  return new Promise((resolve, reject) => {
    try {
      const pxPerMm = dpi / 25.4
      const bleedDiameter = Math.round((BADGE_DIAMETER_MM + BLEED_MM * 2) * pxPerMm)
      const cuttingDiameter = Math.round(BADGE_DIAMETER_MM * pxPerMm)
      
      const canvas = document.createElement('canvas')
      canvas.width = bleedDiameter
      canvas.height = bleedDiameter
      
      const ctx = canvas.getContext('2d', {
        alpha: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      // Transparent background
      ctx.clearRect(0, 0, bleedDiameter, bleedDiameter)

      const centerX = bleedDiameter / 2
      const centerY = bleedDiameter / 2
      const scaleFactor = cuttingDiameter / previewSize

      // Circular clip at bleed size
      ctx.beginPath()
      ctx.arc(centerX, centerY, bleedDiameter / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.translate(position.x * scaleFactor, position.y * scaleFactor)
      
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180)
      }

      const scaledWidth = image.width * zoom * scaleFactor
      const scaledHeight = image.height * zoom * scaleFactor

      ctx.drawImage(
        image,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      )

      ctx.restore()

      const dataUrl = canvas.toDataURL('image/png', 1.0)
      resolve(dataUrl)
    } catch (error) {
      reject(new Error('Failed to export clean bleed: ' + error.message))
    }
  })
}

/**
 * Export badge at exact cut size (no bleed)
 * For digital use or preview
 * 
 * @param {Object} options - Same as exportForPrint
 * @returns {Promise<string>} - Base64 PNG data URL
 */
export async function exportCutSize({
  image,
  position,
  zoom,
  rotation,
  previewSize = 300,
  dpi = 300
}) {
  return new Promise((resolve, reject) => {
    try {
      const pxPerMm = dpi / 25.4
      const cuttingDiameter = Math.round(BADGE_DIAMETER_MM * pxPerMm)
      
      const canvas = document.createElement('canvas')
      canvas.width = cuttingDiameter
      canvas.height = cuttingDiameter
      
      const ctx = canvas.getContext('2d', {
        alpha: true,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      })

      ctx.clearRect(0, 0, cuttingDiameter, cuttingDiameter)

      const centerX = cuttingDiameter / 2
      const centerY = cuttingDiameter / 2
      const scaleFactor = cuttingDiameter / previewSize

      ctx.beginPath()
      ctx.arc(centerX, centerY, cuttingDiameter / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.translate(position.x * scaleFactor, position.y * scaleFactor)
      
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180)
      }

      const scaledWidth = image.width * zoom * scaleFactor
      const scaledHeight = image.height * zoom * scaleFactor

      ctx.drawImage(
        image,
        -scaledWidth / 2,
        -scaledHeight / 2,
        scaledWidth,
        scaledHeight
      )

      ctx.restore()

      const dataUrl = canvas.toDataURL('image/png', 1.0)
      resolve(dataUrl)
    } catch (error) {
      reject(new Error('Failed to export cut size: ' + error.message))
    }
  })
}

/**
 * Get print specifications
 * Returns all relevant print measurements
 */
export function getPrintSpecs(dpi = 300) {
  const pxPerMm = dpi / 25.4
  
  return {
    badgeDiameterMm: BADGE_DIAMETER_MM,
    bleedMm: BLEED_MM,
    safeZoneMm: SAFE_ZONE_MM,
    totalDiameterMm: BADGE_DIAMETER_MM + BLEED_MM * 2,
    safeZoneDiameterMm: BADGE_DIAMETER_MM - SAFE_ZONE_MM * 2,
    dpi,
    cuttingDiameterPx: Math.round(BADGE_DIAMETER_MM * pxPerMm),
    bleedDiameterPx: Math.round((BADGE_DIAMETER_MM + BLEED_MM * 2) * pxPerMm),
    safeZoneDiameterPx: Math.round((BADGE_DIAMETER_MM - SAFE_ZONE_MM * 2) * pxPerMm)
  }
}

export default exportForPrint

