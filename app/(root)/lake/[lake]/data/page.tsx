import React from 'react';
import { lakes, Lake } from '@/lib/data/lakes';
import { notFound } from 'next/navigation';

interface DataPageProps {
  params: { lake: string };
}

const LakeDataPage = async ({ params }: DataPageProps) => {
  const { lake } = await Promise.resolve(params);
  const lakeData: Lake | undefined = lakes.find((l) => l.id === lake);

  if (!lakeData) {
    notFound();
  }

  return (
    <div>
      <h2>Lake Data</h2>
      <p>
        <strong>Name:</strong> {lakeData.name}
      </p>
      <p>
        <strong>Size:</strong> {lakeData.size} acres
      </p>
      <p>
        <strong>Coordinates:</strong> {lakeData.coordinates.join(', ')}
      </p>
    </div>
  );
};

export default LakeDataPage;
