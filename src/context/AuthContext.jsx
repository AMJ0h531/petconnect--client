// src/context/AuthContext.jsx
// WHY useContext: avoids "prop drilling" — passing token through 10 component layers
// Instead any component calls useAuth() and gets the token directly
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // WHY localStorage: token survives page refresh — user stays logged in
  const [token,    setToken]    = useState(() => localStorage.getItem('token'))
  const [user,     setUser]     = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading,  setLoading]  = useState(false)

  // Login: save token + user info to state AND localStorage
  const login = (tokenValue, userInfo) => {
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user',  JSON.stringify(userInfo))
    setToken(tokenValue)
    setUser(userInfo)
  }

  // Logout: clear everything
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  // Helpers — used by ProtectedRoute and Navbar
  const isLoggedIn  = !!token
  const isAdmin     = user?.role === 'ADMIN'
  const isShelter   = user?.role === 'SHELTER' || isAdmin
  const isSitter    = user?.role === 'SITTER'

  return (
    <AuthContext.Provider value={{
      token, user, loading,
      login, logout,
      isLoggedIn, isAdmin, isShelter, isSitter
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// WHY custom hook: components import useAuth() not useContext(AuthContext)
// Cleaner imports, and throws a helpful error if used outside AuthProvider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}