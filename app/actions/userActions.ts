'use server';

import { sanityFetch } from '@/sanity/lib/live';
import { USER_BY_ID_QUERY } from '@/sanity/lib/queries/userQueries';
import { writeClient } from '@/sanity/lib/write-client';
import bcrypt from 'bcrypt';

// Server Action to create a user
export async function createUser({
  name,
  username,
  email,
  password,
  bio,
  image,
}: {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
}): Promise<{ success: boolean; user?: any; error?: string }> {
  // Validate required fields
  if (!name || !username || !email || !password) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    // Format name: capitalize each word
    const capitalize = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const formattedName = name.split(' ').map(capitalize).join(' ');

    // Lowercase email and username
    const formattedEmail = email.toLowerCase();
    const formattedUsername = username.toLowerCase();

    // Generate random user ID
    const id = Math.floor(10000000 + Math.random() * 90000000);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in Sanity
    const newUser = await writeClient.create({
      _type: 'user',
      id,
      name: formattedName,
      username: formattedUsername,
      email: formattedEmail,
      password: hashedPassword,
      image,
      bio,
    });

    // Return success response
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

// Server Action to update a user
export async function updateUser(
  userId: string,
  data: { image?: string; bio?: string },
) {
  try {
    const result = await writeClient.patch(userId).set(data).commit();
    return { success: true, user: result };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

// Server Action to get a user by Id
export async function getUserById(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  try {
    const user = await sanityFetch({
      query: USER_BY_ID_QUERY,
      params: { id: userId },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user data');
  }
}

// Server Action to delete a user
export async function deleteUser(userId: string) {
  try {
    // Step 1: Delete sent friend requests
    const sentFriendRequests = await writeClient.fetch(
      `*[_type == "friendRequest" && from._ref == "${userId}"]{ _id }`,
    );
    for (const request of sentFriendRequests) {
      await writeClient.delete(request._id);
    }

    // Step 2: Delete received friend requests
    const receivedFriendRequests = await writeClient.fetch(
      `*[_type == "friendRequest" && to._ref == "${userId}"]{ _id }`,
    );
    for (const request of receivedFriendRequests) {
      await writeClient.delete(request._id);
    }

    // Step 3: Remove user from all friends lists
    const usersWithThisUserAsFriend = await writeClient.fetch(
      `*[_type == "user" && references("${userId}")]`,
    );
    for (const user of usersWithThisUserAsFriend) {
      await writeClient
        .patch(user._id)
        .unset([`friends[_ref=="${userId}"]`])
        .commit();
    }

    // Step 4: Remove user events from playlists
    const userEvents = await writeClient.fetch(
      `*[_type == "event" && user._ref == "${userId}"]{ _id }`,
    );

    for (const event of userEvents) {
      // Fetch playlists referencing the current event
      const playlists = await writeClient.fetch(
        `*[_type == "playlist" && references("${event._id}")]{ _id }`,
      );

      // Unset the event reference in each playlist
      for (const playlist of playlists) {
        await writeClient
          .patch(playlist._id)
          .unset([`select[_ref=="${event._id}"]`])
          .commit();
      }
    }

    // Step 5: Delete all events created by the user
    const userCreatedEvents = await writeClient.fetch(
      `*[_type == "event" && user._ref == "${userId}"]{ _id }`,
    );
    for (const event of userCreatedEvents) {
      await writeClient.delete(event._id);
    }

    // Step 6: Delete the user document
    await writeClient.delete(userId);

    // Check for any remaining references to the user or their events
    const remainingReferences = await writeClient.fetch(
      `*[references("${userId}")]`,
    );
    if (remainingReferences.length) {
      console.warn(
        `Found dangling references for user ID ${userId}:`,
        remainingReferences,
      );
    }
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    return { success: false, error: 'Failed to delete user' };
  }
}
