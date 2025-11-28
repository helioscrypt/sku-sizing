export const questions = {
  environment: [
    {
      id: 'environment',
      label: 'What is the criticality of workloads in this environment?',
      hint: 'This helps determine the appropriate level of redundancy and features.',
      type: 'radio',
      options: [
        {
          value: 'production',
          label: 'Production / Mission-Critical',
          description: 'Requires maximum availability, zone redundancy, and advanced features',
        },
        {
          value: 'staging',
          label: 'Pre-Production / Staging',
          description: 'Should mirror production capabilities with some cost optimizations',
        },
        {
          value: 'development',
          label: 'Development / Test',
          description: 'Cost-optimized, single-zone deployment acceptable',
        },
        {
          value: 'sandbox',
          label: 'Sandbox / POC',
          description: 'Minimal configuration for experimentation',
        },
      ],
    },
  ],

  firewall: [
    {
      id: 'firewall_tier',
      label: 'What level of threat protection do you require?',
      type: 'radio',
      options: [
        {
          value: 'Basic',
          label: 'Basic Traffic Filtering',
          badge: 'Basic',
          description: 'Simple allow/deny rules, no threat intelligence. Best for dev/test or cost-sensitive scenarios.',
        },
        {
          value: 'Standard',
          label: 'Threat Intelligence',
          badge: 'Standard',
          description: 'Block known malicious IPs, threat-based alerts, FQDN filtering, network rules.',
        },
        {
          value: 'Premium',
          label: 'Advanced Threat Protection',
          badge: 'Premium',
          description: 'Intrusion Detection (IDPS), TLS inspection, URL filtering, web categories.',
        },
      ],
    },
    {
      id: 'firewall_compliance',
      label: 'Do you have compliance requirements mandating advanced threat detection?',
      hint: 'E.g., PCI-DSS, HIPAA, SOC2, or similar regulations',
      type: 'radio',
      options: [
        {
          value: 'yes',
          label: 'Yes',
          description: 'We must meet specific compliance standards requiring advanced threat protection',
        },
        {
          value: 'no',
          label: 'No',
          description: 'No specific compliance requirements for threat detection',
        },
      ],
    },
    {
      id: 'firewall_vwan',
      label: 'Are you using Azure Virtual WAN?',
      type: 'radio',
      options: [
        {
          value: 'yes',
          label: 'Yes - Virtual WAN Hub',
          description: 'Firewall will be deployed in a Virtual WAN secured hub',
        },
        {
          value: 'no',
          label: 'No - Traditional VNet',
          description: 'Firewall will be deployed in a standard hub virtual network',
        },
      ],
    },
  ],

  bastion: [
    {
      id: 'bastion_users',
      label: 'How many administrators will need concurrent Bastion access?',
      hint: 'Each scale unit supports approximately 20 concurrent connections',
      type: 'radio',
      options: [
        {
          value: '50',
          label: 'Up to 50 users',
          description: 'Small team, basic connectivity needs',
        },
        {
          value: '100',
          label: '51-100 users',
          description: 'Medium team, requires 5 scale units',
        },
        {
          value: '200',
          label: '101-200 users',
          description: 'Large team, requires 10 scale units',
        },
        {
          value: '500',
          label: '201-500 users',
          description: 'Enterprise scale, requires 25 scale units',
        },
      ],
    },
    {
      id: 'bastion_features',
      label: 'Which Bastion features do you require?',
      hint: 'Select all that apply. Some features require Standard or Premium tier.',
      type: 'checkbox',
      options: [
        { value: 'file_copy', label: 'File Transfer', tier: 'Standard' },
        { value: 'ip_connect', label: 'IP-based Connection', tier: 'Standard' },
        { value: 'shareable_link', label: 'Shareable Links', tier: 'Standard' },
        { value: 'tunneling', label: 'Native Client (SSH/RDP)', tier: 'Standard' },
        { value: 'session_recording', label: 'Session Recording', tier: 'Premium' },
        { value: 'kerberos', label: 'Kerberos Auth', tier: 'Premium' },
      ],
    },
  ],

  vpn: [
    {
      id: 'vpn_needed',
      label: 'Do you need a VPN Gateway?',
      type: 'radio',
      options: [
        {
          value: 'yes',
          label: 'Yes',
          description: 'We need Site-to-Site or Point-to-Site VPN connectivity',
        },
        {
          value: 'no',
          label: 'No',
          description: 'Not required at this time',
        },
      ],
    },
    {
      id: 'vpn_throughput',
      label: 'What is your expected VPN throughput requirement?',
      type: 'radio',
      condition: { field: 'vpn_needed', value: 'yes' },
      options: [
        {
          value: '650',
          label: 'Up to 650 Mbps',
          description: 'Suitable for small to medium workloads',
        },
        {
          value: '1000',
          label: 'Up to 1 Gbps',
          description: 'Medium to large workloads with higher bandwidth needs',
        },
        {
          value: '1250',
          label: 'Up to 1.25 Gbps',
          description: 'Large workloads requiring maximum throughput',
        },
      ],
    },
    {
      id: 'vpn_connections',
      label: 'How many Site-to-Site VPN connections do you need?',
      type: 'radio',
      condition: { field: 'vpn_needed', value: 'yes' },
      options: [
        {
          value: '10',
          label: 'Up to 10 connections',
          description: 'Single or few branch offices',
        },
        {
          value: '30',
          label: '11-30 connections',
          description: 'Multiple branch offices or partner connections',
        },
      ],
    },
    {
      id: 'vpn_p2s',
      label: 'How many Point-to-Site (P2S) VPN clients do you expect?',
      type: 'radio',
      condition: { field: 'vpn_needed', value: 'yes' },
      options: [
        {
          value: '250',
          label: 'Up to 250 clients',
          description: 'Small remote workforce',
        },
        {
          value: '500',
          label: 'Up to 500 clients',
          description: 'Medium remote workforce',
        },
        {
          value: '1000',
          label: 'Up to 1,000 clients',
          description: 'Large remote workforce',
        },
        {
          value: '5000',
          label: 'Up to 5,000 clients',
          description: 'Enterprise-scale remote access (requires Gen2)',
        },
      ],
    },
  ],

  expressroute: [
    {
      id: 'expressroute_needed',
      label: 'Are you connecting to on-premises via ExpressRoute?',
      type: 'radio',
      options: [
        {
          value: 'yes',
          label: 'Yes',
          description: 'We need dedicated private connectivity to on-premises',
        },
        {
          value: 'no',
          label: 'No',
          description: 'VPN or internet connectivity is sufficient',
        },
      ],
    },
    {
      id: 'expressroute_throughput',
      label: 'What is your expected ExpressRoute throughput?',
      type: 'radio',
      condition: { field: 'expressroute_needed', value: 'yes' },
      options: [
        {
          value: '1000',
          label: 'Up to 1 Gbps',
          description: 'Standard gateway, suitable for most workloads',
        },
        {
          value: '2000',
          label: 'Up to 2 Gbps',
          description: 'High Performance gateway for data-intensive workloads',
        },
        {
          value: '10000',
          label: 'Up to 10 Gbps',
          description: 'Ultra Performance gateway for maximum throughput',
        },
      ],
    },
  ],
}
