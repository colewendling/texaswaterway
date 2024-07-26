'use server';

import { writeClient } from '@/sanity/lib/write-client';
import bcrypt from 'bcrypt';
import { client } from '@/sanity/lib/client';
import { events } from '@/lib/events';
import { users } from '@/lib/users';

// Server Action to clear Sanity Database
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

// Server Action to seed Sanity Database
export const seedDatabase = async () => {
  try {
    const password = 'demo1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const documentTypes = ['playlist', 'event', 'friendRequest', 'user'];
    const results = {};

    // Initialize results with 0 for all document types
    for (const type of documentTypes) {
      results[type] = 0;
    }

    // Function to check if a user already exists
    const userExists = async (type: 'username' | 'email', value: string) => {
      const query =
        type === 'username'
          ? `*[_type == "user" && username == $value][0]`
          : `*[_type == "user" && email == $value][0]`;
      const exists = !!(await client.fetch(query, { value }));
      return exists;
    };

    // Seed users
    const userPromises = users.map(async (user) => {
      // Check for existing username or email
      const usernameExists = await userExists('username', user.username);
      const emailExists = await userExists('email', user.email);

      if (usernameExists || emailExists) {
        console.log(
          `Skipping user creation: Username (${user.username}) or email (${user.email}) already exists.`,
        );
        return null; // Skip user creation if already exists
      }

      const id = Math.floor(10000000 + Math.random() * 90000000); // Generate unique 8-digit ID
      return writeClient.create({
        _type: 'user',
        id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        password: hashedPassword,
        image: user.image,
        friends: [],
      });
    });

    let createdUsers = await Promise.all(userPromises);
    createdUsers = createdUsers.filter(Boolean); // remove nulls

    // Seed events
    const eventPromises = events.map(async (event) => {
      const userRef = await client.fetch(
        `*[_type == "user" && username == $username][0]._id`,
        { username: event.user },
      );
      if (!userRef) {
        console.error(`User reference not found for username: ${event.user}`);
        return null;
      }

      // Generate a slug from the event title
      const slug = event.title
        .toLowerCase()
        .replace(/['’]/g, '') // Remove apostrophes
        .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special characters with dashes
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

      return writeClient.create({
        _type: 'event',
        ...event,
        slug: { _type: 'slug', current: slug },
        user: { _type: 'reference', _ref: userRef },
      });
    });

    let createdEvents = await Promise.all(eventPromises);
    createdEvents = createdEvents.filter(Boolean);

    // Create a "Featured Events" playlist with 5 random events
    const createdPlaylists = [];
    if (createdEvents.length >= 5) {
      const randomEventIds = createdEvents
        .filter(Boolean) // Ensure valid events
        .sort(() => 0.5 - Math.random()) // Shuffle the array
        .slice(0, 5) // Pick the first 5
        .map((event) => ({
          _type: 'reference',
          _ref: event._id,
          _key: `${event._id}-${Date.now()}-${Math.random()}`, // Add a unique key
        }));

      const featuredPlaylistSlug = 'featured-events';

      const playlist = await writeClient.create({
        _type: 'playlist',
        title: 'Featured Events',
        slug: { _type: 'slug', current: featuredPlaylistSlug },
        select: randomEventIds,
      });

      createdPlaylists.push(playlist);
    } else {
      console.log('Not enough events to create the Featured Events playlist.');
    }

    const userIds = createdUsers.map((user) => user._id);

    // Create 30 random friend requests without duplicates
    const usedPairs = new Set();
    const friendRequestPromises = [];

    for (let i = 0; i < 30; i++) {
      const fromIndex = Math.floor(Math.random() * userIds.length);
      let toIndex = Math.floor(Math.random() * userIds.length);

      while (toIndex === fromIndex && userIds.length > 1) {
        toIndex = Math.floor(Math.random() * userIds.length);
      }

      // Ensure we have at least 2 distinct users
      if (userIds.length < 2) break;

      const fromId = userIds[fromIndex];
      const toId = userIds[toIndex];

      // Create a consistent pair key for both orderings
      const pairKey = fromId < toId ? `${fromId}-${toId}` : `${toId}-${fromId}`;

      // Only create if we haven't created this pair before
      if (!usedPairs.has(pairKey)) {
        usedPairs.add(pairKey);
        friendRequestPromises.push(
          writeClient.create({
            _type: 'friendRequest',
            from: { _type: 'reference', _ref: fromId },
            to: { _type: 'reference', _ref: toId },
            status: 'pending',
          }),
        );
      } else {
        // If the pair already exists, decrement i so we try again
        i--;
      }
    }

    const createdFriendRequests = await Promise.all(friendRequestPromises);

    // Assign 3-12 random friends to each user
    const friendAssignmentPromises = createdUsers.map(async (user) => {
      const numberOfFriends = Math.floor(Math.random() * 10) + 3; // Random number between 3 and 12
      const friends = [];

      let attempts = 0;
      const maxAttempts = 100;

      while (friends.length < numberOfFriends && attempts < maxAttempts) {
        attempts++;
        const randomFriendId =
          userIds[Math.floor(Math.random() * userIds.length)];

        // Ensure the user is not added as their own friend and avoid duplicates
        if (randomFriendId !== user._id && !friends.includes(randomFriendId)) {
          // Check if a friend request already exists between these two users
          const friendRequestExists = await client.fetch(
            `*[_type == "friendRequest" && 
              ((from._ref == $userId && to._ref == $friendId) || 
              (from._ref == $friendId && to._ref == $userId))
            ][0]`,
            { userId: user._id, friendId: randomFriendId },
          );

          // Only add as friend if there is no existing friend request
          if (!friendRequestExists) {
            friends.push(randomFriendId);
          }
        }
      }

      return writeClient
        .patch(user._id)
        .set({
          friends: friends.map((id) => ({
            _type: 'reference',
            _ref: id, // Use the string `id` here
            _key: `${id}-${Date.now()}-${Math.random()}`, // Add the unique key
          })),
        })
        .commit();
    });

    await Promise.all(friendAssignmentPromises);

    // Update results
    results.user = createdUsers.length;
    results.event = createdEvents.length;
    results.playlist = createdPlaylists.length;
    results.friendRequest = createdFriendRequests.filter(Boolean).length;

    return {
      status: 'SUCCESS',
      message: 'Seeded database successfully.',
      results,
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      status: 'ERROR',
      message: 'Failed to seed database.',
      error: JSON.stringify(error),
    };
  }
};
