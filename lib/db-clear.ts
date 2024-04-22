'use server';

import { writeClient } from '@/sanity/lib/write-client';

export const clearDatabase = async () => {
  try {
    const documentTypes = ['playlist', 'event', 'friendRequest', 'user'];
    const results = {};

    for (const type of documentTypes) {
      const query = `*[_type == "${type}"]{_id}`;
      const documents = await writeClient.fetch(query);
      const ids = documents.map((doc) => doc._id);

      if (ids.length > 0) {
        await writeClient.delete(ids);
      }

      results[type] = ids.length; // Store the count of deleted documents
    }

    return {
      status: 'SUCCESS',
      message: 'Database cleared successfully.',
      results,
    };
  } catch (error) {
    console.error('Error clearing database:', error);
    return {
      status: 'ERROR',
      message: 'Failed to clear database.',
      error: JSON.stringify(error),
    };
  }
};
