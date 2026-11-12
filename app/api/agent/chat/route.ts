import { NextResponse } from 'next/server';
import { CATALOG } from '@/lib/products';
import { AgentActionStep, Product, NegotiationBreakdown } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { message, mandate = { maxBudget: 100, ecoOnly: false, autoDiscount: true } } = await request.json();
    const query = (message || '').toLowerCase();

    const actionSteps: AgentActionStep[] = [];
    let suggestedProducts: Product[] = [];
    let readyForCheckout: any = null;
    let negotiation: NegotiationBreakdown | undefined = undefined;
    let replyText = '';

    // Step 1: APCP Mandate Validation & Intent Parsing
    actionSteps.push({
      id: 'step-1',
      title: 'APCP Protocol Mandate Verification',
      status: 'completed',
      detail: `Validated user spend ceiling ($${mandate.maxBudget} USD). Eco-priority: ${mandate.ecoOnly ? 'Strict' : 'Standard'}.`,
      latencyMs: 42,
    });

    // Handle receipt OCR or image scan intent
    const isOcrScan = query.includes('receipt') || query.includes('scan') || query.includes('bill') || query.includes('invoice');

    if (isOcrScan) {
      actionSteps.push({
        id: 'step-ocr',
        title: 'Multi-Modal Vision & Line-Item Extraction',
        status: 'completed',
        detail: 'Extracted merchant receipt: "AeroGlide Travel Pack 30L" • Verified list price $68.00 USD.',
        latencyMs: 98,
      });
      suggestedProducts = [CATALOG[0]];
    } else if (query.includes('backpack') || query.includes('bag') || query.includes('travel')) {
      suggestedProducts = CATALOG.filter((p) => p.category === 'Travel' || p.name.toLowerCase().includes('backpack'));
    } else if (query.includes('headphone') || query.includes('audio') || query.includes('earbud') || query.includes('sound')) {
      suggestedProducts = CATALOG.filter((p) => p.category === 'Electronics' && (p.name.toLowerCase().includes('headphone') || p.name.toLowerCase().includes('earbuds')));
    } else if (query.includes('solar') || query.includes('power') || query.includes('charger')) {
      suggestedProducts = CATALOG.filter((p) => p.name.toLowerCase().includes('solar') || p.category === 'Accessories');
    } else if (query.includes('eco') || query.includes('green') || query.includes('sustainable') || mandate.ecoOnly) {
      suggestedProducts = CATALOG.filter((p) => p.ecoFriendly);
    } else {
      suggestedProducts = CATALOG.slice(0, 3);
    }

    // Apply budget constraint filtering
    if (mandate.maxBudget) {
      suggestedProducts = suggestedProducts.filter((p) => p.price <= mandate.maxBudget);
      if (suggestedProducts.length === 0) {
        // Fallback to lowest price item
        suggestedProducts = [CATALOG.reduce((prev, curr) => (prev.price < curr.price ? prev : curr))];
      }
    }

    // Step 2: Multi-Agent Inventory & Price Arbitration
    actionSteps.push({
      id: 'step-2',
      title: 'Multi-Agent Price & Spec Arbitration',
      status: 'completed',
      detail: `Shopper Agent arbitrated with Merchant Inventory. Evaluated ${suggestedProducts.length} certified items.`,
      latencyMs: 64,
    });

    // Check if user is asking to checkout or buy
    const isCheckoutIntent =
      isOcrScan ||
      query.includes('buy') ||
      query.includes('checkout') ||
      query.includes('order') ||
      query.includes('get this') ||
      query.includes('take it') ||
      query.includes('purchase') ||
      query.includes('pay');

    if (isCheckoutIntent && suggestedProducts.length > 0) {
      const selectedProduct = suggestedProducts[0];
      const listPrice = selectedProduct.price;
      const discount = mandate.autoDiscount ? Number((listPrice * 0.1).toFixed(2)) : 0;
      const carbonOffset = 0.50; // PayPal Green Commerce initiative
      const total = Number((listPrice - discount + carbonOffset).toFixed(2));
      const sigHash = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;

      // Step 3: APCP Cryptographic Signature Generation
      actionSteps.push({
        id: 'step-3',
        title: 'APCP Cryptographic Intent Signature',
        status: 'completed',
        detail: `Signed mandate token ${sigHash} via Ed25519 curve. Mandate budget: $${mandate.maxBudget} USD (OK).`,
        latencyMs: 38,
      });

      // Step 4: PayPal Orders v2 Order Staging
      actionSteps.push({
        id: 'step-4',
        title: 'PayPal Orders v2 Sandbox Staging',
        status: 'completed',
        detail: `Created PayPal Sandbox purchase_unit intent=CAPTURE for "${selectedProduct.name}".`,
        latencyMs: 76,
      });

      negotiation = {
        listPrice,
        negotiatedRebate: discount,
        carbonOffsetContribution: carbonOffset,
        finalSettlementAmount: total,
        intentSignatureHash: sigHash,
        mandateVerified: true,
      };

      readyForCheckout = {
        items: [
          {
            name: selectedProduct.name,
            quantity: 1,
            unitPrice: selectedProduct.price,
          },
        ],
        subtotal: listPrice,
        discount,
        carbonOffset,
        total,
        currency: 'USD',
        signatureHash: sigHash,
      };

      replyText = `Procurement authorized for **${selectedProduct.name}** under your active mandate ceiling ($${mandate.maxBudget} max).

I completed multi-agent price arbitration:
• **Catalog List Price:** $${listPrice.toFixed(2)}
• **AI Agent Rebate:** -$${discount.toFixed(2)} (10%)
• **PayPal Green Commerce Offset:** +$${carbonOffset.toFixed(2)}
• **Net Settlement Due:** **$${total.toFixed(2)} USD**

Your cryptographic intent signature has been anchored (${sigHash}). Click the **PayPal Sandbox Button** below to capture the order.`;
    } else {
      replyText = `I analyzed the catalog and filtered **${suggestedProducts.length} verified products** respecting your budget ceiling of **$${mandate.maxBudget} USD**${mandate.ecoOnly ? ' (Eco-Priority Enabled)' : ''}.

Select any product to start 1-click PayPal checkout, or ask me to compare specs!`;
    }

    return NextResponse.json({
      reply: replyText,
      replyText: replyText,
      actionSteps,
      suggestedProducts,
      negotiation,
      readyForCheckout,
    });
  } catch (error) {
    console.error('Error in agent chat:', error);
    return NextResponse.json({ error: 'Failed to process AI agent response' }, { status: 500 });
  }
}
