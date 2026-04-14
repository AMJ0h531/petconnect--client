// src/components/FilterBar.jsx
// WHY: Filters live in their own component so BrowseDogsPage and
// BrowseCatsPage can each pass in their own species-specific options
export default function FilterBar({ species, filters, onChange, onReset }) {

  const handleChange = (key, value) => {
    // Pass updated filters up to the parent page
    // WHY lift state up: the parent controls the filter state so it can
    // also pass filters to the useDogs/useCats hook
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-stone-700">Filter</h3>
        <button
          onClick={onReset}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {/* Dog-only filters */}
        {species === 'dog' && (
          <>
            <Select
              label="Size"
              value={filters.size || ''}
              onChange={v => handleChange('size', v)}
              options={[
                { value: '',           label: 'Any size' },
                { value: 'SMALL',      label: 'Small' },
                { value: 'MEDIUM',     label: 'Medium' },
                { value: 'LARGE',      label: 'Large' },
                { value: 'EXTRA_LARGE',label: 'Extra large' },
              ]}
            />
          </>
        )}

        {/* Cat-only filters */}
        {species === 'cat' && (
          <Select
            label="Indoor / Outdoor"
            value={filters.indoorOutdoor || ''}
            onChange={v => handleChange('indoorOutdoor', v)}
            options={[
              { value: '',       label: 'Any' },
              { value: 'INDOOR', label: 'Indoor' },
              { value: 'OUTDOOR',label: 'Outdoor' },
              { value: 'BOTH',   label: 'Both' },
            ]}
          />
        )}

        {/* Shared filters */}
        <Toggle
          label="Good with kids"
          checked={!!filters.goodWithKids}
          onChange={v => handleChange('goodWithKids', v || undefined)}
        />
        <Toggle
          label="Good with dogs"
          checked={!!filters.goodWithDogs}
          onChange={v => handleChange('goodWithDogs', v || undefined)}
        />
        <Toggle
          label="Good with cats"
          checked={!!filters.goodWithCats}
          onChange={v => handleChange('goodWithCats', v || undefined)}
        />
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-stone-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked || undefined)}
        className="w-4 h-4 accent-teal-600 cursor-pointer"
      />
      <span className="text-sm text-stone-600">{label}</span>
    </label>
  )
}