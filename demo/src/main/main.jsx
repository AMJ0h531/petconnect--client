import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // WHY StrictMode: catches common mistakes during development only
  // It renders components twice in dev to detect side effects — no production impact
  <React.StrictMode>
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)