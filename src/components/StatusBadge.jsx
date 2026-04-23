const STATUS_STYLES = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  PENDING: 'bg-amber-100 text-amber-800',
  ADOPTED: 'bg-blue-100 text-blue-800',
}

const STATUS_LABELS = {
  AVAILABLE: 'Available',
  PENDING: 'Pending Review',
  ADOPTED: 'Adopted',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`
      inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
      ${STATUS_STYLES[status] || 'bg-stone-100 text-stone-600'}
    `}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
