import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type'); // "username" or "email"
    const value = searchParams.get('value');

    // Validate query parameters
    if (!type || !value || !['username', 'email'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 },
      );
    }

    // Build the query
    const query =
      type === 'username'
        ? `*[_type == "author" && username == $value][0]`
        : `*[_type == "author" && email == $value][0]`;

    // Execute the query
    const exists = !!(await client.fetch(query, { value }));

    // Return the result
    return NextResponse.json({ exists }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/auth/check-existing:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
