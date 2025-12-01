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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-badge-primary to-badge-secondary flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-badge-primary">Admin Access</h1>
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

