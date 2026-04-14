// src/components/ProtectedRoute.jsx
// WHY: Wraps any page that requires login. Without this, a user could
// manually type /admin in the URL and see the admin dashboard.
import { Navigate } from 'react-router-dom'
import { useAuth }  from '../hooks/useAuth'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth()

  // Not logged in at all → go to login
  if (!isLoggedIn) return <Navigate to="/login" replace />

  // Logged in but wrong role (e.g. USER trying to access /admin)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  // All good — render the protected page
  return children
}