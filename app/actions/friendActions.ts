'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeClient } from '@/sanity/lib/write-client';

// Server Action to create a friend request
export const createFriendRequest = async (
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

// Server Action to accept a friend request
export const acceptFriendRequest = async (
  fromUserId: string,
  toUserId: string,
  requestId: string,
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

// Server Action to reject or delete a friend request
export const deleteFriendRequest = async (requestId: string) => {
  try {
    await writeClient.delete(requestId);
    return { status: 'SUCCESS', message: 'Friend request rejected.' };
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return { status: 'ERROR', error: JSON.stringify(error) };
  }
};

// Server Action to remove a friend
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