// src/pages/BrowseCatsPage.jsx
// WHY: Mirrors BrowseDogsPage exactly but uses useCats hook and cat-specific
// filters. Having separate pages gives adopters a focused experience.
import { useState }    from 'react'
import { useCats }     from '../hooks/useCats'
import FilterBar       from '../components/FilterBar'
import PetCard         from '../components/PetCard'
import LoadingSpinner  from '../components/LoadingSpinner'

const EMPTY_FILTERS = {
  indoorOutdoor: '', goodWithKids: undefined,
  goodWithDogs: undefined, isDeclawed: undefined
}

export default function BrowseCatsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [page,    setPage]    = useState(0)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(0)
  }

  const { cats, totalPages, loading, error } = useCats(filters, page)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-stone-800 mb-2">
          Adoptable Cats
        </h1>
        <p className="text-stone-500">
          Find your perfect feline companion. Filter by lifestyle, temperament,
          and home compatibility.
        </p>
      </div>

      <FilterBar
        species="cat"
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setFilters(EMPTY_FILTERS); setPage(0) }}
      />

      {loading && <LoadingSpinner count={6} />}

      {error && (
        <div className="text-center py-12 text-red-500">{error}</div>
      )}

      {!loading && !error && cats.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No cats match your filters.</p>
          <button onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-3 text-sm text-teal-500 underline">
            Clear filters
          </button>
        </div>
      )}

      {!loading && cats.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cats.map(cat => <PetCard key={cat.id} pet={cat} />)}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-stone-200
                           text-sm disabled:opacity-40 hover:bg-stone-50
                           transition-colors">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-stone-500">
                Page {page + 1} of {totalPages}
              </span>
              <button disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-stone-200
                           text-sm disabled:opacity-40 hover:bg-stone-50
                           transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}