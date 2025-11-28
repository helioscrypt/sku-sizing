/**
 * CIDR Calculator Utilities for Azure Hub-Spoke Network Planning
 */

// Convert IP address string to 32-bit integer
export function ipToInt(ip) {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

// Convert 32-bit integer to IP address string
export function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

// Parse CIDR notation (e.g., "10.0.0.0/16") into components
export function parseCidr(cidr) {
  const [ip, prefixStr] = cidr.split("/");
  const prefix = parseInt(prefixStr, 10);
  const ipInt = ipToInt(ip);
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const size = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? size : size - 2;

  return {
    cidr,
    ip,
    prefix,
    mask,
    network,
    broadcast,
    networkIp: intToIp(network),
    broadcastIp: intToIp(broadcast),
    size,
    usableHosts,
    firstUsable: intToIp(network + 1),
    lastUsable: intToIp(broadcast - 1),
  };
}

// Check if two CIDR ranges overlap
export function cidrsOverlap(cidr1, cidr2) {
  const a = parseCidr(cidr1);
  const b = parseCidr(cidr2);
  return !(a.broadcast < b.network || b.broadcast < a.network);
}

// Check if cidr1 contains cidr2
export function cidrContains(parent, child) {
  const p = parseCidr(parent);
  const c = parseCidr(child);
  return c.network >= p.network && c.broadcast <= p.broadcast;
}

// Get the next available CIDR block after a given one
export function getNextCidr(cidr, prefix) {
  const parsed = parseCidr(cidr);
  const nextNetwork = parsed.broadcast + 1;
  const newSize = Math.pow(2, 32 - prefix);
  // Align to the new prefix boundary
  const aligned = Math.ceil(nextNetwork / newSize) * newSize;
  return `${intToIp(aligned)}/${prefix}`;
}

// Calculate required prefix for a given number of hosts
export function prefixForHosts(hosts) {
  // Azure reserves 5 IPs per subnet (first 4 + broadcast)
  const required = hosts + 5;
  const bits = Math.ceil(Math.log2(required));
  return 32 - bits;
}

// Calculate required prefix for a given number of subnets within a VNet
export function prefixForSubnets(
  vnetPrefix,
  subnetCount,
  minSubnetPrefix = 29
) {
  const vnetSize = 32 - vnetPrefix;
  const bitsNeeded = Math.ceil(Math.log2(subnetCount));
  const subnetPrefix = vnetPrefix + bitsNeeded;
  return Math.min(subnetPrefix, minSubnetPrefix);
}

// Azure reserved subnets with their minimum sizes
export const AZURE_RESERVED_SUBNETS = {
  GatewaySubnet: {
    name: "GatewaySubnet",
    minPrefix: 27, // /27 = 32 IPs, recommended for VPN/ExpressRoute
    recommended: 27,
    description: "VPN/ExpressRoute Gateway",
    required: false,
  },
  AzureFirewallSubnet: {
    name: "AzureFirewallSubnet",
    minPrefix: 26, // /26 = 64 IPs minimum required
    recommended: 26,
    description: "Azure Firewall",
    required: false,
  },
  AzureFirewallManagementSubnet: {
    name: "AzureFirewallManagementSubnet",
    minPrefix: 26,
    recommended: 26,
    description: "Azure Firewall Management (forced tunneling)",
    required: false,
  },
  AzureBastionSubnet: {
    name: "AzureBastionSubnet",
    minPrefix: 26, // /26 = 64 IPs minimum required
    recommended: 26,
    description: "Azure Bastion",
    required: false,
  },
  RouteServerSubnet: {
    name: "RouteServerSubnet",
    minPrefix: 27,
    recommended: 27,
    description: "Azure Route Server",
    required: false,
  },
  ApplicationGatewaySubnet: {
    name: "ApplicationGatewaySubnet",
    minPrefix: 28,
    recommended: 26,
    description: "Application Gateway / WAF",
    required: false,
  },
  PrivateEndpointSubnet: {
    name: "PrivateEndpointSubnet",
    minPrefix: 28,
    recommended: 24,
    description: "Private Endpoints",
    required: false,
  },
  DnsResolverInbound: {
    name: "DnsResolverInbound",
    minPrefix: 28,
    recommended: 28,
    description: "DNS Resolver Inbound",
    required: false,
  },
  DnsResolverOutbound: {
    name: "DnsResolverOutbound",
    minPrefix: 28,
    recommended: 28,
    description: "DNS Resolver Outbound",
    required: false,
  },
};

// Calculate hub subnets based on enabled services
export function calculateHubSubnets(hubCidr, enabledServices) {
  const hub = parseCidr(hubCidr);
  const subnets = [];
  let currentOffset = hub.network;

  // Sort services by size (larger subnets first for better allocation)
  const sortedServices = [...enabledServices].sort((a, b) => {
    const sizeA = AZURE_RESERVED_SUBNETS[a]?.recommended || 28;
    const sizeB = AZURE_RESERVED_SUBNETS[b]?.recommended || 28;
    return sizeA - sizeB; // Lower prefix = larger subnet = allocate first
  });

  for (const service of sortedServices) {
    const config = AZURE_RESERVED_SUBNETS[service];
    if (!config) continue;

    const subnetSize = Math.pow(2, 32 - config.recommended);
    // Align to subnet boundary
    const aligned = Math.ceil(currentOffset / subnetSize) * subnetSize;

    if (aligned + subnetSize - 1 > hub.broadcast) {
      throw new Error(
        `Not enough space in hub for ${service}. Consider a larger hub CIDR.`
      );
    }

    const subnetCidr = `${intToIp(aligned)}/${config.recommended}`;
    subnets.push({
      name: config.name,
      cidr: subnetCidr,
      ...parseCidr(subnetCidr),
      description: config.description,
    });

    currentOffset = aligned + subnetSize;
  }

  // Calculate remaining space
  const usedSpace = currentOffset - hub.network;
  const remainingSpace = hub.size - usedSpace;
  const remainingPercent = ((remainingSpace / hub.size) * 100).toFixed(1);

  return {
    subnets,
    usedSpace,
    remainingSpace,
    remainingPercent,
    hubInfo: hub,
  };
}

// Calculate spoke subnets based on workload type
export function calculateSpokeSubnets(
  spokeCidr,
  workloadType,
  customSubnets = []
) {
  const spoke = parseCidr(spokeCidr);
  const subnets = [];
  let currentOffset = spoke.network;

  // Define subnet patterns based on workload type
  const patterns = {
    general: [
      { name: "AppSubnet", prefix: 25 },
      { name: "DataSubnet", prefix: 26 },
      { name: "PrivateEndpointSubnet", prefix: 27 },
    ],
    aks: [
      { name: "AksNodeSubnet", prefix: 24 },
      { name: "AksPodSubnet", prefix: 24 },
      { name: "PrivateEndpointSubnet", prefix: 27 },
    ],
    "web-app": [
      { name: "WebSubnet", prefix: 26 },
      { name: "AppSubnet", prefix: 25 },
      { name: "DataSubnet", prefix: 26 },
      { name: "PrivateEndpointSubnet", prefix: 27 },
    ],
    data: [
      { name: "ComputeSubnet", prefix: 25 },
      { name: "StorageSubnet", prefix: 26 },
      { name: "PrivateEndpointSubnet", prefix: 26 },
    ],
    custom: customSubnets,
  };

  const subnetPattern = patterns[workloadType] || patterns["general"];

  // Sort by size (larger first)
  const sortedPattern = [...subnetPattern].sort((a, b) => a.prefix - b.prefix);

  for (const subnet of sortedPattern) {
    const subnetSize = Math.pow(2, 32 - subnet.prefix);
    const aligned = Math.ceil(currentOffset / subnetSize) * subnetSize;

    if (aligned + subnetSize - 1 > spoke.broadcast) {
      throw new Error(
        `Not enough space in spoke for ${subnet.name}. Consider a larger spoke CIDR.`
      );
    }

    const subnetCidr = `${intToIp(aligned)}/${subnet.prefix}`;
    subnets.push({
      name: subnet.name,
      cidr: subnetCidr,
      ...parseCidr(subnetCidr),
    });

    currentOffset = aligned + subnetSize;
  }

  const usedSpace = currentOffset - spoke.network;
  const remainingSpace = spoke.size - usedSpace;
  const remainingPercent = ((remainingSpace / spoke.size) * 100).toFixed(1);

  return {
    subnets,
    usedSpace,
    remainingSpace,
    remainingPercent,
    spokeInfo: spoke,
  };
}

// Plan entire hub-spoke network
export function planNetwork(config) {
  const {
    baseNetwork = "10.0.0.0/8",
    hubPrefix = 22,
    spokePrefix = 23,
    spokes = [],
    hubServices = [],
    reserveGrowth = 2, // Reserve space for N additional spokes
  } = config;

  const base = parseCidr(baseNetwork);
  const allocations = [];
  let currentOffset = base.network;
  const errors = [];

  // Allocate Hub
  const hubSize = Math.pow(2, 32 - hubPrefix);
  const hubAligned = Math.ceil(currentOffset / hubSize) * hubSize;
  const hubCidr = `${intToIp(hubAligned)}/${hubPrefix}`;

  let hubAllocation;
  try {
    hubAllocation = calculateHubSubnets(hubCidr, hubServices);
    allocations.push({
      type: "hub",
      name: "Hub",
      cidr: hubCidr,
      ...hubAllocation,
    });
  } catch (e) {
    errors.push(`Hub: ${e.message}`);
  }

  currentOffset = hubAligned + hubSize;

  // Allocate Spokes
  for (const spoke of spokes) {
    const spokeSize = Math.pow(2, 32 - (spoke.prefix || spokePrefix));
    const spokeAligned = Math.ceil(currentOffset / spokeSize) * spokeSize;

    if (spokeAligned + spokeSize - 1 > base.broadcast) {
      errors.push(`Not enough space for spoke: ${spoke.name}`);
      continue;
    }

    const spokeCidr = `${intToIp(spokeAligned)}/${spoke.prefix || spokePrefix}`;

    try {
      const spokeAllocation = calculateSpokeSubnets(
        spokeCidr,
        spoke.workloadType || "general",
        spoke.customSubnets
      );
      allocations.push({
        type: "spoke",
        name: spoke.name,
        cidr: spokeCidr,
        workloadType: spoke.workloadType || "general",
        ...spokeAllocation,
      });
    } catch (e) {
      errors.push(`Spoke ${spoke.name}: ${e.message}`);
    }

    currentOffset = spokeAligned + spokeSize;
  }

  // Calculate reserved growth space
  const growthCidrs = [];
  for (let i = 0; i < reserveGrowth; i++) {
    const growthSize = Math.pow(2, 32 - spokePrefix);
    const growthAligned = Math.ceil(currentOffset / growthSize) * growthSize;

    if (growthAligned + growthSize - 1 <= base.broadcast) {
      growthCidrs.push(`${intToIp(growthAligned)}/${spokePrefix}`);
      currentOffset = growthAligned + growthSize;
    }
  }

  // Summary
  const totalUsed = currentOffset - base.network;
  const totalRemaining = base.size - totalUsed;
  const utilizationPercent = ((totalUsed / base.size) * 100).toFixed(1);

  return {
    baseNetwork: base,
    allocations,
    growthReserved: growthCidrs,
    summary: {
      totalUsed,
      totalRemaining,
      utilizationPercent,
      hubCount: 1,
      spokeCount: spokes.length,
      growthSlots: growthCidrs.length,
    },
    errors,
  };
}

// Validate CIDR input
export function validateCidr(cidr) {
  const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
  if (!cidrRegex.test(cidr)) {
    return {
      valid: false,
      error: "Invalid CIDR format. Use format: x.x.x.x/y",
    };
  }

  const [ip, prefix] = cidr.split("/");
  const octets = ip.split(".").map(Number);

  if (octets.some((o) => o < 0 || o > 255)) {
    return { valid: false, error: "IP octets must be between 0 and 255" };
  }

  const prefixNum = parseInt(prefix, 10);
  if (prefixNum < 8 || prefixNum > 30) {
    return { valid: false, error: "Prefix must be between /8 and /30" };
  }

  // Check if it's a valid network address
  const parsed = parseCidr(cidr);
  if (parsed.networkIp !== ip) {
    return {
      valid: false,
      error: `Not a valid network address. Did you mean ${parsed.networkIp}/${prefix}?`,
      suggestion: `${parsed.networkIp}/${prefix}`,
    };
  }

  return { valid: true };
}

// Format IP count for display
export function formatIpCount(count) {
  if (count >= 1048576) return `${(count / 1048576).toFixed(1)}M`;
  if (count >= 1024) return `${(count / 1024).toFixed(1)}K`;
  return count.toString();
}
