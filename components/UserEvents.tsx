import { client } from '@/sanity/lib/client';
import { EVENTS_BY_USER_ID_QUERY } from '@/sanity/lib/queries/eventQueries';
import React from 'react';
import EventCard, { EventCardType } from './EventCard';

const UserEvents = async ({ id, editMode }: { id: string; editMode: boolean }) => {
  const events = await client.fetch(EVENTS_BY_USER_ID_QUERY, { id });
  return (
    <>
      {events.length > 0 ? (
        events.map((event: EventCardType) => (
          <EventCard key={event._id} post={event} editMode={editMode} />
        ))
      ) : (
        <p className="no-result">No posts yet</p>
      )}
    </>
  );
};

export default UserEvents;
