// filepath: c:\Users\anna.a.johnson\IdeaProjects\petconnect--client\src\components\adoptionApplicationForm.jsx
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

export default function AdoptionApplicationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    homeType: '',
    currentPets: '',
    reason: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    setTimeout(() => navigate(`/pets/${id}`), 1800)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Adoption Application</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Apply to Adopt</h1>
          </div>
          <Link
            to={`/pets/${id}`}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
          >
            Back to profile
          </Link>
        </div>

        {submitted ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <p className="text-xl font-semibold text-emerald-900">Application submitted!</p>
            <p className="mt-3 text-slate-600">Your request has been sent. You will be redirected back shortly.</p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Full Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Phone</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Home Type</span>
              <input
                name="homeType"
                value={form.homeType}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Current Pets</span>
              <input
                name="currentPets"
                value={form.currentPets}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Why do you want to adopt?</span>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                required
                rows="5"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </main>
  )
}