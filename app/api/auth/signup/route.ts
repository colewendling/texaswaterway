import { writeClient } from '@/sanity/lib/write-client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { name, username, email, password, bio, image } = await req.json();

  if (!name || !username || !email || !password) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  try {
    const id = Math.floor(10000000 + Math.random() * 90000000);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await writeClient.create({
      _type: 'user',
      id,
      name,
      username,
      email,
      password: hashedPassword,
      image,
      bio,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
