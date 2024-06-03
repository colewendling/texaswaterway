import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EventForm from '@/components/EventForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/');
  
  return (
    <>
      <section className="orange_container min-h-[200px] md:min-h-[400px] relative">
        <h1 className="heading">Create your Event</h1>
        <img
          src="/art/events-left.png"
          alt="Events Left"
          className="hero-art-left"
        />
        <img
          src="/art/events-right.png"
          alt="Events Left"
          className="hero-art-right"
        />
      </section>
      <EventForm />
    </>
  );
};

export default Page;
