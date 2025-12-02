/**
 * Header component for the Designer page
 */
function DesignerHeader({ badgeCategory, hasReferral, onBackToHome }) {
  return (
    <header className="max-w-7xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToHome}
            className="hover:scale-105 transition-transform"
          >
            <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-gradient">Badge Designer</h1>
            <p className="text-sm text-badge-primary/60">Create your 58mm custom badge</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {badgeCategory && (
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${
              badgeCategory === 'personal' 
                ? 'bg-badge-primary/10 border border-badge-primary/30' 
                : 'bg-badge-secondary/10 border border-badge-secondary/30'
            }`}>
              <span className={`text-sm ${
                badgeCategory === 'personal' ? 'text-badge-primary' : 'text-badge-secondary'
              }`}>
                {badgeCategory === 'personal' ? '👤 Personal' : '🎉 Event'}
              </span>
            </div>
          )}
          {hasReferral && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-100 border border-green-300 rounded-full">
              <span className="text-green-700 text-sm">🎁 Referral</span>
            </div>
          )}
          <button 
            onClick={onBackToHome}
            className="btn-secondary text-sm py-2 px-4"
          >
            ← Back
          </button>
        </div>
      </div>
    </header>
  )
}

export default DesignerHeader

