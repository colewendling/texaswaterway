'use server';

import { writeClient } from '@/sanity/lib/write-client';
import bcrypt from 'bcrypt';


// Server Action to create a user
export async function createUser({
  name,
  username,
  email,
  password,
  bio,
  image,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  // Validate required fields
  if (!name || !username || !email || !password) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    // Generate random user ID
    const id = Math.floor(10000000 + Math.random() * 90000000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in Sanity
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

    // Return success response
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}