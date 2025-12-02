import { useState } from 'react'

/**
 * Referrer Authentication Page
 * Combined registration and login
 */
function ReferrerAuth({ onLogin, onBack }) {
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  })

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/referrer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setSuccess('Registration successful! You can now login.')
      setMode('login')
      setFormData(prev => ({ ...prev, name: '', password: '', phone: '' }))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/referrer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store referrer data in localStorage
      localStorage.setItem('referrer_data', JSON.stringify(data.referrer))
      localStorage.setItem('referrer_id', data.referrer.id)

      onLogin(data.referrer, data.stats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-badge-cream py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button onClick={onBack} className="hover:scale-105 transition-transform mb-4">
            <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-16 w-auto mx-auto" />
          </button>
          <h1 className="font-display text-2xl font-bold text-badge-primary">
            {mode === 'login' ? 'Referrer Login' : 'Become a Referrer'}
          </h1>
          <p className="text-badge-primary/60 mt-2">
            {mode === 'login' 
              ? 'Access your referral dashboard' 
              : 'Earn 10% commission on every sale you refer'}
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {/* Registration Fields */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-badge-primary mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-badge-primary mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-badge-primary mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder={mode === 'register' ? 'Create a password (min 6 characters)' : 'Enter your password'}
                required
                minLength={6}
                className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
              />
            </div>

            {/* Phone (Registration only - optional) */}
            {mode === 'register' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-badge-primary mb-1">
                  Phone Number <span className="text-badge-primary/40">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-4 py-2.5 border border-badge-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-badge-primary/20"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'login' ? 'Logging in...' : 'Registering...'}
                </span>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            {mode === 'login' ? (
              <p className="text-badge-primary/60 text-sm">
                Don't have an account?{' '}
                <button 
                  onClick={() => { setMode('register'); setError(null); setSuccess(null); }}
                  className="text-badge-secondary font-medium hover:underline"
                >
                  Register now
                </button>
              </p>
            ) : (
              <p className="text-badge-primary/60 text-sm">
                Already registered?{' '}
                <button 
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-badge-secondary font-medium hover:underline"
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button onClick={onBack} className="text-badge-primary/60 hover:text-badge-primary text-sm">
            ← Back to Home
          </button>
        </div>

        {/* Benefits (Registration mode) */}
        {mode === 'register' && (
          <div className="mt-8 glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-badge-primary mb-4">
              Why Become a Referrer?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="font-medium text-badge-primary">10% Commission</p>
                  <p className="text-sm text-badge-primary/60">Earn on every sale from your referrals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-medium text-badge-primary">Track Everything</p>
                  <p className="text-sm text-badge-primary/60">Dashboard with clicks, conversions, earnings</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="font-medium text-badge-primary">Flexible Payouts</p>
                  <p className="text-sm text-badge-primary/60">PayPal or Bank Transfer (min 50 AED)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReferrerAuth

