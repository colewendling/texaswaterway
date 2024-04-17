'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { parseServerActionResponse } from './utils';
import slugify from 'slugify';
import { writeClient } from '@/sanity/lib/write-client';

export const createEvent = async (
  state: any,
  form: FormData,
  pitch: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session)
    return parseServerActionResponse({
      error: 'Not signed in',
      status: 'ERROR',
    });

  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch'),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const event = {
      title,
      description,
      category,
      image,
      slug: {
        _type: slug,
        current: slug,
      },
      user: {
        _type: 'reference',
        _ref: session?.id,
      },
      pitch,
    };

    const result = await writeClient.create({ _type: 'event', ...event });

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

export const updateEvent = async (
  eventId: string,
  form: FormData,
  pitch: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return parseServerActionResponse({
      error: 'Not signed in',
      status: 'ERROR',
    });
  }

  const { title, description, category, image } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== 'pitch'),
  );

  const slug = slugify(title as string, { lower: true, strict: true });

  try {
    const updatedEvent = {
      title,
      description,
      category,
      image: image,
      slug: {
        _type: 'slug',
        current: slug,
      },
      pitch,
    };

    const result = await writeClient
      .patch(eventId) // Target the event by ID
      .set(updatedEvent) // Update fields
      .commit(); // Commit the changes

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const result = await writeClient.delete(eventId);
    console.log('Event deleted successfully:', result);
    return { status: 'SUCCESS', _id: eventId };
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
};

const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function checkIfUsernameExists(
  username: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/auth/check-existing?type=username&value=${encodeURIComponent(username)}`,
    );
    if (!res.ok) {
      console.error('Failed to check username availability');
      return false;
    }
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
}

export async function checkIfEmailExists(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/auth/check-existing?type=email&value=${encodeURIComponent(email)}`,
    );
    if (!res.ok) {
      console.error('Failed to check email availability');
      return false;
    }
    const data = await res.json();
    return data.exists;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
}

// Action to send a friend request
export const sendFriendRequest = async (
  fromUserId: string,
  toUserId: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Not signed in');
  }

  try {
    const result = await writeClient.create({
      _type: 'friendRequest',
      from: { _type: 'reference', _ref: fromUserId },
      to: { _type: 'reference', _ref: toUserId },
      status: 'pending',
    });

    return { status: 'SUCCESS', friendRequest: result };
  } catch (error) {
    console.error('Error sending friend request:', error);
    return { status: 'ERROR', error: JSON.stringify(error) };
  }
};

// Action to accept a friend request
export const acceptFriendRequest = async (
  toUserId: string,
  requestId: string,
  fromUserId: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Not signed in');
  }

  try {
    // Add "from" user to "to" user's friends list
    await writeClient
      .patch(toUserId)
      .setIfMissing({ friends: [] })
      .append('friends', [{ _type: 'reference', _ref: fromUserId }])
      .commit();

    // Add "to" user to "from" user's friends list
    await writeClient
      .patch(fromUserId)
      .setIfMissing({ friends: [] })
      .append('friends', [{ _type: 'reference', _ref: toUserId }])
      .commit();

    // Delete the friend request
    await writeClient.delete(requestId);

    return { status: 'SUCCESS', message: 'Friend request accepted.' };
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return { status: 'ERROR', error: JSON.stringify(error) };
  }
};

// Action to reject or delete a friend request
export const rejectFriendRequest = async (requestId: string) => {
  try {
    await writeClient.delete(requestId);
    return { status: 'SUCCESS', message: 'Friend request rejected.' };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return { status: 'ERROR', error: JSON.stringify(error) };
  }
};

export const removeFriend = async (userId: string, friendId: string) => {
  try {
    // Remove the friend from the current user's friends list
    await writeClient
      .patch(userId)
      .unset([`friends[_ref == "${friendId}"]`])
      .commit();

    // Remove the current user from the friend's friends list
    await writeClient
      .patch(friendId)
      .unset([`friends[_ref == "${userId}"]`])
      .commit();

    return { status: 'SUCCESS', message: 'Friend removed successfully.' };
  } catch (error) {
    console.error('Error removing friend:', error);
    return { status: 'ERROR', error: JSON.stringify(error) };
  }
};