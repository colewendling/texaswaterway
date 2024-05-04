'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';
import { createFriendRequest, deleteFriendRequest, removeFriend } from '@/app/actions/friendActions';
import { cn } from '@/lib/utils';


const FriendButton = ({
  userId,
  sessionId,
  isOwnProfile,
  isFriend,
  pendingCount,
  hasPendingRequest,
  requestId,
  setHasPendingRequest,
  setRequestId,
  setModalOpen,
}: {
  userId: string;
  sessionId: string;
  isOwnProfile: boolean;
  isFriend: boolean;
  pendingCount: number;
  hasPendingRequest: boolean;
  requestId: string;
  setHasPendingRequest: React.Dispatch<React.SetStateAction<boolean>>;
  setRequestId: React.Dispatch<React.SetStateAction<string>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSendRequest = async (fromUserId: string, toUserId: string) => {
    try {
      const result = await createFriendRequest(fromUserId, toUserId);
      if (result.status === 'SUCCESS') {
        alert('Friend request sent successfully!');
        setHasPendingRequest(true);
        if (result.friendRequest) {
          setRequestId(result.friendRequest._id);
        }
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!requestId) {
      console.error('No requestId found for cancellation.');
      return;
    }

    try {
      const result = await deleteFriendRequest(requestId); // Use requestId
      if (result.status === 'SUCCESS') {
        alert('Friend request canceled.');
        setHasPendingRequest(false); // Update state optimistically
      }
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleRemoveFriend = async (sessionId: string, userId: string) => {
    try {
      const result = await removeFriend(sessionId, userId);
      if (result.status === 'SUCCESS') {
        alert('Friend removed successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <>
      {isOwnProfile && (
        <button
          onClick={() => {
            setModalOpen(true);
          }}
          className={`friend-button ${pendingCount > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          <UserPlus size={15} />
          {pendingCount > 0 && (
            <>
              <span className="friend-button-notification-circle"></span>
              <span
                className={cn(
                  'animate-pulse',
                  'friend-button-notification-circle',
                )}
              >
                {pendingCount}
              </span>
            </>
          )}
        </button>
      )}
      {!isOwnProfile && !isFriend && !hasPendingRequest && (
        <button
          onClick={() => {
            handleSendRequest(sessionId, userId);
          }}
          className="min-w-[150px] p-1 rounded-full  border-[2px] border-white text-white cursor-pointer bg-primary-300 hover:bg-blue-500"
        >
          + Add Friend
        </button>
      )}
      {!isOwnProfile && !isFriend && hasPendingRequest && (
        <button
          onClick={() => handleCancelRequest(requestId)}
          className="min-w-[150px] p-1  rounded-full bg-gray-500 text-white cursor-pointer hover:bg-blue-600"
        >
          Cancel Request
        </button>
      )}
      {!isOwnProfile && isFriend && (
        <button
          onClick={() => handleRemoveFriend(sessionId, userId)}
          className="text-white py-1 px-3 hover:underline hover:text-red-800"
        >
          Remove as Friend
        </button>
      )}
    </>
  );
};

export default FriendButton;
