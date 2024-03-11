'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { BadgePlus, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/" className="flex flex-row">
          <Image src="/logo-black.svg" alt="logo" width={80} height={30} />
          <Image
            src="/text-black.svg"
            alt="logo"
            width={240}
            height={30}
            className="max-sm:hidden"
          />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {session && session?.user ? (
            <>
              <Link href="/event/create">
                <span className="max-sm:hidden">Create</span>
                <BadgePlus className="size-6 sm:hidden" />
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}>
                <span className="max-sm:hidden">Logout</span>
                <LogOut className="size-6 sm:hidden text-red-500" />
              </button>
              <Link href={`/user/${session?.id}`}>
                <Avatar className="size-10">
                  <AvatarImage
                    src={session?.user.image || ''}
                    alt={session?.user?.name || ''}
                  />
                  <AvatarFallback>AV</AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn('github')}>
              <span>Login</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
