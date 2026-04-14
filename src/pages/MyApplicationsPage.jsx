// src/pages/MyApplicationsPage.jsx
import { useState, useEffect } from 'react'
import { Link }                from 'react-router-dom'
import applicationService      from '../services/applicationService'
import StatusBadge             from '../components/StatusBadge'

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await applicationService.getMyApplications()
        setApplications(response.data)
      } catch {
        setError('Could not load your applications.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse flex gap-4 mb-4
                                bg-white rounded-2xl p-4 border border-stone-100">
          <div className="w-20 h-20 bg-stone-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-stone-200 rounded w-1/3" />
            <div className="h-3 bg-stone-200 rounded w-1/4" />
            <div className="h-3 bg-stone-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">
        My Applications
      </h1>
      <p className="text-stone-400 text-sm mb-8">
        Track the status of your adoption applications.
      </p>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && applications.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <p className="mb-4">You haven't applied to adopt any pets yet.</p>
          <Link to="/dogs"
            className="text-teal-500 underline text-sm">
            Browse adoptable pets
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {applications.map(app => (
          <div key={app.id}
            className="bg-white rounded-2xl border border-stone-100 p-4
                       flex gap-4 items-start">

            {/* Pet thumbnail */}
            <div className="w-20 h-20 rounded-xl bg-stone-100 overflow-hidden
                            shrink-0">
              {app.pet?.imageUrl ? (
                <img src={app.pet.imageUrl} alt={app.pet.name}
                     className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center
                                justify-center text-3xl text-stone-300">
                  🐾
                </div>
              )}
            </div>

            {/* Application details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <Link to={`/pets/${app.pet?.id}`}
                  className="font-semibold text-stone-800 hover:text-teal-600
                             transition-colors truncate">
                  {app.pet?.name}
                </Link>
                {/* WHY custom status display: application status is different
                    from pet status — pending/approved/denied not available/adopted */}
                <AppStatusBadge status={app.status} />
              </div>

              <p className="text-sm text-stone-400 mb-2">
                {app.pet?.breed} ·{' '}
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {app.message && (
                <p className="text-sm text-stone-500 italic line-clamp-2">
                  "{app.message}"
                </p>
              )}

              {/* Status-specific helper messages */}
              {app.status === 'APPROVED' && (
                <p className="text-xs text-teal-600 mt-2 font-medium">
                  Congratulations! The shelter will contact you shortly.
                </p>
              )}
              {app.status === 'DENIED' && (
                <p className="text-xs text-stone-400 mt-2">
                  This application was not approved. Keep looking — your
                  perfect pet is out there!
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Application-specific status badge — different colors from pet status
function AppStatusBadge({ status }) {
  const styles = {
    PENDING:  'bg-amber-50  text-amber-700  border-amber-100',
    APPROVED: 'bg-teal-50   text-teal-700   border-teal-100',
    DENIED:   'bg-stone-100 text-stone-500  border-stone-200',
  }
  return (
    <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5
                      rounded-full border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  )
}