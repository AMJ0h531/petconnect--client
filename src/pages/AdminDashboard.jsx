import { useEffect, useState } from 'react'
import applicationService from '../services/applicationService'
import StatusBadge from '../components/StatusBadge'

export default function AdminDashboard() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [appFilter, setAppFilter] = useState('all')
  const [actionError, setActionError] = useState(null)
  const [activeActionId, setActiveActionId] = useState(null)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    setLoading(true)

    try {
      const response = await applicationService.getAll()
      setApps(response.data || [])
      setActionError(null)
    } catch (error) {
      console.error('Failed to load applications', error)
      setActionError('Could not load adoption applications.')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (appId, action) => {
    setActiveActionId(appId)
    setActionError(null)

    try {
      await applicationService.updateStatus(appId, action)
      await loadApplications()
    } catch (error) {
      console.error('Could not update application', error)
      setActionError('Could not update that application.')
    } finally {
      setActiveActionId(null)
    }
  }

  const filteredApps = apps.filter(app => appFilter === 'all' || app.status === appFilter)
  const counts = {
    total: apps.length,
    pending: apps.filter(app => app.status === 'PENDING').length,
    approved: apps.filter(app => app.status === 'APPROVED').length,
    denied: apps.filter(app => app.status === 'DENIED').length,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-stone-500">
            Review adoption requests and decide which pets move from pending review to adopted.
          </p>
        </div>
        <button
          type="button"
          onClick={loadApplications}
          className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
        >
          Refresh queue
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total requests" value={counts.total} tone="stone" />
        <SummaryCard label="Pending review" value={counts.pending} tone="amber" />
        <SummaryCard label="Approved" value={counts.approved} tone="teal" />
        <SummaryCard label="Denied" value={counts.denied} tone="red" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'PENDING', 'APPROVED', 'DENIED'].map(filter => (
          <button
            key={filter}
            onClick={() => setAppFilter(filter)}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              appFilter === filter ? 'bg-teal-500 text-white' : 'bg-stone-200 text-stone-700'
            }`}
          >
            {filter === 'all' ? 'All' : filter}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white">
          {filteredApps.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-stone-500">
              No applications match this filter right now.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-left">
                <tr className="border-b border-stone-100">
                  <th className="px-4 py-3">Applicant</th>
                  <th className="px-4 py-3">Pet</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map(app => (
                  <tr key={app.id} className="align-top border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-4">
                      <div className="font-medium text-stone-800">{app.user?.username || 'Applicant'}</div>
                      <div className="text-xs text-stone-400">{app.user?.email || 'No email provided'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-stone-800">{app.pet?.name || 'Unknown pet'}</div>
                      <div className="text-xs text-stone-400">{app.pet?.breed || 'Breed unavailable'}</div>
                      {app.pet?.status && (
                        <div className="mt-2">
                          <StatusBadge status={app.pet.status} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-stone-500">
                      {new Date(app.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <AppStatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-4 text-stone-600">
                      {app.message ? (
                        <p className="max-w-sm whitespace-pre-wrap">{app.message}</p>
                      ) : (
                        <span className="text-stone-400">No message provided</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {app.status === 'PENDING' ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAction(app.id, 'APPROVED')}
                            disabled={activeActionId === app.id}
                            className="rounded-lg bg-teal-500 px-3 py-2 text-white hover:bg-teal-600 disabled:opacity-50"
                          >
                            {activeActionId === app.id ? 'Saving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleAction(app.id, 'DENIED')}
                            disabled={activeActionId === app.id}
                            className="rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            {activeActionId === app.id ? 'Saving...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-stone-400">Decision recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const tones = {
    stone: 'border-stone-200 bg-stone-50 text-stone-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-800',
    teal: 'border-teal-100 bg-teal-50 text-teal-700',
    red: 'border-red-100 bg-red-50 text-red-700',
  }

  return (
    <div className={`rounded-2xl border px-5 py-4 ${tones[tone] || tones.stone}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}

function AppStatusBadge({ status }) {
  const styles = {
    PENDING: 'border-amber-100 bg-amber-50 text-amber-700',
    APPROVED: 'border-teal-100 bg-teal-50 text-teal-700',
    DENIED: 'border-red-100 bg-red-50 text-red-700',
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  )
}
