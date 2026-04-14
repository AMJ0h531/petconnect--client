// src/components/PetGrid.jsx
// WHY: Extracts the repeated grid + empty state + pagination pattern
// so BrowseDogsPage and BrowseCatsPage don't duplicate it
import PetCard       from './PetCard'
import LoadingSpinner from './LoadingSpinner'

export default function PetGrid({
  pets, loading, error, totalPages,
  page, onPageChange, emptyMessage = 'No pets found.'
}) {
  if (loading) return <LoadingSpinner count={6} />

  if (error) return (
    <div className="text-center py-12 text-red-500 text-sm">{error}</div>
  )

  if (pets.length === 0) return (
    <div className="text-center py-20 text-stone-400">
      <p>{emptyMessage}</p>
    </div>
  )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          <button disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="px-4 py-2 rounded-xl border border-stone-200 text-sm
                       disabled:opacity-40 hover:bg-stone-50 transition-colors">
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-stone-500">
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            className="px-4 py-2 rounded-xl border border-stone-200 text-sm
                       disabled:opacity-40 hover:bg-stone-50 transition-colors">
            Next
          </button>
        </div>
      )}
    </>
  )
}