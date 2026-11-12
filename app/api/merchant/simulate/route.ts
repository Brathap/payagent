import { NextResponse } from 'next/server';
import { generateSimulatedLiveOrder } from '@/lib/ordersStore';

export async function POST() {
  const newOrder = generateSimulatedLiveOrder();
  return NextResponse.json({ order: newOrder, success: true });
}
