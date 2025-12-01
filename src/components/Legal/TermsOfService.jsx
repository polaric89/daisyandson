/**
 * Terms of Service Page
 * Legal terms and conditions for Daisy & Son Co.
 */
function TermsOfService({ onBack }) {
  return (
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">Terms of Service</h1>
                <p className="text-xs text-badge-primary/60">Legal Information</p>
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
              Terms & Conditions
            </h1>
            <p className="text-badge-primary/60">
              Last updated: December 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            
            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">1</span>
                These Terms
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">1.1 What these terms cover.</strong> These are the terms and conditions on which we supply products to you, whether these are goods, services or digital content.
                </p>
                <p>
                  <strong className="text-badge-primary">1.2 Why you should read them.</strong> Please read these terms carefully before you submit your order to us. These terms tell you who we are, how we will provide products to you, how you and we may change or end the contract, what to do if there is a problem and other important information.
                </p>
                <p>
                  <strong className="text-badge-primary">1.3 Are you a business customer or a consumer?</strong> In some areas you will have different rights under these terms depending on whether you are a business or consumer.
                </p>
                <div className="bg-badge-beige/50 rounded-xl p-4 mt-4">
                  <p className="mb-2">You are a <strong className="text-badge-primary">consumer</strong> if:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>You are an individual.</li>
                    <li>You are buying products from us wholly or mainly for your personal use (not for use in connection with your trade, business, craft or profession).</li>
                  </ul>
                  <p className="mt-3 mb-2">You are a <strong className="text-badge-primary">business</strong> if:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>You are buying products for use in connection with your trade, business, craft or profession.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">2</span>
                Information About Us
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">2.1 Who we are.</strong> We are Daisy & Son Co., a custom badge and pin manufacturing company based in the United Arab Emirates.
                </p>
                <p>
                  <strong className="text-badge-primary">2.2 How to contact us.</strong> You can contact us by writing to us at <a href="mailto:support@daisyandson.com" className="text-badge-secondary hover:underline">support@daisyandson.com</a>.
                </p>
                <p>
                  <strong className="text-badge-primary">2.3 How we may contact you.</strong> If we have to contact you we will do so by telephone or by writing to you at the email address or postal address you provided to us in your order.
                </p>
                <p>
                  <strong className="text-badge-primary">2.4 "Writing" includes emails.</strong> When we use the words "writing" or "written" in these terms, this includes emails.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">3</span>
                Our Contract With You
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">3.1 How we will accept your order.</strong> Our acceptance of your order will take place when we email you to accept it or when we begin processing your badge design, at which point a contract will come into existence between you and us.
                </p>
                <p>
                  <strong className="text-badge-primary">3.2 If we cannot accept your order.</strong> If we are unable to accept your order, we will inform you of this and will not charge you for the product. This might be because the product is out of stock, because of unexpected limits on our resources, because we have identified an error in the price or description of the product, or because we are unable to meet a delivery deadline you have specified.
                </p>
                <p>
                  <strong className="text-badge-primary">3.3 Your order number.</strong> We will assign an order number to your order and tell you what it is when we accept your order. It will help us if you can tell us the order number whenever you contact us about your order.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">4</span>
                Our Products
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">4.1 Products may vary slightly from their pictures.</strong> The images of the products on our website are for illustrative purposes only. Although we have made every effort to display the colours accurately, we cannot guarantee that a device's display of the colours accurately reflects the colour of the products. Your product may vary slightly from those images.
                </p>
                <p>
                  <strong className="text-badge-primary">4.2 Product specifications.</strong> Our standard badge size is 58mm diameter. All badges are printed in high resolution and come with a pin back attachment.
                </p>
                <p>
                  <strong className="text-badge-primary">4.3 Custom designs.</strong> When you upload your own images for custom badge production, you are responsible for ensuring you have the right to use those images. We are not responsible for any copyright infringement related to images you provide.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">5</span>
                Pricing and Payment
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">5.1 Where to find the price.</strong> The price of the product (in AED) will be the price indicated on the order pages when you placed your order. We take all reasonable care to ensure that the price of the product advised to you is correct.
                </p>
                <p>
                  <strong className="text-badge-primary">5.2 Our pricing structure:</strong>
                </p>
                <div className="bg-badge-beige/50 rounded-xl p-4">
                  <p className="font-medium text-badge-primary mb-2">Personal Orders (Multiple Unique Designs):</p>
                  <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                    <li>1-4 badges: 20 AED each</li>
                    <li>5-9 badges: 17 AED each</li>
                    <li>10+ badges: 15 AED each</li>
                  </ul>
                  <p className="font-medium text-badge-primary mb-2">Event Orders (Same Design, Multiple Copies):</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Minimum 15 pieces: 13 AED each</li>
                  </ul>
                </div>
                <p>
                  <strong className="text-badge-primary">5.3 Shipping costs.</strong> Shipping costs are calculated based on your delivery location and will be displayed before you complete your order.
                </p>
                <p>
                  <strong className="text-badge-primary">5.4 When you must pay.</strong> You must pay for the products before we dispatch them. We accept payment via PayPal.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">6</span>
                Delivery
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">6.1 Delivery costs and times.</strong> The costs and estimated delivery times will be as displayed on our website and confirmed in your order confirmation.
                </p>
                <p>
                  <strong className="text-badge-primary">6.2 Production time.</strong> Custom badges typically require 1-3 business days for production before shipping.
                </p>
                <p>
                  <strong className="text-badge-primary">6.3 Shipping carrier.</strong> We use Aramex for delivery services. You will receive tracking information once your order has been dispatched.
                </p>
                <p>
                  <strong className="text-badge-primary">6.4 If you are not at home when delivery is attempted.</strong> If no one is available at your address to take delivery, the carrier will leave a note informing you of how to rearrange delivery or collect from a depot.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">7</span>
                Your Rights to Cancel
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">7.1 Custom products.</strong> As our badges are custom-made to your specifications, you do not have the right to change your mind and cancel once production has begun. Please ensure your design is correct before placing your order.
                </p>
                <p>
                  <strong className="text-badge-primary">7.2 Cancellation before production.</strong> If you wish to cancel your order before we have begun production, please contact us immediately. We will refund your payment in full if we have not yet started making your badges.
                </p>
                <p>
                  <strong className="text-badge-primary">7.3 Faulty products.</strong> If your badges arrive damaged or defective, please contact us within 7 days of delivery with photos of the issue. We will arrange a replacement or refund at our discretion.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">8</span>
                Intellectual Property
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">8.1 Your images.</strong> You retain all rights to images you upload. By uploading images, you grant us a license to use them solely for the purpose of fulfilling your order.
                </p>
                <p>
                  <strong className="text-badge-primary">8.2 Your responsibility.</strong> You warrant that any images you upload are either owned by you or that you have obtained all necessary permissions to use them. You agree to indemnify us against any claims arising from your use of images.
                </p>
                <p>
                  <strong className="text-badge-primary">8.3 Prohibited content.</strong> We reserve the right to refuse any order containing content that is illegal, offensive, infringes third-party rights, or violates any applicable laws.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">9</span>
                Our Liability
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">9.1 We are responsible for losses you suffer.</strong> We are responsible for losses you suffer caused by us breaking this contract unless the loss is unexpected, caused by events outside our control, or avoidable.
                </p>
                <p>
                  <strong className="text-badge-primary">9.2 We do not exclude or limit our liability.</strong> Nothing in these terms shall limit or exclude our liability for death or personal injury caused by our negligence, fraud, or any other liability which cannot be limited or excluded by applicable law.
                </p>
                <p>
                  <strong className="text-badge-primary">9.3 Limitation of liability.</strong> Our total liability to you for all losses arising under or in connection with any contract between us shall not exceed the total price paid by you for the products.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="mb-10">
              <h2 className="font-display text-xl font-semibold text-badge-primary mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-badge-primary/10 flex items-center justify-center text-sm text-badge-primary">10</span>
                General
              </h2>
              
              <div className="space-y-4 text-badge-primary/70 ml-10">
                <p>
                  <strong className="text-badge-primary">10.1 We may transfer this agreement.</strong> We may transfer our rights and obligations under these terms to another organisation.
                </p>
                <p>
                  <strong className="text-badge-primary">10.2 You need our consent to transfer your rights.</strong> You may only transfer your rights or your obligations under these terms to another person if we agree to this in writing.
                </p>
                <p>
                  <strong className="text-badge-primary">10.3 This contract is between you and us.</strong> No other person shall have any rights to enforce any of its terms.
                </p>
                <p>
                  <strong className="text-badge-primary">10.4 Governing law.</strong> These terms are governed by the laws of the United Arab Emirates. Any disputes will be subject to the exclusive jurisdiction of the courts of the UAE.
                </p>
              </div>
            </section>

          </div>

          {/* Contact Box */}
          <div className="mt-12 p-6 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5 rounded-xl border border-badge-primary/10">
            <h3 className="font-display text-lg font-semibold text-badge-primary mb-2">
              Questions about our terms?
            </h3>
            <p className="text-badge-primary/60 text-sm mb-4">
              If you have any questions about these Terms of Service, please don't hesitate to contact us.
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

export default TermsOfService

