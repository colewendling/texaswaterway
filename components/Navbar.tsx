'use client';
import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { BadgePlus, Github, Settings, Gauge, LogIn, Star } from 'lucide-react';
import Modal from '@/components/Modal';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm';
import UserSettings from './UserSettings';
import { Skeleton } from './ui/skeleton';

const Navbar = () => {
  const { data: session, status } = useSession();
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
          {status === 'loading' ? (
            <>
              {/* Skeleton for Create Button */}
              <Skeleton className="navbar-button-lake-skeleton">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </Skeleton>
              <Skeleton className="navbar-button-map-skeleton">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </Skeleton>
              <Skeleton className="navbar-button-create-skeleton">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </Skeleton>
              <Skeleton className="navbar-avatar-skeleton">
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </Skeleton>

              {/* Skeleton for UserSettings */}
              <Skeleton className="navbar-settings-button-skeleton">
                <Settings className="navbar-settings-button-icon-skeleton" />
              </Skeleton>
            </>
          ) : session && session?.user ? (
            <>
              <Link
                className="navbar-button-lake"
                href={`/lake/${session?.user.lake}/data`}
              >
                <Gauge className="navbar-button-icon" />
                <span className="navbar-button-text">Lake</span>
              </Link>
              <Link className="navbar-button-map" href="/map">
                <img
                  src={'/icons/texas.svg'}
                  alt={'Map Icon'}
                  className="navbar-avatar w-6 h-6"
                />
                <span className="navbar-button-text">Map</span>
              </Link>
              <Link className="navbar-button-create" href="/event/create">
                <BadgePlus className="navbar-button-icon" />
                <span className="navbar-button-text">Create</span>
              </Link>
              <Link
                className="navbar-avatar-container"
                href={`/user/${session?.user.username}`}
              >
                <img
                  src={session?.user.image || ''}
                  alt={session?.user?.name || ''}
                  className="navbar-avatar"
                />
              </Link>
              <UserSettings />
            </>
          ) : (
            <>
              <button
                className="navbar-button-demo"
                onClick={() =>
                  signIn('credentials', {
                    redirect: true,
                    callbackUrl: '/',
                    identifier: 'emily',
                    password: 'demo1234',
                  })
                }
              >
                <Star className="navbar-button-icon" />
                <span className="hidden sm:inline">Demo Login</span>
                <span className="inline sm:hidden">Demo</span>
              </button>
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
                <LogIn className="navbar-button-icon" />
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
