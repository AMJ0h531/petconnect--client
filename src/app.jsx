import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import BrowseDogsPage from './pages/BrowseDogsPage'
import BrowseCatsPage from './pages/BrowseCatsPage'
import MatchQuizPage from './pages/MatchQuizPage'
import LoginPage from './pages/LoginPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import AdminDashboard from './pages/AdminDashboard'
import PetProfile from './pages/PetProfile'
import AdoptionApplicationForm from './components/AdoptionApplicationForm'
import AdminLoginForm from './components/AdminLoginForm'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-stone-50">
        <Navbar />

        <Routes>
          {/* ── Public routes — no login needed ─────────────────────── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dogs" element={<BrowseDogsPage />} />
          <Route path="/cats" element={<BrowseCatsPage />} />
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/pets/:id/apply" element={<AdoptionApplicationForm />} />
          <Route path="/match" element={<MatchQuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginForm />} />

          {/* ── Protected routes — must be logged in ─────────────────── */}
          <Route path="/my-applications" element={
            <ProtectedRoute>
              <MyApplicationsPage />
            </ProtectedRoute>
          } />

          {/* ── Admin only — requires ADMIN role ─────────────────────── */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* ── Catch-all: redirect unknown URLs to homepage ──────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}