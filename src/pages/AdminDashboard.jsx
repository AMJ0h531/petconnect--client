// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import dogService          from '../services/dogService'
import catService          from '../services/catService'
import applicationService  from '../services/applicationService'
import StatusBadge         from '../components/StatusBadge'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('pets')
  const [dogs,      setDogs]      = useState([])
  const [cats,      setCats]      = useState([])
  const [apps,      setApps]      = useState([])
  const [loading,   setLoading]   = useState(true)

  // Add pet form state
  const [showAddForm, setShowAddForm]   = useState(false)
  const [newPetType,  setNewPetType]    = useState('dog')
  const [formData,    setFormData]      = useState({
    name:'', breed:'', age:'', description:'', size:'MEDIUM',
    goodWithKids: false, goodWithDogs: false, goodWithCats: false,
    indoorOutdoor: 'INDOOR', isVaccinated: false
  })
  const [saving,  setSaving]  = useState(false)
  const [saveMsg, setSaveMsg] = useState(null)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [dogsRes, catsRes] = await Promise.all([
        // WHY Promise.all: fires both requests simultaneously
        // instead of waiting for one to finish before starting the other
        dogService.getAll({}, 0, 50),
        catService.getAll({}, 0, 50),
      ])
      setDogs(dogsRes.data.content || [])
      setCats(catsRes.data.content || [])
    } catch (e) {
      console.error('Failed to load pets', e)
    } finally {
      setLoading(false)
    }
  }

  // ── Update application status ─────────────────────────────────────────
  const handleAppStatus = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus)
      setApps(prev => prev.map(a =>
        a.id === appId ? { ...a, status: newStatus } : a
      ))
    } catch (e) {
      alert('Could not update status')
    }
  }

  // ── Delete a pet listing ───────────────────────────────────────────────
  const handleDelete = async (id, type) => {
    if (!window.confirm('Remove this listing?')) return
    try {
      if (type === 'dog') {
        await dogService.delete(id)
        setDogs(prev => prev.filter(d => d.id !== id))
      } else {
        await catService.delete(id)
        setCats(prev => prev.filter(c => c.id !== id))
      }
    } catch {
      alert('Could not delete listing')
    }
  }

  // ── Add new pet ────────────────────────────────────────────────────────
  const handleAddPet = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    try {
      if (newPetType === 'dog') {
        await dogService.create({
          ...formData,
          age: parseInt(formData.age) || 0
        })
      } else {
        await catService.create({
          ...formData,
          age: parseInt(formData.age) || 0
        })
      }
      setSaveMsg('Pet listing created!')
      setShowAddForm(false)
      setFormData({ name:'', breed:'', age:'', description:'',
                    size:'MEDIUM', goodWithKids:false,
                    goodWithDogs:false, goodWithCats:false,
                    indoorOutdoor:'INDOOR', isVaccinated:false })
      loadAll()
    } catch {
      setSaveMsg('Failed to create listing.')
    } finally {
      setSaving(false)
    }
  }

  const allPets = [
    ...dogs.map(d => ({ ...d, _type: 'dog' })),
    ...cats.map(c => ({ ...c, _type: 'cat' })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">
            Admin Dashboard
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {dogs.length} dogs · {cats.length} cats listed
          </p>
        </div>
        <button onClick={() => setShowAddForm(v => !v)}
          className="px-5 py-2.5 bg-teal-500 text-white rounded-xl
                     font-medium text-sm hover:bg-teal-600 transition-colors">
          {showAddForm ? 'Cancel' : '+ Add pet'}
        </button>
      </div>

      {/* Add pet form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
          <h2 className="font-semibold text-stone-700 mb-4">New pet listing</h2>

          {/* Species toggle */}
          <div className="flex gap-3 mb-4">
            {['dog','cat'].map(t => (
              <button key={t} onClick={() => setNewPetType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium
                            transition-colors capitalize
                            ${newPetType === t
                              ? 'bg-teal-500 text-white'
                              : 'bg-stone-100 text-stone-600'}`}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddPet}
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminField label="Name" required
              value={formData.name}
              onChange={v => setFormData(f => ({ ...f, name: v }))} />
            <AdminField label="Breed" required
              value={formData.breed}
              onChange={v => setFormData(f => ({ ...f, breed: v }))} />
            <AdminField label="Age (years)" type="number"
              value={formData.age}
              onChange={v => setFormData(f => ({ ...f, age: v }))} />

            {newPetType === 'dog' ? (
              <div>
                <label className="block text-xs text-stone-500 mb-1">
                  Size
                </label>
                <select
                  value={formData.size}
                  onChange={e =>
                    setFormData(f => ({ ...f, size: e.target.value }))}
                  className="w-full text-sm border border-stone-200 rounded-lg
                             px-3 py-2 focus:outline-none focus:ring-2
                             focus:ring-teal-300">
                  {['SMALL','MEDIUM','LARGE','EXTRA_LARGE'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-stone-500 mb-1">
                  Indoor / Outdoor
                </label>
                <select
                  value={formData.indoorOutdoor}
                  onChange={e =>
                    setFormData(f => ({
                      ...f, indoorOutdoor: e.target.value
                    }))}
                  className="w-full text-sm border border-stone-200 rounded-lg
                             px-3 py-2 focus:outline-none focus:ring-2
                             focus:ring-teal-300">
                  {['INDOOR','OUTDOOR','BOTH'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-xs text-stone-500 mb-1">
                Description
              </label>
              <textarea rows={3}
                value={formData.description}
                onChange={e =>
                  setFormData(f => ({ ...f, description: e.target.value }))}
                className="w-full text-sm border border-stone-200 rounded-lg
                           px-3 py-2 resize-none focus:outline-none
                           focus:ring-2 focus:ring-teal-300" />
            </div>

            {/* Trait checkboxes */}
            <div className="md:col-span-2 flex flex-wrap gap-4">
              {[
                ['goodWithKids', 'Good with kids'],
                ['goodWithDogs', 'Good with dogs'],
                ['goodWithCats', 'Good with cats'],
                ['isVaccinated', 'Vaccinated'],
              ].map(([key, label]) => (
                <label key={key}
                  className="flex items-center gap-2 text-sm text-stone-600
                             cursor-pointer">
                  <input type="checkbox"
                    checked={!!formData[key]}
                    onChange={e =>
                      setFormData(f => ({ ...f, [key]: e.target.checked }))}
                    className="w-4 h-4 accent-teal-600" />
                  {label}
                </label>
              ))}
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-teal-500 text-white rounded-xl
                           text-sm font-medium hover:bg-teal-600
                           disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Create listing'}
              </button>
              {saveMsg && (
                <span className="text-sm text-teal-600">{saveMsg}</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {[['pets','All Pets'], ['applications','Applications']].map(
          ([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium
                          transition-colors
                          ${activeTab === key
                            ? 'bg-stone-800 text-white'
                            : 'bg-white border border-stone-200 text-stone-500'
                          }`}>
              {label}
            </button>
          )
        )}
      </div>

      {/* Pets table */}
      {activeTab === 'pets' && (
        <div className="bg-white rounded-2xl border border-stone-100
                        overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-stone-400 animate-pulse">
              Loading…
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  <th className="px-4 py-3 font-medium text-stone-500">Pet</th>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Type
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Listed
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {allPets.map(pet => (
                  <tr key={`${pet._type}-${pet.id}`}
                    className="border-b border-stone-50
                               hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-800">
                        {pet.name}
                      </div>
                      <div className="text-xs text-stone-400">{pet.breed}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-stone-500">
                        {pet._type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={pet.status} />
                    </td>
                    <td className="px-4 py-3 text-stone-400">
                      {pet.createdAt
                        ? new Date(pet.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(pet.id, pet._type)}
                        className="text-xs text-red-400 hover:text-red-600
                                   transition-colors">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Applications table */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-stone-100
                        overflow-hidden">
          {apps.length === 0 ? (
            <p className="p-8 text-center text-stone-400 text-sm">
              No applications yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left">
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Applicant
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-500">Pet</th>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-stone-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id}
                    className="border-b border-stone-50
                               hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-stone-700">
                      {app.user?.username}
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {app.pet?.name}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3">
                      {app.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleAppStatus(app.id, 'APPROVED')}
                            className="text-xs px-3 py-1 bg-teal-50
                                       text-teal-700 rounded-lg
                                       hover:bg-teal-100 transition-colors">
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAppStatus(app.id, 'DENIED')}
                            className="text-xs px-3 py-1 bg-red-50
                                       text-red-600 rounded-lg
                                       hover:bg-red-100 transition-colors">
                            Deny
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

function AdminField({ label, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs text-stone-500 mb-1">{label}</label>
      <input type={type} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        className="w-full text-sm border border-stone-200 rounded-lg px-3
                   py-2 focus:outline-none focus:ring-2 focus:ring-teal-300" />
    </div>
  )
}