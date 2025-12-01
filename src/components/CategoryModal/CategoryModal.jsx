import { useState } from 'react'

/**
 * Category Selection Modal
 * Asks user if the badge is for Personal or Event use
 */
function CategoryModal({ isOpen, onSelect, onClose }) {
  const [selected, setSelected] = useState(null)

  if (!isOpen) return null

  const handleContinue = () => {
    if (selected) {
      onSelect(selected)
    }
  }

  const categories = [
    {
      id: 'personal',
      title: 'Personal',
      description: 'Multiple unique designs',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      examples: ['Gifts', 'Memories', 'Pets'],
      pricingList: [
        { qty: '1-4 pcs', price: '20 AED each' },
        { qty: '5-9 pcs', price: '17 AED each' },
        { qty: '10+ pcs', price: '15 AED each' }
      ]
    },
    {
      id: 'event',
      title: 'Event',
      description: 'One design, multiple copies',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      examples: ['Parties', 'Weddings', 'Corporate'],
      pricing: 'Min 15 pcs • 13 AED each'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 text-center border-b border-gray-100">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-badge-primary">
            What's this badge for?
          </h2>
          <p className="text-badge-primary/60 mt-2">
            Help us understand your needs better
          </p>
        </div>

        {/* Options */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelected(category.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selected === category.id
                  ? 'border-badge-primary bg-badge-primary/5 shadow-md'
                  : 'border-gray-200 hover:border-badge-primary/30 hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
                selected === category.id
                  ? 'bg-badge-primary text-white'
                  : 'bg-gray-100 text-badge-primary/60'
              }`}>
                {category.icon}
              </div>
              <h3 className={`font-semibold text-lg ${
                selected === category.id ? 'text-badge-primary' : 'text-gray-700'
              }`}>
                {category.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {category.examples.map((ex, i) => (
                  <span 
                    key={i}
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      selected === category.id
                        ? 'bg-badge-primary/10 text-badge-primary'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {ex}
                  </span>
                ))}
              </div>
              <div className={`mt-3 pt-2 border-t ${
                selected === category.id
                  ? 'border-badge-primary/20'
                  : 'border-gray-100'
              }`}>
                {category.pricingList ? (
                  <div className="space-y-1">
                    {category.pricingList.map((tier, i) => (
                      <div key={i} className={`flex justify-between text-xs ${
                        selected === category.id ? 'text-badge-primary' : 'text-gray-500'
                      }`}>
                        <span>{tier.qty}</span>
                        <span className={`font-semibold ${
                          selected === category.id ? 'text-badge-secondary' : 'text-gray-600'
                        }`}>{tier.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs font-medium ${
                    selected === category.id ? 'text-badge-secondary' : 'text-gray-400'
                  }`}>
                    💰 {category.pricing}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary py-3"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selected}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <svg className="w-4 h-4 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryModal

