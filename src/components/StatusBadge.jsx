// src/components/StatusBadge.jsx
// WHY: Every pet card shows a status pill. One component = consistent styling
const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  PENDING:   'bg-amber-100  text-amber-800',
  ADOPTED:   'bg-blue-100   text-blue-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`
      inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold
      ${STATUS_STYLES[status] || 'bg-stone-100 text-stone-600'}
    `}>
      {status}
    </span>
  )
}