export { useAuth } from '../AuthContext'
// In your login function:
const login = (userData) => {
  // ...existing logic...
  setUser({ ...userData, role: userData.role || 'USER' }) // Default to 'USER'
}