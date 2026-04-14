// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { Link }                from 'react-router-dom'
import dogService              from '../services/dogService'
import catService              from '../services/catService'
import PetCard                 from '../components/PetCard'

export default function HomePage() {
  const [featuredDogs, setFeaturedDogs] = useState([])
  const [featuredCats, setFeaturedCats] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const [dogs, cats] = await Promise.all([
          dogService.getFeatured(),
          catService.getFeatured(),
        ])
        setFeaturedDogs(dogs.data || [])
        setFeaturedCats(cats.data || [])
      } catch (e) {
        console.error('Could not load featured pets', e)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <div>
      {/* ── Hero section ─────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-teal-50 text-teal-600 text-sm
                          font-medium px-4 py-1.5 rounded-full mb-6">
            Find your forever friend
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold
                         text-stone-800 mb-6 leading-tight">
            Every pet deserves
            <br />
            <span className="text-teal-500">a loving home.</span>
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto mb-10
                        leading-relaxed">
            Browse adoptable dogs and cats from local shelters, or take our
            Match Quiz to find the perfect companion for your lifestyle.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/dogs"
              className="px-8 py-3.5 bg-teal-500 text-white rounded-2xl
                         font-semibold hover:bg-teal-600 transition-colors">
              Browse Dogs
            </Link>
            <Link to="/cats"
              className="px-8 py-3.5 bg-white text-stone-700 rounded-2xl
                         font-semibold border border-stone-200
                         hover:bg-stone-50 transition-colors">
              Browse Cats
            </Link>
            <Link to="/match"
              className="px-8 py-3.5 bg-stone-800 text-white rounded-2xl
                         font-semibold hover:bg-stone-900 transition-colors">
              Take the Quiz →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="bg-teal-500 py-8">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6
                        text-center text-white">
          <StatItem number={featuredDogs.length + 40} label="Dogs available" />
          <StatItem number={featuredCats.length + 20} label="Cats available" />
          <StatItem number={127} label="Successful adoptions" />
        </div>
      </section>

      {/* ── Featured Dogs ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-800">
            Featured Dogs
          </h2>
          <Link to="/dogs"
            className="text-sm text-teal-500 hover:text-teal-600
                       font-medium transition-colors">
            See all dogs →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl
                                      overflow-hidden border border-stone-100">
                <div className="h-52 bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDogs.map(dog => <PetCard key={dog.id} pet={dog} />)}
          </div>
        )}
      </section>

      {/* ── Match Quiz CTA ───────────────────────────────────────────────── */}
      <section className="bg-stone-800 py-16 mx-4 rounded-3xl mb-16
                          max-w-6xl lg:mx-auto">
        <div className="text-center px-4">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Not sure which pet is right for you?
          </h2>
          <p className="text-stone-400 max-w-md mx-auto mb-8 leading-relaxed">
            Answer 5 quick questions about your lifestyle and we'll match you
            with your most compatible pets — with a compatibility score and
            reasons why.
          </p>
          <Link to="/match"
            className="inline-block px-8 py-3.5 bg-teal-400 text-stone-900
                       rounded-2xl font-bold hover:bg-teal-300 transition-colors">
            Take the Match Quiz
          </Link>
        </div>
      </section>

      {/* ── Featured Cats ────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-800">
            Featured Cats
          </h2>
          <Link to="/cats"
            className="text-sm text-teal-500 hover:text-teal-600
                       font-medium transition-colors">
            See all cats →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-2xl
                                      overflow-hidden border border-stone-100">
                <div className="h-52 bg-stone-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCats.map(cat => <PetCard key={cat.id} pet={cat} />)}
          </div>
        )}
      </section>
    </div>
  )
}

function StatItem({ number, label }) {
  return (
    <div>
      <div className="text-3xl font-bold font-display mb-1">{number}+</div>
      <div className="text-teal-100 text-sm">{label}</div>
    </div>
  )
}