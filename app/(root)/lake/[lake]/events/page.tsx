import React from 'react';
import { notFound } from 'next/navigation';
import { lakes, Lake } from '@/lib/data/lakes';
import Head from 'next/head';

import Pagination from '@/components/Pagnation';
import EventCard, { EventCardType } from '@/components/EventCard';
import { sanityFetch } from '@/sanity/lib/live';
import {
  EVENT_COUNT_BY_LAKE_QUERY,
  PAGINATED_EVENTS_BY_LAKE_QUERY,
} from '@/sanity/lib/queries/eventQueries';
import { PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries/playlistQueries';

interface LakeEventsPageProps {
  params: { lake: string };
  searchParams: { page?: string };
}

const LakeEventsPage: React.FC<LakeEventsPageProps> = async ({
  params,
  searchParams,
}) => {
  const { lake: lakeId } = await Promise.resolve(params);
  const { page: pageParam } = await Promise.resolve(searchParams);

  // Find the lake by ID
  const lake: Lake | undefined = lakes.find((l) => l.id === lakeId);

  if (!lake) {
    notFound();
  }

  // Pagination setup
  const page = Number(pageParam) || 1;
  const pageSize = 6;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Fetch total count of events for the lake
  const countParams = { lakeId };
  const { data: totalCount } = await sanityFetch({
    query: EVENT_COUNT_BY_LAKE_QUERY,
    params: countParams,
  });

  // Fetch paginated events for the lake
  const fetchParams = { lakeId, start, end };
  console.log('fetchParams: ', fetchParams);
  const { data: events } = await sanityFetch({
    query: PAGINATED_EVENTS_BY_LAKE_QUERY,
    params: fetchParams,
  });

  // Fetch featured events playlist
  const { data: featuredPlaylist } = await sanityFetch({
    query: PLAYLIST_BY_SLUG_QUERY,
    params: { slug: 'featured-events' },
  });

  // Extract featured event IDs
  const featuredEventIds =
    featuredPlaylist?.select?.map((event: EventCardType) => event._id) || [];

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Head>
        <title>{lake.name} - Events</title>
        <meta name="description" content={`Upcoming events at ${lake.name}.`} />
      </Head>
      <section className="p-8">
        <ul className="home-event-container  grid md:grid-cols-2 sm:grid-cols-2 gap-6">
          {events?.length > 0 ? (
            events.map((post: EventCardType) => (
              <EventCard
                key={post?._id}
                post={post}
                featuredEventIds={featuredEventIds}
              />
            ))
          ) : (
            <p className="no-results">No events found</p>
          )}
        </ul>
      </section>
      <section className="section_container">
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          query={undefined}
          basePath={`/lake/${lake.id}/events`}
        />
      </section>
    </>
  );
};

export default LakeEventsPage;
