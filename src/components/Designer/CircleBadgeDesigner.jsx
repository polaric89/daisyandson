import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import { exportToPng } from '../../utils/canvas/exportToPng'
import { validateImageQuality } from '../../utils/canvas/imageValidation'

/**
 * CircleBadgeDesigner Component
 * 
 * Features:
 * - Image upload with drag & drop
 * - Circle mask preview (300x300px)
 * - Pan/drag image inside mask
 * - Zoom slider control
 * - Rotation control
 * - High-DPI export (2000x2000px)
 * - Image quality validation (min 800px)
 */
const CircleBadgeDesigner = forwardRef(({ onDesignChange, onExport, onRemove }, ref) => {
  // Image state
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  
  // Transform state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  
  // UI state
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const [qualityWarning, setQualityWarning] = useState(null)
  
  // Refs
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastPositionRef = useRef({ x: 0, y: 0 })

  // Canvas preview size (displayed)
  const PREVIEW_SIZE = 300
  // Export size (high resolution)
  const EXPORT_SIZE = 2000

  // Expose export method to parent
  useImperativeHandle(ref, () => ({
    exportDesign: async () => {
      if (!image) return null
      
      const exportData = await exportToPng({
        image,
        position,
        zoom,
        rotation,
        previewSize: PREVIEW_SIZE,
        exportSize: EXPORT_SIZE
      })
      
      if (onExport) {
        onExport(exportData)
      }
      
      return exportData
    },
    resetDesign: () => {
      setImage(null)
      setImageUrl(null)
      setPosition({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
      setImageSize({ width: 0, height: 0 })
      setQualityWarning(null)
      if (onDesignChange) {
        onDesignChange({ hasImage: false, position: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
      }
      if (onExport) {
        onExport(null)
      }
    }
  }))

  // Track export timeout
  const exportTimeoutRef = useRef(null)
  // Store onExport in ref to avoid dependency issues
  const onExportRef = useRef(onExport)
  onExportRef.current = onExport

  // Notify parent of design changes
  useEffect(() => {
    if (onDesignChange) {
      onDesignChange({
        hasImage: !!image,
        position,
        zoom,
        rotation,
        imageSize
      })
    }
  }, [image, position, zoom, rotation, imageSize, onDesignChange])

  // Auto-export when design changes and has image
  useEffect(() => {
    if (image) {
      // Clear previous timeout
      if (exportTimeoutRef.current) {
        clearTimeout(exportTimeoutRef.current)
      }
      
      // Debounce export
      exportTimeoutRef.current = setTimeout(async () => {
        try {
          const exportData = await exportToPng({
            image,
            position,
            zoom,
            rotation,
            previewSize: PREVIEW_SIZE,
            exportSize: EXPORT_SIZE
          })
          if (onExportRef.current) {
            onExportRef.current(exportData)
          }
        } catch (err) {
          console.error('Export failed:', err)
        }
      }, 400)
    }

    return () => {
      if (exportTimeoutRef.current) {
        clearTimeout(exportTimeoutRef.current)
      }
    }
  }, [image, position, zoom, rotation])

  // Handle image file selection
  const handleImageFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    setIsUploading(true)
    setError(null)
    setQualityWarning(null)

    try {
      // Validate image quality
      const validation = await validateImageQuality(file)
      
      if (!validation.isValid) {
        setError(validation.error)
        setIsUploading(false)
        return
      }

      if (validation.warning) {
        setQualityWarning(validation.warning)
      }

      // Create image object
      const img = new Image()
      const url = URL.createObjectURL(file)
      
      img.onload = () => {
        // Clean up previous image URL
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }

        setImage(img)
        setImageUrl(url)
        setImageSize({ width: img.width, height: img.height })
        
        // Calculate initial zoom to fit image in preview
        const minDimension = Math.min(img.width, img.height)
        const initialZoom = PREVIEW_SIZE / minDimension
        setZoom(Math.max(initialZoom, 0.5))
        
        // Center the image
        setPosition({ x: 0, y: 0 })
        setRotation(0)
        setIsUploading(false)
      }

      img.onerror = () => {
        setError('Failed to load image')
        setIsUploading(false)
        URL.revokeObjectURL(url)
      }

      img.src = url
    } catch (err) {
      setError('Failed to process image')
      setIsUploading(false)
    }
  }, [imageUrl])

  // File input change handler
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }, [handleImageFile])

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleImageFile(file)
    }
  }, [handleImageFile])

  // Pan/drag handlers
  const handleMouseDown = useCallback((e) => {
    if (!image) return
    e.preventDefault()
    
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    lastPositionRef.current = { ...position }
  }, [image, position])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    
    setPosition({
      x: lastPositionRef.current.x + dx,
      y: lastPositionRef.current.y + dy
    })
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e) => {
    if (!image || e.touches.length !== 1) return
    
    const touch = e.touches[0]
    setIsDragging(true)
    dragStartRef.current = { x: touch.clientX, y: touch.clientY }
    lastPositionRef.current = { ...position }
  }, [image, position])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || e.touches.length !== 1) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const dx = touch.clientX - dragStartRef.current.x
    const dy = touch.clientY - dragStartRef.current.y
    
    setPosition({
      x: lastPositionRef.current.x + dx,
      y: lastPositionRef.current.y + dy
    })
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    if (!image) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.05 : 0.05
    setZoom(prev => Math.max(0.1, Math.min(5, prev + delta)))
  }, [image])

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove, { passive: false })
      window.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  // Remove image and notify parent to remove the design slot
  const handleRemoveImage = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl)
    }
    setImage(null)
    setImageUrl(null)
    setImageSize({ width: 0, height: 0 })
    setPosition({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setError(null)
    setQualityWarning(null)
    
    // Notify parent to remove the entire design slot
    if (onRemove) {
      onRemove()
    } else {
      // Fallback: just notify about image removal
      if (onDesignChange) {
        onDesignChange({ hasImage: false, position: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
      }
      if (onExport) {
        onExport(null)
      }
    }
  }, [imageUrl, onDesignChange, onExport, onRemove])

  // Reset position
  const handleResetPosition = useCallback(() => {
    setPosition({ x: 0, y: 0 })
    if (image) {
      const minDimension = Math.min(image.width, image.height)
      setZoom(PREVIEW_SIZE / minDimension)
    }
    setRotation(0)
  }, [image])

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!image && (
        <div
          className={`upload-zone p-8 text-center ${dragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {isUploading ? (
            <div className="py-8">
              <div className="w-12 h-12 mx-auto mb-4 border-2 border-badge-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-badge-primary/60">Processing image...</p>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-badge-primary/20 to-badge-secondary/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-badge-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-badge-primary font-medium mb-2">Drop your photo here</p>
              <p className="text-badge-primary/50 text-sm mb-4">or click to browse</p>
              <p className="text-badge-primary/40 text-xs">
                Minimum 800×800px recommended for best print quality
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Quality Warning */}
      {qualityWarning && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {qualityWarning}
        </div>
      )}

      {/* Preview Area */}
      {image && (
        <div className="space-y-6">
          {/* Badge Preview with Print Marks */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Bleed area indicator (outer ring) */}
              <div 
                className="absolute rounded-full pointer-events-none"
                style={{ 
                  width: PREVIEW_SIZE + 30, // ~3mm bleed scaled
                  height: PREVIEW_SIZE + 30,
                  top: -15,
                  left: -15,
                  border: '2px dashed #00BFFF',
                  opacity: 0.6
                }}
              />
              
              {/* Main badge container */}
              <div
                ref={containerRef}
                className="badge-container cursor-move select-none relative"
                style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onWheel={handleWheel}
              >
                {/* Circular mask container */}
                <div 
                  className="w-full h-full rounded-full overflow-hidden relative"
                  style={{ 
                    backgroundColor: '#e6cfbc'
                  }}
                >
                  {/* Image with transforms */}
                  <img
                    src={imageUrl}
                    alt="Badge preview"
                    className="absolute pointer-events-none"
                    style={{
                      width: imageSize.width * zoom,
                      height: imageSize.height * zoom,
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      maxWidth: 'none'
                    }}
                    draggable={false}
                  />
                </div>
                
                {/* Cutting line indicator (dashed on the edge) */}
                <div 
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ 
                    border: '2px dashed rgba(100, 100, 100, 0.5)'
                  }}
                />
                
                {/* Drag indicator overlay */}
                {isDragging && (
                  <div className="absolute inset-0 rounded-full border-2 border-badge-secondary/50 pointer-events-none" />
                )}
              </div>
            </div>
          </div>

          {/* Image Info & Print Guide */}
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-badge-primary/10 rounded-full text-xs text-badge-primary/60">
              <span>{imageSize.width} × {imageSize.height}px</span>
              <span className="w-1 h-1 bg-badge-primary/30 rounded-full" />
              <span>Scroll to zoom • Drag to position</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-xs text-badge-primary/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#00BFFF' }}></span>
                  Cut Line
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-gray-400"></span>
                  Bleed Line
                </span>
              </div>
              <p className="text-center text-badge-primary/40 text-[10px] max-w-[280px]">
                Deviations may occur, image must be placed within the bleed line
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-badge-primary/70 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                  Zoom
                </label>
                <span className="text-xs text-badge-primary/50">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="slider-track w-full"
              />
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-badge-primary/70 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Rotation
                </label>
                <span className="text-xs text-badge-primary/50">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="slider-track w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleResetPosition}
                className="btn-secondary flex-1 text-sm py-2.5"
              >
                Reset
              </button>
              <button
                onClick={handleRemoveImage}
                className="btn-secondary flex-1 text-sm py-2.5 text-red-500 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

CircleBadgeDesigner.displayName = 'CircleBadgeDesigner'

export default CircleBadgeDesigner

