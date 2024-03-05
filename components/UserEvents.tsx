import { client } from '@/sanity/lib/client';
import { EVENTS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import React from 'react';
import EventCard, { EventCardType } from './EventCard';

const UserEvents = async ({ id }: { id: string }) => {
  const events = await client.fetch(EVENTS_BY_AUTHOR_QUERY, { id });
  return (
    <>
      {events.length > 0 ? (
        events.map((event: EventCardType) => (
          <EventCard key={event._id} post={event} />
        ))
      ) : (
        <p className='no-result'>No posts yet</p>
      )}
    </>
  );
};

export default UserEvents;
