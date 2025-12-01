import { useState } from 'react'

/**
 * Admin Login Component
 * Simple login for admin access
 */
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Simple admin password (in production, use proper auth)
  const ADMIN_PASSWORD = 'admin123'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_logged_in', 'true')
      onLogin(true)
    } else {
      setError('Invalid password')
    }
  }

  return (
    <div className="min-h-screen bg-badge-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/images/ds_logo.png" alt="Daisy & Son Co." className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl font-semibold text-badge-primary">Admin Access</h1>
          <p className="text-badge-primary/60 mt-2">Enter password to manage orders</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-badge-primary/70 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Login
          </button>

          <p className="text-center text-xs text-badge-primary/40 mt-4">
            Default password: admin123
          </p>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin

