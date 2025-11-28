import { useState, useMemo } from 'react'
import {
  planNetwork,
  validateCidr,
  parseCidr,
  formatIpCount,
  AZURE_RESERVED_SUBNETS,
} from '../../utils/cidr'
import NetworkMap from './NetworkMap'
import TerraformOutput from './TerraformOutput'

const WORKLOAD_TYPES = [
  { id: 'general', name: 'General Purpose', description: 'Standard 3-tier application' },
  { id: 'web-app', name: 'Web Application', description: 'Web, App, Data, PE subnets' },
  { id: 'aks', name: 'Kubernetes (AKS)', description: 'Large subnets for AKS nodes/pods' },
  { id: 'data', name: 'Data Platform', description: 'Analytics and data workloads' },
]

const HUB_PREFIX_OPTIONS = [
  { value: 20, label: '/20 (4,096 IPs)', description: 'Large hub with many services' },
  { value: 21, label: '/21 (2,048 IPs)', description: 'Medium-large hub' },
  { value: 22, label: '/22 (1,024 IPs)', description: 'Standard hub (recommended)' },
  { value: 23, label: '/23 (512 IPs)', description: 'Small hub' },
]

const SPOKE_PREFIX_OPTIONS = [
  { value: 21, label: '/21 (2,048 IPs)', description: 'Large spoke (AKS, big workloads)' },
  { value: 22, label: '/22 (1,024 IPs)', description: 'Medium-large spoke' },
  { value: 23, label: '/23 (512 IPs)', description: 'Standard spoke (recommended)' },
  { value: 24, label: '/24 (256 IPs)', description: 'Small spoke' },
  { value: 25, label: '/25 (128 IPs)', description: 'Minimal spoke' },
]

export default function NetworkPlanner() {
  const [config, setConfig] = useState({
    baseNetwork: '10.0.0.0/16',
    hubPrefix: 22,
    defaultSpokePrefix: 23,
    hubServices: ['GatewaySubnet', 'AzureFirewallSubnet', 'AzureBastionSubnet'],
    spokes: [
      { id: 1, name: 'spoke-prod-001', prefix: 23, workloadType: 'general' },
      { id: 2, name: 'spoke-dev-001', prefix: 24, workloadType: 'general' },
    ],
    reserveGrowth: 3,
  })

  const [showTerraform, setShowTerraform] = useState(false)

  // Validate base network
  const baseValidation = useMemo(() => validateCidr(config.baseNetwork), [config.baseNetwork])

  // Calculate network plan
  const networkPlan = useMemo(() => {
    if (!baseValidation.valid) return null
    try {
      return planNetwork({
        baseNetwork: config.baseNetwork,
        hubPrefix: config.hubPrefix,
        spokePrefix: config.defaultSpokePrefix,
        hubServices: config.hubServices,
        spokes: config.spokes,
        reserveGrowth: config.reserveGrowth,
      })
    } catch (e) {
      return { error: e.message }
    }
  }, [config, baseValidation.valid])

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleHubService = (service) => {
    setConfig(prev => ({
      ...prev,
      hubServices: prev.hubServices.includes(service)
        ? prev.hubServices.filter(s => s !== service)
        : [...prev.hubServices, service],
    }))
  }

  const addSpoke = () => {
    const newId = Math.max(0, ...config.spokes.map(s => s.id)) + 1
    setConfig(prev => ({
      ...prev,
      spokes: [
        ...prev.spokes,
        {
          id: newId,
          name: `spoke-new-${String(newId).padStart(3, '0')}`,
          prefix: prev.defaultSpokePrefix,
          workloadType: 'general',
        },
      ],
    }))
  }

  const removeSpoke = (id) => {
    setConfig(prev => ({
      ...prev,
      spokes: prev.spokes.filter(s => s.id !== id),
    }))
  }

  const updateSpoke = (id, key, value) => {
    setConfig(prev => ({
      ...prev,
      spokes: prev.spokes.map(s => (s.id === id ? { ...s, [key]: value } : s)),
    }))
  }

  return (
    <div className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Base Network */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400 text-sm">1</span>
                Address Space
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Base Network (Supernet)
                  </label>
                  <input
                    type="text"
                    value={config.baseNetwork}
                    onChange={(e) => updateConfig('baseNetwork', e.target.value)}
                    className={`input-field font-mono ${!baseValidation.valid ? 'border-red-500' : ''}`}
                    placeholder="10.0.0.0/16"
                  />
                  {!baseValidation.valid && (
                    <p className="text-sm text-red-400 mt-1">{baseValidation.error}</p>
                  )}
                  {baseValidation.valid && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatIpCount(parseCidr(config.baseNetwork).size)} addresses available
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Hub Size
                  </label>
                  <select
                    value={config.hubPrefix}
                    onChange={(e) => updateConfig('hubPrefix', parseInt(e.target.value))}
                    className="input-field"
                  >
                    {HUB_PREFIX_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Default Spoke Size
                  </label>
                  <select
                    value={config.defaultSpokePrefix}
                    onChange={(e) => updateConfig('defaultSpokePrefix', parseInt(e.target.value))}
                    className="input-field"
                  >
                    {SPOKE_PREFIX_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} - {opt.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Reserve Growth (empty spokes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={config.reserveGrowth}
                    onChange={(e) => updateConfig('reserveGrowth', parseInt(e.target.value) || 0)}
                    className="input-field"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Pre-allocate space for future spokes
                  </p>
                </div>
              </div>
            </div>

            {/* Hub Services */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400 text-sm">2</span>
                Hub Services
              </h2>
              <div className="space-y-2">
                {Object.entries(AZURE_RESERVED_SUBNETS).map(([key, service]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      config.hubServices.includes(key)
                        ? 'border-helio-500 bg-helio-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={config.hubServices.includes(key)}
                      onChange={() => toggleHubService(key)}
                      className="w-4 h-4 text-helio-500 rounded focus:ring-helio-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{service.name}</p>
                      <p className="text-xs text-gray-500">/{service.recommended} min</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Spokes */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-helio-600/20 flex items-center justify-center text-helio-400 text-sm">3</span>
                  Spokes
                </h2>
                <button
                  onClick={addSpoke}
                  className="px-3 py-1 text-sm font-medium text-helio-400 border border-helio-500/30 rounded-lg hover:bg-helio-500/10 transition-colors"
                >
                  + Add Spoke
                </button>
              </div>
              <div className="space-y-3">
                {config.spokes.map((spoke) => (
                  <div key={spoke.id} className="p-3 rounded-lg border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={spoke.name}
                        onChange={(e) => updateSpoke(spoke.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 bg-dark-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-helio-500"
                        placeholder="Spoke name"
                      />
                      <button
                        onClick={() => removeSpoke(spoke.id)}
                        className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={spoke.prefix}
                        onChange={(e) => updateSpoke(spoke.id, 'prefix', parseInt(e.target.value))}
                        className="px-3 py-2 bg-dark-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-helio-500"
                      >
                        {SPOKE_PREFIX_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>/{opt.value}</option>
                        ))}
                      </select>
                      <select
                        value={spoke.workloadType}
                        onChange={(e) => updateSpoke(spoke.id, 'workloadType', e.target.value)}
                        className="px-3 py-2 bg-dark-900/50 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-helio-500"
                      >
                        {WORKLOAD_TYPES.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {config.spokes.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No spokes configured. Click "Add Spoke" to begin.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            {networkPlan && !networkPlan.error && (
              <>
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Network Summary</h2>
                    <button
                      onClick={() => setShowTerraform(!showTerraform)}
                      className="btn-secondary text-sm py-2"
                    >
                      {showTerraform ? 'Show Map' : 'Show Terraform'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-500">Total Space</p>
                      <p className="text-2xl font-bold text-white">
                        {formatIpCount(networkPlan.baseNetwork.size)}
                      </p>
                    </div>
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-500">Allocated</p>
                      <p className="text-2xl font-bold text-helio-400">
                        {networkPlan.summary.utilizationPercent}%
                      </p>
                    </div>
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-500">Spokes</p>
                      <p className="text-2xl font-bold text-white">
                        {networkPlan.summary.spokeCount}
                      </p>
                    </div>
                    <div className="p-4 bg-dark-900/50 rounded-xl">
                      <p className="text-sm text-gray-500">Growth Slots</p>
                      <p className="text-2xl font-bold text-green-400">
                        {networkPlan.summary.growthSlots}
                      </p>
                    </div>
                  </div>

                  {networkPlan.errors.length > 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6">
                      <p className="text-sm font-medium text-red-400 mb-2">Allocation Errors:</p>
                      <ul className="text-sm text-red-300 space-y-1">
                        {networkPlan.errors.map((err, i) => (
                          <li key={i}>• {err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {showTerraform ? (
                    <TerraformOutput plan={networkPlan} />
                  ) : (
                    <NetworkMap plan={networkPlan} />
                  )}
                </div>
              </>
            )}

            {networkPlan?.error && (
              <div className="card">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400">{networkPlan.error}</p>
                </div>
              </div>
            )}

            {!baseValidation.valid && (
              <div className="card">
                <div className="text-center py-12 text-gray-500">
                  <p>Enter a valid base network CIDR to see the allocation plan</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
