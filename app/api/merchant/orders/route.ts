import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/ordersStore';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json({ orders });
}
