import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ReferralProvider } from './components/Referrals/ReferralContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReferralProvider>
      <App />
    </ReferralProvider>
  </React.StrictMode>,
)

