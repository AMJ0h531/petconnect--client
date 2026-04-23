import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => (
    location.pathname === path
      ? 'text-teal-600 font-semibold'
      : 'text-stone-500 hover:text-stone-800'
  )

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-100 bg-white">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-stone-800">
          Pet Connect <span className="text-teal-500">+</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/dogs" className={isActive('/dogs')}>Dogs</Link>
          <Link to="/cats" className={isActive('/cats')}>Cats</Link>
          <Link to="/match" className={isActive('/match')}>Find My Match</Link>
          {isAdmin && (
            <Link to="/admin" className={isActive('/admin')}>
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <Link to="/admin-login" className="text-sm text-stone-500 hover:text-stone-700">
              Admin Login
            </Link>
          )}

          {isLoggedIn ? (
            <>
              {!isAdmin && (
                <Link to="/my-applications" className="text-sm text-stone-500 hover:text-stone-700">
                  My Applications
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">{user?.username}</span>
                <button
                  onClick={logout}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-50"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
