'use client';

import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { BadgePlus, LogOut, Github } from 'lucide-react';
import Modal from '@/components/Modal';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm';

const Navbar = () => {
  const { data: session, status } = useSession();

  // Manage modal state
  const [openModal, setOpenModal] = useState<string | null>(null);
  const openModalHandler = (modal: 'signUp' | 'login') => setOpenModal(modal);
  const closeModalHandler = () => setOpenModal(null);

  return (
    <header>
      <nav className="navbar">
        {/* Site Logo & Text */}
        <Link href="/" className="navbar-logo-container">
          <img
            src="/logos/logo-black.svg"
            alt="Texas Waterway Logo"
            className="navbar-logo"
          />
          <img
            src="/logos/text-black.svg"
            alt="Texas Waterway"
            className="navbar-logo-text"
          />
        </Link>
        {/* Navbar Links */}
        <div className="navbar-button-container">
          {session && session?.user ? (
            <>
              <Link className="navbar-button-create" href="/event/create">
                <BadgePlus className="navbar-button-icon" />
                <span className="navbar-button-text">Create</span>
              </Link>
              <button
                className="navbar-button-logout"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="navbar-button-icon" />
                <span className="navbar-button-text">Logout</span>
              </button>
              <Link
                className="navbar-avatar"
                href={`/user/${session?.user.username}`}
              >
                <img
                  src={session?.user.image || ''}
                  alt={session?.user?.name || ''}
                  className="navbar-avatar"
                />
              </Link>
            </>
          ) : (
            <>
              <button
                className="navbar-button-github"
                onClick={() => signIn('github')}
              >
                <Github className="navbar-button-icon" />
                <span className="navbar-button-text">GitHub Login</span>
              </button>
              <button
                className="navbar-button-login"
                onClick={() => openModalHandler('login')}
              >
                <LogOut className="navbar-button-icon" />
                <span className="navbar-button-text">Login</span>
              </button>
              <button
                className="navbar-button-signup"
                onClick={() => openModalHandler('signUp')}
              >
                <BadgePlus className="navbar-button-icon" />
                <span className="navbar-button-text">Sign Up</span>
              </button>
            </>
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
