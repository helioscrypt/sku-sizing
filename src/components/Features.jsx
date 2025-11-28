const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Azure Firewall',
    description: 'Choose between Basic, Standard, and Premium tiers based on your threat protection requirements.',
    skus: ['Basic', 'Standard', 'Premium'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Azure Bastion',
    description: 'Scale your secure remote access from 50 to 1000+ concurrent users with the right tier.',
    skus: ['Basic', 'Standard', 'Premium'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    title: 'VPN Gateway',
    description: 'From 650 Mbps to 1.25 Gbps throughput with zone-redundant options for high availability.',
    skus: ['VpnGw1', 'VpnGw2', 'VpnGw3'],
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'ExpressRoute',
    description: 'Dedicated private connectivity from 1 Gbps to 10 Gbps for enterprise workloads.',
    skus: ['Standard', 'High Perf', 'Ultra'],
  },
]

export default function Features() {
  return (
    <section className="py-20 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Components We Size
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get recommendations for all critical Azure Landing Zone connectivity components
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-dark-800/50 rounded-xl border border-white/5 hover:border-helio-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-helio-600/10"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-helio-600/20 to-helio-400/20 flex items-center justify-center text-helio-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.skus.map((sku, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs font-medium rounded bg-white/5 text-gray-300"
                  >
                    {sku}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400">
              Three simple steps to your optimized configuration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer Questions',
                description: 'Tell us about your environment, security requirements, and expected usage.',
              },
              {
                step: '02',
                title: 'Get Recommendations',
                description: 'Receive tailored SKU recommendations with cost estimates and explanations.',
              },
              {
                step: '03',
                title: 'Export Configuration',
                description: 'Copy ready-to-use Terraform/Terragrunt configuration for your infrastructure.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-helio-600/20 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8 pl-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-600">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
