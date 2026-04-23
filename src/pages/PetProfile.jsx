import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import applicationService from '../services/applicationService'
import catService from '../services/catService'
import dogService from '../services/dogService'
import StatusBadge from '../components/StatusBadge'

export default function PetProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, user } = useAuth()

  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [appError, setAppError] = useState(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true)
      setError(null)

      try {
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

  useEffect(() => {
    const loadMyApplications = async () => {
      if (!isLoggedIn || !user || !pet) return

      try {
        const response = await applicationService.getMyApplications()
        const hasPendingApplication = response.data.some(application =>
          application.pet?.id === pet.id && application.status === 'PENDING'
        )
        setSubmitted(hasPendingApplication)
      } catch {
        setSubmitted(false)
      }
    }

    loadMyApplications()
  }, [isLoggedIn, pet, user])

  const handleApply = async (event) => {
    event.preventDefault()

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    setSubmitting(true)
    setAppError(null)

    try {
      const response = await applicationService.submit(pet.id, message)
      setPet(response.data.pet)
      setSubmitted(true)
      setShowApplicationForm(false)
    } catch (err) {
      setAppError(err.response?.data?.message || err.message || 'Could not submit application')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">Loading...</div>
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 mb-4">{error}</p>
        <Link to="/" className="text-teal-500 underline text-sm">Back to home</Link>
      </div>
    )
  }

  if (!pet) return null

  const browsePath = pet.species === 'DOG' ? '/dogs' : '/cats'
  const browseLabel = pet.species === 'DOG' ? 'dogs' : 'cats'
  const isPetAvailable = pet.status === 'AVAILABLE'
  const isPetPending = pet.status === 'PENDING'
  const isPetAdopted = pet.status === 'ADOPTED'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <nav className="text-sm text-stone-400 mb-6">
        <Link to="/" className="hover:text-stone-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={browsePath} className="hover:text-stone-600 capitalize">
          {browseLabel}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-stone-600">{pet.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative mb-4 h-80 overflow-hidden rounded-2xl bg-stone-100">
            {pet.imageUrl ? (
              <img src={pet.imageUrl} alt={pet.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl text-stone-200">
                {pet.species === 'CAT' ? '🐱' : '🐶'}
              </div>
            )}
            <div className="absolute left-4 top-4">
              <StatusBadge status={pet.status} />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3">
            <StatCard label="Age" value={pet.age ? `${pet.age} year${pet.age !== 1 ? 's' : ''}` : 'Unknown'} />
            <StatCard label="Breed" value={pet.breed} />
            {pet.size && <StatCard label="Size" value={formatEnum(pet.size)} />}
          </div>

          <div className="flex flex-wrap gap-2">
            {pet.goodWithKids && <Trait label="Good with kids" />}
            {pet.goodWithDogs && <Trait label="Good with dogs" />}
            {pet.goodWithCats && <Trait label="Good with cats" />}
            {pet.isVaccinated && <Trait label="Vaccinated" />}
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-stone-800 mb-1">{pet.name}</h1>
          <p className="text-stone-400 text-sm mb-6">{pet.breed}</p>
          {pet.description && <p className="text-stone-600 leading-relaxed mb-8">{pet.description}</p>}

          {isPetAvailable && (
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-6">
              <h2 className="font-display text-xl font-semibold text-stone-800 mb-3">
                Apply to adopt {pet.name}
              </h2>
              <p className="mb-4 text-sm text-stone-500">
                The adopt button now sends an application to the admin for review before the adoption is finalized.
              </p>

              {submitted ? (
                <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-700">
                  Your application has been submitted. This pet is now pending admin review.
                </div>
              ) : !isLoggedIn ? (
                <div className="py-2 text-center">
                  <p className="mb-4 text-sm text-stone-500">You need an account to apply.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded-xl bg-teal-500 px-6 py-3 text-sm font-medium text-white hover:bg-teal-600"
                  >
                    Sign in to apply
                  </button>
                </div>
              ) : !showApplicationForm ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowApplicationForm(true)
                    setAppError(null)
                  }}
                  className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-white hover:bg-teal-600"
                >
                  Adopt {pet.name}
                </button>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm text-stone-600">
                      Tell the shelter about yourself <span className="text-stone-400">(optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={event => setMessage(event.target.value)}
                      rows={4}
                      placeholder={`Why would ${pet.name} be a great fit?`}
                      className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
                    />
                  </div>
                  {appError && <p className="text-sm text-red-500">{appError}</p>}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded-xl bg-teal-500 py-3 font-semibold text-white hover:bg-teal-600 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : `Send application for ${pet.name}`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="rounded-xl border border-stone-200 px-4 py-3 font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {isPetPending && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
              <p className="mb-2 font-medium text-amber-800">{pet.name} already has an adoption request under review.</p>
              <p className="mb-4 text-sm text-amber-700">
                While the application is pending, the adopt button is locked so nobody else can adopt this pet at the same time.
              </p>
              <Link to={browsePath} className="text-sm text-amber-700 underline">
                Browse more {browseLabel}
              </Link>
            </div>
          )}

          {isPetAdopted && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
              <p className="mb-2 font-medium text-blue-700">{pet.name} has found a home!</p>
              <Link to={browsePath} className="text-sm text-blue-600 underline">
                Browse more {browseLabel}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white px-4 py-3">
      <p className="mb-0.5 text-xs text-stone-400">{label}</p>
      <p className="text-sm font-semibold text-stone-700">{value}</p>
    </div>
  )
}

function Trait({ label }) {
  return (
    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
      {label}
    </span>
  )
}

function formatEnum(value) {
  return String(value).toLowerCase().replace(/_/g, ' ')
}
