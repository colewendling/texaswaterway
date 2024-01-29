import SearchForm from '../../components/SearchForm';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
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
    </>
  );
}
