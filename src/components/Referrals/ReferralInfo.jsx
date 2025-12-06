/**
 * ReferralInfo Component
 * 
 * Explains the referral program process and benefits
 */
function ReferralInfo({ onBack, onBecomeReferrer }) {
  return (
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">Referral Program</h1>
                <p className="text-xs text-badge-primary/60">Partner with us and earn rewards</p>
              </div>
            </div>
            
            <button 
              onClick={onBack}
              className="text-sm text-badge-primary/60 hover:text-badge-primary flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-badge-secondary/20 to-badge-primary/20 flex items-center justify-center">
            <span className="text-4xl">🤝</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-badge-primary mb-4">
            Partner With Us
          </h2>
          <p className="text-lg text-badge-primary/70 max-w-2xl mx-auto">
            Share our badge designer with friends, clients, and your network. 
            Earn <span className="font-bold text-badge-secondary">10% commission</span> on every successful order!
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-6 sm:p-8 mb-8">
          <h3 className="font-display text-2xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Benefits
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-badge-beige/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-badge-primary/10 flex items-center justify-center mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="font-semibold text-badge-primary mb-2">10% Commission</h4>
              <p className="text-sm text-badge-primary/70">
                Earn 10% on every order placed through your referral link
              </p>
            </div>

            <div className="p-4 bg-badge-beige/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-badge-primary/10 flex items-center justify-center mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-badge-primary mb-2">Real-Time Tracking</h4>
              <p className="text-sm text-badge-primary/70">
                Monitor clicks, conversions, and earnings in your dashboard
              </p>
            </div>

            <div className="p-4 bg-badge-beige/50 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-badge-primary/10 flex items-center justify-center mb-3">
                <span className="text-2xl">💳</span>
              </div>
              <h4 className="font-semibold text-badge-primary mb-2">Easy Payouts</h4>
              <p className="text-sm text-badge-primary/70">
                Request payouts anytime. Fast and secure payment processing
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-6 sm:p-8 mb-8">
          <h3 className="font-display text-2xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            How It Works
          </h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-badge-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-badge-primary mb-2">Sign Up</h4>
                <p className="text-sm text-badge-primary/70">
                  Register as a referrer with your name and contact information. It's free and takes less than a minute.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-badge-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-badge-primary mb-2">Get Your Link</h4>
                <p className="text-sm text-badge-primary/70">
                  Receive your unique referral link and code. Share it via social media, email, or any platform you prefer.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-badge-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-badge-primary mb-2">Share & Earn</h4>
                <p className="text-sm text-badge-primary/70">
                  When someone clicks your link and places an order, you automatically earn 10% commission. No limits on referrals!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-badge-primary text-white flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-badge-primary mb-2">Track & Get Paid</h4>
                <p className="text-sm text-badge-primary/70">
                  Monitor your performance in real-time. Request payouts when you're ready. We process payments quickly and securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-6 sm:p-8 mb-8">
          <h3 className="font-display text-2xl font-semibold text-badge-primary mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            <div className="border-b border-badge-primary/10 pb-4">
              <h4 className="font-semibold text-badge-primary mb-2">How much can I earn?</h4>
              <p className="text-sm text-badge-primary/70">
                You earn 10% commission on every order placed through your referral link. There's no limit to how many referrals you can make or how much you can earn!
              </p>
            </div>

            <div className="border-b border-badge-primary/10 pb-4">
              <h4 className="font-semibold text-badge-primary mb-2">When do I get paid?</h4>
              <p className="text-sm text-badge-primary/70">
                You can request a payout anytime from your dashboard. Once approved, payments are processed within 3-5 business days.
              </p>
            </div>

            <div className="border-b border-badge-primary/10 pb-4">
              <h4 className="font-semibold text-badge-primary mb-2">How do I track my referrals?</h4>
              <p className="text-sm text-badge-primary/70">
                After signing up, you'll have access to a dashboard where you can see clicks, conversions, and earnings in real-time.
              </p>
            </div>

            <div className="pb-4">
              <h4 className="font-semibold text-badge-primary mb-2">Is there a cost to join?</h4>
              <p className="text-sm text-badge-primary/70">
                No! Joining our referral program is completely free. There are no fees, no minimum requirements, and no hidden costs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-badge-primary to-badge-secondary rounded-2xl shadow-lg p-8 text-center text-white">
          <h3 className="font-display text-2xl font-bold mb-4">Ready to Start Earning?</h3>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Join hundreds of partners already earning with us. Sign up today and get your unique referral link in seconds.
          </p>
          <button
            onClick={onBecomeReferrer}
            className="bg-white text-badge-primary px-8 py-3 rounded-xl font-semibold hover:bg-badge-cream transition-colors shadow-lg"
          >
            Become a Referrer
          </button>
        </div>
      </main>
    </div>
  )
}

export default ReferralInfo

