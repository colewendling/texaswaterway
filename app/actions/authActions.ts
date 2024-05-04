'use server';

import { client } from '@/sanity/lib/client';

// Server Action to check if a username exists in the Sanity database
export async function checkIfUsernameExists(
  username: string,
): Promise<boolean> {
  try {
    const query = `*[_type == "user" && username == $value][0]`;
    const result = await client.fetch(query, { value: username });
    return !!result; // Returns true if a user with this username exists
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
}

// Server Action to check if an email exists in the Sanity database
export async function checkIfEmailExists(email: string): Promise<boolean> {
  try {
    const query = `*[_type == "user" && email == $value][0]`;
    const result = await client.fetch(query, { value: email });
    return !!result; // Returns true if a user with this email exists
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false;
  }
}
