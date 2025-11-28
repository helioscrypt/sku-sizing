import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import SkuWizard from './components/SkuWizard'
import Features from './components/Features'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [showWizard, setShowWizard] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {!showWizard ? (
          <>
            <div id="tool">
              <Hero onStartWizard={() => setShowWizard(true)} />
            </div>
            <div id="features">
              <Features />
            </div>
            <Contact />
          </>
        ) : (
          <SkuWizard onBack={() => setShowWizard(false)} />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
