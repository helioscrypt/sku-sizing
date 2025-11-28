export function calculateConfig(answers) {
  const env = answers.environment || 'development'
  const isProduction = env === 'production' || env === 'staging'
  const zones = isProduction ? '["1", "2", "3"]' : 'null'

  // Firewall
  let firewallTier = answers.firewall_tier || 'Basic'
  if (answers.firewall_compliance === 'yes') firewallTier = 'Premium'
  const firewallSku = answers.firewall_vwan === 'yes' ? 'AZFW_Hub' : 'AZFW_VNet'
  const threatMode = firewallTier === 'Basic' ? 'Alert' : 'Deny'

  // Bastion
  const bastionUsers = parseInt(answers.bastion_users) || 50
  const bastionFeatures = answers.bastion_features || []
  const needsPremiumFeatures = bastionFeatures.includes('session_recording') || bastionFeatures.includes('kerberos')
  const needsStandardFeatures = bastionFeatures.some(f => ['file_copy', 'ip_connect', 'shareable_link', 'tunneling'].includes(f))

  let bastionSku = 'Basic'
  let bastionScaleUnits = 2

  if (needsPremiumFeatures || bastionUsers > 200) {
    bastionSku = 'Premium'
    bastionScaleUnits = Math.max(2, Math.ceil(bastionUsers / 20))
  } else if (needsStandardFeatures || bastionUsers > 50 || isProduction) {
    bastionSku = 'Standard'
    bastionScaleUnits = Math.max(2, Math.ceil(bastionUsers / 20))
  }

  // VPN
  let vpnConfig = null
  if (answers.vpn_needed === 'yes') {
    const throughput = parseInt(answers.vpn_throughput) || 650
    const connections = parseInt(answers.vpn_connections) || 10
    const p2s = parseInt(answers.vpn_p2s) || 250

    let vpnSku, vpnGeneration

    if (throughput > 1000 || connections > 10 || p2s > 500) {
      vpnSku = isProduction ? 'VpnGw3AZ' : 'VpnGw3'
      vpnGeneration = p2s > 1000 ? 'Generation2' : 'Generation1'
    } else if (throughput > 650 || p2s > 250) {
      vpnSku = isProduction ? 'VpnGw2AZ' : 'VpnGw2'
      vpnGeneration = 'Generation1'
    } else {
      vpnSku = isProduction ? 'VpnGw1AZ' : 'VpnGw1'
      vpnGeneration = 'Generation1'
    }

    vpnConfig = { sku: vpnSku, generation: vpnGeneration }
  }

  // ExpressRoute
  let expressRouteConfig = null
  if (answers.expressroute_needed === 'yes') {
    const erThroughput = parseInt(answers.expressroute_throughput) || 1000
    let erSku

    if (erThroughput >= 10000) {
      erSku = isProduction ? 'ErGw3AZ' : 'UltraPerformance'
    } else if (erThroughput >= 2000) {
      erSku = isProduction ? 'ErGw2AZ' : 'HighPerformance'
    } else {
      erSku = isProduction ? 'ErGw1AZ' : 'Standard'
    }

    expressRouteConfig = { sku: erSku }
  }

  return {
    environment: env,
    zones,
    firewall: { sku: firewallSku, tier: firewallTier, threatMode },
    bastion: {
      sku: bastionSku,
      scaleUnits: bastionScaleUnits,
      fileCopy: bastionFeatures.includes('file_copy'),
      ipConnect: bastionFeatures.includes('ip_connect'),
      shareableLink: bastionFeatures.includes('shareable_link'),
      tunneling: bastionFeatures.includes('tunneling'),
    },
    vpn: vpnConfig,
    expressRoute: expressRouteConfig,
  }
}

export function calculateCosts(config) {
  const firewallCosts = { Basic: 300, Standard: 900, Premium: 1800 }
  const bastionCosts = { Basic: 140, Standard: 330, Premium: 500 }
  const vpnCosts = {
    VpnGw1: 140, VpnGw2: 280, VpnGw3: 560,
    VpnGw1AZ: 185, VpnGw2AZ: 370, VpnGw3AZ: 740,
  }
  const expressRouteCosts = {
    Standard: 125, HighPerformance: 335, UltraPerformance: 930,
    ErGw1AZ: 165, ErGw2AZ: 445, ErGw3AZ: 1115,
  }

  const firewall = firewallCosts[config.firewall.tier]
  const bastion = bastionCosts[config.bastion.sku] + (config.bastion.sku !== 'Basic' ? (config.bastion.scaleUnits - 2) * 35 : 0)
  const vpn = config.vpn ? vpnCosts[config.vpn.sku] : 0
  const expressRoute = config.expressRoute ? expressRouteCosts[config.expressRoute.sku] : 0

  return {
    firewall: firewall.toLocaleString(),
    bastion: bastion.toLocaleString(),
    vpn: vpn.toLocaleString(),
    expressRoute: expressRoute.toLocaleString(),
    total: (firewall + bastion + vpn + expressRoute).toLocaleString(),
  }
}

export function generateTerraformCode(config) {
  let plain = `# Azure Firewall Configuration
sku_name                 = "${config.firewall.sku}"
sku_tier                 = "${config.firewall.tier}"
threat_intelligence_mode = "${config.firewall.threatMode}"
zones                    = ${config.zones}

# Azure Bastion Configuration
sku         = "${config.bastion.sku}"
scale_units = ${config.bastion.scaleUnits}`

  if (config.bastion.sku !== 'Basic') {
    plain += `
zones                  = ${config.zones}
file_copy_enabled      = ${config.bastion.fileCopy}
ip_connect_enabled     = ${config.bastion.ipConnect}
shareable_link_enabled = ${config.bastion.shareableLink}
tunneling_enabled      = ${config.bastion.tunneling}`
  }

  if (config.vpn) {
    plain += `

# VPN Gateway Configuration
sku        = "${config.vpn.sku}"
generation = "${config.vpn.generation}"`
  }

  if (config.expressRoute) {
    plain += `

# ExpressRoute Gateway Configuration
sku = "${config.expressRoute.sku}"`
  }

  // Generate highlighted version for display
  const highlighted = plain
    .split('\n')
    .map(line => {
      if (line.startsWith('#')) {
        return `<span class="text-gray-500">${line}</span>`
      }
      // Process in order: arrays first, then strings, then standalone values
      return line
        // Match key = value pattern and highlight the key
        .replace(/^(\w+)(\s+=)/g, '<span class="text-helio-300">$1</span>$2')
        // Match arrays like ["1", "2", "3"]
        .replace(/(\[.+?\])/g, '<span class="text-amber-400">$1</span>')
        // Match strings in quotes (but not inside already-wrapped spans)
        .replace(/= "([^"]+)"/g, '= <span class="text-green-400">"$1"</span>')
        // Match booleans
        .replace(/= (true|false)$/g, '= <span class="text-amber-400">$1</span>')
        // Match standalone numbers at end of line
        .replace(/= (\d+)$/g, '= <span class="text-amber-400">$1</span>')
        // Match null
        .replace(/= null$/g, '= <span class="text-gray-500">null</span>')
    })
    .join('\n')

  return { plain, highlighted }
}
