import EventCard, { EventCardType } from '@/components/EventCard';
import SearchForm from '../../components/SearchForm';
import { EVENTS_QUERY } from '@/sanity/lib/queries/eventQueries';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import HeroText from '@/components/HeroText';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({ query: EVENTS_QUERY, params });

  return (
    <>
      <section className="orange_container space-y-6">
        <HeroText />
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : 'All Events'}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: EventCardType) => (
              <EventCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No events found</p>
          )}
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
