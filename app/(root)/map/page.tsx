import Map from '@/components/Map';

const MapPage = async () => {
  return (
    <>
      <section className="hero-container">
        <h1 className="heading">Texas Lakes Map</h1>
        <img
          src="/art/map-left.png"
          alt="Events Left"
          className="hero-art-left"
        />
        <img
          src="/art/map-right.png"
          alt="Events Left"
          className="hero-art-right"
        />
      </section>
      <div className="w-full h-[50vh] md:h-[50vh] lg:h-[70vh] p-4 relative">
        <Map />
      </div>
    </>
  );
};

export default MapPage;
