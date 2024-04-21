import { seedDatabase } from '@/lib/db-seed';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in seed-database API:', error);
    return NextResponse.json({
      status: 'ERROR',
      message: 'Failed to seed database.',
      error: String(error),
    });
  }
}
