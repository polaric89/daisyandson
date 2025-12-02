import { memo } from 'react'

/**
 * Design preview component showing badge thumbnails
 */
const DesignPreview = memo(function DesignPreview({ orderData, badgeCategory }) {
  const designs = orderData?.designs?.filter(d => d.image) || []

  return (
    <div className="glass-card p-6 lg:p-8">
      <h2 className="font-display text-xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-badge-primary/20 text-badge-primary flex items-center justify-center text-sm font-bold">2</span>
        Your Designs
      </h2>
      
      {designs.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {designs.map((design, idx) => (
            <div key={design.id} className="relative group">
              <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-badge-primary/20 shadow-lg">
                <img src={design.image} alt={`Badge ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              {badgeCategory === 'event' && orderData?.quantity && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-badge-secondary text-white text-sm px-3 py-1 rounded-full font-semibold">
                  ×{orderData.quantity}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-[200px] h-[200px] mx-auto mb-4 rounded-full border-2 border-dashed border-badge-primary/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-badge-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-badge-primary/50">Upload images to see your badges</p>
        </div>
      )}
    </div>
  )
})

export default DesignPreview

