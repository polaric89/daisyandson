import { useState } from 'react'

/**
 * FAQ Page
 * Frequently Asked Questions for Daisy & Son Co.
 */
function FAQ({ onBack }) {
  const [openIndex, setOpenIndex] = useState(null)

  const faqCategories = [
    {
      title: 'Orders & Pricing',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      questions: [
        {
          q: 'What are your badge prices?',
          a: `Our pricing depends on the order type:\n\n**Personal Orders (Multiple Unique Designs):**\n• 1-4 badges: 20 AED each\n• 5-9 badges: 17 AED each\n• 10+ badges: 15 AED each\n\n**Event Orders (Same Design, Multiple Copies):**\n• Minimum 15 pieces: 13 AED each\n\nShipping costs are additional and calculated based on your location.`
        },
        {
          q: 'Is there a minimum order quantity?',
          a: 'For Personal orders, there is no minimum - you can order just 1 badge! For Event orders (same design, multiple copies), the minimum quantity is 15 pieces.'
        },
        {
          q: 'Do you offer bulk discounts?',
          a: 'Yes! Our pricing structure includes built-in volume discounts. The more badges you order, the lower the price per badge. For very large orders (50+ pieces), please contact us for a custom quote.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept payments through PayPal, which allows you to pay using your PayPal balance, credit card, or debit card. All transactions are secure and encrypted.'
        }
      ]
    },
    {
      title: 'Custom Designs',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      questions: [
        {
          q: 'What image formats do you accept?',
          a: 'We accept JPG, PNG, and most common image formats. For best results, we recommend high-resolution images (at least 500x500 pixels). Our designer exports at 2000x2000 pixels for crystal-clear prints.'
        },
        {
          q: 'Can I use any photo for my badge?',
          a: 'You can use personal photos, artwork, or images you have permission to use. Please ensure you own the rights to any images you upload. We reserve the right to refuse orders containing copyrighted material, offensive content, or images that violate any laws.'
        },
        {
          q: 'How do I position my image on the badge?',
          a: 'Our online designer allows you to zoom, pan, and rotate your image to get the perfect circular crop. You can preview exactly how your badge will look before ordering.'
        },
        {
          q: 'Can I order different designs in one order?',
          a: 'Yes! With Personal orders, each badge can have a different design. Simply add multiple designs using our designer tool. Event orders are for a single design printed multiple times.'
        },
        {
          q: 'What if I make a mistake in my design?',
          a: 'Please review your design carefully before completing your order. Once production begins, we cannot make changes. If you notice an error immediately after ordering, contact us right away and we\'ll do our best to help.'
        }
      ]
    },
    {
      title: 'Production & Quality',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      questions: [
        {
          q: 'What size are the badges?',
          a: 'Our standard badge size is 58mm (approximately 2.3 inches) in diameter. This is a popular size that\'s great for visibility while still being comfortable to wear.'
        },
        {
          q: 'What type of pin backing do the badges have?',
          a: 'All our badges come with a standard safety pin backing, making them easy to attach to clothing, bags, lanyards, and more.'
        },
        {
          q: 'How long does production take?',
          a: 'Production typically takes 1-3 business days. We\'ll notify you when your order is ready to ship. Rush orders may be available - please contact us for details.'
        },
        {
          q: 'What is the print quality like?',
          a: 'We use high-resolution printing technology to ensure your images are crisp and vibrant. Our badges are covered with a protective mylar layer that makes them water-resistant and durable.'
        },
        {
          q: 'Are the badges waterproof?',
          a: 'Our badges have a protective mylar coating that makes them water-resistant. They can handle light rain or splashes, but we don\'t recommend submerging them in water.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      questions: [
        {
          q: 'Which countries do you ship to?',
          a: 'We ship to the UAE and internationally! Shipping costs and delivery times vary by location. UAE domestic shipping is typically 1-2 business days, while international shipping takes 5-10 business days.'
        },
        {
          q: 'How much does shipping cost?',
          a: 'Shipping costs are calculated based on your delivery location:\n\n• **UAE Domestic:** 25 AED (1-2 business days)\n• **GCC Countries:** Varies by country\n• **International:** Starting from 85 AED\n\nExact shipping costs will be displayed at checkout.'
        },
        {
          q: 'Who is your shipping carrier?',
          a: 'We use Aramex for all our deliveries. Aramex is a reliable international courier service with tracking capabilities.'
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order on our website using your Order ID. Click "Track Order" in the navigation menu and enter your details.'
        },
        {
          q: 'What if I\'m not home when delivery is attempted?',
          a: 'Aramex will typically make multiple delivery attempts. If you\'re not available, they\'ll leave a notification with instructions on how to reschedule or pick up your package from a nearby location.'
        }
      ]
    },
    {
      title: 'Returns & Refunds',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
      questions: [
        {
          q: 'Can I cancel my order?',
          a: 'You can cancel your order before production begins. Please contact us immediately after placing your order if you need to cancel. Once production has started, cancellation is not possible as the badges are custom-made.'
        },
        {
          q: 'What if my badges arrive damaged?',
          a: 'If your badges arrive damaged or defective, please contact us within 7 days of delivery with photos of the damage. We\'ll arrange a replacement or refund at our discretion.'
        },
        {
          q: 'Can I return badges I don\'t want?',
          a: 'Because our badges are custom-made to your specifications, we cannot accept returns for change of mind. Please review your design carefully before ordering.'
        },
        {
          q: 'How long do refunds take?',
          a: 'If a refund is approved, it will be processed within 5-7 business days. The refund will be returned to your original payment method (PayPal). Please allow additional time for your bank to process the refund.'
        },
        {
          q: 'What if my order is lost in shipping?',
          a: 'If your order appears to be lost (no tracking updates for an extended period), please contact us. We\'ll work with Aramex to locate your package or arrange a replacement if necessary.'
        }
      ]
    },
    {
      title: 'Events & Bulk Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      questions: [
        {
          q: 'What are Event badges best for?',
          a: 'Event badges are perfect for:\n\n• Birthday parties\n• Weddings & engagements\n• Corporate events & conferences\n• Team building activities\n• Graduations\n• Sports teams\n• Club meetings\n• Promotional giveaways\n\nAny occasion where you need multiple copies of the same design!'
        },
        {
          q: 'What\'s the difference between Personal and Event orders?',
          a: '**Personal Orders:** Each badge can have a different design. Great for gifts, personal use, or when you want variety.\n\n**Event Orders:** One design printed on all badges. Better pricing (13 AED each) but requires a minimum of 15 pieces.'
        },
        {
          q: 'Can I mix Event and Personal badges in one order?',
          a: 'Currently, each order is either Personal or Event type. If you need both, you can place two separate orders.'
        },
        {
          q: 'Do you offer rush production for events?',
          a: 'We understand events have fixed dates! Please contact us if you have a tight deadline and we\'ll do our best to accommodate your timeline. Rush fees may apply.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIdx, questionIdx) => {
    const key = `${categoryIdx}-${questionIdx}`
    setOpenIndex(openIndex === key ? null : key)
  }

  return (
    <div className="min-h-screen bg-badge-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-badge-primary/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-12 w-auto" />
              <div>
                <h1 className="font-display text-xl font-semibold text-badge-primary">FAQ</h1>
                <p className="text-xs text-badge-primary/60">Frequently Asked Questions</p>
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
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-badge-primary mb-4">
            How can we help?
          </h1>
          <p className="text-badge-primary/60 max-w-2xl mx-auto">
            Find answers to common questions about our custom badge service. Can't find what you're looking for? Contact us!
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {faqCategories.map((category, idx) => (
            <a
              key={idx}
              href={`#category-${idx}`}
              className="flex items-center gap-2 p-3 bg-white/80 backdrop-blur rounded-xl border border-badge-primary/10 hover:border-badge-secondary/30 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-badge-secondary/10 text-badge-secondary flex items-center justify-center">
                {category.icon}
              </div>
              <span className="text-sm font-medium text-badge-primary">{category.title}</span>
            </a>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIdx) => (
            <div 
              key={categoryIdx} 
              id={`category-${categoryIdx}`}
              className="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-badge-primary/10 overflow-hidden"
            >
              {/* Category Header */}
              <div className="p-6 border-b border-badge-primary/10 bg-gradient-to-r from-badge-primary/5 to-badge-secondary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-badge-primary text-white flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-badge-primary">
                    {category.title}
                  </h2>
                </div>
              </div>

              {/* Questions */}
              <div className="divide-y divide-badge-primary/10">
                {category.questions.map((item, questionIdx) => {
                  const isOpen = openIndex === `${categoryIdx}-${questionIdx}`
                  return (
                    <div key={questionIdx}>
                      <button
                        onClick={() => toggleQuestion(categoryIdx, questionIdx)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-badge-beige/30 transition-colors"
                      >
                        <span className="font-medium text-badge-primary pr-4">{item.q}</span>
                        <svg 
                          className={`w-5 h-5 text-badge-secondary flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <div className="p-4 bg-badge-beige/30 rounded-xl text-badge-primary/70 text-sm leading-relaxed whitespace-pre-line">
                            {item.a.split('**').map((part, i) => 
                              i % 2 === 1 ? <strong key={i} className="text-badge-primary">{part}</strong> : part
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div className="mt-12 p-8 bg-gradient-to-r from-badge-primary to-badge-leaf rounded-2xl text-white text-center">
          <h3 className="font-display text-2xl font-semibold mb-2">
            Still have questions?
          </h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            We're here to help! Reach out to us and we'll get back to you as soon as possible.
          </p>
          <a 
            href="mailto:support@daisyandson.com"
            className="inline-flex items-center gap-2 bg-white text-badge-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </a>
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

export default FAQ

