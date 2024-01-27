'use server';

import { signIn } from 'next-auth/react';

export async function loginWithGitHub() {
  await signIn('github');
}
