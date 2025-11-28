export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="https://helioscrypt.com" className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}Helioscrypt_Logo_whitelila_72ppi.png`}
              alt="HeliosCrypt"
              className="h-10 w-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#tool" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sizing Tool
            </a>
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium text-white bg-helio-600 hover:bg-helio-500 rounded-lg transition-colors"
            >
              Get in Touch
            </a>
          </nav>

          <button className="md:hidden p-2 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
