// IP Class Analysis Functions
export function getIPClass(ip) {
  if (!ip) return null;
  const firstOctet = parseInt(ip.split('.')[0]);
  
  if (firstOctet >= 1 && firstOctet <= 126) return 'A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'D';
  if (firstOctet >= 240 && firstOctet <= 255) return 'E';
  
  return null;
}

export function getClassDescription(ipClass) {
  const descriptions = {
    'A': 'Large networks with many hosts',
    'B': 'Medium-sized networks',
    'C': 'Small networks with fewer hosts',
    'D': 'Multicast addresses',
    'E': 'Experimental/Reserved addresses'
  };
  return descriptions[ipClass] || '';
}

export function getDefaultMask(ipClass) {
  const masks = {
    'A': '255.0.0.0 (/8)',
    'B': '255.255.0.0 (/16)',
    'C': '255.255.255.0 (/24)',
    'D': 'N/A (Multicast)',
    'E': 'N/A (Reserved)'
  };
  return masks[ipClass] || '';
}

export function getNetworkBits(ipClass) {
  const bits = {
    'A': '8',
    'B': '16', 
    'C': '24',
    'D': 'N/A',
    'E': 'N/A'
  };
  return bits[ipClass] || '';
}

// Subnet Calculation Functions
export function prefixToSubnetMask(prefix) {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const bitsInOctet = Math.min(8, Math.max(0, prefix - i * 8));
    const octetValue = (0xFF << (8 - bitsInOctet)) & 0xFF;
    mask.push(octetValue);
  }
  return mask.join('.');
}

export function calculateNetworkAddress(ip, prefix) {
  if (!isValidIP(ip)) return "Invalid IP";
  
  const ipParts = ip.split('.').map(Number);
  const maskParts = prefixToSubnetMask(prefix).split('.').map(Number);
  
  const networkParts = ipParts.map((octet, index) => octet & maskParts[index]);
  return networkParts.join('.');
}

export function calculateBroadcastAddress(ip, prefix) {
  if (!isValidIP(ip)) return "Invalid IP";
  
  const networkAddress = calculateNetworkAddress(ip, prefix);
  const networkParts = networkAddress.split('.').map(Number);
  const hostBits = 32 - prefix;
  
  // Convert to binary, set all host bits to 1, convert back
  let ipInt = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3];
  ipInt = ipInt | ((1 << hostBits) - 1);
  
  return [
    (ipInt >>> 24) & 0xFF,
    (ipInt >>> 16) & 0xFF,
    (ipInt >>> 8) & 0xFF,
    ipInt & 0xFF
  ].join('.');
}

export function getFirstHost(networkAddress) {
  if (!isValidIP(networkAddress)) return "Invalid";
  const parts = networkAddress.split('.').map(Number);
  parts[3] += 1;
  if (parts[3] > 255) {
    parts[3] = 0;
    parts[2] += 1;
  }
  return parts.join('.');
}

export function getLastHost(broadcastAddress) {
  if (!isValidIP(broadcastAddress)) return "Invalid";
  const parts = broadcastAddress.split('.').map(Number);
  parts[3] -= 1;
  if (parts[3] < 0) {
    parts[3] = 255;
    parts[2] -= 1;
  }
  return parts.join('.');
}

// IP Validation Function
export function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

// Additional Utility Functions
export function calculateHostCount(prefix) {
  const hostBits = 32 - prefix;
  return Math.pow(2, hostBits);
}

export function calculateUsableHosts(prefix) {
  const totalHosts = calculateHostCount(prefix);
  return Math.max(0, totalHosts - 2); // Subtract network and broadcast addresses
}

export function subnetMaskToCIDR(subnetMask) {
  if (!isValidIP(subnetMask)) return null;
  
  const parts = subnetMask.split('.').map(Number);
  let cidr = 0;
  
  for (const part of parts) {
    if (part === 255) {
      cidr += 8;
    } else if (part === 254) {
      cidr += 7;
    } else if (part === 252) {
      cidr += 6;
    } else if (part === 248) {
      cidr += 5;
    } else if (part === 240) {
      cidr += 4;
    } else if (part === 224) {
      cidr += 3;
    } else if (part === 192) {
      cidr += 2;
    } else if (part === 128) {
      cidr += 1;
    } else if (part !== 0) {
      return null; // Invalid subnet mask
    }
  }
  
  return cidr;
}