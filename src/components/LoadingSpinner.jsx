// src/components/LoadingSpinner.jsx
// WHY: Reusable loading state — used in every page while API calls are in flight
// Shows skeleton cards instead of blank space — better UX
export default function LoadingSpinner({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        // WHY animate-pulse: Tailwind's skeleton animation — signals loading
        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
          <div className="bg-stone-200 h-52 w-full" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-200 rounded w-1/2" />
            <div className="flex gap-2 mt-2">
              <div className="h-6 bg-stone-200 rounded-full w-16" />
              <div className="h-6 bg-stone-200 rounded-full w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}