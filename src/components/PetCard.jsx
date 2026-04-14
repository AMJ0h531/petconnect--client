// src/components/PetCard.jsx
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function PetCard({ pet }) {
  return (
    // WHY Link wrapper: clicking anywhere on the card navigates to detail page
    // pet-card class applies the hover-lift CSS from index.css
    <Link to={`/pets/${pet.id}`} className="pet-card block">
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-100">

        {/* Pet photo */}
        <div className="relative h-52 bg-stone-100 overflow-hidden">
          {pet.imageUrl ? (
            <img
              src={pet.imageUrl}
              alt={`${pet.name} the ${pet.breed}`}
              className="w-full h-full object-cover transition-transform
                         duration-300 hover:scale-105"
              // WHY loading="lazy": browser only fetches this image when it's
              // about to scroll into view — faster initial page load
              loading="lazy"
            />
          ) : (
            // Placeholder when no image uploaded yet
            <div className="w-full h-full flex items-center justify-center
                            text-5xl text-stone-300">
              {pet.species === 'CAT' ? '🐱' : '🐕'}
            </div>
          )}

          {/* Status badge floats over the photo */}
          <div className="absolute top-3 left-3">
            <StatusBadge status={pet.status} />
          </div>
        </div>

        {/* Pet info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-display font-semibold text-lg text-stone-800
                           leading-tight">
              {pet.name}
            </h3>
            {pet.age !== null && (
              <span className="text-sm text-stone-400 ml-2 shrink-0">
                {pet.age} yr{pet.age !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-500 mb-3">{pet.breed}</p>

          {/* Trait chips — dog-specific or cat-specific */}
          <div className="flex flex-wrap gap-1.5">
            {pet.goodWithKids && (
              <Chip label="Good with kids" color="teal" />
            )}
            {pet.goodWithDogs && (
              <Chip label="Dog friendly" color="blue" />
            )}
            {pet.goodWithCats && (
              <Chip label="Cat friendly" color="purple" />
            )}
            {pet.size && (
              <Chip label={pet.size.toLowerCase()} color="stone" />
            )}
            {pet.indoorOutdoor && (
              <Chip label={pet.indoorOutdoor.toLowerCase()} color="stone" />
            )}
          </div>

          {/* Match score — only shown when coming from quiz results */}
          {pet.matchScore !== undefined && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full">
                <div
                  className="h-full bg-brand-teal rounded-full transition-all"
                  style={{ width: `${pet.matchScore}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-brand-teal">
                {pet.matchScore}% match
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// WHY inner component: Chip is only used inside PetCard, so it lives here
function Chip({ label, color }) {
  const colors = {
    teal:   'bg-teal-50   text-teal-700',
    blue:   'bg-blue-50   text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
    stone:  'bg-stone-100 text-stone-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${colors[color] || colors.stone}`}>
      {label}
    </span>
  )
}