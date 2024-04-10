import { client } from '@/sanity/lib/client';
import {
  USER_BY_EMAIL_QUERY,
  USER_BY_GITHUB_ID_QUERY,
} from '@/sanity/lib/queries';
import { writeClient } from '@/sanity/lib/write-client';
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID || '',
      clientSecret: process.env.AUTH_GITHUB_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};
        if (!email || !password) {
          throw new Error('Missing email or password');
        }

        // Fetch the user by email
        const user = await client.fetch(USER_BY_EMAIL_QUERY, { email });
        if (!user) {
          throw new Error('No user found');
        }

        // Validate the user's password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Return a simplified user object that includes all required fields
        return {
          id: user.id, // Ensure this is the Sanity `_id`
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ account, profile }: { account: any; profile?: any }) {

      if (account.provider === 'github') {
        // Handle GitHub sign-in
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(USER_BY_GITHUB_ID_QUERY, {
            id: profile.id,
          });

        if (!existingUser) {
          // Create a new Github user in Sanity if they don’t exist
          await writeClient.create({
            _type: 'user',
            id: profile.id,
            name: profile.name,
            username: profile.login,
            email: profile.email,
            image: profile.avatar_url,
            bio: profile.bio || '',
          });
        }
      }
      return true;
    },
    async jwt({ token, account, profile, user }: { token: any; account: any; profile?: any; user?: any }) {
      if (account && profile) {

        //Github users
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(USER_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });
        token.id = user?._id; 

      } else if (user) {
        //Non-Github users
        const sanityUser = await client
          .withConfig({ useCdn: false })
          .fetch(USER_BY_EMAIL_QUERY, {
            email: user.email,
          });
        token.id = sanityUser._id;

      }

      return token;
    },
    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
