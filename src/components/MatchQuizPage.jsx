// src/pages/MatchQuizPage.jsx
import { useState }    from 'react'
import dogService      from '../services/dogService'
import catService      from '../services/catService'
import PetCard         from './PetCard'

const QUESTIONS = [
  {
    key:     'species',
    label:   'What kind of pet are you looking for?',
    options: [{ value:'dog', label:'A dog' }, { value:'cat', label:'A cat' }]
  },
  {
    key:     'livingSituation',
    label:   'Where do you live?',
    options: [
      { value:'APARTMENT', label:'Apartment or condo' },
      { value:'HOUSE',     label:'House with yard' },
    ]
  },
  {
    key:     'activityLevel',
    label:   'How active is your lifestyle?',
    options: [
      { value: 1, label:'Very relaxed — homebody' },
      { value: 2, label:'Light — occasional walks' },
      { value: 3, label:'Moderate — daily walks' },
      { value: 4, label:'Active — runs and hikes' },
      { value: 5, label:'Very active — athletic' },
    ]
  },
  {
    key:     'hasKids',
    label:   'Do you have children at home?',
    options: [
      { value: true,  label: 'Yes' },
      { value: false, label: 'No'  },
    ]
  },
  {
    key:     'experienceLevel',
    label:   'Have you owned a pet before?',
    options: [
      { value: 'FIRST_TIME',  label: 'First-time owner' },
      { value: 'EXPERIENCED', label: 'Experienced owner' },
    ]
  },
]

export default function MatchQuizPage() {
  const [step,     setStep]     = useState(0)
  const [answers,  setAnswers]  = useState({})
  const [results,  setResults]  = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const currentQ = QUESTIONS[step]
  const progress = Math.round((step / QUESTIONS.length) * 100)

  const handleAnswer = async (value) => {
    const updated = { ...answers, [currentQ.key]: value }
    setAnswers(updated)

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1)
    } else {
      // Last question answered — call the match API
      await runMatch(updated)
    }
  }

  const runMatch = async (finalAnswers) => {
    setLoading(true)
    setError(null)
    try {
      const { species, ...quizPayload } = finalAnswers
      const service = species === 'cat' ? catService : dogService
      const response = await service.getMatches(quizPayload)
      setResults(response.data)
    } catch (err) {
      setError('Could not load matches. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStep(0); setAnswers({})
    setResults(null); setError(null)
  }

  // ── Loading state ────────────────────────────────────────────────────
  if (loading) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500
                      rounded-full animate-spin mx-auto mb-4" />
      <p className="text-stone-500">Finding your perfect match…</p>
    </div>
  )

  // ── Results ───────────────────────────────────────────────────────────
  if (results) return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl font-bold text-stone-800 mb-3">
          Your Matches
        </h1>
        <p className="text-stone-500 mb-6">
          Based on your answers, here are your top compatible pets.
        </p>
        <button onClick={reset}
          className="text-sm text-teal-500 underline">
          Retake quiz
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-stone-400 py-12">
          No strong matches right now — check back soon as new pets arrive!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(({ pet, score, reasons }) => (
            <div key={pet.id} className="relative">
              {/* Score ring on top of card */}
              <div className="absolute -top-3 -right-3 z-10 w-14 h-14
                              bg-teal-500 rounded-full flex items-center
                              justify-center shadow-md">
                <span className="text-white text-xs font-bold leading-none
                                 text-center">{score}%</span>
              </div>
              <PetCard pet={{ ...pet, matchScore: score }} />
              {/* Reason chips below card */}
              <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                {reasons.map(r => (
                  <span key={r}
                    className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5
                               rounded-full">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // ── Quiz questions ─────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-stone-400 mb-2">
          <span>Question {step + 1} of {QUESTIONS.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full">
          <div className="h-full bg-teal-400 rounded-full transition-all duration-500"
               style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-display text-2xl font-bold text-stone-800 mb-8">
        {currentQ.label}
      </h2>

      {/* Answer buttons */}
      <div className="space-y-3">
        {currentQ.options.map(opt => (
          <button key={String(opt.value)}
            onClick={() => handleAnswer(opt.value)}
            className="w-full text-left px-6 py-4 rounded-2xl border-2
                       border-stone-100 bg-white hover:border-teal-300
                       hover:bg-teal-50 transition-all duration-150
                       text-stone-700 font-medium">
            {opt.label}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)}
          className="mt-6 text-sm text-stone-400 hover:text-stone-600">
          ← Back
        </button>
      )}
    </div>
  )
}