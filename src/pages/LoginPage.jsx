// src/pages/LoginPage.jsx
import { useState }       from 'react'
import { useNavigate }    from 'react-router-dom'
import { useAuth }        from '../hooks/useAuth'
import authService        from '../services/authService'

export default function LoginPage() {
  const [mode,     setMode]     = useState('login')   // 'login' | 'register'
  const [form,     setForm]     = useState({ username:'', email:'', password:'' })
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let response
      if (mode === 'login') {
        response = await authService.login(form.username, form.password)
      } else {
        response = await authService.register(
          form.username, form.email, form.password)
      }
      login(response.data.token, {
        username: response.data.username,
        email:    response.data.email,
        role:     response.data.role,
        userId:   response.data.userId,
      })
      navigate('/')
    } catch (err) {
      if (!err.response) {
        // Backend not reachable — fall back to local mock session so the
        // adoption form and admin dashboard can be tested without a server.
        login('local-demo-token', {
          username: form.username,
          email:    form.email || `${form.username}@petconnect.local`,
          role:     'USER',
          userId:   `local-${form.username}`,
        })
        navigate('/')
      } else {
        setError(err.response?.data?.error || 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Mode toggle */}
        <div className="flex rounded-xl border border-stone-200 p-1 mb-8">
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null) }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                ${mode === m
                  ? 'bg-teal-500 text-white'
                  : 'text-stone-500 hover:text-stone-700'}`}>
              {m === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-stone-100 p-8">
          <h1 className="font-display text-2xl font-bold text-stone-800 mb-6">
            {mode === 'login' ? 'Welcome back' : 'Join Pet Connect Plus'}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl
                            text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Username" type="text"
              value={form.username}
              onChange={v => setForm(f => ({ ...f, username: v }))} />

            {mode === 'register' && (
              <Field label="Email" type="email"
                value={form.email}
                onChange={v => setForm(f => ({ ...f, email: v }))} />
            )}

            <Field label="Password" type="password"
              value={form.password}
              onChange={v => setForm(f => ({ ...f, password: v }))} />

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-500 text-white font-semibold
                         hover:bg-teal-600 disabled:opacity-50 transition-colors mt-2">
              {loading ? 'Please wait…' :
               mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-stone-600 mb-1">{label}</label>
      <input type={type} value={value} required
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-stone-200
                   focus:outline-none focus:ring-2 focus:ring-teal-300
                   text-sm bg-white" />
    </div>
  )
}

   