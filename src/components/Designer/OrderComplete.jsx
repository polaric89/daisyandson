/**
 * Order completion success screen
 */
function OrderComplete({ 
  completedOrderId, 
  quantity, 
  onTrackOrder, 
  onStartNew, 
  onBackToHome 
}) {
  return (
    <div className="glass-card p-12 text-center max-w-2xl mx-auto">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-display text-3xl font-bold text-badge-primary mb-4">Order Placed! 🎉</h2>
      
      {/* Order ID */}
      {completedOrderId && (
        <div className="bg-badge-primary/5 border border-badge-primary/20 rounded-xl p-4 mb-6 inline-block">
          <p className="text-xs text-badge-primary/60 mb-1">Your Order ID</p>
          <p className="font-mono text-lg font-bold text-badge-primary select-all">{completedOrderId}</p>
          <p className="text-xs text-badge-primary/50 mt-1">Save this to track your order</p>
        </div>
      )}
      
      <p className="text-badge-primary/70 mb-2">
        Thank you for your order of {quantity} badge{quantity > 1 ? 's' : ''}!
      </p>
      <p className="text-badge-primary/50 text-sm mb-8">
        Your 58mm badges will be printed in high quality and shipped to you soon.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onTrackOrder} className="btn-secondary">
          <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Track Order
        </button>
        <button onClick={onStartNew} className="btn-primary">
          Create Another Order
        </button>
        <button onClick={onBackToHome} className="btn-secondary">
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default OrderComplete

