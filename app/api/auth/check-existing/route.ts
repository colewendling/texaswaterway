import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // "username" or "email"
  const value = searchParams.get('value');

  if (!type || !value || !['username', 'email'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid query parameters' },
      { status: 400 },
    );
  }

  const query =
    type === 'username'
      ? `*[_type == "author" && username == $value][0]`
      : `*[_type == "author" && email == $value][0]`;

  const exists = !!(await client.fetch(query, { value }));

  return NextResponse.json({ exists });
}
