# Azure Connectivity SKU Sizing Questionnaire

Use this questionnaire to determine the appropriate SKU sizes for your Azure landing zone connectivity components.

---

## 1. Azure Firewall

### 1.1 Security Requirements

**Q1: What level of threat protection do you require?**

| Option | Description | Recommendation |
|--------|-------------|----------------|
| ☐ Basic traffic filtering only | Simple allow/deny rules, no threat intelligence | **Basic** tier |
| ☐ Threat intelligence with alerting | Block known malicious IPs, threat-based alerts | **Standard** tier |
| ☐ Advanced threat protection | IDPS, TLS inspection, URL filtering, web categories | **Premium** tier |

**Q2: Do you have compliance requirements mandating advanced threat detection (e.g., PCI-DSS, HIPAA)?**

| Option | Recommendation |
|--------|----------------|
| ☐ Yes | **Premium** tier required |
| ☐ No | Standard or Basic based on Q1 |

### 1.2 High Availability

**Q3: Do you require zone-redundant firewall deployment?**

| Option | Configuration |
|--------|---------------|
| ☐ Yes - Production/Mission-critical | Deploy across zones `["1", "2", "3"]` |
| ☐ No - Dev/Test environment | Single zone deployment |

### 1.3 Deployment Type

**Q4: Are you using Azure Virtual WAN?**

| Option | SKU Name |
|--------|----------|
| ☐ Yes - Virtual WAN Hub | `AZFW_Hub` |
| ☐ No - Traditional VNet | `AZFW_VNet` |

### Firewall Summary

Based on your answers, your recommended configuration:

```
sku_name                  = "________"  # AZFW_VNet or AZFW_Hub
sku_tier                  = "________"  # Basic, Standard, or Premium
threat_intelligence_mode  = "________"  # Off, Alert, or Deny
zones                     = [________]  # null or ["1", "2", "3"]
```

---

## 2. Azure Bastion

### 2.1 User Concurrency

**Q5: How many administrators will need concurrent Bastion access?**

| Concurrent Users | Recommended SKU | Scale Units |
|------------------|-----------------|-------------|
| ☐ Up to 50 | Basic | 2 (fixed) |
| ☐ 51-100 | Standard | 5 |
| ☐ 101-200 | Standard | 10 |
| ☐ 201-500 | Standard | 25 |
| ☐ 500+ | Premium | 25-50 |

*Note: Each scale unit supports ~20 concurrent connections. Basic tier is fixed at 2 scale units (max 50 effective concurrent sessions).*

### 2.2 Feature Requirements

**Q6: Which Bastion features do you require?** (Check all that apply)

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| ☐ Copy/Paste | ✅ | ✅ | ✅ |
| ☐ File Transfer (upload/download) | ❌ | ✅ | ✅ |
| ☐ IP-based Connection (connect via IP) | ❌ | ✅ | ✅ |
| ☐ Shareable Links (time-limited access) | ❌ | ✅ | ✅ |
| ☐ Native Client Support (SSH/RDP tunneling) | ❌ | ✅ | ✅ |
| ☐ Kerberos Authentication | ❌ | ❌ | ✅ |
| ☐ Session Recording | ❌ | ❌ | ✅ |

*If you checked any feature marked ❌ for Basic, you need Standard or Premium.*

### 2.3 High Availability

**Q7: Do you require zone-redundant Bastion deployment?**

| Option | Configuration |
|--------|---------------|
| ☐ Yes - Production/Mission-critical | Standard or Premium with zones `["1", "2", "3"]` |
| ☐ No - Dev/Test environment | Basic or Standard without zones |

*Note: Zone redundancy requires Standard or Premium tier.*

### Bastion Summary

Based on your answers, your recommended configuration:

```
sku         = "________"  # Basic, Standard, or Premium
scale_units = ________    # 2-50 (only configurable for Standard/Premium)
zones       = [________]  # null or ["1", "2", "3"] (Standard/Premium only)

# Feature flags (Standard/Premium only):
file_copy_enabled       = ________  # true/false
ip_connect_enabled      = ________  # true/false
shareable_link_enabled  = ________  # true/false
tunneling_enabled       = ________  # true/false
```

---

## 3. VPN Gateway

### 3.1 Throughput Requirements

**Q8: What is your expected VPN throughput requirement?**

| Throughput Need | Recommended SKU |
|-----------------|-----------------|
| ☐ Up to 650 Mbps | VpnGw1 |
| ☐ Up to 1 Gbps | VpnGw2 |
| ☐ Up to 1.25 Gbps | VpnGw3 |
| ☐ Higher (future growth) | VpnGw3 with Generation2 |

### 3.2 Connection Count

**Q9: How many Site-to-Site VPN connections do you need?**

| Connection Count | Minimum SKU Required |
|------------------|----------------------|
| ☐ Up to 10 connections | VpnGw1 |
| ☐ 11-30 connections | VpnGw2 or VpnGw3 |
| ☐ More than 30 | Multiple gateways or ExpressRoute |

### 3.3 Point-to-Site Requirements

**Q10: How many Point-to-Site (P2S) VPN clients do you expect?**

| P2S Client Count | Recommended SKU |
|------------------|-----------------|
| ☐ Up to 250 | VpnGw1 |
| ☐ Up to 500 | VpnGw2 |
| ☐ Up to 1,000 | VpnGw3 |
| ☐ Up to 5,000 | VpnGw3 with Generation2 |

### 3.4 High Availability

**Q11: Do you require zone-redundant VPN Gateway?**

| Option | Recommended SKU |
|--------|-----------------|
| ☐ Yes - Production/Mission-critical | VpnGw1AZ, VpnGw2AZ, or VpnGw3AZ |
| ☐ No - Dev/Test or single-zone OK | VpnGw1, VpnGw2, or VpnGw3 |

*AZ SKUs automatically deploy across zones ["1", "2", "3"].*

### 3.5 Performance Generation

**Q12: Do you want Generation2 for improved performance?**

| Option | Notes |
|--------|-------|
| ☐ Yes | Better throughput/latency, requires VpnGw2+ or VpnGw2AZ+ |
| ☐ No | Generation1 is sufficient for basic needs |

*Generation2 is only available for VpnGw2, VpnGw3, VpnGw2AZ, and VpnGw3AZ.*

### VPN Gateway Summary

Based on your answers, your recommended configuration:

```
sku        = "________"  # VpnGw1, VpnGw2, VpnGw3, VpnGw1AZ, VpnGw2AZ, or VpnGw3AZ
generation = "________"  # Generation1 or Generation2
```

---

## 4. ExpressRoute Gateway (if applicable)

*Skip this section if not using ExpressRoute.*

### 4.1 ExpressRoute Requirements

**Q13: Are you connecting to on-premises via ExpressRoute?**

| Option | Action |
|--------|--------|
| ☐ Yes | Continue to Q14 |
| ☐ No | Skip to Section 5 |

**Q14: What is your expected ExpressRoute throughput?**

| Throughput Need | Recommended SKU |
|-----------------|-----------------|
| ☐ Up to 1 Gbps | Standard |
| ☐ Up to 2 Gbps | HighPerformance |
| ☐ Up to 10 Gbps | UltraPerformance |
| ☐ Up to 100 Gbps | ErGw3AZ |

**Q15: Do you require zone-redundant ExpressRoute Gateway?**

| Option | Recommended SKU Suffix |
|--------|------------------------|
| ☐ Yes | Use ErGw1AZ, ErGw2AZ, or ErGw3AZ |
| ☐ No | Use Standard, HighPerformance, or UltraPerformance |

---

## 5. Network Address Planning

### 5.1 IP Address Requirements

**Q16: How many IP addresses do you need in the Hub VNet?**

| Resource Count | Recommended Hub CIDR |
|----------------|----------------------|
| ☐ Small (< 250 resources) | /24 (256 IPs) |
| ☐ Medium (< 1000 resources) | /23 (512 IPs) |
| ☐ Large (< 4000 resources) | /22 (1024 IPs) |
| ☐ Very Large | /21 or larger |

**Q17: How many spoke VNets do you anticipate?**

| Spoke Count | Planning Consideration |
|-------------|------------------------|
| ☐ 1-5 spokes | Allocate /22 per spoke |
| ☐ 6-20 spokes | Allocate /23 per spoke, plan address space carefully |
| ☐ 20+ spokes | Consider supernet planning, /21+ total allocation |

---

## 6. Environment Classification

### 6.1 Workload Criticality

**Q18: What is the criticality of workloads in this environment?**

| Criticality | Recommendations |
|-------------|-----------------|
| ☐ **Production / Mission-Critical** | Zone-redundant all components, Premium/Standard tiers |
| ☐ **Pre-Production / Staging** | Zone-redundant recommended, Standard tiers acceptable |
| ☐ **Development / Test** | Single-zone OK, Basic tiers acceptable for cost savings |
| ☐ **Sandbox / POC** | Minimal SKUs, Basic tiers, no zone redundancy |

---

## 7. Cost Optimization

### 7.1 Budget Constraints

**Q19: What is your monthly budget range for connectivity components?**

| Budget Range | Typical Configuration |
|--------------|----------------------|
| ☐ < $500/month | Basic tiers, no zone redundancy, VpnGw1 |
| ☐ $500-$1,500/month | Standard tiers, selective zone redundancy |
| ☐ $1,500-$5,000/month | Standard/Premium tiers, full zone redundancy |
| ☐ > $5,000/month | Premium tiers, full redundancy, high-capacity SKUs |

---

## Summary: Recommended Configuration

Fill in based on your questionnaire responses:

### Azure Firewall
```hcl
sku_name                 = "_____________"
sku_tier                 = "_____________"
threat_intelligence_mode = "_____________"
zones                    = _____________
```

### Azure Bastion
```hcl
sku                    = "_____________"
scale_units            = _____________
zones                  = _____________
file_copy_enabled      = _____________
ip_connect_enabled     = _____________
shareable_link_enabled = _____________
tunneling_enabled      = _____________
```

### VPN Gateway
```hcl
sku        = "_____________"
generation = "_____________"
```

### ExpressRoute Gateway (if applicable)
```hcl
sku = "_____________"
```

### Network Address Space
```hcl
hub_vnet_address_space   = ["_____________"]
spoke_vnet_address_space = ["_____________"]
```

---

## Quick Reference: SKU Comparison Tables

### Azure Firewall Tiers

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Monthly Cost (approx.) | ~$300 | ~$900 | ~$1,800 |
| Throughput | 250 Mbps | 30 Gbps | 30 Gbps |
| Threat Intelligence | ❌ | ✅ Alert/Deny | ✅ Alert/Deny |
| IDPS | ❌ | ❌ | ✅ |
| TLS Inspection | ❌ | ❌ | ✅ |
| URL Filtering | ❌ | ✅ | ✅ Advanced |
| Web Categories | ❌ | ❌ | ✅ |

### Azure Bastion Tiers

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Monthly Cost (approx.) | ~$140 | ~$330+ | ~$500+ |
| Max Concurrent Sessions | 50 | 20 × scale_units | 20 × scale_units |
| Scale Units | 2 (fixed) | 2-50 | 2-50 |
| Zone Redundancy | ❌ | ✅ | ✅ |
| File Copy | ❌ | ✅ | ✅ |
| Native Client | ❌ | ✅ | ✅ |
| Session Recording | ❌ | ❌ | ✅ |

### VPN Gateway SKUs

| SKU | Throughput | S2S Tunnels | P2S Connections | Zone Redundant |
|-----|------------|-------------|-----------------|----------------|
| VpnGw1 | 650 Mbps | 10 | 250 | ❌ |
| VpnGw2 | 1 Gbps | 30 | 500 | ❌ |
| VpnGw3 | 1.25 Gbps | 30 | 1,000 | ❌ |
| VpnGw1AZ | 650 Mbps | 10 | 250 | ✅ |
| VpnGw2AZ | 1 Gbps | 30 | 500 | ✅ |
| VpnGw3AZ | 1.25 Gbps | 30 | 1,000 | ✅ |

---

*Document generated for Azure Landing Zone connectivity planning.*
