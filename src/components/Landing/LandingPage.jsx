import { useState } from 'react'

/**
 * Landing Page Component
 * 
 * Professional landing page for the Photo Badge Designer
 */
function LandingPage({ onGetStarted, onTrackOrder }) {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Easy Upload',
      description: 'Drag & drop your favorite photos instantly'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
      title: 'Perfect Crop',
      description: 'Zoom, pan & rotate for the perfect circular fit'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Print Quality',
      description: 'Export at 2000×2000px for crystal-clear prints'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fast Delivery',
      description: 'Receive your custom badges within days'
    }
  ]

  const steps = [
    { num: '01', title: 'Upload', desc: 'Choose your favorite photo' },
    { num: '02', title: 'Design', desc: 'Position & zoom to perfection' },
    { num: '03', title: 'Order', desc: 'Secure checkout with PayPal' },
    { num: '04', title: 'Receive', desc: 'Get your badges delivered' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-badge-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L14.14 13.14L16.18 20L12 16.27L7.82 20L9.86 13.14L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-badge-primary">BadgePin</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onTrackOrder}
                className="text-sm text-badge-primary/70 hover:text-badge-primary transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Track Order
              </button>
              <button 
                onClick={onGetStarted}
                className="btn-primary text-sm py-2 px-4"
              >
                Start Designing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-badge-primary/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-badge-secondary rounded-full animate-pulse"></span>
                <span className="text-sm text-badge-primary font-medium">New: Bulk orders available</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-badge-primary leading-tight mb-6">
                Turn Your Photos Into
                <span className="text-gradient block">Custom Badges</span>
              </h1>
              
              <p className="text-lg text-badge-primary/60 mb-8 max-w-xl mx-auto lg:mx-0">
                Create stunning photo pins and badges in minutes. Perfect for events, 
                gifts, memories, or your brand. High-quality prints delivered to your door.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={onGetStarted}
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2"
                >
                  Create Your Badge
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-badge-beige to-badge-rose border-2 border-white"
                      style={{ 
                        backgroundImage: `linear-gradient(${45 * i}deg, #e6cfbc, #d09892)` 
                      }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 text-badge-secondary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-badge-primary/60">2,500+ happy customers</p>
                </div>
              </div>
            </div>
            
            {/* Right: Hero Image/Badge Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-badge-primary/20 to-badge-secondary/20 rounded-full blur-3xl opacity-30"></div>
              <div className="relative">
                {/* Main badge */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 mx-auto rounded-full bg-gradient-to-br from-badge-beige to-badge-rose shadow-2xl flex items-center justify-center"
                  style={{
                    boxShadow: '0 0 0 8px rgba(68, 85, 203, 0.2), 0 25px 50px rgba(68, 85, 203, 0.15)'
                  }}
                >
                  <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-white to-badge-cream flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-badge-primary/10 flex items-center justify-center">
                        <svg className="w-10 h-10 text-badge-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-badge-primary font-medium">Your Photo Here</p>
                      <p className="text-badge-primary/50 text-sm">58mm Badge</p>
                    </div>
                  </div>
                </div>
                
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-badge-secondary to-amber-500 shadow-lg animate-float"
                  style={{ animationDelay: '0s' }}
                />
                <div className="absolute bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-badge-primary to-indigo-400 shadow-lg animate-float"
                  style={{ animationDelay: '1s' }}
                />
                <div className="absolute top-1/2 -right-12 w-12 h-12 rounded-full bg-gradient-to-br from-badge-rose to-pink-400 shadow-lg animate-float"
                  style={{ animationDelay: '2s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-badge-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-badge-primary mb-4">
              Why Choose BadgePin?
            </h2>
            <p className="text-badge-primary/60 max-w-2xl mx-auto">
              We make it incredibly easy to create professional-quality badges from your photos
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white border border-badge-primary/10 hover:border-badge-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                  hoveredFeature === idx 
                    ? 'bg-badge-primary text-white' 
                    : 'bg-badge-primary/10 text-badge-primary'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-badge-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-badge-primary/60 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-badge-primary mb-4">
              How It Works
            </h2>
            <p className="text-badge-primary/60 max-w-2xl mx-auto">
              Four simple steps to create your perfect custom badge
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center relative">
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-badge-primary/20 to-badge-primary/20" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-badge-primary to-indigo-500 text-white font-display text-xl font-bold flex items-center justify-center shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-badge-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-badge-primary/60 text-sm">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-badge-cream/30 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-badge-primary mb-4">
              Simple Pricing
            </h2>
            <p className="text-badge-primary/60">
              More badges = better price. Choose what fits you best.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Pricing */}
            <div className="bg-white rounded-2xl border border-badge-primary/10 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-badge-primary/10 text-badge-primary rounded-full text-sm font-medium mb-4">
                  👤 Personal
                </div>
                <h3 className="font-display text-xl font-bold text-badge-primary mb-2">
                  Multiple Unique Designs
                </h3>
                <p className="text-badge-primary/60 text-sm mb-4">
                  Create different badges for yourself, gifts, or memories
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-badge-primary/70">1 badge</span>
                    <span className="font-bold text-badge-primary">20 AED</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-badge-primary/70">5+ badges</span>
                    <span className="font-bold text-green-600">17 AED <span className="text-xs font-normal">each</span></span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-badge-secondary/10 rounded-lg border border-badge-secondary/30">
                    <span className="text-badge-primary/70">10+ badges</span>
                    <span className="font-bold text-badge-secondary">15 AED <span className="text-xs font-normal">each</span></span>
                  </div>
                </div>

                <button 
                  onClick={onGetStarted}
                  className="btn-primary w-full"
                >
                  Start Designing
                </button>
              </div>
            </div>

            {/* Event Pricing */}
            <div className="bg-white rounded-2xl border-2 border-badge-secondary/30 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-badge-secondary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                Best for Events
              </div>
              <div className="p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-badge-secondary/10 text-badge-secondary rounded-full text-sm font-medium mb-4">
                  🎉 Event
                </div>
                <h3 className="font-display text-xl font-bold text-badge-primary mb-2">
                  One Design, Many Copies
                </h3>
                <p className="text-badge-primary/60 text-sm mb-4">
                  Perfect for parties, weddings, or corporate events
                </p>
                
                <div className="p-4 bg-badge-secondary/5 rounded-xl mb-6 text-center">
                  <div className="text-3xl font-bold text-badge-secondary mb-1">13 AED</div>
                  <div className="text-badge-primary/60 text-sm">per badge • minimum 15 pieces</div>
                </div>

                <ul className="space-y-2 text-sm text-badge-primary/70 mb-6">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    58mm premium pin badge
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-resolution print
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Same design on all badges
                  </li>
                </ul>

                <button 
                  onClick={onGetStarted}
                  className="btn-gold w-full"
                >
                  Create Event Badges
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-badge-primary to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Ready to Create Your Badge?
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of happy customers who've turned their favorite photos into beautiful keepsakes.
              </p>
              <button 
                onClick={onGetStarted}
                className="bg-white text-badge-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors text-lg inline-flex items-center gap-2"
              >
                Start Designing Free
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-badge-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L14.14 13.14L16.18 20L12 16.27L7.82 20L9.86 13.14L4 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold text-badge-primary">BadgePin</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-badge-primary/60">
              <a href="#" className="hover:text-badge-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-badge-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-badge-primary transition-colors">Contact</a>
              <a href="#" className="hover:text-badge-primary transition-colors">FAQ</a>
            </div>
            
            <p className="text-sm text-badge-primary/40">
              © 2024 BadgePin. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

