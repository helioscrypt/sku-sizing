import { useState } from 'react'
import { questions } from '../../data/questions'
import Results from './Results'

export default function SkuWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const sections = ['environment', 'firewall', 'bastion', 'vpn', 'expressroute']
  const sectionLabels = ['Environment', 'Firewall', 'Bastion', 'VPN Gateway', 'ExpressRoute']

  const currentQuestions = questions[sections[currentStep]] || []
  const progress = ((currentStep + 1) / sections.length) * 100

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleCheckbox = (questionId, value, checked) => {
    setAnswers(prev => {
      const current = prev[questionId] || []
      if (checked) {
        return { ...prev, [questionId]: [...current, value] }
      } else {
        return { ...prev, [questionId]: current.filter(v => v !== value) }
      }
    })
  }

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const shouldShowQuestion = (question) => {
    if (!question.condition) return true
    const { field, value } = question.condition
    return answers[field] === value
  }

  if (showResults) {
    return <Results answers={answers} onBack={() => setShowResults(false)} onRestart={() => {
      setAnswers({})
      setCurrentStep(0)
      setShowResults(false)
    }} />
  }

  return (
    <section className="pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">
              Step {currentStep + 1} of {sections.length}: {sectionLabels[currentStep]}
            </span>
            <span className="text-sm font-medium text-helio-500">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-helio-600 to-helio-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => index <= currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === currentStep
                  ? 'bg-helio-600 text-white'
                  : index < currentStep
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-dark-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {index < currentStep && (
                <svg className="w-4 h-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {sectionLabels[index]}
            </button>
          ))}
        </div>

        {/* Questions Card */}
        <div className="bg-dark-800/50 rounded-2xl border border-white/5 p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-helio-500 to-azure-500 flex items-center justify-center text-white text-xl font-bold">
              {currentStep + 1}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{sectionLabels[currentStep]}</h2>
              <p className="text-gray-400 text-sm">Configure your {sectionLabels[currentStep].toLowerCase()} settings</p>
            </div>
          </div>

          <div className="space-y-8">
            {currentQuestions.filter(shouldShowQuestion).map((question) => (
              <div key={question.id} className="animate-slide-up">
                <label className="block text-lg font-medium text-white mb-2">
                  {question.label}
                </label>
                {question.hint && (
                  <p className="text-sm text-gray-400 mb-4">{question.hint}</p>
                )}

                {question.type === 'radio' && (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          answers[question.id] === option.value
                            ? 'border-helio-500 bg-helio-500/10'
                            : 'border-white/10 hover:border-white/20 bg-dark-900/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={answers[question.id] === option.value}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="mt-1 w-4 h-4 text-helio-500 focus:ring-helio-500 focus:ring-offset-dark-900"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{option.label}</span>
                            {option.badge && (
                              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                option.badge === 'Basic' ? 'bg-green-500/20 text-green-400' :
                                option.badge === 'Standard' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-pink-500/20 text-pink-400'
                              }`}>
                                {option.badge}
                              </span>
                            )}
                          </div>
                          {option.description && (
                            <p className="text-sm text-gray-400 mt-1">{option.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'checkbox' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          (answers[question.id] || []).includes(option.value)
                            ? 'border-helio-500 bg-helio-500/10'
                            : 'border-white/10 hover:border-white/20 bg-dark-900/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={(answers[question.id] || []).includes(option.value)}
                          onChange={(e) => handleCheckbox(question.id, option.value, e.target.checked)}
                          className="w-4 h-4 text-helio-500 rounded focus:ring-helio-500 focus:ring-offset-dark-900"
                        />
                        <div>
                          <span className="font-medium text-white">{option.label}</span>
                          {option.tier && (
                            <span className="ml-2 text-xs text-gray-500">({option.tier}+)</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-white border border-white/20 hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-helio-600 to-helio-500 hover:from-helio-500 hover:to-helio-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-helio-500/20"
            >
              {currentStep === sections.length - 1 ? 'Generate Results' : 'Continue'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
