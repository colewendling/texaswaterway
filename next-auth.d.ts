import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    id: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      lake: string;
    };
  }
  interface JWT {
    id: string;
  }
}
