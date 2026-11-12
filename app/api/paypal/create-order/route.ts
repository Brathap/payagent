import { NextResponse } from 'next/server';

async function getPayPalAccessToken(clientId: string, clientSecret: string) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', items = [] } = body;

    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // If sandbox credentials are provided, invoke live PayPal Sandbox API
    if (clientId && clientSecret && !clientId.startsWith('test_') && !clientId.includes('mock')) {
      try {
        const accessToken = await getPayPalAccessToken(clientId, clientSecret);
        const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: Number(amount).toFixed(2),
                  breakdown: {
                    item_total: {
                      currency_code: currency,
                      value: Number(amount).toFixed(2),
                    },
                  },
                },
                items: items.map((it: { name: string; quantity: number; unitPrice: number }) => ({
                  name: it.name,
                  unit_amount: {
                    currency_code: currency,
                    value: Number(it.unitPrice).toFixed(2),
                  },
                  quantity: it.quantity.toString(),
                })),
              },
            ],
          }),
        });

        const orderData = await orderResponse.json();
        if (orderData.id) {
          return NextResponse.json({ id: orderData.id, mode: 'sandbox_live' });
        }
      } catch (err) {
        console.warn('PayPal Sandbox API request failed, falling back to simulated sandbox:', err);
      }
    }

    // Fallback sandbox simulation for instant testing without mandatory keys
    const simulatedOrderId = `PAYPAL-SBX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    return NextResponse.json({
      id: simulatedOrderId,
      mode: 'sandbox_simulation',
      status: 'CREATED',
    });
  } catch (error) {
    console.error('Error in create-order:', error);
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  }
}
