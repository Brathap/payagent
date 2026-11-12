import { MerchantOrder } from './types';

// Pre-seeded realistic orders to immediately demonstrate AG Grid analytics & AI risk auditing
export const initialOrders: MerchantOrder[] = [
  {
    id: 'ORD-9821',
    paypalOrderId: '5KJ82910AA331201',
    customerName: 'Alex Rivera',
    customerEmail: 'alex.rivera@example.com',
    itemSummary: 'AeroGlide Eco Travel Backpack 30L (x1)',
    totalAmount: 68.0,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 12,
    riskLevel: 'LOW',
    fraudReasoning: 'Consistent IP geolocation, verified PayPal account with 4-year tenure.',
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
    timestamp: '2026-11-12 08:44:11',
  },
  {
    id: 'ORD-9819',
    paypalOrderId: '2PQ11944DE442991',
    customerName: 'Sarah Lin',
    customerEmail: 'sarah.lin@alumni.edu',
    itemSummary: 'TerraVentures Ultralight Daypack + SolCharge Solar Power Bank',
    totalAmount: 83.5,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 18,
    riskLevel: 'LOW',
    fraudReasoning: 'Verified educational domain, shipping matches billing address exactly.',
    timestamp: '2026-11-12 07:30:45',
  },
  {
    id: 'ORD-9818',
    paypalOrderId: '9KL77631GH883410',
    customerName: 'Dmitri Voronov',
    customerEmail: 'dmitri.v@unknown-proxy.net',
    itemSummary: 'ChronoGlow Smart Fitness Band (x2)',
    totalAmount: 110.0,
    currency: 'USD',
    status: 'FLAGGED',
    riskScore: 74,
    riskLevel: 'MEDIUM',
    fraudReasoning: 'VPN/Tor exit node IP detected during order authorization.',
    timestamp: '2026-11-12 06:12:09',
  },
  {
    id: 'ORD-9817',
    paypalOrderId: '4MN55320JK114982',
    customerName: 'Emma Watson',
    customerEmail: 'emma.creative@studio.design',
    itemSummary: 'BambooCore Ergonomic Wireless Mouse (x1)',
    totalAmount: 29.5,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 8,
    riskLevel: 'LOW',
    fraudReasoning: 'High trust score, repeated customer with clean chargeback record.',
    timestamp: '2026-11-12 04:55:22',
  },
  {
    id: 'ORD-9816',
    paypalOrderId: '1GH33910KL556213',
    customerName: 'Carlos Gomez',
    customerEmail: 'carlos.g@domain.com',
    itemSummary: 'NordicThermal Stainless Travel Tumbler (x2)',
    totalAmount: 48.0,
    currency: 'USD',
    status: 'COMPLETED',
    riskScore: 15,
    riskLevel: 'LOW',
    fraudReasoning: 'Standard checkout velocity, matching billing zip code.',
    timestamp: '2026-11-11 22:18:04',
  },
];

// Global in-memory storage for demonstration across requests in development
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
