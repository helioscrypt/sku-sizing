import { useState } from 'react'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Hero from './components/landing/Hero'
import Features from './components/landing/Features'
import Contact from './components/landing/Contact'
import SkuWizard from './components/sku-sizing/SkuWizard'
import NetworkPlanner from './components/cidr-planner/NetworkPlanner'

function App() {
  const [showTools, setShowTools] = useState(false)
  const [activeTab, setActiveTab] = useState('sku') // 'sku' or 'cidr'

  const handleNavigate = (section) => {
    setShowTools(false)
    // Small delay to let the view switch before scrolling
    setTimeout(() => {
      if (section === 'home' || section === 'tool') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 100)
  }

  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} />
      <main>
        {!showTools ? (
          <>
            <div id="tool">
              <Hero
                onStartTools={() => setShowTools(true)}
                onSelectTool={(tool) => {
                  setActiveTab(tool)
                  setShowTools(true)
                }}
              />
            </div>
            <div id="features">
              <Features />
            </div>
            <Contact />
          </>
        ) : (
          <div className="pt-20">
            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 p-1 bg-dark-800 rounded-xl">
                  <button
                    onClick={() => setActiveTab('sku')}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === 'sku'
                        ? 'bg-helio-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      SKU Sizing
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cidr')}
                    className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === 'cidr'
                        ? 'bg-helio-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                      </svg>
                      CIDR Planner
                    </span>
                  </button>
                </div>
                <button
                  onClick={() => setShowTools(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </button>
              </div>

              {/* Tool Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {activeTab === 'sku' ? (
                    <>Azure <span className="gradient-text">SKU Sizing</span></>
                  ) : (
                    <>Azure <span className="gradient-text">CIDR Planner</span></>
                  )}
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  {activeTab === 'sku'
                    ? 'Answer a few questions to get personalized SKU recommendations for your Azure landing zone.'
                    : 'Plan your hub-spoke network with automatic subnet allocation, growth reservation, and overlap detection.'
                  }
                </p>
              </div>
            </div>

            {/* Tool Content */}
            {activeTab === 'sku' ? (
              <SkuWizard />
            ) : (
              <NetworkPlanner />
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
