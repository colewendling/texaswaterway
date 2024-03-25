'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { BadgePlus, LogOut, Github } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Modal from '@/components/Modal';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm';

const Navbar = () => {
  const { data: session, status } = useSession();

useEffect(() => {
  console.log('Session status:', status);
  if (status === 'authenticated') {
    console.log('Session Details:', session);
    console.log('Session.id:', session.id);
  } else if (status === 'unauthenticated') {
    console.log('No active session');
  } else {
    console.log('Loading session...');
  }
}, [session, status]);

  // Manage modal state
  const [openModal, setOpenModal] = useState<string | null>(null);


  const openModalHandler = (modal: 'signUp' | 'login') => setOpenModal(modal);
  const closeModalHandler = () => setOpenModal(null);

  return (
    <header className="px-5 py-3 shadow-sm font-work-sans bg-white">
      <nav className="flex justify-between items-center">
        {/* Logo Section */}
        <Link href="/" className="flex flex-row">
          <Image src="/logo-black.svg" alt="logo" width={80} height={80} />
          <Image
            src="/text-black.svg"
            alt="logo"
            width={240}
            height={30}
            className="max-sm:hidden"
          />
        </Link>

        {/* User Interaction Section */}
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
            <div className="flex gap-4">
              <button
                onClick={() => signIn('github')}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded"
              >
                <Github className="w-4 h-4" />
                Sign in with GitHub
              </button>
              <button
                onClick={() => openModalHandler('login')}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Login
              </button>
              <button
                onClick={() => openModalHandler('signUp')}
                className="px-4 py-2 bg-blue-500 rounded text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        <Modal isOpen={openModal === 'signUp'} onClose={closeModalHandler}>
          <SignUpForm onClose={closeModalHandler} />
        </Modal>
        <Modal isOpen={openModal === 'login'} onClose={closeModalHandler}>
          <LoginForm onClose={closeModalHandler} />
        </Modal>
      </nav>
    </header>
  );
};

export default Navbar;
