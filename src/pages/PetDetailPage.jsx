// src/pages/PetDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth }          from '../hooks/useAuth'
import applicationService   from '../services/applicationService'
import dogService           from '../services/dogService'
import catService           from '../services/catService'
import StatusBadge          from '../components/StatusBadge'

export default function PetDetailPage() {
  const { id }       = useParams()    // /pets/:id — React Router extracts the id
  const { isLoggedIn } = useAuth()
  const navigate     = useNavigate()

  const [pet,        setPet]        = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  // Application form state
  const [message,    setMessage]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [appError,   setAppError]   = useState(null)

  // WHY useEffect with id dependency: re-fetches if user navigates
  // from /pets/1 directly to /pets/2 — params change but component stays mounted
  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try dog endpoint first, fall back to cat
        // WHY: we don't know which type from the URL alone
        let response
        try {
          response = await dogService.getById(id)
        } catch {
          response = await catService.getById(id)
        }
        setPet(response.data)
      } catch {
        setError('Pet not found')
      } finally {
        setLoading(false)
      }
    }
    fetchPet()
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    setSubmitting(true)
    setAppError(null)
    try {
      await applicationService.submit(pet.id, message)
      setSubmitted(true)
    } catch (err) {
      setAppError(
        err.response?.data?.message || 'Could not submit application'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-80 bg-stone-200 rounded-2xl mb-6" />
      <div className="h-8 bg-stone-200 rounded w-1/3 mb-3" />
      <div className="h-4 bg-stone-200 rounded w-1/2" />
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-stone-500 mb-4">{error}</p>
      <Link to="/" className="text-teal-500 underline text-sm">
        Back to home
      </Link>
    </div>
  )

  if (!pet) return null

  // ── Pet detail layout ──────────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-stone-400 mb-6">
        <Link to="/" className="hover:text-stone-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={pet.size ? '/dogs' : '/cats'}
          className="hover:text-stone-600 capitalize">
          {pet.size ? 'Dogs' : 'Cats'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-600">{pet.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── Left: photo + traits ──────────────────────────────────────── */}
        <div>
          {/* Main photo */}
          <div className="rounded-2xl overflow-hidden bg-stone-100 h-80
                          mb-4 relative">
            {pet.imageUrl ? (
              <img src={pet.imageUrl} alt={pet.name}
                   className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center
                              text-8xl text-stone-200">
                {pet.indoorOutdoor ? '🐱' : '🐕'}
              </div>
            )}
            <div className="absolute top-4 left-4">
              <StatusBadge status={pet.status} />
            </div>
          </div>

          {/* Quick stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <StatCard label="Age"
              value={pet.age != null ? `${pet.age} year${pet.age !== 1 ? 's' : ''}` : 'Unknown'} />
            <StatCard label="Breed"     value={pet.breed} />
            {pet.size && (
              <StatCard label="Size"
                value={pet.size.charAt(0) + pet.size.slice(1).toLowerCase()} />
            )}
            {pet.energyLevel && (
              <StatCard label="Energy"
                value={'⚡'.repeat(pet.energyLevel)} />
            )}
            {pet.indoorOutdoor && (
              <StatCard label="Lifestyle"
                value={pet.indoorOutdoor.charAt(0) +
                       pet.indoorOutdoor.slice(1).toLowerCase()} />
            )}
            {pet.activityLevel && (
              <StatCard label="Activity"
                value={`${pet.activityLevel} / 5`} />
            )}
          </div>

          {/* Trait chips */}
          <div className="flex flex-wrap gap-2">
            {pet.goodWithKids  && <Trait label="Good with kids" />}
            {pet.goodWithDogs  && <Trait label="Good with dogs" />}
            {pet.goodWithCats  && <Trait label="Good with cats" />}
            {pet.isHouseTrained && <Trait label="House trained" />}
            {pet.isVaccinated  && <Trait label="Vaccinated" />}
            {pet.isNeutered    && <Trait label="Neutered" />}
            {pet.isSpayed      && <Trait label="Spayed" />}
            {pet.isDeclawed    && <Trait label="Declawed" />}
            {pet.isLonghaired  && <Trait label="Longhaired" />}
          </div>

          {pet.shelterName && (
            <p className="text-xs text-stone-400 mt-4">
              Listed by {pet.shelterName}
            </p>
          )}
        </div>

        {/* ── Right: description + application form ─────────────────────── */}
        <div>
          <h1 className="font-display text-4xl font-bold text-stone-800 mb-1">
            {pet.name}
          </h1>
          <p className="text-stone-400 text-sm mb-6">
            {pet.breed}
            {pet.trainingLevel && ` · ${pet.trainingLevel.toLowerCase()} training`}
          </p>

          {pet.description && (
            <p className="text-stone-600 leading-relaxed mb-8">
              {pet.description}
            </p>
          )}

          {/* ── Application form ─────────────────────────────────────── */}
          {pet.status === 'AVAILABLE' && (
            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
              <h2 className="font-display text-xl font-semibold
                             text-stone-800 mb-4">
                Apply to adopt {pet.name}
              </h2>

              {/* Already submitted */}
              {submitted ? (
                <div className="bg-teal-50 border border-teal-100 rounded-xl
                                p-4 text-teal-700 text-sm">
                  Your application has been submitted! The shelter will
                  review it and contact you soon.
                </div>
              ) : !isLoggedIn ? (
                /* Not logged in */
                <div className="text-center py-4">
                  <p className="text-stone-500 text-sm mb-4">
                    You need an account to apply.
                  </p>
                  <Link to="/login"
                    className="px-6 py-3 bg-teal-500 text-white rounded-xl
                               font-medium text-sm hover:bg-teal-600
                               transition-colors">
                    Sign in or create account
                  </Link>
                </div>
              ) : (
                /* Application form */
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm text-stone-600 mb-1">
                      Tell the shelter about yourself
                      <span className="text-stone-400"> (optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      placeholder={`Why would ${pet.name} be a great fit for your home?`}
                      className="w-full px-4 py-3 rounded-xl border
                                 border-stone-200 text-sm resize-none
                                 focus:outline-none focus:ring-2
                                 focus:ring-teal-300 bg-white"
                    />
                  </div>

                  {appError && (
                    <p className="text-sm text-red-500">{appError}</p>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full py-3 rounded-xl bg-teal-500 text-white
                               font-semibold hover:bg-teal-600 disabled:opacity-50
                               transition-colors">
                    {submitting ? 'Submitting…' : `Apply to adopt ${pet.name}`}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Already adopted */}
          {pet.status === 'ADOPTED' && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl
                            p-6 text-center">
              <p className="text-blue-700 font-medium mb-2">
                {pet.name} has found a home!
              </p>
              <p className="text-blue-500 text-sm mb-4">
                But there are more pets waiting.
              </p>
              <Link to={pet.size ? '/dogs' : '/cats'}
                className="text-sm text-blue-600 underline">
                Browse more {pet.size ? 'dogs' : 'cats'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small helper components ─────────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-stone-100 px-4 py-3">
      <p className="text-xs text-stone-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-stone-700">{value}</p>
    </div>
  )
}

function Trait({ label }) {
  return (
    <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs
                     font-medium rounded-full">
      {label}
    </span>
  )
}