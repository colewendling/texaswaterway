'use client';

import React, { useState } from 'react';
import { clearDatabase, seedDatabase } from '@/app/actions/databaseActions';


const DevelopmentPage = () => {
  const [loading, setLoading] = useState<{ clear: boolean; seed: boolean }>({
    clear: false,
    seed: false,
  });
  const [message, setMessage] = useState('');
  const [results, setResults] = useState<Record<string, number> | null>(null);

  const handleClearDatabase = async () => {
    if (
      !confirm(
        'Are you sure you want to clear the entire database? This action is irreversible!',
      )
    ) {
      return;
    }

    setLoading({ clear: true, seed: false });
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
      setLoading({ clear: false, seed: false });
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

    setLoading({ clear: false, seed: true });
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
      setLoading({ clear: false, seed: false });
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
          disabled={loading.clear || loading.seed}
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
          disabled={loading.seed || loading.clear}
          className={`px-6 py-3 text-white font-medium rounded-md transition ${
            loading.seed
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading.seed ? 'Seeding...' : 'Seed Database'}
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
