'use client';

import React, { useState } from 'react';
import { clearDatabase, seedDatabase } from '@/app/actions/databaseActions';
import { redirect } from 'next/navigation';

import { fetchAndSaveLakeData } from '@/app/actions/lakeDataActions';
import { lakes } from '@/lib/data/lakes';

const DevelopmentPage = () => {
  const [loading, setLoading] = useState<{
    clear: boolean;
    seed: boolean;
    lakeData: boolean;
  }>({
    clear: false,
    seed: false,
    lakeData: false,
  });
  const [selectedLake, setSelectedLake] = useState<string>(lakes[0].id);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<Record<string, number> | null>(null);

  if (process.env.NODE_ENV === 'production') {
    redirect('/');
  }

  const handleClearDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to clear the entire database? This action is irreversible!',
      )
    ) {
      return;
    }

    setLoading({ clear: true, seed: false, lakeData: false });
    setMessage('');
    setResults(null);

    try {
      const data = await clearDatabase();

      if (data.status === 'SUCCESS') {
        setMessage('Database cleared successfully!');
        setResults(data.results ?? {});
      } else {
        setMessage('Failed to clear database.');
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error clearing database:', error);
      setMessage('An error occurred.');
    } finally {
      setLoading({ clear: false, seed: false, lakeData: false });
    }
  };

  const handleSeedDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to seed the database with demo data? This action will add new demo data.',
      )
    ) {
      return;
    }

    setLoading({ clear: false, seed: true, lakeData: false });
    setMessage('');
    setResults(null);

    try {
      const data = await seedDatabase();

      if (data.status === 'SUCCESS') {
        setMessage('Database seeded successfully!');
        setResults(data.results ?? {});
      } else {
        setMessage('Failed to seed database.');
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage('An error occurred.');
    } finally {
      setLoading({ clear: false, seed: false, lakeData: false });
    }
  };

  const handleFetchLakeData = async () => {
    setLoading({ clear: false, seed: false, lakeData: true });
    setMessage('');

    try {
      await fetchAndSaveLakeData(selectedLake);
      setMessage(`Data for ${selectedLake} saved successfully!`);
    } catch (error) {
      console.error('Error fetching lake data:', error);
      setMessage(`Failed to fetch or save data for ${selectedLake}.`);
    } finally {
      setLoading({ clear: false, seed: false, lakeData: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Development Tools
      </h1>
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleClearDatabase}
          disabled={loading.clear || loading.seed || loading.lakeData}
          className={`px-6 py-3 text-white font-medium rounded-md transition ${
            loading.clear
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {loading.clear ? 'Clearing...' : 'Clear Database'}
        </button>
        <button
          onClick={handleSeedDatabase}
          disabled={loading.seed || loading.clear || loading.lakeData}
          className={`px-6 py-3 text-white font-medium rounded-md transition ${
            loading.seed
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading.seed ? 'Seeding...' : 'Seed Database'}
        </button>
        {/* Dropdown for selecting a lake */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="lake-select"
            className="text-lg font-medium text-gray-700 mb-2"
          >
            Select Lake:
          </label>
          <select
            id="lake-select"
            value={selectedLake}
            onChange={(e) => setSelectedLake(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          >
            {lakes.map((lake) => (
              <option key={lake.id} value={lake.id}>
                {lake.name}
              </option>
            ))}
          </select>
        </div>
        {/* Button to fetch lake data */}
        <button
          onClick={handleFetchLakeData}
          disabled={loading.lakeData || loading.clear || loading.seed}
          className={`px-6 py-3 text-white font-medium rounded-md transition ${
            loading.lakeData
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading.lakeData ? 'Fetching...' : 'Fetch Lake Data'}
        </button>
      </div>
      {message && (
        <p
          className={`mt-6 text-lg font-medium ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
      {results && (
        <div className="mt-8 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {message.includes('cleared')
              ? 'Deleted Documents:'
              : 'Created Documents:'}
          </h2>
          <ul className="space-y-2">
            {Object.entries(results).map(([type, count]) => (
              <li
                key={type}
                className="text-gray-600 border-b border-gray-200 pb-2"
              >
                <span className="font-medium capitalize">{type}:</span> {count}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DevelopmentPage;
