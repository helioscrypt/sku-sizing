import { formatIpCount } from '../../utils/cidr'

export default function NetworkMap({ plan }) {
  if (!plan || !plan.allocations) return null

  const { allocations, growthReserved, baseNetwork } = plan

  return (
    <div className="space-y-4">
      {/* Visual Address Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{baseNetwork.networkIp}</span>
          <span>{baseNetwork.broadcastIp}</span>
        </div>
        <div className="h-8 bg-dark-900 rounded-lg overflow-hidden flex">
          {allocations.map((alloc, i) => {
            const width = (alloc.hubInfo?.size || alloc.spokeInfo?.size) / baseNetwork.size * 100
            const bgColor = alloc.type === 'hub' ? 'bg-helio-600' : 'bg-blue-600'
            return (
              <div
                key={i}
                className={`${bgColor} h-full relative group`}
                style={{ width: `${width}%` }}
                title={`${alloc.name}: ${alloc.cidr}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {width > 5 && (
                    <span className="text-xs text-white font-medium truncate px-1">
                      {alloc.name}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {growthReserved.map((cidr, i) => {
            const size = Math.pow(2, 32 - parseInt(cidr.split('/')[1]))
            const width = size / baseNetwork.size * 100
            return (
              <div
                key={`growth-${i}`}
                className="bg-green-600/30 h-full border-l border-green-500/50"
                style={{ width: `${width}%` }}
                title={`Growth: ${cidr}`}
              />
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-helio-600"></div>
            <span className="text-gray-400">Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-600"></div>
            <span className="text-gray-400">Spokes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-600/30 border border-green-500/50"></div>
            <span className="text-gray-400">Reserved Growth</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-dark-900"></div>
            <span className="text-gray-400">Free</span>
          </div>
        </div>
      </div>

      {/* Hub Details */}
      {allocations.filter(a => a.type === 'hub').map((hub, i) => (
        <div key={i} className="p-4 bg-helio-600/10 border border-helio-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-helio-600/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-helio-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">{hub.name}</h3>
                <p className="text-sm font-mono text-helio-300">{hub.cidr}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{hub.remainingPercent}% free</p>
              <p className="text-xs text-gray-500">{formatIpCount(hub.remainingSpace)} IPs remaining</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {hub.subnets.map((subnet, j) => (
              <div key={j} className="p-3 bg-dark-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{subnet.name}</span>
                  <span className="text-xs text-gray-500">/{subnet.prefix}</span>
                </div>
                <p className="text-xs font-mono text-gray-400 mt-1">{subnet.cidr}</p>
                <p className="text-xs text-gray-500">{formatIpCount(subnet.usableHosts)} usable</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Spoke Details */}
      {allocations.filter(a => a.type === 'spoke').map((spoke, i) => (
        <div key={i} className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">{spoke.name}</h3>
                <p className="text-sm font-mono text-blue-300">{spoke.cidr}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                {spoke.workloadType}
              </span>
              <p className="text-xs text-gray-500 mt-1">{spoke.remainingPercent}% free</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {spoke.subnets.map((subnet, j) => (
              <div key={j} className="p-3 bg-dark-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white truncate">{subnet.name}</span>
                  <span className="text-xs text-gray-500">/{subnet.prefix}</span>
                </div>
                <p className="text-xs font-mono text-gray-400 mt-1">{subnet.cidr}</p>
                <p className="text-xs text-gray-500">{formatIpCount(subnet.usableHosts)} usable</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Growth Reserved */}
      {growthReserved.length > 0 && (
        <div className="p-4 bg-green-600/10 border border-green-500/30 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">Reserved for Growth</h3>
              <p className="text-sm text-gray-400">{growthReserved.length} slots pre-allocated for future spokes</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {growthReserved.map((cidr, i) => (
              <span key={i} className="px-3 py-1 text-sm font-mono bg-dark-900/50 text-green-300 rounded-lg">
                {cidr}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
