import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // If the user is not signed in, show a message
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>
          You need to{' '}
          <Link href="/api/auth/signin" className="text-blue-500 underline">
            sign in
          </Link>{' '}
          to access this page.
        </p>
      </div>
    );
  }

  // If the user is signed in, show the dashboard
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
      <p>Hello, {session.user?.name}! Here is your protected content.</p>
    </div>
  );
}
