import { MerchantOrder } from './types';

export const initialOrders: MerchantOrder[] = [
  {
    id: 'ORD-9821',
    paypalOrderId: '5KJ82910AA331201',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@example.com',
    itemSummary: 'AeroGlide Eco Travel Backpack 30L (x1)',
    totalAmount: 61.20,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 12,
    riskLevel: 'LOW',
    fraudReasoning: 'Consistent IP geolocation, verified PayPal account with 4-year tenure.',
    signatureHash: '0x8f2a...c10b',
    timestamp: '2026-11-12 09:15:32',
  },
  {
    id: 'ORD-9820',
    paypalOrderId: '7WX44190BC998014',
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance883@tempmail.io',
    itemSummary: 'SonicShield ANC Wireless Headphones (x4)',
    totalAmount: 359.96,
    currency: 'USD',
    status: 'FLAGGED',
    riskScore: 86,
    riskLevel: 'HIGH',
    fraudReasoning: 'Disposable email domain, multiple failed attempts prior to checkout, rapid bulk order.',
    signatureHash: '0x1a7c...ee29',
    timestamp: '2026-11-12 08:44:11',
  },
  {
    id: 'ORD-9819',
    paypalOrderId: '2PQ11944DE442991',
    customerName: 'Sarah Lin',
    customerEmail: 'sarah.lin@alumni.edu',
    itemSummary: 'TerraVentures Ultralight Daypack + SolCharge Solar Power Bank',
    totalAmount: 83.50,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 18,
    riskLevel: 'LOW',
    fraudReasoning: 'Verified educational domain, shipping matches billing address exactly.',
    signatureHash: '0x99dc...fa41',
    timestamp: '2026-11-12 07:30:45',
  },
  {
    id: 'ORD-9818',
    paypalOrderId: '9KL77631GH883410',
    customerName: 'Dmitri Voronov',
    customerEmail: 'dmitri.v@unknown-proxy.net',
    itemSummary: 'ChronoGlow Smart Fitness Band (x2)',
    totalAmount: 110.00,
    currency: 'USD',
    status: 'FLAGGED',
    riskScore: 74,
    riskLevel: 'MEDIUM',
    fraudReasoning: 'VPN/Tor exit node IP detected during order authorization.',
    signatureHash: '0x43b1...78aa',
    timestamp: '2026-11-12 06:12:09',
  },
  {
    id: 'ORD-9817',
    paypalOrderId: '4MN55320JK114982',
    customerName: 'Emma Watson',
    customerEmail: 'emma.creative@studio.design',
    itemSummary: 'BambooCore Ergonomic Wireless Mouse (x1)',
    totalAmount: 29.50,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 8,
    riskLevel: 'LOW',
    fraudReasoning: 'High trust score, repeated customer with clean chargeback record.',
    signatureHash: '0x7e29...dd44',
    timestamp: '2026-11-12 04:55:22',
  },
  {
    id: 'ORD-9816',
    paypalOrderId: '1GH33910KL556213',
    customerName: 'Carlos Gomez',
    customerEmail: 'carlos.g@domain.com',
    itemSummary: 'NordicThermal Stainless Travel Tumbler (x2)',
    totalAmount: 48.00,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 15,
    riskLevel: 'LOW',
    fraudReasoning: 'Standard checkout velocity, matching billing zip code.',
    signatureHash: '0x32ab...66cf',
    timestamp: '2026-11-11 22:18:04',
  },
];

declare global {
  // eslint-disable-next-line no-var
  var __payagent_orders: MerchantOrder[] | undefined;
}

export function getOrders(): MerchantOrder[] {
  if (!globalThis.__payagent_orders) {
    globalThis.__payagent_orders = [...initialOrders];
  }
  return globalThis.__payagent_orders;
}

export function addOrder(order: MerchantOrder): MerchantOrder {
  const current = getOrders();
  globalThis.__payagent_orders = [order, ...current];
  return order;
}

// Function to simulate an incoming live stream transaction in AG Grid
export function generateSimulatedLiveOrder(): MerchantOrder {
  const names = ['Liam Chen', 'Olivia Taylor', 'Noah Schmidt', 'Sophia Martinez', 'Jackson Lee', 'Ava Dubois'];
  const items = [
    'AeroGlide Eco Travel Backpack 30L',
    'SonicShield ANC Wireless Headphones',
    'SolCharge 20000mAh Solar Power Bank',
    'BambooCore Ergonomic Mouse',
    'TerraVentures Ultralight Daypack',
  ];
  const prices = [61.20, 80.99, 34.00, 26.55, 49.50];
  const idx = Math.floor(Math.random() * names.length);
  const isHighRisk = Math.random() < 0.2; // 20% anomaly chance
  const riskScore = isHighRisk ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 20) + 5;

  const newOrder: MerchantOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    paypalOrderId: `PAYPAL-LIVE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    customerName: names[idx],
    customerEmail: `${names[idx].toLowerCase().replace(' ', '.')}@fastmail.com`,
    itemSummary: `${items[idx % items.length]} (x1)`,
    totalAmount: prices[idx % prices.length],
    currency: 'USD',
    status: isHighRisk ? 'FLAGGED' : 'COMPLETED',
    riskScore,
    riskLevel: isHighRisk ? 'HIGH' : 'LOW',
    fraudReasoning: isHighRisk
      ? 'Anomalous velocity: 3 checkout attempts across mismatched geolocations in under 60 seconds.'
      : 'Verified APCP cryptographic intent hash with clean PayPal session fingerprint.',
    signatureHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };

  addOrder(newOrder);
  return newOrder;
}
