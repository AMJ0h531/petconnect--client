import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const DEMO_ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
const DEMO_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'PetConnectAdmin2026!'

export default function AdminLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const isValidAdmin =
      credentials.username === DEMO_ADMIN_USERNAME &&
      credentials.password === DEMO_ADMIN_PASSWORD

    if (!isValidAdmin) {
      setError('Invalid admin credentials')
      return
    }

    login('admin-demo-token', {
      username: DEMO_ADMIN_USERNAME,
      role: 'ADMIN',
      userId: 'admin-demo-user',
    })

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} autoComplete="off" className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mb-6 text-center text-sm text-slate-500">
          This route is role-protected in the app. For production security, wire this form to your backend auth service.
        </p>

        {error && <p className="mb-4 text-center text-red-600">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="off"
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
            autoComplete="new-password"
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
  )
}
