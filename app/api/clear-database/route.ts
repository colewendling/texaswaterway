import { NextResponse } from 'next/server';
import { clearDatabase } from '@/lib/db-clear';

export async function POST() {
  const result = await clearDatabase();
  return NextResponse.json(result);
}
