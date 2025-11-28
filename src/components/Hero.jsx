export default function Hero({ onStartWizard }) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-helio-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-helio-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm text-gray-300">Free Azure Sizing Tool</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-white">Right-Size Your</span>
            <br />
            <span className="gradient-text">Azure Landing Zone</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Answer a few simple questions to get personalized SKU recommendations for your
            Azure Firewall, Bastion, VPN Gateway, and more. Optimized for cost and performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartWizard}
              className="group w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-helio-600 to-helio-500 hover:from-helio-500 hover:to-helio-400 rounded-xl transition-all duration-200 shadow-lg shadow-helio-600/30 hover:shadow-helio-500/50"
            >
              Start Sizing Tool
              <svg className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white border border-helio-500/30 hover:bg-helio-500/10 rounded-xl transition-colors"
            >
              Talk to an Expert
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-6">Trusted by enterprises for Azure cloud infrastructure</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-medium">Azure Expert MSP</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                <span className="font-medium">Security Focused</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
                <span className="font-medium">Infrastructure as Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Image */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
          <div className="gradient-border rounded-xl overflow-hidden glow">
            <div className="bg-dark-800 p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-sm text-gray-500 font-mono">terragrunt.hcl</span>
              </div>
              <pre className="text-sm font-mono overflow-x-auto">
                <code>
                  <span className="text-gray-500"># Azure Firewall - Recommended Configuration</span>{'\n'}
                  <span className="text-helio-300">sku_name</span>                 = <span className="text-green-400">"AZFW_VNet"</span>{'\n'}
                  <span className="text-helio-300">sku_tier</span>                 = <span className="text-green-400">"Standard"</span>{'\n'}
                  <span className="text-helio-300">threat_intelligence_mode</span> = <span className="text-green-400">"Deny"</span>{'\n'}
                  <span className="text-helio-300">zones</span>                    = <span className="text-amber-400">["1", "2", "3"]</span>{'\n'}
                  {'\n'}
                  <span className="text-gray-500"># Azure Bastion - Right-sized for your team</span>{'\n'}
                  <span className="text-helio-300">sku</span>                      = <span className="text-green-400">"Standard"</span>{'\n'}
                  <span className="text-helio-300">scale_units</span>              = <span className="text-amber-400">5</span>{'\n'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
