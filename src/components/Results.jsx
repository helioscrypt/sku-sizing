import { useMemo, useState } from 'react'
import { calculateConfig, calculateCosts, generateTerraformCode } from '../utils/calculator'

export default function Results({ answers, onBack, onRestart }) {
  const [copied, setCopied] = useState(false)

  const config = useMemo(() => calculateConfig(answers), [answers])
  const costs = useMemo(() => calculateCosts(config), [config])
  const terraformCode = useMemo(() => generateTerraformCode(config), [config])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terraformCode.plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-400 font-medium">Configuration Generated</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Recommended Configuration
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based on your responses, here are the optimized SKU recommendations for your Azure Landing Zone.
          </p>
        </div>

        {/* Cost Summary */}
        <div className="bg-gradient-to-br from-helio-600/10 to-helio-400/10 rounded-2xl border border-helio-500/20 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-helio-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-helio-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Estimated Monthly Cost</h2>
              <p className="text-sm text-gray-400">Approximate costs, may vary by region</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <CostItem label="Firewall" value={costs.firewall} />
            <CostItem label="Bastion" value={costs.bastion} />
            {config.vpn && <CostItem label="VPN Gateway" value={costs.vpn} />}
            {config.expressRoute && <CostItem label="ExpressRoute" value={costs.expressRoute} />}
            <CostItem label="Total" value={costs.total} highlight />
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="grid gap-6 mb-8">
          {/* Firewall */}
          <ConfigCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Azure Firewall"
            items={[
              { label: 'SKU Name', value: config.firewall.sku },
              { label: 'SKU Tier', value: config.firewall.tier, badge: config.firewall.tier },
              { label: 'Threat Intelligence', value: config.firewall.threatMode },
              { label: 'Availability Zones', value: config.zones },
            ]}
          />

          {/* Bastion */}
          <ConfigCard
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Azure Bastion"
            items={[
              { label: 'SKU', value: config.bastion.sku, badge: config.bastion.sku },
              { label: 'Scale Units', value: config.bastion.scaleUnits.toString() },
              { label: 'Max Concurrent Users', value: `~${config.bastion.scaleUnits * 20}` },
              { label: 'Availability Zones', value: config.bastion.sku !== 'Basic' ? config.zones : 'N/A (Basic)' },
              { label: 'File Transfer', value: config.bastion.fileCopy ? 'Enabled' : 'Disabled' },
              { label: 'Native Client', value: config.bastion.tunneling ? 'Enabled' : 'Disabled' },
            ]}
          />

          {/* VPN */}
          {config.vpn && (
            <ConfigCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="VPN Gateway"
              items={[
                { label: 'SKU', value: config.vpn.sku },
                { label: 'Generation', value: config.vpn.generation },
                { label: 'Zone Redundant', value: config.vpn.sku.includes('AZ') ? 'Yes' : 'No' },
              ]}
            />
          )}

          {/* ExpressRoute */}
          {config.expressRoute && (
            <ConfigCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="ExpressRoute Gateway"
              items={[
                { label: 'SKU', value: config.expressRoute.sku },
                { label: 'Zone Redundant', value: config.expressRoute.sku.includes('AZ') ? 'Yes' : 'No' },
              ]}
            />
          )}
        </div>

        {/* Terraform Output */}
        <div className="bg-dark-800/50 rounded-2xl border border-white/5 overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-helio-600/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-helio-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Terraform Configuration</h3>
                <p className="text-sm text-gray-400">Ready to use in your terragrunt.hcl</p>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-helio-600 hover:bg-helio-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <div className="p-6 bg-[#1e1e1e] overflow-x-auto">
            <pre className="text-sm font-mono" dangerouslySetInnerHTML={{ __html: terraformCode.highlighted }} />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-helio-600/20 to-purple-900/20 rounded-2xl border border-helio-500/20 p-8 text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Need Help Implementing?</h3>
          <p className="text-gray-400 mb-6">
            I can help you deploy and optimize your Azure landing zone infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:felix@helioscrypt.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-helio-600 hover:bg-helio-500 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              felix@helioscrypt.com
            </a>
            <a
              href="tel:+491712775258"
              className="inline-flex items-center gap-2 px-6 py-3 border border-helio-500/30 hover:bg-helio-500/10 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +49 171 2775258
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 text-white border border-white/20 hover:bg-white/5 rounded-xl font-medium transition-colors"
          >
            ← Modify Answers
          </button>
          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 text-gray-400 hover:text-white transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </section>
  )
}

function CostItem({ label, value, highlight }) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-helio-500/20 border border-helio-500/30' : 'bg-dark-800/50'}`}>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-helio-400' : 'text-white'}`}>
        ${value}
        <span className="text-sm font-normal text-gray-500">/mo</span>
      </p>
    </div>
  )
}

function ConfigCard({ icon, title, items }) {
  return (
    <div className="bg-dark-800/50 rounded-2xl border border-white/5 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-helio-600/20 to-helio-400/20 flex items-center justify-center text-helio-400">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500 mb-1">{item.label}</p>
            <div className="flex items-center gap-2">
              <p className="font-medium text-white">{item.value}</p>
              {item.badge && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  item.badge === 'Basic' ? 'bg-green-500/20 text-green-400' :
                  item.badge === 'Standard' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-pink-500/20 text-pink-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
