export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  stock: number;
  imageUrl: string;
  ecoFriendly?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AgentActionStep {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedProducts?: Product[];
  actionSteps?: AgentActionStep[];
  readyForCheckout?: {
    orderId?: string;
    items: { name: string; quantity: number; unitPrice: number }[];
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
  };
  completedOrder?: {
    paypalOrderId: string;
    payerName?: string;
    amount: number;
    currency: string;
    status: string;
    timestamp: string;
  };
}

export interface MerchantOrder {
  id: string;
  paypalOrderId: string;
  customerName: string;
  customerEmail: string;
  itemSummary: string;
  totalAmount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FLAGGED' | 'REFUNDED';
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  fraudReasoning?: string;
  timestamp: string;
}
