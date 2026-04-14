// src/components/MatchResultCard.jsx
// WHY: Reusable card specifically for quiz results — shows score ring
// and reason chips on top of the regular PetCard
import PetCard from './PetCard'

export default function MatchResultCard({ pet, score, reasons }) {
  return (
    <div className="relative">
      {/* Score ring badge positioned above the card */}
      <div className="absolute -top-3 -right-3 z-10 w-14 h-14
                      bg-teal-500 rounded-full flex flex-col items-center
                      justify-center shadow-md pointer-events-none">
        <span className="text-white text-sm font-bold leading-none">
          {score}%
        </span>
        <span className="text-teal-100 text-xs leading-none">match</span>
      </div>

      <PetCard pet={{ ...pet, matchScore: score }} />

      {/* Reason chips */}
      <div className="flex flex-wrap gap-1.5 mt-2 px-1">
        {reasons.map(reason => (
          <span key={reason}
            className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1
                       rounded-full border border-teal-100">
            {reason}
          </span>
        ))}
      </div>
    </div>
  )
}