import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AdminLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Hardcoded for demo (replace with secure check)
   if (credentials.username === 'admin' && credentials.password === 'password') {
  // Simulate a token (replace with real API response)
  const fakeToken = 'admin-token-123' // In production, get from API
  const userInfo = { username: 'admin', role: 'ADMIN' } // Include role here
  login(fakeToken, userInfo) // Call login with token and userInfo
  navigate('/admin')
} else {
  setError('Invalid credentials')
}

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-slate-900 text-center">Admin Login</h1>
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Login as Admin
        </button>
      </form>
    </div>
