// ============================================================
// PLUTO Dev Traffic Generator
// Generates realistic fake traffic when extension is not connected
// ============================================================

const ATTACK_TYPES = ['DDoS', 'Brute Force', 'Port Scan', 'Bot Traffic', 'SQL Injection', 'XSS Attack', 'Unknown'];
const PROTOCOLS = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'SSH', 'FTP'];
const PORTS = [80, 443, 22, 21, 3306, 5432, 8080, 3389, 445, 23];

// Known malicious IP ranges for realistic simulation
const MALICIOUS_IP_PREFIXES = [
  '45.33.', '185.220.', '192.42.', '23.129.', '104.244.',
  '198.98.', '51.15.', '89.248.', '176.10.', '91.219.'
];

// Safe IP ranges
const SAFE_IP_PREFIXES = [
  '192.168.', '10.0.', '172.16.', '8.8.', '1.1.',
  '208.67.', '64.6.', '74.125.', '142.250.'
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIP(malicious: boolean = false): string {
  if (malicious && Math.random() > 0.3) {
    const prefix = randomElement(MALICIOUS_IP_PREFIXES);
    return `${prefix}${randomInt(1, 255)}.${randomInt(1, 255)}`;
  } else {
    const prefix = randomElement(SAFE_IP_PREFIXES);
    return `${prefix}${randomInt(1, 255)}.${randomInt(1, 255)}`;
  }
}

export interface FakeTrafficEntry {
  ip: string;
  port: number;
  protocol: string;
  requestCount: number;
  source: string;
  userAgent: string;
  attackType?: string;
  expectedRisk?: number;
}

export function generateFakeTraffic(malicious: boolean = false): FakeTrafficEntry {
  const isMalicious = malicious || Math.random() > 0.7; // 30% chance of malicious
  
  if (isMalicious) {
    // Generate malicious traffic
    const attackType = randomElement(ATTACK_TYPES);
    const port = randomElement([22, 23, 3389, 445, 3306]); // Commonly attacked ports
    
    return {
      ip: generateIP(true),
      port,
      protocol: port === 22 ? 'SSH' : port === 3389 ? 'RDP' : randomElement(PROTOCOLS),
      requestCount: randomInt(50, 300), // High request count
      source: 'dev_simulation',
      userAgent: 'Mozilla/5.0 (compatible; Bot/1.0)',
      attackType,
      expectedRisk: randomInt(60, 95)
    };
  } else {
    // Generate normal traffic
    return {
      ip: generateIP(false),
      port: randomElement([80, 443, 8080]),
      protocol: randomElement(['HTTP', 'HTTPS']),
      requestCount: randomInt(1, 15), // Normal request count
      source: 'dev_simulation',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      expectedRisk: randomInt(0, 30)
    };
  }
}

export function generateTrafficBatch(count: number = 5): FakeTrafficEntry[] {
  const batch: FakeTrafficEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    // 30% malicious, 70% normal
    const malicious = Math.random() > 0.7;
    batch.push(generateFakeTraffic(malicious));
  }
  
  return batch;
}

export function generateAttackWave(): FakeTrafficEntry[] {
  // Simulate a coordinated attack
  const attackType = randomElement(['DDoS', 'Brute Force', 'Port Scan']);
  const targetPort = randomElement([22, 3389, 445]);
  const attackerIPs = Array.from({ length: randomInt(3, 8) }, () => generateIP(true));
  
  return attackerIPs.map(ip => ({
    ip,
    port: targetPort,
    protocol: targetPort === 22 ? 'SSH' : 'TCP',
    requestCount: randomInt(100, 500),
    source: 'dev_simulation',
    userAgent: 'Mozilla/5.0 (compatible; Bot/1.0)',
    attackType,
    expectedRisk: randomInt(80, 99)
  }));
}

// Traffic patterns for realistic simulation
export function generateRealisticPattern(): FakeTrafficEntry[] {
  const pattern: FakeTrafficEntry[] = [];
  const hour = new Date().getHours();
  
  // Simulate time-based traffic patterns
  if (hour >= 9 && hour <= 17) {
    // Business hours - more traffic, some attacks
    pattern.push(...generateTrafficBatch(8));
    if (Math.random() > 0.7) {
      pattern.push(...generateAttackWave());
    }
  } else {
    // Off hours - less traffic, more suspicious
    pattern.push(...generateTrafficBatch(3));
    if (Math.random() > 0.5) {
      pattern.push(generateFakeTraffic(true));
    }
  }
  
  return pattern;
}
