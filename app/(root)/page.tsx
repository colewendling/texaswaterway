import EventCard from '@/components/EventCard';
import SearchForm from '../../components/SearchForm';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  const posts = [{
    _createdAt: new Date(),
    views: 55,
    author: {_id: 1, name: 'Cole'},
    description: 'This is a description',
    image: "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg",
    category: 'Robots',
    title: 'We Robots',
  }]

  return (
    <>
      <section className="orange_container space-y-6">
        <h1 className="heading">
          Howdy!, <br /> Connect With Texas Lake goers{' '}
        </h1>
        <p className="sub-heading !max-w-3xl">
          Comprehensive dashboard app offering up-to-date data on Texas lakes,
          including lake levels, water storage, weather conditions, and fishing
          insights.
        </p>
        <p className="sub-heading !max-w-3xl">
          Explore and Share Local Events, News Stories and Enjoy Live Lake Data.
        </p>
        <SearchForm query={query} />
      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : 'All Startups'}
        </p>
        <ul className='mt-7 card_grid'>
          { posts?.length > 0 ? (
            posts.map((post: EventCardType, index: number) => (
              <EventCard key={post?._id} post={post}/>
            ))
          ) : (
            <p className='no-results'>No startups found</p>
          )}
        </ul>
      </section>
    </>
  );
}
