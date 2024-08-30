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
      <Map />
    </>
  );
};

export default MapPage;
