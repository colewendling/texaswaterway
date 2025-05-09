import EventCard, { EventCardType } from '@/components/EventCard';
import SearchForm from '../../components/SearchForm';
import {
  PAGINATED_EVENTS_QUERY,
  EVENT_COUNT_QUERY,
} from '@/sanity/lib/queries/eventQueries';
import { PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries/playlistQueries';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import HeroText from '@/components/HeroText';
import Pagination from '@/components/Pagnation';
import React from 'react';
import { lakes } from '@/lib/data/lakes';
import { getLakeNameById } from '@/lib/utils';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query: initialSearchQuery, page: pageParam } = await searchParams;
  let searchQuery = initialSearchQuery;

  const page = Number(pageParam) || 1;
  const pageSize = 12;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let lakeId: string | undefined = undefined;

  // Check if the searchQuery includes any lake name
  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    for (const lake of lakes) {
      if (lowerCaseQuery.includes(lake.name.toLowerCase())) {
        lakeId = lake.id;
        console.log(JSON.stringify(lakeId));
        searchQuery = lake.id; // Update searchQuery to lakeId
        break; // Stop after finding the first matching lake
      }
    }
  }

  // Fetch total count of events for pagination
  const countParams = { search: searchQuery || null };
  const { data: totalCount } = await sanityFetch({
    query: EVENT_COUNT_QUERY,
    params: countParams,
  });

  // Fetch paginated events
  const params = { search: searchQuery || null, start, end };
  const { data: posts } = await sanityFetch({
    query: PAGINATED_EVENTS_QUERY,
    params,
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
      <section className="home-hero-container">
        <img
          src="/art/plants-left.png"
          alt="Plants Left"
          className="home-hero-art-left"
        />
        <img
          src="/art/plants-right.png"
          alt="Plants Right"
          className="home-hero-art-right"
        />
        <div className="water-rectangle"></div>
        <img src="/art/boat.png" alt="Boat" className="hero-boat" />
        <h1 className="home-hero-heading">
          Howdy! <br /> Connect With Texas Lake goers{' '}
        </h1>
        <p className="home-hero-subheading">
          Comprehensive dashboard app offering up-to-date data on Texas lakes,
          including lake levels, water storage, weather conditions, and fishing
          insights.
        </p>
        <HeroText />
        <SearchForm query={searchQuery} />
      </section>
      <section className="section_container">
        <div className="home-header-container">
          <p className="home-header-text">
            {searchQuery
              ? lakeId
                ? `Search results for "${getLakeNameById(lakeId)}"`
                : `Search results for "${searchQuery}"`
              : 'All Events'}
          </p>
          <a href="/map" className="home-header-button">
            Map
          </a>
        </div>
        <ul className="home-event-container  card-grid">
          {posts?.length > 0 ? (
            posts.map((post: EventCardType) => (
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
          query={searchQuery}
          basePath="/"
        />
      </section>
      <SanityLive />
    </>
  );
}
