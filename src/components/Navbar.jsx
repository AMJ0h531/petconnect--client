// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth }           from '../hooks/useAuth'
import { Routes, Route, Navigate } from 'react-router-dom'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const location = useLocation()

  // WHY isActive: highlights current page link
  const isActive = (path) =>
    location.pathname === path
      ? 'text-teal-600 font-semibold'
      : 'text-stone-500 hover:text-stone-800'

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/"
          className="font-display text-xl font-bold text-stone-800 flex
                     items-center gap-2">
          Pet Connect <span className="text-teal-500">+</span>
        </Link>

        {/* Main nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/dogs"  className={isActive('/dogs')}>Dogs</Link>
          <Link to="/cats"  className={isActive('/cats')}>Cats</Link>
          <Link to="/match" className={isActive('/match')}>Find My Match</Link>
          {isAdmin && (
            <Link to="/admin"
              className="text-amber-600 hover:text-amber-700 font-medium">
              Admin
            </Link>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link to="/my-applications"
                className="text-sm text-stone-500 hover:text-stone-700">
                My Applications
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">{user?.username}</span>
                <button
                  onClick={logout}
                  className="text-sm px-4 py-2 rounded-xl border border-stone-200
                             text-stone-600 hover:bg-stone-50 transition-colors">
                  Log out
                </button>
              </div>
            </>
          ) : (
            <Link to="/login"
              className="text-sm px-4 py-2 rounded-xl bg-teal-500 text-white
                         hover:bg-teal-600 transition-colors font-medium">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}