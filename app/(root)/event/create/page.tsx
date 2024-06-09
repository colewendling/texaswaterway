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
      <section className="event-create-hero-container">
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
      <div className="event-create-form-container">
        <EventForm />
      </div>
    </>
  );
};

export default Page;
