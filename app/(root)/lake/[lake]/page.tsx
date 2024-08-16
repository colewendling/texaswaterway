import { lakes } from '@/lib/data/lakes';

export default function LakePage({ params }: { params: { lake: string } }) {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">{lake.name}</h1>
      <pre className="bg-gray-800 text-white p-4 rounded w-full max-w-xl overflow-auto">
        {JSON.stringify(lake, null, 2)}
      </pre>
    </div>
  );
}
