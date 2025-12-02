/**
 * Privacy Policy Page
 * Privacy and cookies policy for Daisy & Son Co.
 */
function PrivacyPolicy({ onBack }) {
  return (
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">Privacy Policy</h1>
                <p className="text-xs text-badge-primary/60">Your Data, Protected</p>
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 p-8 md:p-12">
          
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-badge-primary mb-4">
              Privacy & Cookies
            </h1>
            <p className="text-badge-primary/60">
              Last updated: December 2024
            </p>
          </div>

          {/* Intro */}
          <div className="mb-10 p-6 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5 rounded-xl border border-badge-primary/10">
            <p className="text-badge-primary/80 leading-relaxed">
              Daisy & Son Co. is committed to respecting and safeguarding all customer and web visitor data collected when browsing or making purchases through our website. Please read this Privacy Policy carefully to understand how we collect, use and protect your personal data. We will only use your data in accordance with this policy and applicable data protection laws.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-10">
            
            {/* Section 1 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">1</span>
                Why We Collect Information
              </h2>
              
              <div className="ml-10 space-y-3 text-badge-primary/70">
                <p>We collect information about you for a few specific reasons:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>To process your enquiry and look after your order to ensure you receive the highest possible levels of service.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>To complete an order, which means processing payment through a secure, third-party payment system (PayPal), and ship the order to your address via Aramex.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Process a return or refund, as per our Refunds Policy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>To deliver timely updates on promotions and events that you have expressed an interest in.</span>
                  </li>
                </ul>
                
                <div className="mt-4 p-4 bg-badge-beige/50 rounded-xl">
                  <p className="text-sm">
                    <strong className="text-badge-primary">Important:</strong> Your information will not be shared with 3rd parties. We will not email you unless you have provided your consent. We do not send random marketing emails to personal email addresses.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">2</span>
                What Personal Information We Collect
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>When browsing, creating an account or making a purchase, we may collect and process the following personal data:</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-badge-beige/30 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Details
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Full name</li>
                      <li>• Email address</li>
                      <li>• Phone number</li>
                      <li>• Postal/delivery address</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-badge-beige/30 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Payment Information
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• PayPal transaction details</li>
                      <li>• Order history</li>
                      <li>• Payment confirmation</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-badge-beige/30 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Technical Data
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• IP address</li>
                      <li>• Browser type</li>
                      <li>• Time zone</li>
                      <li>• Operating system</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-badge-beige/30 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-badge-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Uploaded Content
                    </h4>
                    <ul className="text-sm space-y-1">
                      <li>• Badge design images</li>
                      <li>• Custom artwork</li>
                      <li>• Design preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">3</span>
                How We Use Your Information
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>Your order details will be stored securely and used only for the following purposes:</p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-badge-secondary/20 text-badge-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                    <span><strong className="text-badge-primary">Order Processing:</strong> To manufacture your custom badges and fulfill your order.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-badge-secondary/20 text-badge-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                    <span><strong className="text-badge-primary">Shipping:</strong> To deliver your order to your specified address via Aramex courier service.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-badge-secondary/20 text-badge-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                    <span><strong className="text-badge-primary">Communication:</strong> To send order confirmations, shipping updates, and respond to your enquiries.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-badge-secondary/20 text-badge-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">4</span>
                    <span><strong className="text-badge-primary">Customer Service:</strong> To handle returns, refunds, and resolve any issues with your order.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-badge-secondary/20 text-badge-secondary flex items-center justify-center text-xs font-medium flex-shrink-0">5</span>
                    <span><strong className="text-badge-primary">Legal Compliance:</strong> To comply with legal obligations and protect our rights.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">4</span>
                Data Sharing
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>We only share your personal data with the following trusted third parties when necessary to fulfill your order:</p>
                
                <div className="space-y-3">
                  <div className="p-4 border border-badge-primary/10 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-1">PayPal</h4>
                    <p className="text-sm">For secure payment processing. PayPal's privacy policy applies to payment data.</p>
                  </div>
                  
                  <div className="p-4 border border-badge-primary/10 rounded-xl">
                    <h4 className="font-medium text-badge-primary mb-1">Aramex</h4>
                    <p className="text-sm">For shipping and delivery services. Your name, address, and phone number are shared for delivery purposes only.</p>
                  </div>
                </div>
                
                <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200 text-green-800">
                  ✓ We do NOT sell, rent, or trade your personal information to any third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">5</span>
                Data Security
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>We take the security of your data seriously and implement appropriate measures to protect it:</p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-leaf mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure HTTPS encryption for all data transmission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-leaf mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Payment processing handled entirely by PayPal's secure systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-leaf mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Limited access to personal data on a need-to-know basis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-leaf mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Regular review of data protection practices</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">6</span>
                Cookies
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us:</p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-badge-secondary">🍪</span>
                    <span>Remember your preferences and settings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-badge-secondary">🍪</span>
                    <span>Understand how you use our website</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-badge-secondary">🍪</span>
                    <span>Improve website performance and user experience</span>
                  </li>
                </ul>
                
                <div className="p-4 bg-badge-beige/50 rounded-xl">
                  <p className="text-sm">
                    <strong className="text-badge-primary">Managing Cookies:</strong> You can control and manage cookies through your browser settings. Please note that disabling cookies may affect some functionality of our website.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">7</span>
                Your Rights
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>You have the following rights regarding your personal data:</p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="p-3 border border-badge-primary/10 rounded-lg">
                    <h4 className="font-medium text-badge-primary text-sm mb-1">Right to Access</h4>
                    <p className="text-xs">Request a copy of your personal data we hold</p>
                  </div>
                  <div className="p-3 border border-badge-primary/10 rounded-lg">
                    <h4 className="font-medium text-badge-primary text-sm mb-1">Right to Rectification</h4>
                    <p className="text-xs">Request correction of inaccurate data</p>
                  </div>
                  <div className="p-3 border border-badge-primary/10 rounded-lg">
                    <h4 className="font-medium text-badge-primary text-sm mb-1">Right to Erasure</h4>
                    <p className="text-xs">Request deletion of your personal data</p>
                  </div>
                  <div className="p-3 border border-badge-primary/10 rounded-lg">
                    <h4 className="font-medium text-badge-primary text-sm mb-1">Right to Object</h4>
                    <p className="text-xs">Object to processing of your data</p>
                  </div>
                </div>
                
                <p className="text-sm">
                  To exercise any of these rights, please contact us at <a href="mailto:support@daisyandson.com" className="text-badge-secondary hover:underline">support@daisyandson.com</a>
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">8</span>
                Data Retention
              </h2>
              
              <div className="ml-10 space-y-4 text-badge-primary/70">
                <p>We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected:</p>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-primary/50 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong className="text-badge-primary">Order data:</strong> Retained for 7 years for accounting and legal purposes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-primary/50 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong className="text-badge-primary">Design images:</strong> Deleted within 30 days after order completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-badge-primary/50 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span><strong className="text-badge-primary">Marketing preferences:</strong> Until you withdraw consent</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">9</span>
                Changes to This Policy
              </h2>
              
              <div className="ml-10 text-badge-primary/70">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by posting the new policy on this page with an updated revision date. We encourage you to review this policy periodically.
                </p>
              </div>
            </section>

          </div>

          {/* Contact Box */}
          <div className="mt-12 p-6 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5 rounded-xl border border-badge-primary/10">
            <h3 className="font-display text-lg font-semibold text-badge-primary mb-2">
              Questions about your privacy?
            </h3>
            <p className="text-badge-primary/60 text-sm mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
            <a 
              href="mailto:support@daisyandson.com"
              className="inline-flex items-center gap-2 text-badge-secondary hover:text-badge-primary transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@daisyandson.com
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-badge-primary/10 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-badge-primary/40">
            © 2024 Daisy & Son Co. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPolicy

