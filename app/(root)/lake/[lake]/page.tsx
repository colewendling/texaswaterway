import LakePageContent from '@/components/LakePageContent';
import { lakes } from '@/lib/data/lakes';

const LakePage = async ({ params }: { params: { lake: string } }) => {
  const lake = lakes.find((l) => l.id === params.lake);

  if (!lake) {
    return (
      <div className="text-center text-red-500 mt-10">
        <h1 className="text-2xl font-bold">Lake not found</h1>
        <p>The requested lake does not exist in our records.</p>
      </div>
    );
  }

  return (
    <>
      <section className="hero-container">
        <h1 className="heading">{lake.name}</h1>
        <img
          src="/art/events-left.png"
          alt="Events Left"
          className="hero-art-left"
        />
        <img
          src="/art/events-right.png"
          alt="Events Right"
          className="hero-art-right"
        />
      </section>
      <LakePageContent lake={lake} />
    </>
  );
};

export default LakePage;
