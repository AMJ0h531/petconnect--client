// src/pages/BrowseDogsPage.jsx
import { useState } from 'react'
import { useDogs }      from '../hooks/useDogs'
import FilterBar        from '../components/FilterBar'
import PetCard          from '../components/PetCard'
import LoadingSpinner   from '../components/LoadingSpinner'

const EMPTY_FILTERS = {
  size: '', goodWithKids: undefined,
  goodWithDogs: undefined, goodWithCats: undefined
}

export default function BrowseDogsPage() {
  const [filters,  setFilters]  = useState(EMPTY_FILTERS)
  const [page,     setPage]     = useState(0)

  // WHY: when filters change, reset to page 0 so we don't show
  // "page 3 of 1" after a filter narrows results
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(0)
  }

 const { dogs = [], totalPages, loading, error, refetch } = useDogs(filters, page)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-stone-800 mb-2">
          Adoptable Dogs
        </h1>
        <p className="text-stone-500">
          Find your perfect canine companion. Filter by size, temperament,
          and lifestyle.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        species="dog"
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setFilters(EMPTY_FILTERS); setPage(0) }}
      />

      {/* Results */}
      {loading && <LoadingSpinner count={6} />}

      {error && (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
          <button onClick={refetch}
            className="mt-3 text-sm text-stone-500 underline">
            Try again
          </button>
        </div>
      )}

      {!loading && !error && dogs.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No dogs match your filters.</p>
          <button onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-3 text-sm text-teal-500 underline">
            Clear filters
          </button>
        </div>
      )}

      {!loading && dogs.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map(dog => <PetCard key={dog.id} pet={dog} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-sm
                           disabled:opacity-40 hover:bg-stone-50 transition-colors">
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-stone-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-sm
                           disabled:opacity-40 hover:bg-stone-50 transition-colors">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}