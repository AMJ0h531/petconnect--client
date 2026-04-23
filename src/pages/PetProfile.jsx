// filepath: c:\Users\anna.a.johnson\IdeaProjects\petconnect--client\src\pages\PetProfile.jsx
import { useEffect, useMemo } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'

const PETS = {
  luna: {
    id: 'luna',
    name: 'Luna',
    type: 'Dog',
    breed: 'Labrador Mix',
    age: '2 years',
    gender: 'Female',
    img: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=900&q=85',
    status: 'available',
    tags: ['Good with kids', 'Dog friendly', 'Cat friendly', 'Outdoor lover', 'Leash trained'],
    bio: `Luna is an absolute ray of sunshine wrapped in golden fur. She came to Happy Paws Shelter after her previous family relocated overseas, so she arrived already house-trained, leash-savvy, and full of love.`,
    facts: [
      { label: 'Shelter ID', value: '#HP-1042' },
      { label: 'Weight', value: '55 lbs' },
      { label: 'Coat', value: 'Short, golden' },
      { label: 'Energy', value: 'High' },
    ],
    traits: ['Affectionate', 'Energetic', 'Playful', 'Curious', 'Loyal', 'Social'],
    goodWith: [
      { icon: '👶', label: 'Young Children', ok: true },
      { icon: '🐕', label: 'Other Dogs', ok: true },
      { icon: '🐈', label: 'Cats', ok: true },
      { icon: '🏠', label: 'Apartment OK', ok: false },
      { icon: '🌲', label: 'Outdoor Space', ok: true },
      { icon: '🧒', label: 'Older Kids', ok: true },
    ],
    health: [
      { label: 'Spayed / Neutered', value: 'Yes', badge: 'bg-emerald-100 text-emerald-700' },
      { label: 'Vaccinations', value: 'Up to date — Rabies, DHPP, Bordetella', badge: 'bg-emerald-100 text-emerald-700' },
      { label: 'Microchipped', value: 'Yes — ID #985141002345678', badge: 'bg-sky-100 text-sky-700' },
    ],
    shelter: {
      name: 'Happy Paws Shelter',
      address: '123 Main St, Columbus, OH 43215',
      phone: '(614) 555-0199',
      email: 'adopt@happypaws.org',
      hours: 'Mon–Sat 9am–6pm · Sun 11am–4pm',
    },
  },
  // Add more pets here as needed (e.g., buddy, max, etc.)
}

export default function PetProfile() {
  const { id } = useParams()
  const pet = useMemo(() => PETS[id?.toLowerCase()], [id])

  useEffect(() => {
    document.title = pet ? `${pet.name} — PetConnect+` : 'Pet Not Found — PetConnect+'
  }, [pet])

  if (!pet) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-16 text-center">
        <p className="text-6xl">🐾</p>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Pet not found</h1>
        <p className="mt-3 text-slate-600">We couldn't find that pet profile.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          Back to Browse
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
          <Link to="/" className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-100">
            ← Back to Browse
          </Link>
          <span className="rounded-full bg-sky-100 px-3 py-2 text-sky-700">{pet.type}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-700">
            {pet.status === 'available' ? 'Available' : 'Adopted'}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-lg">
            <div className="relative min-h-[360px]">
              <img src={pet.img} alt={pet.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/60" />
            </div>
            <div className="space-y-6 p-8">
              <div className="space-y-3">
                <div className="text-4xl font-black tracking-tight">{pet.name}</div>
                <p className="text-sm text-slate-600">{pet.breed} · {pet.age} · {pet.gender}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {pet.facts.map((fact) => (
                  <div key={fact.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{fact.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{fact.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {pet.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to={`/pets/${pet.id}/apply`}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Apply to Adopt
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Contact Shelter
                </Link>
              </div>
            </div>
          </article>

          <section className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">About {pet.name}</h2>
              <p className="text-sm leading-7 text-slate-600">{pet.bio}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {pet.traits.map((trait) => (
                  <span key={trait} className="rounded-full bg-sky-100 px-4 py-2 text-xs font-semibold text-sky-700">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">Health & Vaccination</h2>
              <div className="space-y-3 text-sm text-slate-700">
                {pet.health.map((item) => (
                  <div key={item.label} className="flex items-start justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <span className="font-semibold text-slate-900">{item.label}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold">Good With</h2>
              <div className="grid gap-3">
                {pet.goodWith.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-2xl p-4 ${item.ok ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className={`text-sm ${item.ok ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {item.ok ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}