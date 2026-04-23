import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import BrowseDogsPage from './pages/BrowseDogsPage'
import BrowseCatsPage from './pages/BrowseCatsPage'
import PetDetailPage from './pages/PetDetailPage'
import MatchQuizPage from './pages/MatchQuizPage'
import LoginPage from './pages/LoginPage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import AdminDashboard from './pages/AdminDashboard'
import PetProfile from './pages/PetProfile'
import AdoptionApplicationForm from './components/AdoptionApplicationForm'

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
          <Route path="/pets/:id" element={<PetDetailPage />} />
          <Route path="/match" element={<MatchQuizPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/dogs" element={<BrowseDogsPage />} />
          <Route path="/cats" element={<BrowseCatsPage />} />
          // Add these new routes here:
          <Route path="/pets/:id" element={<PetProfile />} />
          <Route path="/pets/:id/apply" element={<AdoptionApplicationForm />} />
          <Route path="/match" element={<MatchQuizPage />} />
          <Route path="/login" element={<LoginPage />} />

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




// // src/App.jsx
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import { AuthProvider } from './AuthContext'
// import Navbar            from './components/Navbar'
// import ProtectedRoute    from './components/ProtectedRoute'

// // Pages
// import HomePage           from './pages/HomePage'
// import BrowseDogsPage     from './pages/BrowseDogsPage'
// import BrowseCatsPage     from './pages/BrowseCatsPage'
// import PetDetailPage      from './pages/PetDetailPage'
// import MatchQuizPage      from './pages/MatchQuizPage'
// import LoginPage          from './pages/LoginPage'
// import MyApplicationsPage from './pages/MyApplicationsPage'
// import AdminDashboard     from './pages/AdminDashboard'

// export default function App() {
//   return (
//     // WHY AuthProvider here: wraps EVERYTHING so every page has access to auth state
//     <AuthProvider>
//       <div className="min-h-screen bg-stone-50">
//         <Navbar />

//         <Routes>
//           {/* ── Public routes — no login needed ─────────────────────── */}
//           <Route path="/"       element={<HomePage />} />
//           <Route path="/dogs"   element={<BrowseDogsPage />} />
//           <Route path="/cats"   element={<BrowseCatsPage />} />
//           <Route path="/pets/:id" element={<PetDetailPage />} />
//           <Route path="/match"  element={<MatchQuizPage />} />
//           <Route path="/login"  element={<LoginPage />} />

//           {/* ── Protected routes — must be logged in ─────────────────── */}
//           {/* WHY ProtectedRoute wrapper: redirects to /login if no token */}
//           <Route path="/my-applications" element={
//             <ProtectedRoute>
//               <MyApplicationsPage />
//             </ProtectedRoute>
//           } />

//           {/* ── Admin only — requires ADMIN role ─────────────────────── */}
//           <Route path="/admin" element={
//             <ProtectedRoute requiredRole="ADMIN">
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />

//           {/* ── Catch-all: redirect unknown URLs to homepage ──────────── */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>
//     </AuthProvider>
//   )
// }

// const router = createBrowserRouter(routes, {
//   future: {
//     v7_startTransition: true,
//     v7_relativeSplatPath: true,
//   },
// });

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );